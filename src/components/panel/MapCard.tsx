'use client';
import { useEffect, useRef } from 'react';
import type { GeorefResult, POICategory } from '@/types';
import type L from 'leaflet';

// Colombia center coordinates
const COLOMBIA_CENTER: [number, number] = [4.5709, -74.2973];
const COLOMBIA_ZOOM = 5;
const PROPERTY_ZOOM = 16;

interface Props {
  georef: GeorefResult | null;
  pois: POICategory[] | null;
  address: string;
}

export default function MapCard({ georef, pois, address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const leafletRef = useRef<typeof L | null>(null);

  // Initialize map on mount (centered on Colombia)
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import('leaflet').then(Leaflet => {
      if (!mapRef.current || mapInstance.current) return;
      leafletRef.current = Leaflet;

      const map = Leaflet.map(mapRef.current, { zoomControl: false, attributionControl: false })
        .setView(COLOMBIA_CENTER, COLOMBIA_ZOOM);

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map when georef/pois change — fly to location + add markers
  useEffect(() => {
    const map = mapInstance.current;
    const Leaflet = leafletRef.current;
    if (!map || !Leaflet) return;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    if (georef?.latitude && georef?.longitude) {
      // Fly to property location
      map.flyTo([georef.latitude, georef.longitude], PROPERTY_ZOOM, { duration: 1.5 });

      // Property pin
      const pin = Leaflet.marker([georef.latitude, georef.longitude], {
        icon: Leaflet.divIcon({
          html: '<div style="background:#7C01FF;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
          iconSize: [14, 14],
          className: '',
        }),
      }).addTo(map);
      markersRef.current.push(pin);

      // POI markers
      const colors: Record<string, string> = {
        'centros-comerciales': '#FF8C00', parques: '#00C29C', clinicas: '#E53935',
        transporte: '#1976D2', policia: '#6E6B75',
      };
      if (pois) {
        pois.forEach(cat => {
          cat.result?.forEach(p => {
            const marker = Leaflet.marker([p.lat, p.lng], {
              icon: Leaflet.divIcon({
                html: `<div style="background:${colors[cat.id] || '#7C01FF'};width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2)"></div>`,
                iconSize: [10, 10],
                className: '',
              }),
            }).addTo(map).bindPopup(`<strong>${p.name}</strong><br>${cat.label} · ${p.distance}m`);
            markersRef.current.push(marker);
          });
        });
      }
    } else {
      // No georef — reset to Colombia view
      map.flyTo(COLOMBIA_CENTER, COLOMBIA_ZOOM, { duration: 1 });
    }
  }, [georef, pois]);

  const hasGeoref = !!georef?.latitude;
  const project = georef?.project || '';
  const title = project ? `${project} — ${address}` : address;

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
      <div ref={mapRef} className="h-[240px] w-full bg-gray-100" />
      {hasGeoref && (
        <div className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wide text-purple-600 opacity-80">📍 Ubicación identificada</span>
          <h3 className="font-bold text-[15px] mt-1 mb-3">{title}</h3>
          {pois && pois.length > 0 ? (
            <div className="space-y-1">
              {pois.map(cat =>
                cat.result?.slice(0, 1).map(p => (
                  <div key={p.name} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-[15px] flex-shrink-0">{cat.icon}</span>
                    <span className="text-[14px] text-gray-800 flex-1 truncate">{p.name}</span>
                    <span className="text-[13px] font-semibold text-teal-600 flex-shrink-0">{p.distance}m</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-[14px] text-gray-400">Cargando lugares cercanos...</p>
          )}
        </div>
      )}
      {!hasGeoref && (
        <div className="p-4 text-center">
          <p className="text-[14px] text-gray-400">Ingresa tu dirección para ver la ubicación de tu inmueble</p>
        </div>
      )}
    </div>
  );
}

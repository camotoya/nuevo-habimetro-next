'use client';
import { useEffect, useRef } from 'react';
import type { GeorefResult, POICategory } from '@/types';

interface Props {
  georef: GeorefResult | null;
  pois: POICategory[] | null;
  address: string;
}

export default function MapCard({ georef, pois, address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!georef?.latitude || !georef?.longitude || !mapRef.current) return;

    // Cleanup previous map
    if (mapInstance.current) {
      (mapInstance.current as { remove: () => void }).remove();
      mapInstance.current = null;
    }

    import('leaflet').then(L => {
      if (!mapRef.current) return;

      // Fix Leaflet default icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false })
        .setView([georef.latitude!, georef.longitude!], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Property pin
      L.marker([georef.latitude!, georef.longitude!], {
        icon: L.divIcon({
          html: '<div style="background:#7C01FF;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
          iconSize: [14, 14],
          className: '',
        }),
      }).addTo(map);

      // POI markers
      const colors: Record<string, string> = {
        'centros-comerciales': '#FF8C00', parques: '#00C29C', clinicas: '#E53935',
        transporte: '#1976D2', policia: '#6E6B75',
      };
      if (pois) {
        pois.forEach(cat => {
          cat.result?.forEach(p => {
            L.marker([p.lat, p.lng], {
              icon: L.divIcon({
                html: `<div style="background:${colors[cat.id] || '#7C01FF'};width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2)"></div>`,
                iconSize: [10, 10],
                className: '',
              }),
            }).addTo(map).bindPopup(`<strong>${p.name}</strong><br>${cat.label} · ${p.distance}m`);
          });
        });
      }

      // Force map to recalculate size after render
      setTimeout(() => map.invalidateSize(), 100);

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [georef?.latitude, georef?.longitude, pois]);

  const project = georef?.project || '';
  const title = project ? `${project} — ${address}` : address;

  return (
    <div>
      <div ref={mapRef} className="h-[240px] w-full bg-gray-100" style={{ zIndex: 1 }} />
      <div className="p-4">
        <span className="text-[12px] font-bold uppercase tracking-wide text-purple-600 opacity-80">📍 Ubicación identificada</span>
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
    </div>
  );
}

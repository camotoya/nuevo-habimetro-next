'use client';
import type { GeorefResult, POICategory } from '@/types';

interface Props {
  georef: GeorefResult | null;
  pois: POICategory[] | null;
  address: string;
}

export default function LocationCard({ georef, pois, address }: Props) {
  const project = georef?.project ?? '';
  const displayAddress = georef?.homologated_address ?? georef?.address ?? address;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Mini map placeholder */}
      <div className="relative">
        <div
          id="panelMap"
          className="w-full h-[200px] bg-gradient-to-br from-purple-600 to-purple-900"
        />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
          <span className="text-sm">📍</span>
          <span className="text-xs font-medium text-purple-700">Ubicación identificada</span>
        </div>
      </div>

      {/* Address info */}
      <div className="bg-white p-4">
        {project && (
          <p className="text-sm font-semibold text-gray-800 mb-0.5">{project}</p>
        )}
        <p className="text-xs text-gray-500 mb-3">{displayAddress}</p>

        {/* POIs list */}
        {pois && pois.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Puntos de interés cercanos
            </p>
            <ul className="space-y-1.5">
              {pois.flatMap((cat) =>
                cat.result.slice(0, 2).map((poi) => (
                  <li
                    key={`${cat.id}-${poi.name}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-base shrink-0">{cat.icon}</span>
                    <span className="flex-1 text-gray-700 truncate">{poi.name}</span>
                    <span className="text-xs font-medium text-teal-600 whitespace-nowrap">
                      {poi.distance < 1000
                        ? `${Math.round(poi.distance)} m`
                        : `${(poi.distance / 1000).toFixed(1)} km`}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

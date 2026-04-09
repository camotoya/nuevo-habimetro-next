'use client';
import type { POICategory } from '@/types';

interface Props {
  pois: POICategory[] | null;
}

export default function POIsCard({ pois }: Props) {
  if (!pois || pois.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-sm text-gray-400 text-center">Sin puntos de interés</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-purple-50/50 border border-purple-100 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-purple-800">Puntos de interés</h3>

      <div className="flex flex-wrap gap-2">
        {pois.flatMap((cat) =>
          cat.result.map((poi) => (
            <span
              key={`${cat.id}-${poi.name}`}
              className="inline-flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-xs shadow-sm"
            >
              <span>{cat.icon}</span>
              <span className="text-gray-700 font-medium truncate max-w-[140px]">
                {poi.name}
              </span>
              <span className="text-teal-600 font-semibold whitespace-nowrap">
                {poi.distance < 1000
                  ? `${Math.round(poi.distance)} m`
                  : `${(poi.distance / 1000).toFixed(1)} km`}
              </span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

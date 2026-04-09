'use client';
import type { CatastralData } from '@/types';

interface Props {
  catastral: CatastralData | null;
  project: string;
}

export default function CatastralCard({ catastral, project }: Props) {
  if (!catastral || catastral.torres.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-sm text-gray-400 text-center">Sin datos catastrales</p>
      </div>
    );
  }

  const torres = catastral.torres;
  const totalUnits = torres.reduce((acc, t) => acc + t.apartamentos.length, 0);
  const allFloors = torres.flatMap((t) => t.pisos);
  const minFloor = allFloors.length > 0 ? Math.min(...allFloors) : null;
  const maxFloor = allFloors.length > 0 ? Math.max(...allFloors) : null;
  const floorsRange =
    minFloor !== null && maxFloor !== null
      ? minFloor === maxFloor
        ? `${minFloor}`
        : `${minFloor} – ${maxFloor}`
      : '—';

  const vetustez = torres[0]?.vetustez;
  const yearBuilt = vetustez ? new Date().getFullYear() - vetustez : null;

  return (
    <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-teal-800">Datos catastrales</h3>

      {project && (
        <p className="text-xs text-teal-700 font-medium">{project}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-teal-600">Torres</p>
          <p className="text-sm font-semibold text-gray-800">{torres.length}</p>
        </div>
        <div>
          <p className="text-xs text-teal-600">Unidades</p>
          <p className="text-sm font-semibold text-gray-800">{totalUnits}</p>
        </div>
        <div>
          <p className="text-xs text-teal-600">Pisos</p>
          <p className="text-sm font-semibold text-gray-800">{floorsRange}</p>
        </div>
        <div>
          <p className="text-xs text-teal-600">Año aprox.</p>
          <p className="text-sm font-semibold text-gray-800">
            {yearBuilt ?? '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

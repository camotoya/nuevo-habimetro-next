'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CatastralData } from '@/types';

interface Props {
  catastral: CatastralData | null;
  propertyType: number;
  onSelectUnit: (unit: string, area: number | null) => void;
}

export default function StepCatastral({ catastral, propertyType, onSelectUnit }: Props) {
  const [selectedTorre, setSelectedTorre] = useState(0);

  // Houses don't have catastral data
  if (propertyType === 2 || propertyType === 4) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-base text-gray-500">
          Datos catastrales no aplican para casas
        </p>
      </div>
    );
  }

  // No catastral data available
  if (!catastral || catastral.torres.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-base text-gray-500">
          No encontramos datos catastrales. Continúa con los datos manualmente.
        </p>
      </div>
    );
  }

  const torre = catastral.torres[selectedTorre];
  const apartments = torre?.apartamentos ?? [];
  const apartmentsInfo = torre?.apartamentos_info ?? {};

  function handleUnitChange(unit: string) {
    const info = apartmentsInfo[unit];
    onSelectUnit(unit, info?.area_catastro ?? null);
  }

  return (
    <div className="space-y-4">
      {/* Building info */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 space-y-2">
        <h3 className="text-base font-semibold text-gray-700">Información del edificio</h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          {torre.complemento && (
            <div>
              <span className="text-gray-400">Nombre</span>
              <p className="font-medium text-gray-700">{torre.complemento}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400">Unidades</span>
            <p className="font-medium text-gray-700">{apartments.length}</p>
          </div>
          {torre.vetustez != null && (
            <div>
              <span className="text-gray-400">Año construcción</span>
              <p className="font-medium text-gray-700">{torre.vetustez}</p>
            </div>
          )}
          {torre.pisos && torre.pisos.length > 0 && (
            <div>
              <span className="text-gray-400">Pisos</span>
              <p className="font-medium text-gray-700">{Math.max(...torre.pisos)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Torre selector if multiple */}
      {catastral.torres.length > 1 && (
        <div>
          <label className="block text-[15px] font-medium text-gray-600 mb-1.5">Torre</label>
          <select
            value={selectedTorre}
            onChange={(e) => setSelectedTorre(Number(e.target.value))}
            className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-base bg-white focus:border-purple-600 focus:outline-none transition-colors"
          >
            {catastral.torres.map((t, i) => (
              <option key={i} value={i}>
                {t.complemento || `Torre ${t.numero}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Unit selector */}
      {apartments.length > 0 && (
        <div>
          <label className="block text-[15px] font-medium text-gray-600 mb-1.5">
            Selecciona tu unidad
          </label>
          <select
            defaultValue=""
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-base bg-white focus:border-purple-600 focus:outline-none transition-colors"
          >
            <option value="" disabled>
              Selecciona apartamento
            </option>
            {apartments.map((apt) => {
              const info = apartmentsInfo[apt];
              const areaLabel = info?.area_catastro ? ` — ${info.area_catastro} m²` : '';
              return (
                <option key={apt} value={apt}>
                  Apto {apt}{areaLabel}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
}

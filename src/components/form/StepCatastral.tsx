'use client';
import { useState } from 'react';
import type { CatastralData } from '@/types';

interface Props {
  catastral: CatastralData | null;
  propertyType: number;
  project: string;
  onSelectUnit: (unit: string, area: number | null) => void;
}

export default function StepCatastral({ catastral, propertyType, project, onSelectUnit }: Props) {
  const [selectedTorre, setSelectedTorre] = useState(0);

  if (propertyType === 2 || propertyType === 4) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center">
        <p className="text-[16px] text-gray-500">Datos catastrales no aplican para casas</p>
      </div>
    );
  }

  if (!catastral || catastral.torres.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center">
        <p className="text-[16px] text-gray-500">No encontramos datos catastrales. Continúa con los datos manualmente.</p>
      </div>
    );
  }

  const torre = catastral.torres[selectedTorre];
  const apartments = torre?.apartamentos ?? [];
  const apartmentsInfo = torre?.apartamentos_info ?? {};
  const age = torre.vetustez ? new Date().getFullYear() - torre.vetustez : null;

  function handleUnitChange(unit: string) {
    const info = apartmentsInfo[unit];
    onSelectUnit(unit, info?.area_catastro ?? null);
  }

  const datos = [
    { label: 'Proyecto', value: project || torre.complemento || '—' },
    { label: 'Unidades', value: apartments.length > 0 ? String(apartments.length) : '—' },
    { label: 'Pisos', value: torre.pisos.length > 0 ? `${torre.pisos[0]} al ${torre.pisos[torre.pisos.length - 1]}` : '—' },
    { label: 'Construido', value: torre.vetustez ? `${torre.vetustez} (${age} años)` : '—' },
    { label: 'Tipo', value: torre.complemento ? torre.complemento.charAt(0).toUpperCase() + torre.complemento.slice(1) : '—' },
  ];

  return (
    <div className="space-y-4">
      {/* Datos catastrales */}
      <div className="rounded-xl bg-teal-50 border border-teal-200 p-4">
        <h3 className="text-[16px] font-semibold text-gray-700 mb-3">Datos catastrales</h3>
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-5 max-sm:grid-cols-3">
          {datos.map(d => (
            <div key={d.label}>
              <div className="text-[12px] font-medium text-teal-700 uppercase tracking-wide">{d.label}</div>
              <div className="text-[15px] font-semibold text-gray-800 mt-0.5">{d.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Torre selector if multiple */}
      {catastral.torres.length > 1 && (
        <div>
          <label className="block text-[16px] font-medium text-gray-600 mb-1.5">Torre</label>
          <select
            value={selectedTorre}
            onChange={(e) => setSelectedTorre(Number(e.target.value))}
            className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-[16px] bg-white focus:border-purple-600 focus:outline-none transition-colors"
          >
            {catastral.torres.map((t, i) => (
              <option key={i} value={i}>{t.complemento || `Torre ${t.numero}`}</option>
            ))}
          </select>
        </div>
      )}

      {/* Unit selector */}
      {apartments.length > 0 && (
        <div>
          <label className="block text-[16px] font-medium text-gray-600 mb-1.5">Selecciona tu unidad</label>
          <select
            defaultValue=""
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-[16px] bg-white focus:border-purple-600 focus:outline-none transition-colors"
          >
            <option value="" disabled>Selecciona apartamento</option>
            {apartments.map((apt) => {
              const info = apartmentsInfo[apt];
              const areaLabel = info?.area_catastro ? ` — ${info.area_catastro} m²` : '';
              return <option key={apt} value={apt}>Apto {apt}{areaLabel}</option>;
            })}
          </select>
        </div>
      )}
    </div>
  );
}

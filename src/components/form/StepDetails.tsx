'use client';
import { cn } from '@/lib/utils';

interface Props {
  formData: {
    elevator: number;
    balcony: number;
    terrace: number;
    storage: number;
    doorman: number;
    remodeled: number;
    floor: number;
    view: string;
  };
  onChange: (field: string, value: number | string) => void;
}

const TOGGLES: { field: string; label: string }[] = [
  { field: 'elevator', label: 'Ascensor' },
  { field: 'balcony', label: 'Balcón' },
  { field: 'terrace', label: 'Terraza' },
  { field: 'storage', label: 'Depósito' },
  { field: 'doorman', label: 'Portería' },
  { field: 'remodeled', label: 'Remodelado' },
];

const VIEW_OPTIONS = [
  { value: '', label: 'Seleccionar' },
  { value: 'Interna', label: 'Interna' },
  { value: 'Exterior', label: 'Exterior' },
  { value: 'Panorámica', label: 'Panorámica' },
];

const inputBase =
  'w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-[15px] bg-white focus:border-purple-600 focus:outline-none transition-colors';

export default function StepDetails({ formData, onChange }: Props) {
  const data = formData as Record<string, number | string>;

  return (
    <div className="space-y-6">
      {/* Toggle buttons grid */}
      <div className="grid grid-cols-3 gap-3">
        {TOGGLES.map(({ field, label }) => {
          const active = data[field] === 1;
          return (
            <div key={field} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-600">{label}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange(field, 1)}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-2.5 text-[15px] font-medium transition-all',
                    active
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  )}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => onChange(field, 0)}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-2.5 text-[15px] font-medium transition-all',
                    !active
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  )}
                >
                  No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floor and View */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Piso</label>
          <input
            type="number"
            min={0}
            placeholder="1"
            value={formData.floor || ''}
            onChange={(e) => onChange('floor', Number(e.target.value))}
            className={inputBase}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Vista</label>
          <select
            value={formData.view}
            onChange={(e) => onChange('view', e.target.value)}
            className={inputBase}
          >
            {VIEW_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

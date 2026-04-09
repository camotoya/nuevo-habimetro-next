'use client';
import { cn, asset } from '@/lib/utils';

const TYPES = [
  { value: 1, label: 'Apartamento', img: '/icons/apto.png', imgSel: '/icons/apto_sel.png' },
  { value: 2, label: 'Casa', img: '/icons/casa.png', imgSel: '/icons/casa_sel.png' },
  { value: 3, label: 'Apto en conjunto', img: '/icons/apto_conj.png', imgSel: '/icons/apto_conj_sel.png' },
  { value: 4, label: 'Casa en conjunto', img: '/icons/casa_conj.png', imgSel: '/icons/casa_conj_sel.png' },
];

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function PropertyTypeSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-[15px] font-medium text-gray-600 mb-2">Tipo de inmueble</label>
      <div className="grid grid-cols-2 gap-2">
        {TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium',
              value === t.value
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            )}
          >
            <img
              src={asset(value === t.value ? t.imgSel : t.img)}
              alt={t.label}
              className="h-12 w-auto"
            />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

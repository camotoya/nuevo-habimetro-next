'use client';
import { cn, asset } from '@/lib/utils';

const TYPES = [
  { value: 1, label: 'Apartamento', img: '/icons/apto.png', imgSel: '/icons/apto_sel.png' },
  { value: 2, label: 'Casa', img: '/icons/casa.png', imgSel: '/icons/casa_sel.png' },
  { value: 3, label: 'Apartamento en conjunto', img: '/icons/apto_conj.png', imgSel: '/icons/apto_conj_sel.png' },
  { value: 4, label: 'Casa en conjunto', img: '/icons/casa_conj.png', imgSel: '/icons/casa_conj_sel.png' },
];

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function PropertyTypeSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-[16px] font-medium text-gray-600 mb-2">Tipo de inmueble</label>
      <div className="grid grid-cols-2 gap-2">
        {TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-[16px] font-medium',
              'sm:flex-row flex-col',
              value === t.value
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            )}
          >
            <span className="flex-1 text-left sm:text-left text-center w-full sm:w-auto">{t.label}</span>
            <img
              src={asset(value === t.value ? t.imgSel : t.img)}
              alt={t.label}
              className="h-[42px] w-auto flex-shrink-0 order-last sm:order-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

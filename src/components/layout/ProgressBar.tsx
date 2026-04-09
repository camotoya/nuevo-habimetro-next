'use client';
import { cn } from '@/lib/utils';

interface Props {
  step: number;
  totalSteps: number;
}

const HINTS: Record<number, string> = {
  1: 'Comencemos con la ubicación de tu inmueble.',
  2: 'Agrega los datos catastrales para mayor precisión.',
  3: 'Las características mejoran el estimado.',
  4: 'Casi listo, solo faltan unos detalles más.',
  5: 'Último paso para obtener tu avalúo.',
};

function getBarColor(pct: number): string {
  if (pct < 35) return 'bg-orange-400';
  if (pct < 65) return 'bg-yellow-400';
  return 'bg-teal-500';
}

export default function ProgressBar({ step, totalSteps }: Props) {
  const pct = Math.round((step / totalSteps) * 100);
  const hint = HINTS[step] ?? '';

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">
          Precisión del avalúo
        </span>
        <span
          className={cn(
            'text-xs font-bold',
            pct < 35 && 'text-orange-500',
            pct >= 35 && pct < 65 && 'text-yellow-600',
            pct >= 65 && 'text-teal-600'
          )}
        >
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getBarColor(pct))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
}

'use client';

interface Props {
  step: number;
  totalSteps: number;
}

const HINTS: Record<number, string> = {
  1: 'Comencemos con la ubicación de tu inmueble.',
  2: 'Las características mejoran la precisión.',
  3: 'Casi listo, solo faltan unos detalles más.',
  4: 'Último paso para ver tu resultado.',
};

export default function ProgressBar({ step, totalSteps }: Props) {
  const pct = Math.round((step / totalSteps) * 100);
  const hint = HINTS[step] ?? '';

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">Perfil del inmueble</span>
        <span className="text-xs font-bold text-teal-600">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-teal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

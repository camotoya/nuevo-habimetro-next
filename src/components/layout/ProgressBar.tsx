'use client';

interface Props {
  step: number;
  totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: Props) {
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[16px] font-medium text-gray-500">Perfil del inmueble</span>
        <span className="text-[16px] font-bold text-teal-600">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-teal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

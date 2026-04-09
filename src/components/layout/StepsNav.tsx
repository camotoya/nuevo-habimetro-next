'use client';
import { cn } from '@/lib/utils';

interface Props {
  currentStep: number;
  totalSteps: number;
  steps: { label: string }[];
}

export default function StepsNav({ currentStep, totalSteps, steps }: Props) {
  return (
    <nav className="py-3">
      <div className="flex items-center">
        {steps.slice(0, totalSteps).map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0',
                  isActive && 'bg-purple-600 text-white',
                  isDone && 'bg-teal-500 text-white',
                  !isActive && !isDone && 'bg-gray-200 text-gray-400'
                )}>
                  {isDone ? '✓' : stepNum}
                </span>
                <span className={cn(
                  'text-[13px] font-medium',
                  isActive && 'text-purple-700',
                  isDone && 'text-teal-600',
                  !isActive && !isDone && 'text-gray-400'
                )}>
                  {step.label}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div className={cn(
                  'h-px flex-1 mx-2',
                  isDone ? 'bg-teal-400' : 'bg-gray-200'
                )} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

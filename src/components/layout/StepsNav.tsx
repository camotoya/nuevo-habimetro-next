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
      <div className="flex items-center gap-1">
        {steps.slice(0, totalSteps).map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={i} className="flex items-center gap-1 flex-1">
              {i > 0 && (
                <div className={cn('h-px flex-1 min-w-2', isDone ? 'bg-teal-400' : 'bg-gray-200')} />
              )}
              <div className="flex items-center gap-1">
                <span className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0',
                  isActive && 'bg-purple-600 text-white',
                  isDone && 'bg-teal-500 text-white',
                  !isActive && !isDone && 'bg-gray-200 text-gray-400'
                )}>
                  {isDone ? '✓' : stepNum}
                </span>
                <span className={cn(
                  'text-[11px] font-medium',
                  isActive && 'text-purple-700',
                  isDone && 'text-teal-600',
                  !isActive && !isDone && 'text-gray-400'
                )}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

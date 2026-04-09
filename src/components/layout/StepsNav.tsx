'use client';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
}

interface Props {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export default function StepsNav({ currentStep, totalSteps, steps }: Props) {
  return (
    <nav className="w-full overflow-x-auto py-4">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          {steps.slice(0, totalSteps).map((step, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={cn(
                      'hidden sm:block w-6 h-px',
                      isDone ? 'bg-teal-400' : 'bg-gray-300'
                    )}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0',
                      isActive && 'bg-purple-600 text-white',
                      isDone && 'bg-teal-500 text-white',
                      !isActive && !isDone && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isDone ? '✓' : stepNum}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium whitespace-nowrap',
                      isActive && 'text-purple-700',
                      isDone && 'text-teal-600',
                      !isActive && !isDone && 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

'use client'

import { Check, Compass, SlidersHorizontal, FileSearch, PackageCheck } from 'lucide-react'

const STEPS = [
  { num: 1, label: 'Discover', icon: Compass },
  { num: 2, label: 'Customize', icon: SlidersHorizontal },
  { num: 3, label: 'Review', icon: FileSearch },
  { num: 4, label: 'Export', icon: PackageCheck },
]

export default function StepProgress({ current }: { readonly current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((step, i) => {
        const isComplete = current > step.num
        const isActive = current === step.num
        const isPending = current < step.num
        const StepIcon = step.icon

        return (
          <div key={step.num} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
                style={{
                  background: isComplete
                    ? 'var(--cash)'
                    : isActive
                      ? 'var(--cash)'
                      : 'var(--cream-dark)',
                  color: isComplete || isActive ? '#fff' : 'var(--brown-faint)',
                  boxShadow: isActive ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                }}
              >
                {isComplete ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <StepIcon size={14} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
              <span
                className="text-xs font-bold hidden sm:inline"
                style={{
                  color: isActive
                    ? 'var(--brown)'
                    : isPending
                      ? 'var(--brown-faint)'
                      : 'var(--cash-dark)',
                }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-6 sm:w-10 h-0.5 rounded-full"
                style={{
                  background: current > step.num
                    ? 'var(--cash)'
                    : 'var(--cream-dark)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

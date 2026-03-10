'use client'

import { Search, Crosshair, FileText, Rocket, CheckCircle } from 'lucide-react'

const STEPS = [
  { num: 1, label: 'Discover', icon: Search },
  { num: 2, label: 'Research', icon: Crosshair },
  { num: 3, label: 'Find the Gap', icon: Crosshair },
  { num: 4, label: 'Build Spec', icon: FileText },
  { num: 5, label: 'Ship It', icon: Rocket },
]

interface StepperProps {
  readonly current: number
  readonly onStepClick?: (step: number) => void
}

export default function Stepper({ current, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 w-full max-w-2xl mx-auto">
      {STEPS.map((step, i) => {
        const done = current > step.num
        const active = current === step.num
        const clickable = done && onStepClick

        return (
          <div key={step.num} className="flex items-center gap-1 sm:gap-2 flex-1">
            <button
              onClick={() => clickable && onStepClick(step.num)}
              disabled={!clickable}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl transition-all text-xs sm:text-sm font-bold whitespace-nowrap"
              style={{
                background: active
                  ? 'var(--cash)'
                  : done
                    ? 'var(--cash-soft)'
                    : 'var(--white)',
                color: active
                  ? '#fff'
                  : done
                    ? 'var(--cash)'
                    : 'var(--brown-faint)',
                border: active
                  ? '2px solid var(--cash)'
                  : done
                    ? '2px solid var(--cash-light)'
                    : '2px solid var(--spot-gray)',
                cursor: clickable ? 'pointer' : active ? 'default' : 'default',
                boxShadow: active ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none',
              }}
            >
              {done ? (
                <CheckCircle size={14} />
              ) : (
                <step.icon size={14} />
              )}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.num}</span>
            </button>

            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 rounded-full min-w-3"
                style={{
                  background: current > step.num
                    ? 'var(--cash-light)'
                    : 'var(--spot-gray)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

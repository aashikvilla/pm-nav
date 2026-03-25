"use client"

import { usePathname } from "next/navigation"

const STEPS = [
  { number: 1, label: "Resume", path: "/onboarding/upload" },
  { number: 2, label: "Profile", path: "/onboarding/profile" },
  { number: 3, label: "Analysis", path: "/onboarding/analyzing" },
  { number: 4, label: "Chat", path: "/onboarding/conversation" },
  { number: 5, label: "Summary", path: "/onboarding/summary" },
]

function getActiveStep(pathname: string): number {
  const match = STEPS.find((s) => pathname.startsWith(s.path))
  return match?.number ?? 1
}

export function OnboardingProgress() {
  const pathname = usePathname()
  const activeStep = getActiveStep(pathname)

  return (
    <header className="bg-[var(--color-surface-container-lowest)]">
      <div className="max-w-2xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[var(--color-primary)] font-semibold text-lg tracking-tight">pm·nav</span>
          <span className="text-xs text-[var(--color-on-surface-variant)]">
            Step {activeStep} of {STEPS.length}
          </span>
        </div>

        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const isDone = step.number < activeStep
            const isActive = step.number === activeStep

            return (
              <div key={step.number} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                      isDone
                        ? "bg-[var(--color-primary)] text-white"
                        : isActive
                          ? "bg-[var(--color-primary-fixed)] text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]"
                          : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"
                    }`}
                  >
                    {isDone ? "✓" : step.number}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:block ${
                      isActive
                        ? "text-[var(--color-primary)]"
                        : isDone
                          ? "text-[var(--color-on-surface-variant)]"
                          : "text-[var(--color-outline-variant)]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-200 ${
                      isDone ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-container)]"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </header>
  )
}

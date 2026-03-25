"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

const STEPS = [
  { label: "Parsing resume", detail: "Extracting work history and responsibilities" },
  { label: "Extracting PM signals", detail: "Identifying problem-solving and leadership patterns" },
  { label: "Mapping skill gaps", detail: "Comparing your experience to PM skill taxonomy" },
  { label: "Preparing your profile", detail: "Building your personalised skill gap report" },
]

export default function OnboardingAnalyzingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const analyzeStarted = useRef(false)

  useEffect(() => {
    if (analyzeStarted.current) return
    analyzeStarted.current = true

    let stepInterval: ReturnType<typeof setInterval>
    let pollInterval: ReturnType<typeof setInterval>

    const startAnalysis = async () => {
      setHasStarted(true)

      // Animate through steps while analysis runs
      let step = 0
      stepInterval = setInterval(() => {
        step = Math.min(step + 1, STEPS.length - 1)
        setCurrentStep(step)
      }, 8000)

      // Trigger analysis
      fetch("/api/v1/onboarding/analyze", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          clearInterval(stepInterval)
          if (data.analysisComplete) {
            setCurrentStep(STEPS.length - 1)
            setTimeout(() => router.push("/onboarding/conversation"), 1200)
          } else {
            setError(data.error || "Analysis failed")
          }
        })
        .catch(() => {
          clearInterval(stepInterval)
          setError("Analysis failed. Please try again.")
        })

      // Poll for status as fallback
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch("/api/v1/onboarding/analysis-status")
          const data = await res.json()
          if (data.status === "completed") {
            clearInterval(pollInterval)
            clearInterval(stepInterval)
            setCurrentStep(STEPS.length - 1)
            setTimeout(() => router.push("/onboarding/conversation"), 1200)
          } else if (data.status === "failed") {
            clearInterval(pollInterval)
            clearInterval(stepInterval)
            setError("Analysis failed. Please try again.")
          }
        } catch {
          // keep polling
        }
      }, 3000)
    }

    startAnalysis()

    return () => {
      clearInterval(stepInterval)
      clearInterval(pollInterval)
    }
  }, [router])

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto text-2xl">⚠️</div>
          <h2 className="text-xl font-semibold text-[var(--color-on-surface)]">Something went wrong</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)]">{error}</p>
          <button
            onClick={() => { setError(null); analyzeStarted.current = false }}
            className="bg-[var(--color-primary)] text-white rounded-full px-8 py-3 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-primary)] px-6">
      <div className="max-w-sm w-full space-y-12 text-center">
        {/* Pulsing indicator */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-white opacity-10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-white opacity-15 animate-ping" style={{ animationDelay: "0.3s" }} />
          <div className="relative w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white opacity-80" />
          </div>
        </div>

        {/* Current step */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            {hasStarted ? STEPS[currentStep].label : "Getting started..."}
          </h2>
          <p className="text-sm text-white opacity-70">
            {hasStarted ? STEPS[currentStep].detail : "Connecting to analysis engine"}
          </p>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === currentStep
                  ? "w-6 h-2 bg-white"
                  : i < currentStep
                    ? "w-2 h-2 bg-white opacity-60"
                    : "w-2 h-2 bg-white opacity-25"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-white opacity-50">This usually takes 30–60 seconds</p>
      </div>
    </div>
  )
}

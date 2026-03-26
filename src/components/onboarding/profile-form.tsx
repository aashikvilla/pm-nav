"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FullScreenLoader } from "@/components/ui/page-loader"

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  currentJobRole: z.string().min(2, "Job title is required"),
  currentIndustry: z.string().min(1, "Industry is required"),
  yearsExperience: z.number().min(0).max(40),
  targetRoleType: z.enum(["consumer", "growth", "technical", "platform", "ai", "b2b"]),
  targetTimeline: z.enum(["3months", "6months", "12months"]),
  preparationStage: z.enum(["exploring", "committed", "applying"]),
})

type FormData = z.infer<typeof schema>

const PM_ROLES = [
  { value: "consumer" as const, label: "Consumer PM", description: "B2C products, growth-focused, user psychology" },
  { value: "growth" as const, label: "Growth PM", description: "Funnel optimization, experimentation, metrics" },
  { value: "technical" as const, label: "Technical PM", description: "APIs, infra products, engineering collaboration" },
  { value: "platform" as const, label: "Platform PM", description: "Internal tools, developer platforms, scalability" },
  { value: "ai" as const, label: "AI PM", description: "ML products, AI features, model evaluation" },
  { value: "b2b" as const, label: "B2B / Enterprise PM", description: "SaaS, customer success, enterprise sales cycles" },
]

const INDUSTRIES = [
  "Technology",
  "Finance / Fintech",
  "Healthcare",
  "E-commerce / Retail",
  "Education / Edtech",
  "Media / Entertainment",
  "Consulting",
  "Manufacturing",
  "Real Estate",
  "Government / Non-profit",
  "Other",
]

interface Props {
  defaultName?: string
  defaultJobRole?: string
  defaultYearsExperience?: number
  recommendedRole?: FormData["targetRoleType"]
}

export function ProfileForm({ defaultName, defaultJobRole, defaultYearsExperience, recommendedRole }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: defaultName ?? "",
      currentJobRole: defaultJobRole ?? "",
      yearsExperience: defaultYearsExperience ?? 3,
      targetRoleType: recommendedRole ?? "consumer",
      targetTimeline: "6months",
      preparationStage: "committed",
    },
  })

  const selectedRole = watch("targetRoleType")

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      const res = await fetch("/api/v1/onboarding/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Failed to save")
      }

      router.push("/onboarding/analyzing")
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isSubmitting && <FullScreenLoader message="Starting your analysis..." />}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-8">
        {/* Basic info */}
        <section className="space-y-5">
          <h2 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
            About you
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-2">Full name</label>
              <input
                {...register("fullName")}
                placeholder="Your name"
                className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200"
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-2">Current job title</label>
                <input
                  {...register("currentJobRole")}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200"
                />
                {errors.currentJobRole && <p className="text-xs text-red-600 mt-1">{errors.currentJobRole.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-2">
                  Years of experience
                </label>
                <input
                  {...register("yearsExperience", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  max={40}
                  className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-2">Industry</label>
              <select
                {...register("currentIndustry")}
                className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200"
              >
                <option value="">Select your industry</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              {errors.currentIndustry && <p className="text-xs text-red-600 mt-1">{errors.currentIndustry.message}</p>}
            </div>
          </div>
        </section>

        {/* Target PM role */}
        <section className="space-y-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
              What type of PM do you want to be?
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PM_ROLES.map((role) => {
              const isSelected = selectedRole === role.value
              const isRecommended = recommendedRole === role.value
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue("targetRoleType", role.value)}
                  className={`relative text-left rounded-2xl p-4 transition-all duration-200 ${
                    isSelected
                      ? "bg-[var(--color-primary-fixed)] ring-2 ring-[var(--color-primary)]"
                      : "bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-surface-container)]"
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold bg-[var(--color-secondary-fixed)] text-[var(--color-on-surface)] px-1.5 py-0.5 rounded-full leading-none">
                      Recommended
                    </span>
                  )}
                  <p className={`text-sm font-semibold pr-2 ${isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface)]"}`}>
                    {role.label}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 leading-snug">
                    {role.description}
                  </p>
                </button>
              )
            })}
          </div>
          {errors.targetRoleType && <p className="text-xs text-red-600">{errors.targetRoleType.message}</p>}
        </section>

        {/* Timeline + stage */}
        <section className="space-y-5">
          <h2 className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
            Your goal
          </h2>

          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-3">
              When do you want to land your first PM role?
            </label>
            <div className="flex gap-3">
              {(["3months", "6months", "12months"] as const).map((t) => {
                const label = t === "3months" ? "3 months" : t === "6months" ? "6 months" : "12 months"
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setValue("targetTimeline", t)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      watch("targetTimeline") === t
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface)] mb-3">
              Where are you in your transition?
            </label>
            <div className="flex gap-3">
              {(["exploring", "committed", "applying"] as const).map((s) => {
                const label = s.charAt(0).toUpperCase() + s.slice(1)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setValue("preparationStage", s)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      watch("preparationStage") === s
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{apiError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--color-primary)] text-white rounded-full py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Starting analysis..." : "Start analysis →"}
        </button>
      </form>
    </>
  )
}

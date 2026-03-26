"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "product_sense", label: "Product Sense" },
  { value: "analytical", label: "Analytical" },
  { value: "strategy", label: "Strategy" },
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "estimation", label: "Estimation" },
  { value: "execution", label: "Execution" },
] as const

const DIFFICULTIES = [
  { value: "", label: "Any Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const

export function QuestionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") ?? ""
  const activeDifficulty = searchParams.get("difficulty") ?? ""

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`/dashboard/questions?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateFilter("category", cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div>
        <select
          value={activeDifficulty}
          onChange={(e) => updateFilter("difficulty", e.target.value)}
          className="px-3 py-1.5 rounded-xl text-sm bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border-0 outline-none cursor-pointer"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

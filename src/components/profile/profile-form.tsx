"use client"

import { useState } from "react"

interface Profile {
  fullName: string | null
  bio: string | null
  linkedinUrl: string | null
  location: string | null
  currentJobRole: string | null
  yearsExperience: number | null
  profileSlug: string | null
}

interface Settings {
  showReadinessScore: boolean
  showPsiEntries: boolean
  showAssignments: boolean
  showActivityGraph: boolean
  showStreak: boolean
}

interface ProfileFormProps {
  initialProfile: Profile | null
  initialSettings: Settings | null
}

const DEFAULT_SETTINGS: Settings = {
  showReadinessScore: true,
  showPsiEntries: true,
  showAssignments: true,
  showActivityGraph: true,
  showStreak: true,
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-on-surface)]">{label}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-container)]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 mt-0.5 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  )
}

export function ProfileForm({ initialProfile, initialSettings }: ProfileFormProps) {
  const [form, setForm] = useState({
    fullName: initialProfile?.fullName ?? "",
    bio: initialProfile?.bio ?? "",
    linkedinUrl: initialProfile?.linkedinUrl ?? "",
    location: initialProfile?.location ?? "",
    currentJobRole: initialProfile?.currentJobRole ?? "",
    yearsExperience: initialProfile?.yearsExperience?.toString() ?? "",
    profileSlug: initialProfile?.profileSlug ?? "",
  })
  const [settings, setSettings] = useState<Settings>(initialSettings ?? DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)

  function handleChange(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (field === "profileSlug") setSlugError(null)
    if (success) setSuccess(false)
    if (error) setError(null)
  }

  function handleSlugInput(value: string) {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-")
    handleChange("profileSlug", sanitized)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSlugError(null)
    setSuccess(false)

    try {
      const payload: Record<string, unknown> = {
        fullName: form.fullName,
        bio: form.bio,
        linkedinUrl: form.linkedinUrl,
        location: form.location,
        currentJobRole: form.currentJobRole,
        profileSlug: form.profileSlug,
        ...settings,
      }
      if (form.yearsExperience) {
        payload.yearsExperience = parseInt(form.yearsExperience, 10)
      }

      const res = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.status === 409) {
        setSlugError(data.error)
        return
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setSuccess(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
        <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Jane Smith"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Current Role
            </label>
            <input
              type="text"
              value={form.currentJobRole}
              onChange={(e) => handleChange("currentJobRole", e.target.value)}
              placeholder="Software Engineer"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={form.yearsExperience}
              onChange={(e) => handleChange("yearsExperience", e.target.value)}
              placeholder="5"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              placeholder="A short description about yourself..."
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
        </div>
      </div>

      {/* Public Profile URL */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
        <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-1">Public Profile URL</h2>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-5">
          Choose a unique URL slug for your public profile. Only lowercase letters, numbers, and hyphens.
        </p>
        <div className="flex items-center gap-0">
          <span className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-sm px-4 py-3 rounded-l-xl border-r border-[var(--color-surface-container-low)]">
            loomis.app/profile/
          </span>
          <input
            type="text"
            value={form.profileSlug}
            onChange={(e) => handleSlugInput(e.target.value)}
            placeholder="your-name"
            className="flex-1 bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-r-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          />
        </div>
        {slugError && <p className="mt-2 text-xs text-rose-600">{slugError}</p>}
        {form.profileSlug && !slugError && (
          <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
            Preview:{" "}
            <a
              href={`/profile/${form.profileSlug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              loomis.app/profile/{form.profileSlug}
            </a>
          </p>
        )}
      </div>

      {/* Visibility */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
        <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-1">Profile Visibility</h2>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">
          Control what appears on your public profile. Requires a profile URL slug to be set.
        </p>
        <div className="divide-y divide-[var(--color-surface-container-low)]">
          <Toggle
            checked={settings.showReadinessScore}
            onChange={(v) => setSettings((s) => ({ ...s, showReadinessScore: v }))}
            label="Skill Scores"
            description="Show your skill category readiness scores"
          />
          <Toggle
            checked={settings.showPsiEntries}
            onChange={(v) => setSettings((s) => ({ ...s, showPsiEntries: v }))}
            label="PSI Entries"
            description="Show your problem-solution-impact stories"
          />
          <Toggle
            checked={settings.showStreak}
            onChange={(v) => setSettings((s) => ({ ...s, showStreak: v }))}
            label="Activity Streak"
            description="Show your current learning streak"
          />
          <Toggle
            checked={settings.showAssignments}
            onChange={(v) => setSettings((s) => ({ ...s, showAssignments: v }))}
            label="Learning Progress"
            description="Show completed learning stages"
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {success && (
          <span className="text-sm text-emerald-600 font-medium">Profile saved.</span>
        )}
        {error && (
          <span className="text-sm text-rose-600">{error}</span>
        )}
      </div>
    </form>
  )
}

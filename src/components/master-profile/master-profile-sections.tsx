"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EntityCard } from "./entity-card"
import WorkExperienceForm from "./work-experience-form"
import EducationForm from "./education-form"
import ProjectForm from "./project-form"
import CertificationForm from "./certification-form"
import AchievementForm from "./achievement-form"

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  workExperiences: any[]
  education: any[]
  projects: any[]
  certifications: any[]
  achievements: any[]
}

type FormType = "work" | "education" | "project" | "certification" | "achievement" | null
type EditEntity = { type: FormType; entity: any } | null

function formatDateRange(startDate: string | null, endDate: string | null, isCurrent?: boolean): string {
  const fmt = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }
  const start = startDate ? fmt(startDate) : ""
  const end = isCurrent ? "Present" : endDate ? fmt(endDate) : ""
  if (start && end) return `${start} — ${end}`
  if (start) return `${start} — Present`
  if (end) return end
  return ""
}

export function MasterProfileSections({ workExperiences, education, projects, certifications, achievements }: Props) {
  const router = useRouter()
  const [addingType, setAddingType] = useState<FormType>(null)
  const [editing, setEditing] = useState<EditEntity>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(type: string, id: string) {
    if (!confirm("Are you sure you want to delete this?")) return
    setDeletingId(id)
    try {
      await fetch(`/api/v1/${type}/${id}`, { method: "DELETE" })
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleVisibility(type: string, id: string, currentlyVisible: boolean) {
    await fetch(`/api/v1/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !currentlyVisible }),
    })
    router.refresh()
  }

  function closeForm() {
    setAddingType(null)
    setEditing(null)
  }

  return (
    <>
      {/* Work Experience */}
      <Section
        title="Work Experience"
        count={workExperiences.length}
        onAdd={() => setAddingType("work")}
      >
        {workExperiences.map((wx: any) => (
          <EntityCard
            key={wx.id}
            title={wx.title}
            subtitle={wx.company}
            dateRange={formatDateRange(wx.startDate, wx.endDate, wx.isCurrent)}
            description={wx.description}
            isVisible={true}
            onToggleVisibility={() => {}}
            onEdit={() => setEditing({ type: "work", entity: wx })}
            onDelete={() => handleDelete("work-experience", wx.id)}
            isDeleting={deletingId === wx.id}
          />
        ))}
      </Section>

      {/* Education */}
      <Section
        title="Education"
        count={education.length}
        onAdd={() => setAddingType("education")}
      >
        {education.map((ed: any) => (
          <EntityCard
            key={ed.id}
            title={ed.school}
            subtitle={[ed.degree, ed.fieldOfStudy].filter(Boolean).join(" in ")}
            dateRange={formatDateRange(ed.startDate, ed.endDate)}
            description={ed.description}
            isVisible={ed.isVisible}
            onToggleVisibility={() => handleToggleVisibility("education", ed.id, ed.isVisible)}
            onEdit={() => setEditing({ type: "education", entity: ed })}
            onDelete={() => handleDelete("education", ed.id)}
            isDeleting={deletingId === ed.id}
          />
        ))}
      </Section>

      {/* Projects */}
      <Section
        title="Projects"
        count={projects.length}
        onAdd={() => setAddingType("project")}
      >
        {projects.map((p: any) => (
          <EntityCard
            key={p.id}
            title={p.title}
            dateRange={formatDateRange(p.startDate, p.endDate)}
            description={p.description}
            tags={p.tags}
            url={p.url}
            isVisible={p.isVisible}
            onToggleVisibility={() => handleToggleVisibility("projects", p.id, p.isVisible)}
            onEdit={() => setEditing({ type: "project", entity: p })}
            onDelete={() => handleDelete("projects", p.id)}
            isDeleting={deletingId === p.id}
          />
        ))}
      </Section>

      {/* Certifications */}
      <Section
        title="Certifications"
        count={certifications.length}
        onAdd={() => setAddingType("certification")}
      >
        {certifications.map((c: any) => (
          <EntityCard
            key={c.id}
            title={c.name}
            subtitle={c.issuer}
            dateRange={c.issueDate ? new Date(c.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
            url={c.credentialUrl}
            isVisible={c.isVisible}
            onToggleVisibility={() => handleToggleVisibility("certifications", c.id, c.isVisible)}
            onEdit={() => setEditing({ type: "certification", entity: c })}
            onDelete={() => handleDelete("certifications", c.id)}
            isDeleting={deletingId === c.id}
          />
        ))}
      </Section>

      {/* Achievements */}
      <Section
        title="Achievements"
        count={achievements.length}
        onAdd={() => setAddingType("achievement")}
      >
        {achievements.map((a: any) => (
          <EntityCard
            key={a.id}
            title={a.title}
            dateRange={a.date ? new Date(a.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
            description={a.description}
            isVisible={a.isVisible}
            onToggleVisibility={() => handleToggleVisibility("achievements", a.id, a.isVisible)}
            onEdit={() => setEditing({ type: "achievement", entity: a })}
            onDelete={() => handleDelete("achievements", a.id)}
            isDeleting={deletingId === a.id}
          />
        ))}
      </Section>

      {/* Forms */}
      {(addingType === "work" || editing?.type === "work") && (
        <WorkExperienceForm entity={editing?.entity ?? null} onClose={closeForm} />
      )}
      {(addingType === "education" || editing?.type === "education") && (
        <EducationForm entity={editing?.entity ?? null} onClose={closeForm} />
      )}
      {(addingType === "project" || editing?.type === "project") && (
        <ProjectForm entity={editing?.entity ?? null} onClose={closeForm} />
      )}
      {(addingType === "certification" || editing?.type === "certification") && (
        <CertificationForm entity={editing?.entity ?? null} onClose={closeForm} />
      )}
      {(addingType === "achievement" || editing?.type === "achievement") && (
        <AchievementForm entity={editing?.entity ?? null} onClose={closeForm} />
      )}
    </>
  )
}

function Section({ title, count, onAdd, children }: { title: string; count: number; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h2>
          <span className="text-xs text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="text-sm font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          + Add
        </button>
      </div>
      {count === 0 ? (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 text-center shadow-[var(--shadow-ambient)]">
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            No {title.toLowerCase()} added yet.
          </p>
          <button
            onClick={onAdd}
            className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Add your first {title.toLowerCase().replace(/s$/, "")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  )
}

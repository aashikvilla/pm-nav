"use client"

import { useState } from "react"

type AppStatus = "applied" | "phone_screen" | "interview" | "rejected" | "offer"

interface Application {
  id: string
  companyName: string
  roleTitle: string | null
  status: AppStatus
  notes: string | null
  appliedDate: string
  createdAt: string
}

interface ApplicationBoardProps {
  initialApplications: Application[]
}

const COLUMNS: { status: AppStatus; label: string; color: string }[] = [
  { status: "applied", label: "Applied", color: "bg-slate-100 text-slate-700" },
  { status: "phone_screen", label: "Phone Screen", color: "bg-blue-100 text-blue-700" },
  { status: "interview", label: "Interviewing", color: "bg-violet-100 text-violet-700" },
  { status: "offer", label: "Offer", color: "bg-emerald-100 text-emerald-700" },
  { status: "rejected", label: "Rejected", color: "bg-red-100 text-red-600" },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface ModalProps {
  onClose: () => void
  onSave: (data: { companyName: string; roleTitle: string; notes: string; status: AppStatus }) => Promise<void>
  initial?: Partial<Application>
  title: string
  saving: boolean
  onDelete?: () => void
  deleting?: boolean
}

function Modal({ onClose, onSave, initial, title, saving, onDelete, deleting }: ModalProps) {
  const [form, setForm] = useState({
    companyName: initial?.companyName ?? "",
    roleTitle: initial?.roleTitle ?? "",
    notes: initial?.notes ?? "",
    status: (initial?.status ?? "applied") as AppStatus,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.companyName.trim()) return
    await onSave(form)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-surface-container-low)]">
          <h2 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Company *
            </label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
              placeholder="Stripe"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Role
            </label>
            <input
              type="text"
              value={form.roleTitle}
              onChange={(e) => setForm((f) => ({ ...f, roleTitle: e.target.value }))}
              placeholder="Product Manager, Growth"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AppStatus }))}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              {COLUMNS.map((col) => (
                <option key={col.status} value={col.status}>
                  {col.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Recruiter contact, interview notes, next steps..."
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !form.companyName.trim()}
              className="flex-1 bg-[var(--color-primary)] text-white py-3 rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="px-5 py-3 rounded-full font-semibold text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-colors"
              >
                {deleting ? "…" : "Delete"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export function ApplicationBoard({ initialApplications }: ApplicationBoardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleAdd(data: { companyName: string; roleTitle: string; notes: string; status: AppStatus }) {
    setSaving(true)
    try {
      const res = await fetch("/api/v1/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          roleTitle: data.roleTitle || undefined,
          notes: data.notes || undefined,
          status: data.status,
        }),
      })
      if (res.ok) {
        const { application } = await res.json()
        setApplications((prev) => [application, ...prev])
        setShowAdd(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(data: { companyName: string; roleTitle: string; notes: string; status: AppStatus }) {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch("/api/v1/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          companyName: data.companyName,
          roleTitle: data.roleTitle || undefined,
          notes: data.notes || undefined,
          status: data.status,
        }),
      })
      if (res.ok) {
        const { application } = await res.json()
        setApplications((prev) => prev.map((a) => (a.id === application.id ? application : a)))
        setEditing(null)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!editing) return
    setDeleting(true)
    try {
      const res = await fetch("/api/v1/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id }),
      })
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== editing.id))
        setEditing(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  const isEmpty = applications.length === 0

  return (
    <>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          {applications.length === 0
            ? "No applications yet"
            : `${applications.length} application${applications.length !== 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          + Add Application
        </button>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-12 text-center shadow-[var(--shadow-ambient)]">
          <p className="text-[var(--color-on-surface-variant)] text-base mb-2">
            Track your applications in one place.
          </p>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
            Add your first one when you&apos;re ready.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Add Application
          </button>
        </div>
      )}

      {/* Kanban board */}
      {!isEmpty && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((col) => {
              const colApps = applications.filter((a) => a.status === col.status)
              return (
                <div key={col.status} className="w-64 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">{colApps.length}</span>
                  </div>
                  <div className="space-y-3">
                    {colApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setEditing(app)}
                        className="w-full text-left bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 shadow-[var(--shadow-ambient)] hover:shadow-md transition-shadow"
                      >
                        <p className="font-semibold text-sm text-[var(--color-on-surface)] mb-0.5">
                          {app.companyName}
                        </p>
                        {app.roleTitle && (
                          <p className="text-xs text-[var(--color-on-surface-variant)] mb-2 line-clamp-1">
                            {app.roleTitle}
                          </p>
                        )}
                        {app.notes && (
                          <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-2 mb-2">
                            {app.notes}
                          </p>
                        )}
                        <p className="text-[10px] text-[var(--color-on-surface-variant)]/60">
                          {formatDate(app.appliedDate)}
                        </p>
                      </button>
                    ))}
                    {colApps.length === 0 && (
                      <div className="rounded-2xl border-2 border-dashed border-[var(--color-surface-container)] h-20 flex items-center justify-center">
                        <span className="text-xs text-[var(--color-on-surface-variant)]/40">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <Modal
          title="Add Application"
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          saving={saving}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <Modal
          title="Edit Application"
          onClose={() => setEditing(null)}
          onSave={handleEdit}
          initial={editing}
          saving={saving}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </>
  )
}


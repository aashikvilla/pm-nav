"use client";

import { useState } from "react";
import { PsiEntryCard, PsiEntryWithSkills } from "./psi-entry-card";

interface PsiEntriesListProps {
  initialEntries: PsiEntryWithSkills[];
}

interface FormState {
  problem: string;
  solution: string;
  impact: string;
}

const EMPTY_FORM: FormState = { problem: "", solution: "", impact: "" };

export function PsiEntriesList({ initialEntries }: PsiEntriesListProps) {
  const [entries, setEntries] = useState<PsiEntryWithSkills[]>(initialEntries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(entry: PsiEntryWithSkills) {
    setEditingId(entry.id);
    setIsAdding(false);
    setForm({ problem: entry.problem, solution: entry.solution, impact: entry.impact });
    setError(null);
  }

  function startAdd() {
    setIsAdding(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function cancelForm() {
    setEditingId(null);
    setIsAdding(false);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (isAdding) {
        const res = await fetch("/api/v1/psi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to save");
          return;
        }
        const created: PsiEntryWithSkills = await res.json();
        setEntries((prev) => [created, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/v1/psi/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to save");
          return;
        }
        const updated: PsiEntryWithSkills = await res.json();
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      }
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    // Optimistic removal
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/v1/psi/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-on-surface)]">
          Work Experiences
        </h1>
        <button
          onClick={startAdd}
          className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
        >
          + Add Entry
        </button>
      </div>

      {/* Add / Edit form */}
      {(isAdding || editingId) && (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6 flex flex-col gap-4">
          <p className="text-sm font-semibold text-[var(--color-on-surface)]">
            {isAdding ? "New Experience" : "Edit Experience"}
          </p>

          {(["problem", "solution", "impact"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)]">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <textarea
                rows={3}
                value={form[field]}
                onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                className="w-full text-sm text-[var(--color-on-surface)] bg-[var(--color-surface-container)] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder={`Describe the ${field}…`}
              />
            </div>
          ))}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={cancelForm}
              className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-outline-variant)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 && !isAdding ? (
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          No experiences yet. Add your first PSI entry above.
        </p>
      ) : (
        entries.map((entry) => (
          <PsiEntryCard
            key={entry.id}
            entry={entry}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

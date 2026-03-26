"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WorkExperience = {
  id: string;
  company: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
};

type Props = {
  entity?: WorkExperience | null;
  onClose: () => void;
};

function toMonth(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 7);
}

export default function WorkExperienceForm({ entity, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!entity;

  const [company, setCompany] = useState(entity?.company ?? "");
  const [title, setTitle] = useState(entity?.title ?? "");
  const [startDate, setStartDate] = useState(toMonth(entity?.startDate));
  const [endDate, setEndDate] = useState(toMonth(entity?.endDate));
  const [isCurrent, setIsCurrent] = useState(entity?.isCurrent ?? false);
  const [description, setDescription] = useState(entity?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const body = {
      company,
      title,
      startDate: startDate || null,
      endDate: isCurrent ? null : endDate || null,
      isCurrent,
      description: description || null,
    };

    try {
      const url = isEdit
        ? `/api/v1/work-experience/${entity.id}`
        : "/api/v1/work-experience";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[var(--color-on-surface)] mb-6">
          {isEdit ? "Edit Work Experience" : "Add Work Experience"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Company *
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
              />
            </div>
            {!isCurrent && (
              <div>
                <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-[var(--color-on-surface)]">I currently work here</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-[var(--color-on-surface-variant)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

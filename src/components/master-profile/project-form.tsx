"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  startDate: string | null;
  endDate: string | null;
};

type Props = {
  entity?: Project | null;
  onClose: () => void;
};

function toMonth(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 7);
}

export default function ProjectForm({ entity, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!entity;

  const [title, setTitle] = useState(entity?.title ?? "");
  const [description, setDescription] = useState(entity?.description ?? "");
  const [url, setUrl] = useState(entity?.url ?? "");
  const [imageUrl, setImageUrl] = useState(entity?.imageUrl ?? "");
  const [tagsInput, setTagsInput] = useState(entity?.tags?.join(", ") ?? "");
  const [startDate, setStartDate] = useState(toMonth(entity?.startDate));
  const [endDate, setEndDate] = useState(toMonth(entity?.endDate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title,
      description: description || null,
      url: url || null,
      imageUrl: imageUrl || null,
      tags,
      startDate: startDate || null,
      endDate: endDate || null,
    };

    try {
      const apiUrl = isEdit
        ? `/api/v1/projects/${entity.id}`
        : "/api/v1/projects";
      const res = await fetch(apiUrl, {
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
          {isEdit ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. React, TypeScript, Product"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Comma-separated</p>
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

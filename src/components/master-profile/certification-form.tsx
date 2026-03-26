"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  credentialUrl: string | null;
};

type Props = {
  entity?: Certification | null;
  onClose: () => void;
};

function toDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function CertificationForm({ entity, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!entity;

  const [name, setName] = useState(entity?.name ?? "");
  const [issuer, setIssuer] = useState(entity?.issuer ?? "");
  const [issueDate, setIssueDate] = useState(toDate(entity?.issueDate));
  const [expirationDate, setExpirationDate] = useState(toDate(entity?.expirationDate));
  const [credentialUrl, setCredentialUrl] = useState(entity?.credentialUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const body = {
      name,
      issuer: issuer || null,
      issueDate: issueDate || null,
      expirationDate: expirationDate || null,
      credentialUrl: credentialUrl || null,
    };

    try {
      const url = isEdit
        ? `/api/v1/certifications/${entity.id}`
        : "/api/v1/certifications";
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
          {isEdit ? "Edit Certification" : "Add Certification"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Issuer
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
              Credential URL
            </label>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://"
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm"
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

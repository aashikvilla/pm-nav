import Link from "next/link";

interface PsiSummaryWidgetProps {
  totalCount: number;
  previews: Array<{
    id: string;
    problemPreview: string;
  }>;
}

export function PsiSummaryWidget({ totalCount, previews }: PsiSummaryWidgetProps) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)]">
          Work Experiences
        </p>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
          {totalCount} total
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {previews.length === 0 ? (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            No experiences yet. Add your first PSI entry.
          </p>
        ) : (
          previews.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-lg bg-[var(--color-surface-container)] text-sm text-[var(--color-on-surface)] leading-relaxed"
            >
              {p.problemPreview.length === 120 ? `${p.problemPreview}…` : p.problemPreview}
            </div>
          ))
        )}
      </div>

      <Link
        href="/dashboard/psi"
        className="text-xs font-medium text-[var(--color-primary)] hover:underline"
      >
        View all experiences →
      </Link>
    </div>
  );
}

import Link from "next/link";

interface GapEntry {
  categoryName: string;
  score: number;
  explanation: string;
  learningHref: string;
}

interface SkillGapsPanelProps {
  gaps: GapEntry[];
}

export function SkillGapsPanel({ gaps }: SkillGapsPanelProps) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)] mb-4">
        Focus Areas
      </p>
      <div className="flex flex-col gap-4">
        {gaps.map((gap) => (
          <div key={gap.categoryName} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                {gap.categoryName}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                {gap.score}%
              </span>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
              {gap.explanation}
            </p>
            <Link
              href={gap.learningHref}
              className="text-xs font-medium text-[var(--color-primary)] hover:underline self-start"
            >
              Start improving →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

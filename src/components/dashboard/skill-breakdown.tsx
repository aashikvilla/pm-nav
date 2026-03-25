interface SkillBreakdownProps {
  categories: Array<{
    name: string;
    score: number;
  }>;
}

function barColor(score: number): string {
  if (score < 30) return "var(--color-secondary-fixed)";
  if (score <= 50) return "var(--color-outline-variant)";
  return "var(--color-primary)";
}

export function SkillBreakdown({ categories }: SkillBreakdownProps) {
  const sorted = [...categories].sort((a, b) => a.score - b.score);

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)] mb-4">
        Skill Breakdown
      </p>
      <div className="flex flex-col gap-3">
        {sorted.map((cat) => (
          <div key={cat.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-[var(--color-on-surface)]">{cat.name}</span>
              <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                {cat.score}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-container)]">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${cat.score}%`,
                  backgroundColor: barColor(cat.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ReadinessScoreWidgetProps {
  score: number;
  targetRoleType: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  consumer: "Consumer PM",
  growth: "Growth PM",
  technical: "Technical PM",
  platform: "Platform PM",
  ai: "AI PM",
  b2b: "B2B PM",
  general: "General PM",
};

export function ReadinessScoreWidget({ score, targetRoleType }: ReadinessScoreWidgetProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const roleLabel = targetRoleType ? ROLE_LABELS[targetRoleType] ?? targetRoleType : "PM";
  const isReady = score >= 70;

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6 flex flex-col items-center gap-4">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)]">
        Readiness Score
      </p>

      {/* Circular progress ring */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
          {/* Track */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="var(--color-surface-container)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke={isReady ? "var(--color-secondary-fixed)" : "var(--color-primary)"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-semibold text-[var(--color-on-surface)] tracking-tight">
            {score}
          </span>
          <span className="text-xs text-[var(--color-on-surface-variant)]">/ 100</span>
        </div>
      </div>

      <p className="text-sm text-[var(--color-on-surface-variant)]">for {roleLabel}</p>

      {isReady ? (
        <span className="text-sm font-medium text-[var(--color-secondary)] bg-[var(--color-secondary-fixed)] px-3 py-1 rounded-full">
          You&apos;re ready to apply
        </span>
      ) : (
        <span className="text-xs text-[var(--color-on-surface-variant)]">
          Apply when you reach 70
        </span>
      )}
    </div>
  );
}

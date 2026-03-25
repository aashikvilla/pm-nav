import { formatRelativeDate } from "@/lib/relative-date";

interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
  totalDaysActive: number;
}

export function StreakWidget({
  currentStreak,
  longestStreak,
  lastActiveDate,
  totalDaysActive,
}: StreakWidgetProps) {
  if (currentStreak === 0 && totalDaysActive === 0) return null;

  const relativeDate = formatRelativeDate(lastActiveDate);

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6 flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)]">
        Activity Streak
      </p>

      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="text-3xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          {currentStreak}
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">day streak</span>
      </div>

      <div className="flex gap-4 text-xs text-[var(--color-on-surface-variant)]">
        <span>Longest: <strong className="text-[var(--color-on-surface)]">{longestStreak}</strong> days</span>
        <span>Total: <strong className="text-[var(--color-on-surface)]">{totalDaysActive}</strong> days</span>
      </div>

      <p className="text-xs text-[var(--color-on-surface-variant)]">{relativeDate}</p>
    </div>
  );
}

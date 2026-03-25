"use client";

import { useState } from "react";

interface ActivityGraphProps {
  activityByDay: Record<string, number>;
}

function cellColor(count: number): string {
  if (count === 0) return "var(--color-surface-container)";
  if (count <= 2) return "color-mix(in srgb, var(--color-primary) 20%, transparent)";
  if (count <= 5) return "color-mix(in srgb, var(--color-primary) 50%, transparent)";
  return "var(--color-primary)";
}

function buildGrid(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Go back 83 days so we have 84 total (12 weeks)
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DAY_LABELS = ["", "M", "", "W", "", "F", ""];

export function ActivityGraph({ activityByDay }: ActivityGraphProps) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const days = buildGrid();
  const allZero = days.every((d) => (activityByDay[isoDate(d)] ?? 0) === 0);

  // Build weeks (columns of 7)
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month labels: show month name when it changes across weeks
  const monthLabels: (string | null)[] = weeks.map((week) => {
    const first = week[0];
    const prev = weeks[weeks.indexOf(week) - 1]?.[0];
    if (!prev || first.getMonth() !== prev.getMonth()) {
      return first.toLocaleString("default", { month: "short" });
    }
    return null;
  });

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)] mb-4">
        Activity — Last 12 Weeks
      </p>

      <div className="flex gap-1">
        {/* Day labels column */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-3 w-4 flex items-center justify-end">
              <span className="text-[10px] text-[var(--color-on-surface-variant)]">{label}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1">
          {/* Month labels row */}
          <div className="flex gap-1 mb-1">
            {weeks.map((_, wi) => (
              <div key={wi} className="w-3 text-[10px] text-[var(--color-on-surface-variant)]">
                {monthLabels[wi] ?? ""}
              </div>
            ))}
          </div>

          {/* Day rows */}
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="flex gap-1">
              {weeks.map((week, wi) => {
                const day = week[dayIndex];
                if (!day) return <div key={wi} className="w-3 h-3" />;
                const key = isoDate(day);
                const count = activityByDay[key] ?? 0;
                return (
                  <div
                    key={wi}
                    className="w-3 h-3 rounded-sm cursor-default"
                    style={{ backgroundColor: cellColor(count) }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ date: key, count, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {allZero && (
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-3">
          Start learning to build your streak
        </p>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded text-xs text-white pointer-events-none"
          style={{
            backgroundColor: "var(--color-on-surface)",
            top: tooltip.y - 32,
            left: tooltip.x,
          }}
        >
          {tooltip.date} · {tooltip.count} {tooltip.count === 1 ? "activity" : "activities"}
        </div>
      )}
    </div>
  );
}

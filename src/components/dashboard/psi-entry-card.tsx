"use client";

export interface PsiEntryWithSkills {
  id: string;
  problem: string;
  solution: string;
  impact: string;
  createdAt: string;
  skillMappings: Array<{ skillId: string; skillName: string; categoryName: string; evidenceScore: number }>;
}

interface PsiEntryCardProps {
  entry: PsiEntryWithSkills;
  onEdit: (entry: PsiEntryWithSkills) => void;
  onDelete: (id: string) => void;
}

export function PsiEntryCard({ entry, onEdit, onDelete }: PsiEntryCardProps) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)] mb-1">
              Problem
            </p>
            <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{entry.problem}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)] mb-1">
              Solution
            </p>
            <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{entry.solution}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)] mb-1">
              Impact
            </p>
            <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{entry.impact}</p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(entry)}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-xs font-medium text-[var(--color-on-surface-variant)] hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {entry.skillMappings.length === 0 ? (
          <span className="text-xs text-[var(--color-on-surface-variant)] italic">No skills tagged</span>
        ) : (
          entry.skillMappings.map((m) => (
            <span
              key={m.skillId}
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-primary-fixed)] text-[var(--color-primary)]"
            >
              {m.categoryName}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

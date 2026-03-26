import Link from "next/link"

type StageStatus = "not_started" | "in_progress" | "completed"

interface StageCardProps {
  id: string
  stageNumber: number
  title: string
  description: string | null
  estimatedHours: number | string | null
  subtopicCount: number
  totalResources: number
  completedResources: number
  status: string
  isUnlocked: boolean
  assignmentScore: number | null
  assignmentPassed: boolean
}

export function StageCard({
  id,
  stageNumber,
  title,
  description,
  estimatedHours,
  subtopicCount,
  totalResources,
  completedResources,
  status,
  isUnlocked,
  assignmentScore,
  assignmentPassed,
}: StageCardProps) {
  const progressPercent = totalResources > 0 ? (completedResources / totalResources) * 100 : 0

  const numberCircleClass =
    status === "completed"
      ? "bg-green-600 text-white"
      : status === "in_progress"
      ? "bg-[var(--color-primary)] text-white"
      : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"

  const isLocked = !isUnlocked && status === "not_started"

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-[var(--shadow-ambient)] p-5 flex items-center gap-5">
      {/* Stage number circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${numberCircleClass}`}
      >
        {status === "completed" ? (
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 10 8 14 16 6" />
          </svg>
        ) : (
          stageNumber
        )}
      </div>

      {/* Center content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <h3 className="font-medium text-[var(--color-on-surface)] leading-snug">{title}</h3>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <p className="text-xs text-[var(--color-on-surface-variant)]">
          {subtopicCount} {subtopicCount === 1 ? "topic" : "topics"} &middot; {estimatedHours}h estimated
          {assignmentScore !== null && (
            <>
              {" "}
              &middot;{" "}
              <span className={assignmentPassed ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                Assignment {assignmentScore}%
              </span>
            </>
          )}
        </p>

        {/* Resource progress */}
        <div className="space-y-1">
          <div className="h-1.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            {completedResources}/{totalResources} resources
          </p>
        </div>
      </div>

      {/* Right action */}
      <div className="shrink-0">
        {isLocked ? (
          <span className="text-sm text-[var(--color-on-surface-variant)] opacity-50 cursor-not-allowed select-none">
            Locked
          </span>
        ) : status === "completed" ? (
          <Link
            href={`/dashboard/learning/${id}`}
            className="text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
          >
            Review
          </Link>
        ) : status === "in_progress" ? (
          <Link
            href={`/dashboard/learning/${id}`}
            className="px-5 py-2 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            Continue
          </Link>
        ) : (
          <Link
            href={`/dashboard/learning/${id}`}
            className="px-5 py-2 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            Start
          </Link>
        )}
      </div>
    </div>
  )
}

"use client"

interface EntityCardProps {
  title: string
  subtitle?: string
  dateRange?: string
  description?: string
  tags?: string[]
  url?: string | null
  isVisible: boolean
  onToggleVisibility: () => void
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
        <circle cx="8" cy="8" r="2" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
      <line x1="2" y1="14" x2="14" y2="2" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M5 4V2.5A.5.5 0 015.5 2h5a.5.5 0 01.5.5V4m1.5 0l-.75 9.5a1 1 0 01-1 .9H5.25a1 1 0 01-1-.9L3.5 4" />
    </svg>
  )
}

export function EntityCard({
  title,
  subtitle,
  dateRange,
  description,
  tags,
  url,
  isVisible,
  onToggleVisibility,
  onEdit,
  onDelete,
  isDeleting = false,
}: EntityCardProps) {
  return (
    <div
      className={`bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)] transition-opacity ${
        isVisible ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[var(--color-on-surface)] text-base font-semibold leading-snug">
          {title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleVisibility}
            className="rounded-full p-1.5 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
            aria-label={isVisible ? "Hide" : "Show"}
          >
            <EyeIcon visible={isVisible} />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full p-1.5 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors"
            aria-label="Edit"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-full p-1.5 text-[var(--color-on-surface-variant)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            aria-label="Delete"
          >
            {isDeleting ? (
              <span className="text-xs font-medium text-red-600 px-1">Deleting...</span>
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>
      </div>

      {/* Subtitle + date */}
      {(subtitle || dateRange) && (
        <div className="mt-1 flex items-baseline gap-2 text-sm text-[var(--color-on-surface-variant)]">
          {subtitle && <span>{subtitle}</span>}
          {subtitle && dateRange && <span aria-hidden="true">&middot;</span>}
          {dateRange && <span>{dateRange}</span>}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="mt-3 text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-3">
          {description}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-surface-container-low)] px-2.5 py-0.5 text-xs text-[var(--color-on-surface-variant)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* URL */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-[var(--color-primary)] hover:underline truncate max-w-full"
        >
          {url}
        </a>
      )}
    </div>
  )
}

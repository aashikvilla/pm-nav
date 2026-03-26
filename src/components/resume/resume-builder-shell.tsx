"use client"

import { useState } from "react"
import type { JdItem, ResumeVersionItem } from "./types"
import { JdManager } from "./jd-manager"
import { ResumePreview } from "./resume-preview"

interface ResumeBuilderShellProps {
  initialJds: JdItem[]
  initialVersions: ResumeVersionItem[]
  maxJds: number
}

export function ResumeBuilderShell({ initialJds, initialVersions, maxJds }: ResumeBuilderShellProps) {
  const [versions, setVersions] = useState<ResumeVersionItem[]>(initialVersions)

  function handleVersionCreated(version: ResumeVersionItem) {
    setVersions((prev) => [version, ...prev])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <JdManager
        initialJds={initialJds}
        maxJds={maxJds}
        onVersionCreated={handleVersionCreated}
      />
      <ResumePreview versions={versions} />
    </div>
  )
}

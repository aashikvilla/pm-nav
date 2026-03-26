import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ResumeBuilderShell } from "@/components/resume/resume-builder-shell"
import type { JdItem, ResumeVersionItem } from "@/components/resume/types"

export default async function ResumePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const [rawJds, rawVersions] = await Promise.all([
    prisma.jobDescription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, company: true, keywords: true, createdAt: true },
    }),
    prisma.resumeVersion.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        atsScore: true,
        keywordMatch: true,
        content: true,
        createdAt: true,
        jd: { select: { id: true, title: true, company: true } },
      },
    }),
  ])

  const jds: JdItem[] = rawJds.map((j) => ({
    ...j,
    createdAt: j.createdAt.toISOString(),
  }))

  const versions: ResumeVersionItem[] = rawVersions.map((v) => ({
    id: v.id,
    title: v.title,
    atsScore: v.atsScore,
    keywordMatch: v.keywordMatch as { matched: string[]; missing: string[] } | null,
    content: v.content as unknown as ResumeVersionItem["content"],
    createdAt: v.createdAt.toISOString(),
    jd: v.jd,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          Resume Builder
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          {jds.length === 0
            ? "Add a job description you're interested in, and we'll tailor your resume to it."
            : versions.length === 0
            ? "Great start — now hit 'Optimize Resume' to generate your first tailored version."
            : `${versions.length} tailored version${versions.length !== 1 ? "s" : ""} ready to review.`}
        </p>
      </div>

      <ResumeBuilderShell initialJds={jds} initialVersions={versions} maxJds={3} />
    </div>
  )
}

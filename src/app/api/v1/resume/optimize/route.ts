export const runtime = "nodejs"
export const maxDuration = 120

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { optimizeResume } from "@/lib/ai/agents/resume-optimizer"
import { logger } from "@/lib/logger"

const optimizeSchema = z.object({
  jdId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = optimizeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    // Fetch JD, PSI entries, profile, and target in parallel
    const [jd, psiEntries, profile, pmTarget] = await Promise.all([
      prisma.jobDescription.findFirst({
        where: { id: parsed.data.jdId, userId },
      }),
      prisma.psiEntry.findMany({
        where: { userId, isVisible: true },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.userPmTarget.findUnique({ where: { userId } }),
    ])

    if (!jd) {
      return NextResponse.json({ error: "Job description not found" }, { status: 404 })
    }

    if (!psiEntries.length) {
      return NextResponse.json(
        { error: "No PSI entries found. Complete onboarding first to generate your experience entries." },
        { status: 400 }
      )
    }

    const targetRole = pmTarget?.targetRoleType ?? "general"
    const targetCompany = jd.company ?? pmTarget?.targetCompany ?? undefined

    logger.info(`[Resume] Optimizing for user=${userId} jd=${jd.id} psiCount=${psiEntries.length}`)

    const result = await optimizeResume({
      psiEntries: psiEntries.map((e) => ({
        problem: e.problem,
        solution: e.solution,
        impact: e.impact,
      })),
      targetRole,
      targetCompany,
      jobDescription: jd.content,
      jdKeywords: jd.keywords,
    })

    // Save as ResumeVersion
    const resumeContent = {
      summary: result.summary,
      bullets: result.bullets,
      profile: {
        fullName: profile?.fullName ?? "",
        email: session.user.email ?? "",
        linkedinUrl: profile?.linkedinUrl ?? "",
        currentRole: profile?.currentJobRole ?? "",
      },
    }

    const version = await prisma.resumeVersion.create({
      data: {
        userId,
        jdId: jd.id,
        title: `Resume for ${jd.title}`,
        content: resumeContent,
        atsScore: result.atsScore,
        keywordMatch: result.keywordMatch,
        isBase: false,
      },
    })

    logger.info(`[Resume] Version created id=${version.id} atsScore=${result.atsScore}`)

    return NextResponse.json({
      version: {
        id: version.id,
        title: version.title,
        atsScore: result.atsScore,
        keywordMatch: result.keywordMatch,
        createdAt: version.createdAt,
      },
      content: resumeContent,
    })
  } catch (error) {
    logger.error("Failed to optimize resume", error)
    return NextResponse.json({ error: "Failed to optimize resume. Please try again." }, { status: 500 })
  }
}

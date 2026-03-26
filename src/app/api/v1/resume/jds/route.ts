export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { extractJdKeywords } from "@/lib/ai/agents/ats-scorer"
import { logger } from "@/lib/logger"

const MAX_JDS_PER_USER = 3

const createJdSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  content: z.string().min(50).max(20000),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const jds = await prisma.jobDescription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        keywords: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ jds, count: jds.length, max: MAX_JDS_PER_USER })
  } catch (error) {
    logger.error("Failed to fetch JDs", error)
    return NextResponse.json({ error: "Failed to fetch job descriptions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = createJdSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    // Check limit
    const existingCount = await prisma.jobDescription.count({ where: { userId } })
    if (existingCount >= MAX_JDS_PER_USER) {
      return NextResponse.json(
        { error: `Maximum ${MAX_JDS_PER_USER} job descriptions allowed. Delete one to add another.` },
        { status: 400 }
      )
    }

    // Extract keywords via AI
    logger.info(`[Resume] Extracting keywords for user=${userId}`)
    const keywords = await extractJdKeywords(parsed.data.content)

    const jd = await prisma.jobDescription.create({
      data: {
        userId,
        title: parsed.data.title,
        company: parsed.data.company ?? null,
        content: parsed.data.content,
        keywords,
      },
      select: {
        id: true,
        title: true,
        company: true,
        keywords: true,
        createdAt: true,
      },
    })

    logger.info(`[Resume] JD created id=${jd.id} keywords=${keywords.length}`)
    return NextResponse.json({ jd }, { status: 201 })
  } catch (error) {
    logger.error("Failed to create JD", error)
    return NextResponse.json({ error: "Failed to save job description" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { z } from "zod"

const querySchema = z.object({
  category: z.string().optional(),
  difficulty: z.string().optional(),
  roleType: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query params", details: parsed.error.flatten() }, { status: 400 })
    }

    const { category, difficulty, roleType, page, limit } = parsed.data
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { isActive: true }
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty
    if (roleType) where.roleTypes = { has: roleType }

    const [questions, total, userAttempts] = await Promise.all([
      prisma.questionBank.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          question: true,
          category: true,
          difficulty: true,
          roleTypes: true,
          keyPoints: true,
        },
      }),
      prisma.questionBank.count({ where }),
      prisma.questionAttempt.findMany({
        where: { userId },
        orderBy: { attemptedAt: "desc" },
        select: {
          questionId: true,
          aiScore: true,
          attemptedAt: true,
        },
      }),
    ])

    // Build map of best attempt per question
    const attemptMap = new Map<string, { bestScore: number | null; lastAttemptedAt: Date; attemptCount: number }>()
    for (const a of userAttempts) {
      const existing = attemptMap.get(a.questionId)
      if (!existing) {
        attemptMap.set(a.questionId, { bestScore: a.aiScore, lastAttemptedAt: a.attemptedAt, attemptCount: 1 })
      } else {
        existing.attemptCount++
        if (a.aiScore !== null && (existing.bestScore === null || a.aiScore > existing.bestScore)) {
          existing.bestScore = a.aiScore
        }
      }
    }

    const questionsWithAttempts = questions.map((q) => {
      const attempt = attemptMap.get(q.id)
      return {
        ...q,
        lastAttempt: attempt
          ? { bestScore: attempt.bestScore, lastAttemptedAt: attempt.lastAttemptedAt, attemptCount: attempt.attemptCount }
          : null,
      }
    })

    // Stats
    const uniqueAttempted = attemptMap.size
    const allScores = userAttempts.filter((a) => a.aiScore !== null).map((a) => a.aiScore as number)
    const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((s, v) => s + v, 0) / allScores.length) : null

    return NextResponse.json({
      questions: questionsWithAttempts,
      total,
      page,
      limit,
      stats: { attempted: uniqueAttempted, totalQuestions: total, avgScore },
    })
  } catch (err) {
    logger.error("Failed to fetch questions", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

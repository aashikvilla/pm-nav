export const runtime = "nodejs"
export const maxDuration = 120

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { evaluateQuestion } from "@/lib/ai/agents/question-evaluator"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"
import { z } from "zod"

const bodySchema = z.object({
  questionId: z.string().min(1),
  response: z.string().min(10, "Answer must be at least 10 characters"),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { questionId, response } = parsed.data

    const question = await prisma.questionBank.findUnique({
      where: { id: questionId, isActive: true },
    })
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const criteria = (question.evaluationCriteria as { criterion: string; points: number }[]) ?? []

    const evaluation = await evaluateQuestion({
      question: question.question,
      category: question.category,
      evaluationCriteria: criteria,
      keyPoints: question.keyPoints,
      userResponse: response,
    })

    const attempt = await prisma.questionAttempt.create({
      data: {
        userId,
        questionId,
        response,
        aiScore: evaluation.totalScore,
        aiFeedback: evaluation.feedback,
        aiScoreBreakdown: {
          breakdown: evaluation.breakdown,
          strongPoints: evaluation.strongPoints,
          missedKeyPoints: evaluation.missedKeyPoints,
        },
      },
    })

    await recordActivity(userId, "question_attempt", questionId, "question")

    logger.info("Question attempt submitted", { userId, questionId, score: evaluation.totalScore })

    return NextResponse.json({ attempt, evaluation })
  } catch (err) {
    logger.error("Failed to evaluate question answer", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

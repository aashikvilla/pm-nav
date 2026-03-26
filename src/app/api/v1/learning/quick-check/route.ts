export const runtime = "nodejs"
export const maxDuration = 60

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { evaluateQuickCheck } from "@/lib/ai/agents/quick-check-evaluator"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"

const bodySchema = z.object({
  subtopicId: z.string().min(1),
  response: z.string().min(10, "Please provide a more detailed response"),
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
    const { subtopicId, response } = parsed.data

    // Verify subtopic exists and has a quick check
    const subtopic = await prisma.stageSubtopic.findUnique({
      where: { id: subtopicId },
    })
    if (!subtopic || !subtopic.quickCheck) {
      return NextResponse.json({ error: "Quick check not found for this subtopic" }, { status: 404 })
    }

    // Evaluate with AI
    const evaluation = await evaluateQuickCheck({
      subtopicTitle: subtopic.title,
      quickCheckPrompt: subtopic.quickCheck,
      userResponse: response,
    })

    // Store submission
    const submission = await prisma.quickCheckSubmission.create({
      data: {
        userId,
        subtopicId,
        response,
        aiFeedback: evaluation.feedback,
        passed: evaluation.passed,
      },
    })

    // Log activity and update streak
    await recordActivity(userId, "quick_check", subtopicId, "subtopic")

    logger.info("Quick check submitted", { userId, subtopicId, passed: evaluation.passed })

    return NextResponse.json({
      id: submission.id,
      passed: evaluation.passed,
      feedback: evaluation.feedback,
      strengthAreas: evaluation.strengthAreas,
      improvementAreas: evaluation.improvementAreas,
    })
  } catch (error) {
    logger.error("Quick check evaluation failed", { userId, error })
    return NextResponse.json({ error: "Failed to evaluate your response. Please try again." }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id
  const { id } = await params

  try {
    const question = await prisma.questionBank.findUnique({
      where: { id, isActive: true },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const attempts = await prisma.questionAttempt.findMany({
      where: { userId, questionId: id },
      orderBy: { attemptedAt: "desc" },
      select: {
        id: true,
        response: true,
        aiScore: true,
        aiFeedback: true,
        aiScoreBreakdown: true,
        attemptedAt: true,
      },
    })

    return NextResponse.json({ question, attempts })
  } catch (err) {
    logger.error("Failed to fetch question detail", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

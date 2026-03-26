export const runtime = "nodejs"
export const maxDuration = 60

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { runConversationTurn } from "@/lib/ai/agents/conversation-agent"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"

const ConversationSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(2000),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const { sessionId, message } = ConversationSchema.parse(body)

    // Load user context
    const [profile, pmTarget, skillScores] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.userPmTarget.findUnique({ where: { userId } }),
      prisma.userSkillScore.findMany({
        where: { userId },
        include: { skill: { include: { category: true } } },
        orderBy: { evidenceScore: "asc" },
        take: 5,
      }),
    ])

    // Get or create conversation session
    let convSession = sessionId
      ? await prisma.conversationSession.findFirst({
          where: { id: sessionId, userId, sessionType: "gap_filling" },
        })
      : null

    if (!convSession) {
      convSession = await prisma.conversationSession.create({
        data: { userId, sessionType: "gap_filling", status: "active" },
      })
    }

    // Load conversation history
    const turns = await prisma.conversationTurn.findMany({
      where: { sessionId: convSession.id },
      orderBy: { createdAt: "asc" },
    })

    // Cap history at last 6 turns (3 exchanges) to limit token growth per call
    const recentTurns = turns.slice(-6)
    const history = recentTurns.map((t) => ({
      role: t.role as "user" | "assistant",
      content: t.content,
    }))

    const topGaps = skillScores
      .filter((s) => s.evidenceScore < 60)
      .slice(0, 3)
      .map((s) => ({
        categoryName: s.skill.category.name,
        score: Math.round(s.evidenceScore),
      }))

    const result = await runConversationTurn({
      userName: profile?.fullName ?? "there",
      currentRole: profile?.currentJobRole ?? "professional",
      targetRole: pmTarget?.targetRoleType ?? "consumer",
      topGaps,
      history,
      userMessage: message,
    })

    // Store this turn + AI reply
    await prisma.conversationTurn.createMany({
      data: [
        { sessionId: convSession.id, role: "user", content: message },
        { sessionId: convSession.id, role: "assistant", content: result.reply },
      ],
    })

    // Store any new PSI signals from the conversation
    if (result.newPsiSignals.length > 0) {
      const skills = await prisma.skill.findMany({ select: { id: true, slug: true } })
      const skillBySlug = new Map(skills.map((s) => [s.slug, s]))

      for (const signal of result.newPsiSignals) {
        const entry = await prisma.psiEntry.create({
          data: {
            userId,
            problem: signal.problem,
            solution: signal.solution,
            impact: signal.impact,
            rawContext: "Extracted from gap-fill conversation",
            confidenceScore: 60,
          },
        })

        const mappings = signal.skillsHinted
          .map((slug) => skillBySlug.get(slug))
          .filter(Boolean)
          .map((skill) => ({
            psiEntryId: entry.id,
            skillId: skill!.id,
            evidenceScore: 60,
          }))

        if (mappings.length > 0) {
          await prisma.psiSkillMapping.createMany({ data: mappings, skipDuplicates: true })
        }
      }
    }

    // If conversation is complete, advance onboarding step
    if (result.isComplete) {
      await prisma.conversationSession.update({
        where: { id: convSession.id },
        data: { status: "completed" },
      })
      await prisma.profile.update({
        where: { userId },
        data: { onboardingStep: 4 },
      })
      await recordActivity(userId, "conversation_completed")
    }

    const turnCount = Math.ceil((turns.length + 2) / 2) // pairs of turns

    logger.info("Conversation turn processed", { userId, sessionId: convSession.id, turnCount })

    return NextResponse.json({
      reply: result.reply,
      sessionId: convSession.id,
      isComplete: result.isComplete,
      turnCount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    logger.error("Conversation error", { userId, error })
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"

const bodySchema = z.object({
  resourceId: z.string().min(1),
  subtopicId: z.string().min(1),
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
    const { resourceId, subtopicId } = parsed.data

    // Verify resource exists and belongs to subtopic
    const resource = await prisma.resource.findFirst({
      where: { id: resourceId, subtopicId },
      include: { subtopic: { include: { stage: true } } },
    })
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Upsert completion (idempotent)
    await prisma.stageResourceCompletion.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      create: { userId, subtopicId, resourceId },
      update: {},
    })

    // Ensure stage progress exists and is at least in_progress
    const stageId = resource.subtopic.stage.id
    await prisma.userLearningProgress.upsert({
      where: { userId_stageId: { userId, stageId } },
      create: { userId, stageId, status: "in_progress", startedAt: new Date() },
      update: {
        status: "in_progress",
        startedAt: new Date(),
      },
    })

    // Log activity and update streak
    await recordActivity(userId, "resource_completed", resourceId, "resource")

    logger.info("Resource marked complete", { userId, resourceId, subtopicId })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Failed to mark resource complete", { userId, error })
    return NextResponse.json({ error: "Failed to mark resource as completed" }, { status: 500 })
  }
}

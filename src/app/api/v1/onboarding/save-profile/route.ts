export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const SaveProfileSchema = z.object({
  fullName: z.string().min(2),
  currentJobRole: z.string().min(2),
  currentIndustry: z.string().min(1),
  yearsExperience: z.number().min(0).max(40),
  targetRoleType: z.enum(["consumer", "growth", "technical", "platform", "ai", "b2b"]),
  targetTimeline: z.enum(["3months", "6months", "12months"]),
  preparationStage: z.enum(["exploring", "committed", "applying"]),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const data = SaveProfileSchema.parse(body)

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: data.fullName,
        currentJobRole: data.currentJobRole,
        currentIndustry: data.currentIndustry,
        yearsExperience: data.yearsExperience,
        onboardingStep: 2,
        analysisStatus: "pending",
      },
      update: {
        fullName: data.fullName,
        currentJobRole: data.currentJobRole,
        currentIndustry: data.currentIndustry,
        yearsExperience: data.yearsExperience,
        onboardingStep: 2,
        analysisStatus: "pending",
      },
    })

    await prisma.userPmTarget.upsert({
      where: { userId },
      create: {
        userId,
        targetRoleType: data.targetRoleType,
        targetTimeline: data.targetTimeline,
        preparationStage: data.preparationStage,
      },
      update: {
        targetRoleType: data.targetRoleType,
        targetTimeline: data.targetTimeline,
        preparationStage: data.preparationStage,
      },
    })

    logger.info("Profile saved", { userId, targetRoleType: data.targetRoleType })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 })
    }
    logger.error("Failed to save profile", { userId, error })
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}

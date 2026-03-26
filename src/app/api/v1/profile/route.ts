export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const UpdateProfileSchema = z.object({
  fullName: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  profileImageUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().max(120).optional(),
  currentJobRole: z.string().max(120).optional(),
  yearsExperience: z.number().int().min(0).max(50).optional(),
  profileSlug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens")
    .optional(),
  // PublicProfileSettings
  showReadinessScore: z.boolean().optional(),
  showPsiEntries: z.boolean().optional(),
  showAssignments: z.boolean().optional(),
  showActivityGraph: z.boolean().optional(),
  showStreak: z.boolean().optional(),
  isPublic: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const [profile, settings] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.publicProfileSettings.findUnique({ where: { userId } }),
    ])

    return NextResponse.json({ profile, settings })
  } catch (error) {
    logger.error("Failed to fetch profile", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = UpdateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const {
      fullName,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      profileImageUrl,
      location,
      currentJobRole,
      yearsExperience,
      profileSlug,
      showReadinessScore,
      showPsiEntries,
      showAssignments,
      showActivityGraph,
      showStreak,
      isPublic,
    } = parsed.data

    // Check slug uniqueness if changing
    if (profileSlug) {
      const existing = await prisma.profile.findFirst({
        where: { profileSlug, userId: { not: userId } },
      })
      if (existing) {
        return NextResponse.json({ error: "That URL is already taken. Try a different one." }, { status: 409 })
      }
    }

    const profileData: Record<string, unknown> = {}
    if (fullName !== undefined) profileData.fullName = fullName || null
    if (bio !== undefined) profileData.bio = bio || null
    if (linkedinUrl !== undefined) profileData.linkedinUrl = linkedinUrl || null
    if (githubUrl !== undefined) profileData.githubUrl = githubUrl || null
    if (portfolioUrl !== undefined) profileData.portfolioUrl = portfolioUrl || null
    if (profileImageUrl !== undefined) profileData.profileImageUrl = profileImageUrl || null
    if (location !== undefined) profileData.location = location || null
    if (currentJobRole !== undefined) profileData.currentJobRole = currentJobRole || null
    if (yearsExperience !== undefined) profileData.yearsExperience = yearsExperience
    if (profileSlug !== undefined) profileData.profileSlug = profileSlug || null

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
    })

    // Upsert PublicProfileSettings if any visibility flag provided
    const settingsData: Record<string, unknown> = {}
    if (showReadinessScore !== undefined) settingsData.showReadinessScore = showReadinessScore
    if (showPsiEntries !== undefined) settingsData.showPsiEntries = showPsiEntries
    if (showAssignments !== undefined) settingsData.showAssignments = showAssignments
    if (showActivityGraph !== undefined) settingsData.showActivityGraph = showActivityGraph
    if (showStreak !== undefined) settingsData.showStreak = showStreak
    // isPublic lives on Profile model as onboardingCompleted check — we store it in profileSettings via verificationBadge proxy
    // Actually there's no isPublic on Profile or PublicProfileSettings in schema, so we skip it here
    // (the profile is effectively "public" when profileSlug is set)

    let settings = null
    if (Object.keys(settingsData).length > 0) {
      settings = await prisma.publicProfileSettings.upsert({
        where: { userId },
        create: { userId, ...settingsData },
        update: settingsData,
      })
    } else {
      settings = await prisma.publicProfileSettings.findUnique({ where: { userId } })
    }

    return NextResponse.json({ profile, settings })
  } catch (error) {
    logger.error("Failed to update profile", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

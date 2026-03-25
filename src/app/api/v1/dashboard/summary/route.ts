import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeReadinessScore } from "@/lib/score-calculator";
import { getGapExplanation } from "@/lib/gap-explanations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Parallel queries
  const [profile, pmTarget, skillScores, psiEntries, streak, activityLogs] =
    await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.userPmTarget.findUnique({ where: { userId } }),
      prisma.userSkillScore.findMany({
        where: { userId },
        include: {
          skill: {
            include: { category: true },
          },
        },
      }),
      prisma.psiEntry.findMany({
        where: { userId, isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { id: true, problem: true },
      }),
      prisma.userStreak.findUnique({ where: { userId } }),
      prisma.activityLog.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdAt: true },
      }),
    ]);

  // Readiness score
  let readiness: { overall: number; byCategory: Record<string, number> };

  if (skillScores.length === 0) {
    readiness = { overall: 0, byCategory: {} };
  } else {
    const roleWeights = pmTarget
      ? await prisma.roleWeight.findMany({
          where: { roleType: pmTarget.targetRoleType },
        })
      : [];

    const scoreInputs = skillScores.map((s) => ({
      skillId: s.skillId,
      categoryId: s.skill.categoryId,
      evidenceScore: s.evidenceScore,
      assignmentScore: s.assignmentScore,
      learningScore: s.learningScore,
    }));

    const weightInputs = roleWeights.map((rw) => ({
      categoryId: rw.categoryId,
      weight: rw.weight,
    }));

    const result = computeReadinessScore(scoreInputs, weightInputs);

    // Map categoryId → slug for the response
    const categorySlugMap = new Map<string, string>();
    for (const s of skillScores) {
      categorySlugMap.set(s.skill.categoryId, s.skill.category.slug);
    }

    const byCategorySlug: Record<string, number> = {};
    for (const [catId, score] of Object.entries(result.byCategory)) {
      const slug = categorySlugMap.get(catId);
      if (slug) byCategorySlug[slug] = Math.round(score);
    }

    readiness = { overall: result.overall, byCategory: byCategorySlug };
  }

  // Build category name/slug lookup from skill scores
  const categoryInfo = new Map<
    string,
    { slug: string; name: string; score: number }
  >();
  for (const [slug, score] of Object.entries(readiness.byCategory)) {
    const match = skillScores.find((s) => s.skill.category.slug === slug);
    if (match) {
      categoryInfo.set(slug, {
        slug,
        name: match.skill.category.name,
        score,
      });
    }
  }

  const sortedCategories = Array.from(categoryInfo.values()).sort(
    (a, b) => a.score - b.score
  );

  const roleType = pmTarget?.targetRoleType ?? null;

  const topGaps = sortedCategories.slice(0, 3).map((c) => ({
    categorySlug: c.slug,
    categoryName: c.name,
    score: c.score,
    explanation: getGapExplanation(roleType, c.slug),
  }));

  const topStrengths = [...sortedCategories]
    .reverse()
    .slice(0, 3)
    .map((c) => ({
      categorySlug: c.slug,
      categoryName: c.name,
      score: c.score,
    }));

  // PSI summary
  const psiCount = await prisma.psiEntry.count({
    where: { userId, isVisible: true },
  });

  const psiSummary = {
    totalCount: psiCount,
    previews: psiEntries.map((e) => ({
      id: e.id,
      problemPreview: e.problem.slice(0, 120),
    })),
  };

  // Activity heatmap (past 84 days)
  const activityByDay: Record<string, number> = {};
  for (const log of activityLogs) {
    const day = log.createdAt.toISOString().slice(0, 10);
    activityByDay[day] = (activityByDay[day] ?? 0) + 1;
  }

  return NextResponse.json({
    profile: {
      fullName: profile?.fullName ?? null,
      targetRoleType: roleType,
      onboardingCompleted: profile?.onboardingCompleted ?? false,
    },
    readiness,
    topGaps,
    topStrengths,
    psiSummary,
    streak: streak
      ? {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActiveDate: streak.lastActiveDate?.toISOString() ?? null,
          totalDaysActive: streak.totalDaysActive,
        }
      : null,
    activityByDay,
  });
}

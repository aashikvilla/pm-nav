import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ReadinessScoreWidget } from "@/components/dashboard/readiness-score-widget";
import { SkillBreakdown } from "@/components/dashboard/skill-breakdown";
import { SkillGapsPanel } from "@/components/dashboard/skill-gaps-panel";
import { PsiSummaryWidget } from "@/components/dashboard/psi-summary-widget";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { ActivityGraph } from "@/components/dashboard/activity-graph";

const ONBOARDING_STEP_URLS: Record<number, string> = {
  0: "/onboarding/upload",
  1: "/onboarding/profile",
  2: "/onboarding/analyzing",
  3: "/onboarding/conversation",
  4: "/onboarding/summary",
};

async function getDashboardSummary() {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/v1/dashboard/summary`, {
    cache: "no-store",
    headers: { Cookie: "" }, // cookies forwarded via Next.js server context
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const summary = await getDashboardSummary();

  // Onboarding guard
  if (!summary?.profile?.onboardingCompleted) {
    const step = summary?.profile?.onboardingStep ?? 0;
    redirect(ONBOARDING_STEP_URLS[step] ?? "/onboarding/upload");
  }

  const { profile, readiness, topGaps, psiSummary, streak, activityByDay } = summary;

  const hasScores = Object.keys(readiness.byCategory).length > 0;

  const categoryList = Object.entries(readiness.byCategory as Record<string, number>).map(
    ([slug, score]) => ({
      name: slug
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      score,
    })
  );

  const gapsWithHref = topGaps.map(
    (g: { categorySlug: string; categoryName: string; score: number; explanation: string }) => ({
      categoryName: g.categoryName,
      score: g.score,
      explanation: g.explanation,
      learningHref: "/dashboard/learning",
    })
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          Welcome back{profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}
        </h1>
        {streak && streak.currentStreak > 0 && (
          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
            🔥 {streak.currentStreak}-day streak
          </span>
        )}
      </div>

      {!hasScores ? (
        /* Empty state — analysis still running */
        <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-10 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Analysis still running — your scores will appear here shortly.
          </p>
        </div>
      ) : (
        <>
          {/* Top row: score + gaps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReadinessScoreWidget
              score={readiness.overall}
              targetRoleType={profile.targetRoleType}
            />
            <div className="md:col-span-2">
              <SkillGapsPanel gaps={gapsWithHref} />
            </div>
          </div>

          {/* Skill breakdown */}
          <SkillBreakdown categories={categoryList} />

          {/* PSI summary + streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PsiSummaryWidget
              totalCount={psiSummary.totalCount}
              previews={psiSummary.previews}
            />
            {streak && (
              <StreakWidget
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
                lastActiveDate={streak.lastActiveDate ? new Date(streak.lastActiveDate) : null}
                totalDaysActive={streak.totalDaysActive}
              />
            )}
          </div>

          {/* Activity graph */}
          <ActivityGraph activityByDay={activityByDay} />
        </>
      )}
    </div>
  );
}

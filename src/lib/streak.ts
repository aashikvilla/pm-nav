import { prisma } from "@/lib/prisma"

export async function recordActivity(
  userId: string,
  activityType: string,
  entityId?: string,
  entityType?: string,
  metadata?: Record<string, string | number | boolean | null>,
): Promise<void> {
  await prisma.activityLog.create({
    data: { userId, activityType, entityId, entityType, metadata },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const streak = await prisma.userStreak.findUnique({ where: { userId } })
  if (!streak) return

  const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null
  if (lastActive) lastActive.setHours(0, 0, 0, 0)

  const todayTime = today.getTime()
  if (lastActive?.getTime() === todayTime) return

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const isConsecutive = lastActive?.getTime() === yesterday.getTime()

  const newStreak = isConsecutive ? streak.currentStreak + 1 : 1
  await prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(streak.longestStreak, newStreak),
      lastActiveDate: new Date(),
      totalDaysActive: streak.totalDaysActive + 1,
    },
  })
}

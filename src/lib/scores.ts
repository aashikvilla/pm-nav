export function calculateCategoryScores(
  skillScores: { skillId: string; evidenceScore: number; assignmentScore: number; learningScore: number }[],
  skills: { id: string; categoryId: string }[],
): Record<string, number> {
  const skillMap = new Map(skills.map((s) => [s.id, s.categoryId]))
  const categoryBuckets: Record<string, number[]> = {}

  for (const score of skillScores) {
    const catId = skillMap.get(score.skillId)
    if (!catId) continue
    const composite = 0.5 * score.evidenceScore + 0.3 * score.assignmentScore + 0.2 * score.learningScore
    if (!categoryBuckets[catId]) categoryBuckets[catId] = []
    categoryBuckets[catId].push(composite)
  }

  const result: Record<string, number> = {}
  for (const [catId, scores] of Object.entries(categoryBuckets)) {
    result[catId] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }
  return result
}

export function calculateReadinessScore(
  categoryScores: Record<string, number>,
  roleWeights: { categoryId: string; weight: number }[],
): number {
  let total = 0
  let totalWeight = 0
  for (const rw of roleWeights) {
    const score = categoryScores[rw.categoryId] ?? 0
    total += score * rw.weight
    totalWeight += rw.weight
  }
  if (totalWeight === 0) return 0
  return Math.round(total / totalWeight)
}

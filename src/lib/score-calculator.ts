export interface SkillScoreInput {
  skillId: string;
  categoryId: string;
  evidenceScore: number;
  assignmentScore: number;
  learningScore: number;
}

export interface RoleWeightInput {
  categoryId: string;
  weight: number;
}

export interface CategoryScore {
  categoryId: string;
  score: number;
}

export interface ReadinessScoreResult {
  overall: number;
  byCategory: Record<string, number>;
}

export function computeReadinessScore(
  skillScores: SkillScoreInput[],
  roleWeights: RoleWeightInput[]
): ReadinessScoreResult {
  if (skillScores.length === 0) {
    return { overall: 0, byCategory: {} };
  }

  // Group skills by category and compute per-skill scores
  const categoryMap = new Map<string, number[]>();
  for (const s of skillScores) {
    const skillScore = 0.5 * s.evidenceScore + 0.3 * s.assignmentScore + 0.2 * s.learningScore;
    if (!categoryMap.has(s.categoryId)) categoryMap.set(s.categoryId, []);
    categoryMap.get(s.categoryId)!.push(skillScore);
  }

  // Compute per-category average
  const byCategory: Record<string, number> = {};
  for (const [catId, scores] of categoryMap.entries()) {
    byCategory[catId] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  let overall: number;

  if (roleWeights.length === 0) {
    // Fallback: simple average of all category scores
    const vals = Object.values(byCategory);
    overall = vals.reduce((a, b) => a + b, 0) / vals.length;
  } else {
    // Weighted sum
    overall = 0;
    for (const rw of roleWeights) {
      const catScore = byCategory[rw.categoryId] ?? 0;
      overall += catScore * rw.weight;
    }
  }

  return {
    overall: Math.round(overall),
    byCategory,
  };
}

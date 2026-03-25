import { claudeChat } from "@/lib/ai/anthropic"

interface GapAnalysisInput {
  psiEntries: { problem: string; solution: string; impact: string; skillsHinted: string[] }[]
  targetRoleType: string
  yearsExperience: number
  currentRole: string
}

interface GapAnalysisResult {
  skillScores: Record<string, number> // skillSlug → 0-100
  topStrengths: string[]
  topGaps: string[]
  summary: string
  recommendedStages: number[] // stage numbers to prioritize
}

const SYSTEM_PROMPT = `You are a PM hiring expert. Analyze a candidate's PSI entries to score their PM readiness across skills.

Skill slugs to score: product-thinking, user-research, data-analysis, prioritization, stakeholder-management, technical-acumen, execution, communication, business-acumen, leadership

Score each skill 0-100 based on evidence in PSI entries. Be honest and calibrated — most career switchers score 20-60 range.
Return ONLY valid JSON.`

export async function analyzeGaps(input: GapAnalysisInput): Promise<GapAnalysisResult> {
  const entriesSummary = input.psiEntries
    .slice(0, 10)
    .map((e, i) => `Entry ${i + 1}:\nP: ${e.problem}\nS: ${e.solution}\nI: ${e.impact}\nSkills: ${e.skillsHinted.join(", ")}`)
    .join("\n\n")

  const prompt = `Analyze PM readiness for:
Target role: ${input.targetRoleType} PM
Current role: ${input.currentRole}
Years experience: ${input.yearsExperience}

PSI Entries:
${entriesSummary}

Return JSON: {"skillScores":{"slug":number},"topStrengths":string[],"topGaps":string[],"summary":string,"recommendedStages":number[]}`

  const response = await claudeChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }])
  try {
    return JSON.parse(response) as GapAnalysisResult
  } catch {
    throw new Error("Failed to parse gap analysis JSON")
  }
}

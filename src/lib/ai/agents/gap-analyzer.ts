// Model: stepfun/step-3.5-flash:free (primary) → deepseek/deepseek-chat-v3.1 (fallback)
// Rationale: Gap analysis processes large context (full taxonomy + PSI entries). Step 3.5 Flash
// has 256K context and ranks highly on structured analytical tasks. Using StepFun here (vs
// DeepSeek for PSI) spreads rate limits across providers.
import { orChat } from "@/lib/ai/openrouter"
import { logger } from "@/lib/logger"

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

  const response = await orChat("gapAnalyzer", SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    maxTokens: 4096,
    jsonMode: true,
  })

  logger.info("[GapAnalyzer] Raw response", { chars: response.length, preview: response.slice(0, 300) })

  try {
    const codeBlock = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const objectMatch = response.match(/\{[\s\S]*\}/)
    const jsonStr = codeBlock ? codeBlock[1] : objectMatch ? objectMatch[0] : response.trim()
    logger.info("[GapAnalyzer] Parsing JSON", { method: codeBlock ? "codeBlock" : objectMatch ? "objectMatch" : "raw", jsonPreview: jsonStr.slice(0, 200) })
    const parsed = JSON.parse(jsonStr) as GapAnalysisResult
    logger.info("[GapAnalyzer] Parsed OK", { skillSlugs: Object.keys(parsed.skillScores ?? {}), hasStrengths: !!parsed.topStrengths, hasGaps: !!parsed.topGaps })
    return parsed
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    logger.error("[GapAnalyzer] JSON parse failed", { error: msg, responsePreview: response.slice(0, 500) })
    throw new Error("Failed to parse gap analysis JSON: " + response.slice(0, 200))
  }
}

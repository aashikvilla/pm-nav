// Model: qwen/qwen3-next-80b-a3b-instruct:free (primary) → mistral-small-3.1-24b (fallback)
// Rationale: Resume optimization is JD-to-profile matching + structured generation —
// exactly what Qwen3 Next is optimized for (RAG + agentic workflows). 262K context
// handles long JDs + full profiles. 3B active params = very fast for on-demand generation.
// Mistral Small covers rate limits from a different provider.
import { orChat } from "@/lib/ai/openrouter"

interface ResumeOptimizeInput {
  psiEntries: { problem: string; solution: string; impact: string }[]
  targetRole: string
  targetCompany?: string
  jobDescription: string
  jdKeywords: string[]
}

interface ResumeOptimizeResult {
  bullets: { original: string; optimized: string; keywords: string[] }[]
  summary: string
  atsScore: number
  keywordMatch: { matched: string[]; missing: string[] }
}

const SYSTEM_PROMPT = `You are a resume optimization expert specializing in PM roles.
Transform PSI entries into ATS-optimized resume bullets. Use PM vocabulary. Quantify impact.
Return ONLY valid JSON.`

export async function optimizeResume(input: ResumeOptimizeInput): Promise<ResumeOptimizeResult> {
  const psiText = input.psiEntries
    .slice(0, 8)
    .map((e, i) => `Entry ${i + 1}: P:${e.problem} | S:${e.solution} | I:${e.impact}`)
    .join("\n")

  const prompt = `Optimize for ${input.targetRole} PM role${input.targetCompany ? ` at ${input.targetCompany}` : ""}.

JD keywords to target: ${input.jdKeywords.join(", ")}
JD excerpt: ${input.jobDescription.slice(0, 500)}

PSI Entries:
${psiText}

Return JSON: {"bullets":[{"original":string,"optimized":string,"keywords":string[]}],"summary":string,"atsScore":number,"keywordMatch":{"matched":string[],"missing":string[]}}`

  const response = await orChat("resumeOptimizer", SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    maxTokens: 4096,
    jsonMode: true,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as ResumeOptimizeResult
  } catch {
    throw new Error("Failed to parse resume optimize JSON from AI response: " + response)
  }
}

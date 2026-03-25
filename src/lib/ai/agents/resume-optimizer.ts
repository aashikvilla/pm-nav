// Model: STRUCTURED (meta-llama/llama-3.3-70b-instruct:free)
// Rationale: Resume optimisation is a structured transformation task — convert
// PSI entries into ATS-compliant bullets that match JD keywords and PM vocabulary.
// Llama 3.3 70B excels at precisely following complex transformation instructions
// and keyword matching patterns, making it the right balance of capability and
// speed for this batch-oriented, less time-sensitive task.
import { orChat, MODELS } from "@/lib/ai/openrouter"

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

  const response = await orChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    model: MODELS.STRUCTURED,
    maxTokens: 4096,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as ResumeOptimizeResult
  } catch {
    throw new Error("Failed to parse resume optimize JSON from AI response: " + response)
  }
}

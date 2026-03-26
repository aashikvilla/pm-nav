// Model: mistral-small-3.1-24b (primary) → gpt-oss-20b (fallback)
// Rationale: Keyword extraction from JDs is a focused NLP task —
// Mistral Small handles structured extraction well within its 24B params.
import { orChat } from "@/lib/ai/openrouter"

const SYSTEM_PROMPT = `You are an ATS keyword extraction expert for Product Management roles.
Extract the most important keywords and phrases from a job description that an ATS system would scan for.
Focus on: hard skills, tools, methodologies, domain terms, certifications, and PM-specific terminology.
Return ONLY valid JSON.`

export async function extractJdKeywords(jdContent: string): Promise<string[]> {
  const prompt = `Extract PM-relevant ATS keywords from this job description. Return JSON: {"keywords": string[]}

Job Description:
${jdContent.slice(0, 3000)}`

  const response = await orChat("atsScorer", SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    maxTokens: 1024,
    jsonMode: true,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    const parsed = JSON.parse(jsonStr) as { keywords: string[] }
    return parsed.keywords ?? []
  } catch {
    throw new Error("Failed to parse ATS keyword extraction response: " + response)
  }
}

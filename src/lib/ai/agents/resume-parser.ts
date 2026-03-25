// Model: STRUCTURED (meta-llama/llama-3.3-70b-instruct:free)
// Rationale: Resume parsing is schema-constrained JSON extraction. Llama 3.3 70B
// leads free-tier benchmarks for instruction-following and structured output —
// reliably returns well-formed JSON matching the expected schema.
import { orChat, MODELS } from "@/lib/ai/openrouter"

interface ParsedResume {
  fullName: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  summary: string
  workExperiences: {
    company: string
    title: string
    startDate: string
    endDate: string | null
    isCurrent: boolean
    description: string
    bullets: string[]
  }[]
  education: { institution: string; degree: string; field: string; year: string }[]
  skills: string[]
  rawText: string
}

const SYSTEM_PROMPT = `You are a resume parser. Extract structured data from resume text.
Return ONLY valid JSON matching the schema. No markdown, no explanation.
For dates use format "YYYY-MM" or null if unknown. isCurrent=true if still in role.`

export async function parseResume(resumeText: string): Promise<ParsedResume> {
  const schema = `{
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "linkedinUrl": string,
  "summary": string,
  "workExperiences": [{"company":string,"title":string,"startDate":string,"endDate":string|null,"isCurrent":boolean,"description":string,"bullets":string[]}],
  "education": [{"institution":string,"degree":string,"field":string,"year":string}],
  "skills": string[],
  "rawText": string
}`

  const response = await orChat(
    SYSTEM_PROMPT,
    [{ role: "user", content: `Parse this resume and return JSON matching this schema:\n${schema}\n\nResume:\n${resumeText}` }],
    { model: MODELS.STRUCTURED, maxTokens: 4096 },
  )

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as ParsedResume
  } catch {
    throw new Error("Failed to parse resume JSON from AI response: " + response)
  }
}

// Model: openai/gpt-oss-120b:free (primary) → mistral-small-3.1-24b (fallback)
// Rationale: Extraction task, not reasoning. GPT-OSS 120B has native structured output
// from OpenAI training heritage. Mistral covers rate-limit spills from a different provider.
import { orChat } from "@/lib/ai/openrouter"

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
    "resumeParser",
    SYSTEM_PROMPT,
    [{ role: "user", content: `Parse this resume and return JSON matching this schema:\n${schema}\n\nResume:\n${resumeText}` }],
    { maxTokens: 4096, jsonMode: true },
  )

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as ParsedResume
  } catch {
    throw new Error("Failed to parse resume JSON from AI response: " + response)
  }
}

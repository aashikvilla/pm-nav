import { gptChat } from "@/lib/ai/openai"

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
  const response = await gptChat(
    SYSTEM_PROMPT,
    `Parse this resume and return JSON matching this schema:\n${schema}\n\nResume:\n${resumeText}`,
    { maxTokens: 4096 }
  )
  try {
    return JSON.parse(response) as ParsedResume
  } catch {
    throw new Error("Failed to parse resume JSON from AI response")
  }
}

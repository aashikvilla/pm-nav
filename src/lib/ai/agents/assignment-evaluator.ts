import { claudeChat } from "@/lib/ai/anthropic"

interface EvaluationInput {
  assignmentTitle: string
  assignmentPrompt: string
  rubric: { criterion: string; points: number; description: string }[]
  submission: string
  maxScore: number
}

interface EvaluationResult {
  totalScore: number
  passed: boolean
  breakdown: { criterion: string; score: number; maxPoints: number; comment: string }[]
  overallFeedback: string
  strengthAreas: string[]
  improvementAreas: string[]
}

const SYSTEM_PROMPT = `You are a senior PM hiring manager evaluating a PM assignment submission.
Score honestly against the rubric. Be specific in feedback. Return ONLY valid JSON.`

export async function evaluateAssignment(input: EvaluationInput): Promise<EvaluationResult> {
  const rubricText = input.rubric
    .map((r) => `- ${r.criterion} (${r.points} pts): ${r.description}`)
    .join("\n")

  const prompt = `Assignment: ${input.assignmentTitle}
Prompt: ${input.assignmentPrompt}

Rubric (total ${input.maxScore} pts):
${rubricText}

Submission:
${input.submission}

Evaluate and return JSON: {
  "totalScore": number,
  "passed": boolean (score >= 60% of maxScore),
  "breakdown": [{"criterion":string,"score":number,"maxPoints":number,"comment":string}],
  "overallFeedback": string,
  "strengthAreas": string[],
  "improvementAreas": string[]
}`

  const response = await claudeChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }])
  try {
    return JSON.parse(response) as EvaluationResult
  } catch {
    throw new Error("Failed to parse evaluation JSON")
  }
}

import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function claudeChat(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  opts?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await anthropic.messages.create({
    model: opts?.model ?? "claude-sonnet-4-6",
    max_tokens: opts?.maxTokens ?? 4096,
    system: systemPrompt,
    messages,
  })
  const block = response.content[0]
  if (block.type !== "text") throw new Error("Unexpected response type")
  return block.text
}

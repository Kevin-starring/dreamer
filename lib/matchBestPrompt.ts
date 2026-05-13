import type { Tool, PromptTemplate } from './types'

/**
 * When useCase is undefined (live API responses), find the most relevant
 * prompt for a tool based on keyword matching against the task name.
 */
export function matchBestPrompt(tool: Tool, taskName?: string | null): PromptTemplate {
  if (!taskName || tool.prompts.length <= 1) return tool.prompts[0]

  const lower = taskName.toLowerCase()
  let bestPrompt = tool.prompts[0]
  let bestScore = 0

  for (const prompt of tool.prompts) {
    let score = 0

    // Match task name words against prompt tags (strongest signal)
    for (const tag of prompt.tags) {
      if (lower.includes(tag)) score += 3
    }

    // Match against useCase name parts
    const ucWords = prompt.useCase.split('-')
    for (const word of ucWords) {
      if (word.length > 2 && lower.includes(word)) score += 2
    }

    if (score > bestScore) {
      bestScore = score
      bestPrompt = prompt
    }
  }

  return bestPrompt
}

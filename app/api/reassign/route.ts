import Anthropic from '@anthropic-ai/sdk'
import { parseDecomposition, EmptyResponseError } from '@/lib/parseDecomposition'
import type { DecomposeResponse } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_TOOL_IDS = [
  'claude', 'chatgpt', 'midjourney', 'canva', 'runway', 'elevenlabs',
  'cursor', 'gamma', 'perplexity', 'capcut', 'notion-ai', 'figma-ai',
  'suno', 'dall-e', 'stable-diffusion', 'descript', 'synthesia',
  'copy-ai', 'jasper', 'pika',
]

const SYSTEM_PROMPT = `You are an AI tool assignment engine. Given a user's dream and their custom execution plan, assign the most appropriate AI tool to each task.

OUTPUT FORMAT — follow this EXACTLY:
# [Dream Title — short, no emoji]

## [Branch Name]
- [Task Name] [tool:tool-id]
- [Task Name] [tool:tool-id]

RULES:
1. Use h1 for root, h2 for branches, "- " bullets for leaf tasks
2. NO h3, NO numbered lists, NO emoji anywhere
3. Every leaf MUST have exactly one [tool:tool-id] tag
4. Only use tool IDs from this list: ${VALID_TOOL_IDS.join(', ')}
5. IMPORTANT: Keep the exact branch names and task names from the user's plan — do NOT rename, add, or remove any items
6. Choose the most relevant AI tool for each specific task`

export async function POST(request: Request) {
  let dream: string
  let branches: Array<{ name: string; tasks: string[] }>

  try {
    const body = await request.json()
    dream = body.dream?.trim()
    branches = body.branches
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!dream || !branches?.length) {
    return Response.json({ error: 'dream and branches are required' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Service unavailable' }, { status: 503 })
  }

  const planText = branches
    .map(b => `## ${b.name}\n${b.tasks.map(t => `- ${t}`).join('\n')}`)
    .join('\n\n')

  const userMessage = `My dream: ${dream}

Assign AI tools to each task in my custom execution plan. Keep all names exactly as-is:

${planText}`

  try {
    const message = await client.messages.create(
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      },
      { signal: AbortSignal.timeout(10000) }
    )

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const root = parseDecomposition(text)
    const response: DecomposeResponse = { root, source: 'live' }
    return Response.json(response)

  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string }
    if (e.status === 401) return Response.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    if (e.name === 'TimeoutError' || e.name === 'AbortError') console.error('Reassign timeout')
    else if (err instanceof EmptyResponseError) console.error('Parse error:', e.message)
    else console.error('Reassign error:', e.message)
    return Response.json({ error: 'Failed to regenerate. Try again.' }, { status: 500 })
  }
}

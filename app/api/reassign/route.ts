import Anthropic from '@anthropic-ai/sdk'
import { parseDecomposition, EmptyResponseError } from '@/lib/parseDecomposition'
import type { DecomposeResponse, TreeNode } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_TOOL_IDS = [
  'claude', 'chatgpt', 'midjourney', 'canva', 'runway', 'elevenlabs',
  'cursor', 'gamma', 'perplexity', 'capcut', 'notion-ai', 'figma-ai',
  'suno', 'dall-e', 'stable-diffusion', 'descript', 'synthesia',
  'copy-ai', 'jasper', 'pika',
]

// Keyword-based local fallback when API key is unavailable
const KEYWORD_TOOL_MAP: Array<{ keywords: string[]; toolId: string }> = [
  { keywords: ['research', 'search', 'find', 'explore', 'analyze', 'market', 'trend', 'study'], toolId: 'perplexity' },
  { keywords: ['image', 'photo', 'picture', 'illustration', 'art', 'thumbnail', 'banner', 'poster'], toolId: 'midjourney' },
  { keywords: ['logo', 'graphic', 'flyer', 'design', 'brand', 'visual'], toolId: 'canva' },
  { keywords: ['video edit', 'editing', 'cut', 'splice', 'montage', 'reel', 'highlight'], toolId: 'capcut' },
  { keywords: ['video', 'film', 'footage', 'animate', 'animation', 'motion'], toolId: 'runway' },
  { keywords: ['voice', 'narrat', 'voiceover', 'podcast', 'speech', 'tts'], toolId: 'elevenlabs' },
  { keywords: ['music', 'song', 'melody', 'track', 'audio', 'sound'], toolId: 'suno' },
  { keywords: ['presentation', 'slide', 'deck', 'pitch'], toolId: 'gamma' },
  { keywords: ['social', 'caption', 'post', 'marketing', 'copy', 'ad', 'campaign'], toolId: 'copy-ai' },
  { keywords: ['track', 'organiz', 'plan', 'schedule', 'log', 'note', 'manage', 'application'], toolId: 'notion-ai' },
  { keywords: ['code', 'program', 'develop', 'build', 'app', 'website', 'software', 'cursor'], toolId: 'cursor' },
  { keywords: ['cv', 'resume', 'article', 'essay', 'paper', 'report', 'write', 'statement'], toolId: 'jasper' },
  { keywords: ['interview', 'practice', 'prep', 'script', 'outline', 'strategy', 'plan', 'roadmap'], toolId: 'claude' },
]

function matchToolLocally(taskName: string): string {
  const lower = taskName.toLowerCase()
  for (const { keywords, toolId } of KEYWORD_TOOL_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return toolId
  }
  return 'claude'
}

function buildTreeLocally(dream: string, branches: Array<{ name: string; tasks: string[] }>): TreeNode {
  return {
    name: dream,
    toolId: null,
    children: branches.map(b => ({
      name: b.name,
      toolId: null,
      children: b.tasks.map(t => ({ name: t, toolId: matchToolLocally(t) })),
    })),
  }
}

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
    console.error('ANTHROPIC_API_KEY not set — falling back to local tool matching')
    const root = buildTreeLocally(dream, branches)
    return Response.json({ root, source: 'live' } satisfies DecomposeResponse)
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
    if (e.status === 401) console.error('Anthropic auth error — falling back to local matching')
    else if (e.name === 'TimeoutError' || e.name === 'AbortError') console.error('Reassign timeout — falling back to local matching')
    else if (err instanceof EmptyResponseError) console.error('Parse error — falling back to local matching:', e.message)
    else console.error('Reassign error — falling back to local matching:', e.message)
    const root = buildTreeLocally(dream, branches)
    return Response.json({ root, source: 'live' } satisfies DecomposeResponse)
  }
}

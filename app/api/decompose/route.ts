import Anthropic from '@anthropic-ai/sdk'
import { parseDecomposition, EmptyResponseError } from '@/lib/parseDecomposition'
import { matchGoldenPath } from '@/lib/goldenPathMatch'
import type { DecomposeResponse } from '@/lib/types'

import youtubeCoooking from '@/public/cache/golden-path.json'
import doctor from '@/public/cache/doctor.json'
import lawyer from '@/public/cache/lawyer.json'
import footballPlayer from '@/public/cache/football-player.json'
import firefighter from '@/public/cache/firefighter.json'
import scientist from '@/public/cache/scientist.json'
import idolSinger from '@/public/cache/idol-singer.json'
import proGamer from '@/public/cache/pro-gamer.json'
import startupFounder from '@/public/cache/startup-founder.json'
import author from '@/public/cache/author.json'
import webtoonArtist from '@/public/cache/webtoon-artist.json'
import actor from '@/public/cache/actor.json'
import travelWorld from '@/public/cache/travel-world.json'
import gameDeveloper from '@/public/cache/game-developer.json'

const GOLDEN_CACHE: Record<string, DecomposeResponse> = {
  'youtube-cooking':  youtubeCoooking as DecomposeResponse,
  'doctor':           doctor as DecomposeResponse,
  'lawyer':           lawyer as DecomposeResponse,
  'football-player':  footballPlayer as DecomposeResponse,
  'firefighter':      firefighter as DecomposeResponse,
  'scientist':        scientist as DecomposeResponse,
  'idol-singer':      idolSinger as DecomposeResponse,
  'pro-gamer':        proGamer as DecomposeResponse,
  'startup-founder':  startupFounder as DecomposeResponse,
  'author':           author as DecomposeResponse,
  'webtoon-artist':   webtoonArtist as DecomposeResponse,
  'actor':            actor as DecomposeResponse,
  'travel-world':     travelWorld as DecomposeResponse,
  'game-developer':   gameDeveloper as DecomposeResponse,
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_TOOL_IDS = [
  'claude', 'chatgpt', 'midjourney', 'canva', 'runway', 'elevenlabs',
  'cursor', 'gamma', 'perplexity', 'capcut', 'notion-ai', 'figma-ai',
  'suno', 'dall-e', 'stable-diffusion', 'descript', 'synthesia',
  'copy-ai', 'jasper', 'pika'
]

const SYSTEM_PROMPT = `You are a dream decomposition engine. A user will describe a dream or goal. Break it down into an actionable execution tree.

OUTPUT FORMAT — follow this EXACTLY:
# [Dream Title — short, no emoji]

## [Branch Name — no emoji, no numbered prefixes]
- [Task Name] [tool:tool-id]
- [Task Name] [tool:tool-id]

## [Branch Name]
- [Task Name] [tool:tool-id]

RULES:
1. Use exactly h1 for the root, h2 for branches (5 branches max), and "- " bullets for leaf tasks
2. NO h3 headings, NO numbered lists, NO emoji anywhere
3. Every leaf MUST have exactly one [tool:tool-id] tag
4. Only use tool IDs from this list: ${VALID_TOOL_IDS.join(', ')}
5. Choose the most appropriate tool for each specific task
6. 2-4 leaves per branch
7. Branch names should be action-oriented phases (e.g. "Research", "Production", "Marketing")
8. Leaf names should be specific tasks (e.g. "Find niche audience", "Write script outline")`

function loadGoldenCache(key: string): DecomposeResponse {
  return GOLDEN_CACHE[key] ?? GOLDEN_CACHE['youtube-cooking']
}

export async function POST(request: Request) {
  let dream: string

  try {
    const body = await request.json()
    dream = body.dream?.trim()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!dream || dream.length === 0) {
    return Response.json({ error: 'Dream is required' }, { status: 400 })
  }

  if (dream.length > 500) {
    return Response.json({ error: 'Dream must be under 500 characters' }, { status: 400 })
  }

  const goldenKey = matchGoldenPath(dream)
  if (goldenKey) {
    return Response.json(loadGoldenCache(goldenKey))
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set — falling back to golden cache')
    return Response.json({ ...loadGoldenCache('youtube-cooking'), note: 'Showing example result' })
  }

  try {
    const message = await client.messages.create(
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `My dream: ${dream}` }],
      },
      { signal: AbortSignal.timeout(8000) }
    )

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const root = parseDecomposition(text)

    const response: DecomposeResponse = { root, source: 'live' }
    return Response.json(response)

  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string }
    const isTimeout = e.name === 'TimeoutError' || e.name === 'AbortError'
    const isRateLimit = e.status === 429
    const isAuth = e.status === 401

    if (isAuth) {
      console.error('Anthropic auth error — check ANTHROPIC_API_KEY')
      return Response.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    if (isTimeout) console.error('Anthropic API timeout — falling back to golden cache')
    else if (isRateLimit) console.error('Anthropic rate limit — falling back to golden cache')
    else if (err instanceof EmptyResponseError) console.error('Parse error:', e.message)
    else console.error('Decompose error:', e.message)

    return Response.json({ ...loadGoldenCache('youtube-cooking'), note: 'Showing example result' })
  }
}

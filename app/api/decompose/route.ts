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
import programmer from '@/public/cache/programmer.json'
import chef from '@/public/cache/chef.json'
import pilot from '@/public/cache/pilot.json'
import photographer from '@/public/cache/photographer.json'
import musician from '@/public/cache/musician.json'
import dancer from '@/public/cache/dancer.json'
import teacher from '@/public/cache/teacher.json'
import architect from '@/public/cache/architect.json'
import veterinarian from '@/public/cache/veterinarian.json'
import dentist from '@/public/cache/dentist.json'
import psychologist from '@/public/cache/psychologist.json'
import uxDesigner from '@/public/cache/ux-designer.json'
import filmmaker from '@/public/cache/filmmaker.json'
import journalist from '@/public/cache/journalist.json'
import fashionDesigner from '@/public/cache/fashion-designer.json'
import interiorDesigner from '@/public/cache/interior-designer.json'
import dataScientist from '@/public/cache/data-scientist.json'
import youtuber from '@/public/cache/youtuber.json'
import policeOfficer from '@/public/cache/police-officer.json'
import fitnessTrainer from '@/public/cache/fitness-trainer.json'
import voiceActor from '@/public/cache/voice-actor.json'
import astronaut from '@/public/cache/astronaut.json'
import diplomat from '@/public/cache/diplomat.json'
import aiEngineer from '@/public/cache/ai-engineer.json'
import nurse from '@/public/cache/nurse.json'
import becomeRich from '@/public/cache/become-rich.json'
import loseWeight from '@/public/cache/lose-weight.json'
import runMarathon from '@/public/cache/run-marathon.json'
import openCafe from '@/public/cache/open-cafe.json'
import learnLanguage from '@/public/cache/learn-language.json'
import travelEurope from '@/public/cache/travel-europe.json'
import buyHouse from '@/public/cache/buy-house.json'
import findLove from '@/public/cache/find-love.json'

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
  'programmer':        programmer as DecomposeResponse,
  'chef':              chef as DecomposeResponse,
  'pilot':             pilot as DecomposeResponse,
  'photographer':      photographer as DecomposeResponse,
  'musician':          musician as DecomposeResponse,
  'dancer':            dancer as DecomposeResponse,
  'teacher':           teacher as DecomposeResponse,
  'architect':         architect as DecomposeResponse,
  'veterinarian':      veterinarian as DecomposeResponse,
  'dentist':           dentist as DecomposeResponse,
  'psychologist':      psychologist as DecomposeResponse,
  'ux-designer':       uxDesigner as DecomposeResponse,
  'filmmaker':         filmmaker as DecomposeResponse,
  'journalist':        journalist as DecomposeResponse,
  'fashion-designer':  fashionDesigner as DecomposeResponse,
  'interior-designer': interiorDesigner as DecomposeResponse,
  'data-scientist':    dataScientist as DecomposeResponse,
  'youtuber':          youtuber as DecomposeResponse,
  'police-officer':    policeOfficer as DecomposeResponse,
  'fitness-trainer':   fitnessTrainer as DecomposeResponse,
  'voice-actor':       voiceActor as DecomposeResponse,
  'astronaut':         astronaut as DecomposeResponse,
  'diplomat':          diplomat as DecomposeResponse,
  'ai-engineer':       aiEngineer as DecomposeResponse,
  'nurse':             nurse as DecomposeResponse,
  'become-rich':       becomeRich as DecomposeResponse,
  'lose-weight':       loseWeight as DecomposeResponse,
  'run-marathon':      runMarathon as DecomposeResponse,
  'open-cafe':         openCafe as DecomposeResponse,
  'learn-language':    learnLanguage as DecomposeResponse,
  'travel-europe':     travelEurope as DecomposeResponse,
  'buy-house':         buyHouse as DecomposeResponse,
  'find-love':         findLove as DecomposeResponse,
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
    console.error('ANTHROPIC_API_KEY not set')
    return Response.json(
      { error: 'AI service not configured. Please set ANTHROPIC_API_KEY in your environment.' },
      { status: 503 }
    )
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

    return Response.json({ ...loadGoldenCache('youtube-cooking'), note: 'AI temporarily unavailable — showing an example result' })
  }
}

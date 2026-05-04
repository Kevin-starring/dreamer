import { Redis } from '@upstash/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { toolId, dreamHash } = body

    if (!toolId || typeof toolId !== 'string') {
      return Response.json({ ok: true })
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return Response.json({ ok: true })
    }

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    const key = `tool:${toolId.replace(/[^a-z0-9-]/g, '')}`
    await redis.incr(key)

    if (dreamHash && typeof dreamHash === 'string') {
      await redis.incr(`dream:${dreamHash.slice(0, 32)}`)
    }

  } catch {
    // fire-and-forget — never let analytics break the UI
  }

  return Response.json({ ok: true })
}

import { describe, it, expect } from 'vitest'
import { parseDecomposition, EmptyResponseError } from './parseDecomposition'

const HAPPY_PATH = `# YouTube Cooking Channel

## Content Strategy
- Niche Research [tool:claude]
- Content Calendar [tool:claude]
- Trend Analysis [tool:perplexity]

## Video Production
- Intro Animation [tool:runway]
- Voiceover [tool:elevenlabs]`

describe('parseDecomposition', () => {
  it('happy path: produces correct root and branch structure', () => {
    const result = parseDecomposition(HAPPY_PATH)
    expect(result.name).toBe('YouTube Cooking Channel')
    expect(result.children).toHaveLength(2)
    expect(result.children![0].name).toBe('Content Strategy')
    expect(result.children![0].children).toHaveLength(3)
    expect(result.children![1].name).toBe('Video Production')
  })

  it('[tool: runway] space variant → toolId trimmed to "runway"', () => {
    const md = `# My Dream\n\n## Branch\n- Task [tool: runway]`
    const result = parseDecomposition(md)
    expect(result.children![0].children![0].toolId).toBe('runway')
  })

  it('emoji in branch header → stripped from name', () => {
    const md = `# My Dream\n\n## 📝 Content Strategy\n- Task [tool:claude]`
    const result = parseDecomposition(md)
    expect(result.children![0].name).toBe('Content Strategy')
  })

  it('leaf with no tool tag → toolId is null', () => {
    const md = `# My Dream\n\n## Branch\n- Plain task without a tag`
    const result = parseDecomposition(md)
    expect(result.children![0].children![0].toolId).toBeNull()
    expect(result.children![0].children![0].name).toBe('Plain task without a tag')
  })

  it('empty string → throws EmptyResponseError', () => {
    expect(() => parseDecomposition('')).toThrow(EmptyResponseError)
  })

  it('h1 root but zero h2 branches → throws EmptyResponseError', () => {
    const md = `# My Dream\n\nSome prose text\n- A bullet without a branch`
    expect(() => parseDecomposition(md)).toThrow(EmptyResponseError)
  })
})

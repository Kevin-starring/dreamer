import { describe, it, expect } from 'vitest'
import { isGoldenPath } from './goldenPathMatch'

describe('isGoldenPath', () => {
  it('exact demo phrase matches', () => {
    expect(isGoldenPath('I want to launch a YouTube cooking channel')).toBe(true)
  })

  it('different phrasing with both keywords matches', () => {
    expect(isGoldenPath('start a cooking channel on YouTube')).toBe(true)
  })

  it('input without both keywords does not match', () => {
    expect(isGoldenPath('I want to write a novel')).toBe(false)
  })
})

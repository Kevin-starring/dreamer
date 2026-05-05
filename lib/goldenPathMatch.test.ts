import { describe, it, expect } from 'vitest'
import { isGoldenPath, matchGoldenPath } from './goldenPathMatch'

describe('matchGoldenPath', () => {
  it('youtube cooking — exact demo phrase', () => {
    expect(matchGoldenPath('I want to launch a YouTube cooking channel')).toBe('youtube-cooking')
  })

  it('youtube cooking — rephrased', () => {
    expect(matchGoldenPath('start a cooking channel on YouTube')).toBe('youtube-cooking')
  })

  it('doctor', () => {
    expect(matchGoldenPath('I want to become a doctor')).toBe('doctor')
  })

  it('doctor — physician variant', () => {
    expect(matchGoldenPath('my dream is to be a physician')).toBe('doctor')
  })

  it('lawyer', () => {
    expect(matchGoldenPath('I want to become a lawyer')).toBe('lawyer')
  })

  it('lawyer — attorney variant', () => {
    expect(matchGoldenPath('I want to be an attorney')).toBe('lawyer')
  })

  it('football player', () => {
    expect(matchGoldenPath('I want to be a professional football player')).toBe('football-player')
  })

  it('firefighter', () => {
    expect(matchGoldenPath('I want to become a firefighter')).toBe('firefighter')
  })

  it('firefighter — spaced variant', () => {
    expect(matchGoldenPath('my dream is to be a fire fighter')).toBe('firefighter')
  })

  it('scientist', () => {
    expect(matchGoldenPath('I want to be a scientist')).toBe('scientist')
  })

  it('scientist — phd variant', () => {
    expect(matchGoldenPath('I want to get a phd and do research')).toBe('scientist')
  })

  it('unmatched dream returns null', () => {
    expect(matchGoldenPath('I want to write a novel')).toBeNull()
  })
})

describe('isGoldenPath (legacy)', () => {
  it('matched dream returns true', () => {
    expect(isGoldenPath('I want to become a doctor')).toBe(true)
  })

  it('unmatched dream returns false', () => {
    expect(isGoldenPath('I want to write a novel')).toBe(false)
  })
})

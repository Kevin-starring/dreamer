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

  it('idol singer', () => {
    expect(matchGoldenPath('I want to become an idol singer')).toBe('idol-singer')
  })

  it('idol singer — kpop variant', () => {
    expect(matchGoldenPath('my dream is to be a k-pop idol')).toBe('idol-singer')
  })

  it('pro gamer', () => {
    expect(matchGoldenPath('I want to be a pro gamer')).toBe('pro-gamer')
  })

  it('pro gamer — esports variant', () => {
    expect(matchGoldenPath('my dream is to go pro in esports')).toBe('pro-gamer')
  })

  it('startup founder', () => {
    expect(matchGoldenPath('I want to start a startup')).toBe('startup-founder')
  })

  it('startup founder — entrepreneur variant', () => {
    expect(matchGoldenPath('my dream is to be an entrepreneur')).toBe('startup-founder')
  })

  it('author', () => {
    expect(matchGoldenPath('I want to become an author')).toBe('author')
  })

  it('author — write a novel variant', () => {
    expect(matchGoldenPath('I want to write a novel')).toBe('author')
  })

  it('webtoon artist', () => {
    expect(matchGoldenPath('I want to be a webtoon artist')).toBe('webtoon-artist')
  })

  it('actor', () => {
    expect(matchGoldenPath('I want to become an actor')).toBe('actor')
  })

  it('actor — actress variant', () => {
    expect(matchGoldenPath('my dream is to be an actress')).toBe('actor')
  })

  it('travel the world', () => {
    expect(matchGoldenPath('I want to travel the world')).toBe('travel-world')
  })

  it('travel the world — around the world variant', () => {
    expect(matchGoldenPath('my dream is to travel around the world')).toBe('travel-world')
  })

  it('game developer', () => {
    expect(matchGoldenPath('I want to become a game developer')).toBe('game-developer')
  })

  it('game developer — indie game variant', () => {
    expect(matchGoldenPath('I want to make my own indie game')).toBe('game-developer')
  })

  it('unmatched dream returns null', () => {
    expect(matchGoldenPath('I want to open a bakery')).toBeNull()
  })
})

describe('isGoldenPath (legacy)', () => {
  it('matched dream returns true', () => {
    expect(isGoldenPath('I want to become a doctor')).toBe(true)
  })

  it('unmatched dream returns false', () => {
    expect(isGoldenPath('I want to open a bakery')).toBe(false)
  })
})

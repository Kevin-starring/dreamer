const GOLDEN_PATHS: { key: string; terms: string[][] }[] = [
  { key: 'youtube-cooking',  terms: [['youtube'], ['cook']] },
  { key: 'doctor',           terms: [['doctor', 'physician', 'medicine', 'medical school']] },
  { key: 'lawyer',           terms: [['lawyer', 'attorney', 'law school', 'legal career']] },
  { key: 'football-player',  terms: [['football player', 'footballer', 'soccer player', 'nfl', 'premier league']] },
  { key: 'firefighter',      terms: [['firefighter', 'fire fighter', 'fireman', 'fire department']] },
  { key: 'scientist',        terms: [['scientist', 'researcher', 'phd', 'laboratory', 'science career']] },
  { key: 'idol-singer',      terms: [['idol', 'k-pop', 'kpop', 'singer', 'pop star', 'vocalist', 'musician']] },
  { key: 'pro-gamer',        terms: [['pro gamer', 'professional gamer', 'esports', 'e-sports', 'competitive gamer', 'streamer']] },
  { key: 'startup-founder',  terms: [['startup', 'start a business', 'entrepreneur', 'found a company', 'start my own business', 'start a company']] },
  { key: 'author',           terms: [['author', 'novelist', 'write a novel', 'write a book', 'publish a book', 'fiction writer']] },
  { key: 'webtoon-artist',   terms: [['webtoon', 'comic artist', 'manga artist', 'cartoonist', 'webcomic']] },
  { key: 'actor',            terms: [['actor', 'actress', 'acting career', 'film actor', 'tv actor', 'stage actor', 'become an actor']] },
  { key: 'travel-world',     terms: [['travel the world', 'world travel', 'travel around the world', 'backpack the world', 'world trip', 'globe trot']] },
  { key: 'game-developer',   terms: [['game developer', 'game development', 'make a game', 'indie game', 'video game developer', 'game designer']] },
]

/** Returns the golden path key if matched, null otherwise */
export function matchGoldenPath(input: string): string | null {
  const normalized = input.toLowerCase().trim()
  for (const { key, terms } of GOLDEN_PATHS) {
    const allMatch = terms.every(group => group.some(term => normalized.includes(term)))
    if (allMatch) return key
  }
  return null
}

/** Legacy boolean check — kept for existing tests */
export function isGoldenPath(input: string): boolean {
  return matchGoldenPath(input) !== null
}

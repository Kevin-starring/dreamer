const GOLDEN_PATHS: { key: string; terms: string[][] }[] = [
  // youtube AND cooking-related term — both groups must match
  { key: 'youtube-cooking',  terms: [['youtube'], ['cook', 'cooking', 'cookbook', 'culinary', 'chef', 'baker', 'baking', 'recipe']] },

  { key: 'doctor',           terms: [['doctor', 'physician', 'medicine', 'medical school', 'med school']] },
  { key: 'lawyer',           terms: [['lawyer', 'attorney', 'law school', 'legal career', 'bar exam']] },
  { key: 'football-player',  terms: [['football player', 'footballer', 'soccer player', 'nfl', 'premier league']] },
  { key: 'firefighter',      terms: [['firefighter', 'fire fighter', 'fireman', 'fire department']] },
  { key: 'scientist',        terms: [['scientist', 'researcher', 'phd', 'laboratory', 'science career', 'research career']] },

  // New dreams from dream.md
  { key: 'idol-singer',      terms: [['idol', 'k-pop', 'kpop', 'singer', 'pop star', 'vocalist', 'musician', 'singing career', 'music career', 'become a singer']] },
  { key: 'pro-gamer',        terms: [['pro gamer', 'professional gamer', 'esports', 'e-sports', 'competitive gamer', 'gaming career', 'streamer']] },
  { key: 'startup-founder',  terms: [['startup', 'start a business', 'entrepreneur', 'found a company', 'start my own business', 'start a company', 'launch a business']] },
  // 'author' kept as bare term — \bauthor\b won't match 'authoritative'
  { key: 'author',           terms: [['author', 'novelist', 'write a novel', 'write a book', 'publish a book', 'fiction writer', 'writing career']] },
  { key: 'webtoon-artist',   terms: [['webtoon', 'comic artist', 'manga artist', 'cartoonist', 'webcomic']] },
  // 'actor'/'actress' kept — \bactor\b won't match 'contractor'
  { key: 'actor',            terms: [['actor', 'actress', 'acting career', 'acting school', 'drama school', 'audition for', 'aspiring actor']] },
  { key: 'travel-world',     terms: [['travel the world', 'world travel', 'travel around the world', 'backpack the world', 'world trip', 'globe trot', 'traveling the world']] },
  { key: 'game-developer',   terms: [['game developer', 'game development', 'make my own game', 'build a game', 'create a game', 'indie game developer', 'indie game', 'video game developer', 'game designer']] },
]

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Match term using word boundaries to avoid substring false positives.
 * e.g. 'actor' won't match 'contractor', 'author' won't match 'authoritative'.
 */
function matchesTerm(normalized: string, term: string): boolean {
  return new RegExp(`\\b${escapeRegExp(term)}\\b`).test(normalized)
}

/** Returns the golden path key if matched, null otherwise */
export function matchGoldenPath(input: string): string | null {
  const normalized = input.toLowerCase().trim()
  for (const { key, terms } of GOLDEN_PATHS) {
    const allMatch = terms.every(group => group.some(term => matchesTerm(normalized, term)))
    if (allMatch) return key
  }
  return null
}

/** Legacy boolean check — kept for existing tests */
export function isGoldenPath(input: string): boolean {
  return matchGoldenPath(input) !== null
}

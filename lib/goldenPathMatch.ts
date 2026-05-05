const GOLDEN_PATHS: { key: string; terms: string[][] }[] = [
  { key: 'youtube-cooking', terms: [['youtube'], ['cook']] },
  { key: 'doctor',          terms: [['doctor', 'physician', 'medicine', 'medical school']] },
  { key: 'lawyer',          terms: [['lawyer', 'attorney', 'law school', 'legal career']] },
  { key: 'football-player', terms: [['football player', 'footballer', 'soccer player', 'nfl', 'premier league']] },
  { key: 'firefighter',     terms: [['firefighter', 'fire fighter', 'fireman', 'fire department']] },
  { key: 'scientist',       terms: [['scientist', 'researcher', 'phd', 'laboratory', 'science career']] },
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

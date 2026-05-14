const GOLDEN_PATHS: { key: string; terms: string[][] }[] = [
  // youtube AND cooking-related term — both groups must match
  { key: 'youtube-cooking',  terms: [['youtube'], ['cook', 'cooking', 'cookbook', 'culinary', 'chef', 'baker', 'baking', 'recipe']] },

  { key: 'doctor',           terms: [['doctor', 'physician', 'medicine', 'medical school', 'med school']] },
  { key: 'lawyer',           terms: [['lawyer', 'attorney', 'law school', 'legal career', 'bar exam']] },
  { key: 'football-player',  terms: [['football player', 'footballer', 'soccer player', 'nfl', 'premier league']] },
  { key: 'firefighter',      terms: [['firefighter', 'fire fighter', 'fireman', 'fire department']] },
  { key: 'scientist',        terms: [['scientist', 'researcher', 'phd', 'laboratory', 'science career', 'research career']] },

  // New dreams from dream.md
  { key: 'idol-singer',      terms: [['idol', 'k-pop', 'kpop', 'pop star', 'vocalist', 'singing career', 'become a singer', 'become an idol', 'idol singer', 'kpop star']] },
  { key: 'pro-gamer',        terms: [['pro gamer', 'professional gamer', 'esports', 'e-sports', 'competitive gamer', 'gaming career', 'streamer']] },
  { key: 'startup-founder',  terms: [['startup', 'start a business', 'entrepreneur', 'found a company', 'start my own business', 'start a company', 'launch a business']] },
  // 'author' kept as bare term — \bauthor\b won't match 'authoritative'
  { key: 'author',           terms: [['author', 'novelist', 'write a novel', 'write a book', 'publish a book', 'fiction writer', 'writing career']] },
  { key: 'webtoon-artist',   terms: [['webtoon', 'comic artist', 'manga artist', 'cartoonist', 'webcomic']] },
  // 'actor'/'actress' kept — \bactor\b won't match 'contractor'
  { key: 'actor',            terms: [['actor', 'actress', 'acting career', 'acting school', 'drama school', 'audition for', 'aspiring actor']] },
  { key: 'travel-world',     terms: [['travel the world', 'world travel', 'travel around the world', 'backpack the world', 'world trip', 'globe trot', 'traveling the world']] },
  { key: 'game-developer',   terms: [['game developer', 'game development', 'make my own game', 'build a game', 'create a game', 'indie game developer', 'indie game', 'video game developer', 'game designer']] },
  { key: 'programmer',       terms: [['programmer', 'software developer', 'software engineer', 'web developer', 'become a developer', 'learn to code', 'coding career', 'becoming a programmer', 'full stack', 'frontend developer', 'backend developer']] },
  { key: 'chef',             terms: [['become a chef', 'professional chef', 'culinary school', 'culinary arts', 'head chef', 'pastry chef', 'become a cook', 'cooking career', 'culinary career']] },
  { key: 'pilot',            terms: [['pilot', 'airline pilot', 'become a pilot', 'aviation', 'fly planes', 'flight school', 'commercial pilot']] },
  { key: 'photographer',     terms: [['photographer', 'professional photographer', 'photography career', 'become a photographer', 'photography business']] },
  { key: 'musician',         terms: [['musician', 'become a musician', 'music career', 'band member', 'composer', 'music producer', 'instrumentalist', 'play in a band']] },
  { key: 'dancer',           terms: [['dancer', 'professional dancer', 'become a dancer', 'dance career', 'choreographer', 'dancing career', 'ballet dancer']] },
  { key: 'teacher',          terms: [['teacher', 'become a teacher', 'educator', 'teaching career', 'school teacher', 'professor']] },
  { key: 'architect',        terms: [['architect', 'become an architect', 'architecture', 'architectural design', 'architecture career']] },
  { key: 'veterinarian',     terms: [['veterinarian', 'vet', 'become a vet', 'veterinary', 'animal doctor', 'vet school']] },
  { key: 'dentist',          terms: [['dentist', 'become a dentist', 'dental school', 'dentistry', 'dental career']] },
  { key: 'psychologist',     terms: [['psychologist', 'therapist', 'counselor', 'become a psychologist', 'counseling career', 'mental health professional', 'clinical psychologist']] },
  { key: 'ux-designer',      terms: [['ux designer', 'ui designer', 'ux/ui', 'graphic designer', 'become a designer', 'product designer', 'visual designer', 'design career']] },
  { key: 'filmmaker',        terms: [['filmmaker', 'film director', 'movie director', 'become a filmmaker', 'screenwriter', 'director', 'film career', 'make movies']] },
  { key: 'journalist',       terms: [['journalist', 'reporter', 'news anchor', 'become a journalist', 'journalism', 'media career', 'broadcasting career']] },
  { key: 'fashion-designer', terms: [['fashion designer', 'become a fashion designer', 'clothing designer', 'fashion design', 'stylist', 'fashion career']] },
  { key: 'interior-designer',terms: [['interior designer', 'become an interior designer', 'interior design', 'interior decorating', 'home design career']] },
  { key: 'data-scientist',   terms: [['data scientist', 'become a data scientist', 'data science', 'data analyst', 'machine learning', 'data career']] },
  { key: 'youtuber',         terms: [['youtuber', 'become a youtuber', 'content creator', 'youtube channel', 'youtube career', 'influencer', 'start a youtube channel']] },
  { key: 'police-officer',   terms: [['police officer', 'become a police officer', 'law enforcement', 'police career', 'cop', 'join the police']] },
  { key: 'fitness-trainer',  terms: [['personal trainer', 'fitness trainer', 'become a trainer', 'fitness coach', 'gym trainer', 'fitness career', 'personal training']] },
  { key: 'voice-actor',      terms: [['voice actor', 'become a voice actor', 'voice acting', 'dubbing', 'voice over', 'voiceover career']] },
  { key: 'astronaut',        terms: [['astronaut', 'become an astronaut', 'space career', 'nasa', 'space exploration', 'spaceship']] },
  { key: 'diplomat',         terms: [['diplomat', 'become a diplomat', 'diplomacy', 'foreign service', 'embassy career', 'international relations career']] },
  { key: 'ai-engineer',      terms: [['ai engineer', 'machine learning engineer', 'artificial intelligence career', 'ml engineer', 'ai researcher', 'deep learning engineer', 'ai career']] },
  { key: 'nurse',            terms: [['nurse', 'become a nurse', 'nursing career', 'nursing school', 'registered nurse', 'rn']] },
  { key: 'become-rich',      terms: [['become rich', 'get rich', 'financial freedom', 'financially free', 'become wealthy', 'wealth building', 'make a lot of money']] },
  { key: 'lose-weight',      terms: [['lose weight', 'get fit', 'get slim', 'weight loss', 'lose fat', 'get in shape', 'become fit', 'slim down']] },
  { key: 'run-marathon',     terms: [['run a marathon', 'marathon runner', 'complete a marathon', 'marathon training', 'run 42km']] },
  { key: 'open-cafe',        terms: [['open a cafe', 'open my own cafe', 'start a cafe', 'open a restaurant', 'start a restaurant', 'open a bakery', 'run a cafe']] },
  { key: 'learn-language',   terms: [['learn a language', 'become fluent', 'speak fluently', 'learn spanish', 'learn japanese', 'learn french', 'learn english', 'language learning', 'bilingual']] },
  { key: 'travel-europe',    terms: [['travel europe', 'backpack europe', 'europe trip', 'travel through europe', 'visit europe', 'european adventure']] },
  { key: 'buy-house',        terms: [['buy a house', 'own a home', 'buy my own home', 'purchase a house', 'homeowner', 'buy property', 'get a mortgage']] },
  { key: 'find-love',        terms: [['find love', 'find my soulmate', 'find a partner', 'meet someone special', 'find a girlfriend', 'find a boyfriend', 'find true love', 'get married']] },
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

import { matchGoldenPath } from './goldenPathMatch'

type SubMap = Record<string, string>

const SUBSTITUTIONS: Record<string, SubMap> = {
  'idol-singer': {
    'YOUR TARGET CAREER': 'idol singer',
    'YOUR STATUS': 'aspiring idol / trainee',
    'GOAL': 'vocal performance / stage presence / idol training',
    'EXAM': 'entertainment agency audition / vocal evaluation',
    'TYPE': 'idol audition / entertainment agency interview',
    'SPORT': 'dance and stage performance',
    'YOUR TOPIC': 'K-pop and idol music',
    'YOUR NICHE': 'idol music and K-pop content',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'stage fright / forgetting lyrics on stage / self-doubt as a performer / audition pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'entertainment agency / talent academy',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'entertainment agencies / talent academies / idol training programs',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'entertainment agency / talent agency',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional idol / K-pop artist',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'idol auditionee / aspiring K-pop artist',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'idol audition showcase / entertainment agency presentation',
  },
  'pro-gamer': {
    'YOUR TARGET CAREER': 'professional gamer',
    'YOUR STATUS': 'competitive player / aspiring pro',
    'GOAL': 'esports performance / reaction time / in-game mechanics',
    'EXAM': 'ranked qualifier / esports tournament',
    'TYPE': 'esports tryout / team interview',
    'SPORT': 'competitive gaming',
    'YOUR TOPIC': 'competitive gaming and esports',
    'YOUR NICHE': 'esports and gaming content',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'pre-match nerves / recovering from tilt / self-doubt in ranked / clutch-moment pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'esports team / gaming organization',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'esports teams / gaming organizations / esports academies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'esports team / gaming organization',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional gamer / esports athlete',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'esports tryout candidate / aspiring pro gamer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'esports team tryout / sponsorship pitch',
  },
  'startup-founder': {
    'YOUR TARGET CAREER': 'startup founder / entrepreneur',
    'YOUR STATUS': 'aspiring founder / early-stage entrepreneur',
    'GOAL': 'startup growth / product-market fit',
    'EXAM': 'investor pitch / demo day',
    'TYPE': 'investor interview / accelerator interview',
    'SPORT': 'entrepreneurship',
    'YOUR TOPIC': 'my startup and business',
    'YOUR NICHE': "my startup's target market",
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'pitch nerves / pivoting after failure / imposter syndrome / investor pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'startup accelerator / incubator',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'startup accelerators / incubators / angel investors',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'startup accelerator / incubator',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'successful startup founder / entrepreneur',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'startup founder applicant / aspiring entrepreneur',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'accelerator interview / investor pitch presentation',
  },
  'author': {
    'YOUR TARGET CAREER': 'author / novelist',
    'YOUR STATUS': 'aspiring writer / early-career author',
    'GOAL': 'publishing a novel / developing writing craft',
    'EXAM': 'writing contest / literary award / agent query',
    'TYPE': 'literary agent meeting / publisher pitch',
    'SPORT': 'writing discipline',
    'YOUR TOPIC': 'creative writing and storytelling',
    'YOUR NICHE': 'my genre and writing style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      "writer's block / handling rejection letters / imposter syndrome / deadline pressure",
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'literary agent / publisher / MFA program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'literary agents / publishers / MFA writing programs',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'literary agent / publisher',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'published author / novelist',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'aspiring author / publishing hopeful',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'literary agent query / book deal pitch',
  },
  'webtoon-artist': {
    'YOUR TARGET CAREER': 'webtoon artist',
    'YOUR STATUS': 'aspiring webtoon creator / early-career artist',
    'GOAL': 'webtoon series launch / platform serialization',
    'EXAM': 'webtoon platform contest / artist portfolio review',
    'TYPE': 'webtoon platform submission / artist review',
    'SPORT': 'illustration and visual storytelling',
    'YOUR TOPIC': 'webtoon creation and comics',
    'YOUR NICHE': 'my webtoon genre and art style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'creative block / inconsistent art style / self-doubt as an artist / episode deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'webtoon platform / publisher / art program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'webtoon platforms / comic publishers / art programs',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'webtoon platform / publisher',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional webtoon artist / comic creator',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'platform submission candidate / aspiring webtoon artist',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'platform submission / publisher pitch',
  },
  'actor': {
    'YOUR TARGET CAREER': 'actor',
    'YOUR STATUS': 'aspiring actor / drama student',
    'GOAL': 'acting career / film and TV roles',
    'EXAM': 'acting audition / drama school entrance exam',
    'TYPE': 'acting audition / drama school interview',
    'SPORT': 'physical and stage performance',
    'YOUR TOPIC': 'acting and performance',
    'YOUR NICHE': 'my acting style and specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'stage fright / forgetting lines on stage / confidence in auditions / on-set pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'drama school / acting conservatory',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'drama schools / acting conservatories / casting agencies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'drama school / acting conservatory',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional actor / performer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'acting school applicant / aspiring professional actor',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'acting audition / agent showcase presentation',
  },
  'travel-world': {
    'YOUR TARGET CAREER': 'travel content creator',
    'YOUR STATUS': 'aspiring traveler / early-stage travel creator',
    'GOAL': 'long-term world travel / travel content creation',
    'EXAM': 'travel certification / language proficiency test',
    'TYPE': 'brand partnership interview / travel media meeting',
    'SPORT': 'adventure travel / hiking / water activities',
    'YOUR TOPIC': 'world travel and exploration',
    'YOUR NICHE': 'travel content and destination coverage',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'travel anxiety / solo travel fears / culture shock / getting lost abroad',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'travel brand / tourism partnership',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'travel brands / tourism boards / travel media companies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'travel brand / sponsorship partner',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'travel content creator / travel blogger',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'travel content creator / aspiring travel blogger',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'brand collaboration pitch / travel sponsorship meeting',
  },
  'game-developer': {
    'YOUR TARGET CAREER': 'game developer',
    'YOUR STATUS': 'aspiring game developer / self-taught coder',
    'GOAL': 'game development skills / indie game release',
    'EXAM': 'developer portfolio review / coding assessment',
    'TYPE': 'game studio interview / developer portfolio review',
    'SPORT': 'game development and programming',
    'YOUR TOPIC': 'game development and design',
    'YOUR NICHE': 'my game genre and development style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'imposter syndrome / shipping anxiety / scope creep / launch fear',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'game studio / developer program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'game studios / developer programs / game jams',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'game studio / developer program',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional game developer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'game studio applicant / aspiring game developer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'game studio interview / portfolio presentation',
  },
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Generic placeholders that can be filled with the dream text for any dream
const GENERIC_PLACEHOLDERS = [
  'YOUR TOPIC',
  'YOUR NICHE',
  'YOUR TARGET CAREER',
  'YOUR GOAL',
  'YOUR FIELD',
  'YOUR SUBJECT',
  'SKILL/FIELD',
  'SKILL/SUBJECT',
  'SUBJECT/SKILL',
  'YOUR ROLE',
  'JOB TITLE / FIELD',
  'YOUR PROJECT NAME',
  'YOUR VENTURE',
]

/** Replaces dream-specific placeholders in a prompt template based on the user's dream. */
export function fillPrompt(promptText: string, dream: string): string {
  const key = matchGoldenPath(dream)

  let result = promptText

  // Apply golden-path-specific substitutions if available
  if (key) {
    const subs = SUBSTITUTIONS[key]
    if (subs) {
      for (const [pattern, value] of Object.entries(subs)) {
        const regex = new RegExp(`\\[${escapeRegExp(pattern)}(?::[^\\]]+)?\\]`, 'g')
        result = result.replace(regex, value)
      }
    }
    return result
  }

  // For non-golden-path dreams: fill generic placeholders with the dream text
  if (dream.trim()) {
    for (const placeholder of GENERIC_PLACEHOLDERS) {
      // Matches [PLACEHOLDER] or [PLACEHOLDER: anything inside]
      const regex = new RegExp(`\\[${escapeRegExp(placeholder)}(?::[^\\]]+)?\\]`, 'gi')
      result = result.replace(regex, dream.trim())
    }
  }

  return result
}

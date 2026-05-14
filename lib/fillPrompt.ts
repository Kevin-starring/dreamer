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
  'programmer': {
    'YOUR TARGET CAREER': 'software developer / programmer',
    'YOUR STATUS': 'coding beginner / self-taught developer',
    'GOAL': 'programming skills / software development',
    'EXAM': 'technical coding interview / coding assessment',
    'TYPE': 'technical interview / software engineering interview',
    'SPORT': 'programming and software development',
    'YOUR TOPIC': 'software development and coding',
    'YOUR NICHE': 'my programming specialty and tech stack',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'interview anxiety / debugging frustration / imposter syndrome / deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'coding bootcamp / CS degree program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'coding bootcamps / CS programs / tech companies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'coding bootcamp / tech company',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'software developer / programmer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'developer job applicant / bootcamp candidate',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'technical interview / coding challenge presentation',
  },
  'chef': {
    'YOUR TARGET CAREER': 'professional chef',
    'YOUR STATUS': 'aspiring chef / culinary student',
    'GOAL': 'culinary skills / professional kitchen mastery',
    'EXAM': 'culinary certification exam / chef assessment',
    'TYPE': 'culinary school interview / kitchen trial',
    'SPORT': 'culinary arts and cooking',
    'YOUR TOPIC': 'culinary arts and professional cooking',
    'YOUR NICHE': 'my cuisine specialty and cooking style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'kitchen pressure / dish failures / imposter syndrome / service rush anxiety',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'culinary school / cooking program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'culinary schools / cooking programs / restaurants',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'culinary school / restaurant',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional chef',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'culinary school applicant / aspiring chef',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'culinary school interview / kitchen trial',
  },
  'pilot': {
    'YOUR TARGET CAREER': 'airline pilot',
    'YOUR STATUS': 'aspiring pilot / flight student',
    'GOAL': 'flight skills / aviation certification',
    'EXAM': 'FAA written exam / flight checkride',
    'TYPE': 'airline interview / flight academy interview',
    'SPORT': 'aviation and flight',
    'YOUR TOPIC': 'aviation and pilot training',
    'YOUR NICHE': 'my aviation specialty and flight type',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'pre-flight anxiety / recovering from flight errors / self-doubt in training / checkride pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'flight school / aviation academy',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'flight schools / aviation academies / airlines',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'flight school / airline',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'airline pilot',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'airline applicant / flight school candidate',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'airline interview / flight academy interview',
  },
  'photographer': {
    'YOUR TARGET CAREER': 'professional photographer',
    'YOUR STATUS': 'aspiring photographer / photography hobbyist',
    'GOAL': 'photography skills / professional photography career',
    'EXAM': 'photography portfolio review / client pitch',
    'TYPE': 'photography client meeting / agency interview',
    'SPORT': 'photography and visual arts',
    'YOUR TOPIC': 'photography and visual storytelling',
    'YOUR NICHE': 'my photography specialty and style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'shoot anxiety / bad photo sessions / creative self-doubt / client deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'photography school / arts program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'photography schools / arts programs / agencies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'photography school / agency',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional photographer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'photography client prospect / aspiring professional photographer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'photography portfolio review / client pitch',
  },
  'musician': {
    'YOUR TARGET CAREER': 'professional musician',
    'YOUR STATUS': 'aspiring musician / independent artist',
    'GOAL': 'music skills / professional music career',
    'EXAM': 'music audition / record label showcase',
    'TYPE': 'music audition / label meeting',
    'SPORT': 'music performance and production',
    'YOUR TOPIC': 'music and performance',
    'YOUR NICHE': 'my music genre and style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'stage fright / performance mistakes / creative self-doubt / recording pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'music school / conservatory',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'music schools / conservatories / record labels',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'music school / record label',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional musician',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'label showcase candidate / aspiring professional musician',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'music audition / label showcase presentation',
  },
  'dancer': {
    'YOUR TARGET CAREER': 'professional dancer',
    'YOUR STATUS': 'aspiring dancer / dance student',
    'GOAL': 'dance skills / professional performance career',
    'EXAM': 'dance audition / company tryout',
    'TYPE': 'dance audition / company interview',
    'SPORT': 'dance performance and training',
    'YOUR TOPIC': 'dance and performance',
    'YOUR NICHE': 'my dance style and specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'audition nerves / performance mistakes / self-doubt about technique / competition pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'dance conservatory / performing arts school',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'dance conservatories / performing arts schools / dance companies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'dance conservatory / dance company',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional dancer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'dance company auditionee / aspiring professional dancer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'dance audition / company tryout',
  },
  'teacher': {
    'YOUR TARGET CAREER': 'teacher / educator',
    'YOUR STATUS': 'aspiring teacher / education student',
    'GOAL': 'teaching skills / educator certification',
    'EXAM': 'teaching certification exam / Praxis exam',
    'TYPE': 'school interview / teaching demo',
    'SPORT': 'education and teaching',
    'YOUR TOPIC': 'education and teaching',
    'YOUR NICHE': 'my subject area and grade level',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'classroom anxiety / lesson plan failures / self-doubt as an educator / parent pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'education program / teacher training',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'education programs / teacher training programs / schools',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'education program / school district',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'teacher / educator',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'teaching credential candidate / aspiring teacher',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'school interview / teaching demonstration',
  },
  'architect': {
    'YOUR TARGET CAREER': 'architect',
    'YOUR STATUS': 'aspiring architect / architecture student',
    'GOAL': 'design skills / architecture licensure',
    'EXAM': 'ARE architecture exam / design portfolio review',
    'TYPE': 'architecture firm interview / portfolio review',
    'SPORT': 'architecture and design',
    'YOUR TOPIC': 'architecture and design',
    'YOUR NICHE': 'my architecture specialty and design style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'design critique anxiety / project failures / creative self-doubt / client deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'architecture school / design program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'architecture schools / design programs / firms',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'architecture school / firm',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'licensed architect',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'architecture firm applicant / aspiring architect',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'architecture firm interview / portfolio presentation',
  },
  'veterinarian': {
    'YOUR TARGET CAREER': 'veterinarian',
    'YOUR STATUS': 'aspiring vet / pre-vet student',
    'GOAL': 'veterinary skills / vet school admission',
    'EXAM': 'GRE / vet school entrance exam',
    'TYPE': 'vet school interview / clinical interview',
    'SPORT': 'veterinary medicine and animal care',
    'YOUR TOPIC': 'veterinary medicine and animal health',
    'YOUR NICHE': 'my veterinary specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'clinical anxiety / patient loss / self-doubt in vet school / exam pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'vet school / veterinary program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'vet schools / veterinary programs / animal hospitals',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'vet school / animal hospital',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'veterinarian',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'vet school applicant / aspiring veterinarian',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'vet school interview / clinical placement interview',
  },
  'dentist': {
    'YOUR TARGET CAREER': 'dentist',
    'YOUR STATUS': 'aspiring dentist / pre-dental student',
    'GOAL': 'dental skills / dental school admission',
    'EXAM': 'DAT exam / dental board exam',
    'TYPE': 'dental school interview / clinical interview',
    'SPORT': 'dentistry and oral health',
    'YOUR TOPIC': 'dentistry and oral healthcare',
    'YOUR NICHE': 'my dental specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'clinical anxiety / procedure mistakes / self-doubt in dental school / board exam pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'dental school / dental program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'dental schools / dental programs / dental practices',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'dental school / dental practice',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'dentist',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'dental school applicant / aspiring dentist',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'dental school interview / residency interview',
  },
  'psychologist': {
    'YOUR TARGET CAREER': 'psychologist / therapist',
    'YOUR STATUS': 'aspiring psychologist / psychology student',
    'GOAL': 'psychology skills / clinical licensure',
    'EXAM': 'EPPP licensure exam / graduate school entrance exam',
    'TYPE': 'graduate school interview / clinical internship interview',
    'SPORT': 'psychology and mental health',
    'YOUR TOPIC': 'psychology and mental health',
    'YOUR NICHE': 'my psychology specialty and therapeutic approach',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'clinical anxiety / session mistakes / imposter syndrome / licensing exam pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'psychology grad school / clinical program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'psychology grad schools / clinical programs / mental health agencies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'psychology grad school / clinic',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'licensed psychologist',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'grad school applicant / aspiring psychologist',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'grad school interview / clinical internship interview',
  },
  'ux-designer': {
    'YOUR TARGET CAREER': 'UX/UI designer',
    'YOUR STATUS': 'aspiring designer / design student',
    'GOAL': 'UX design skills / design career launch',
    'EXAM': 'design portfolio review / design challenge',
    'TYPE': 'design interview / portfolio review',
    'SPORT': 'UX/UI design and user research',
    'YOUR TOPIC': 'UX/UI design and product design',
    'YOUR NICHE': 'my design specialty and design style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'design critique anxiety / rejected designs / imposter syndrome / product launch pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'UX bootcamp / design program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'UX bootcamps / design programs / tech companies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'UX bootcamp / design agency',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'UX/UI designer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'design job applicant / aspiring UX designer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'design portfolio review / design challenge presentation',
  },
  'filmmaker': {
    'YOUR TARGET CAREER': 'filmmaker / film director',
    'YOUR STATUS': 'aspiring filmmaker / indie director',
    'GOAL': 'filmmaking skills / film production',
    'EXAM': 'film festival submission / film school portfolio',
    'TYPE': 'film school interview / studio pitch',
    'SPORT': 'filmmaking and visual storytelling',
    'YOUR TOPIC': 'filmmaking and cinema',
    'YOUR NICHE': 'my film genre and directorial style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'set anxiety / project failures / creative self-doubt / festival rejection',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'film school / filmmaking program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'film schools / filmmaking programs / studios',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'film school / production company',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional filmmaker',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'film school applicant / aspiring filmmaker',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'film school interview / studio pitch',
  },
  'journalist': {
    'YOUR TARGET CAREER': 'journalist / reporter',
    'YOUR STATUS': 'aspiring journalist / journalism student',
    'GOAL': 'journalism skills / reporting career',
    'EXAM': 'journalism school entrance / writing portfolio review',
    'TYPE': 'newsroom interview / editorial interview',
    'SPORT': 'journalism and news reporting',
    'YOUR TOPIC': 'journalism and news writing',
    'YOUR NICHE': 'my journalism beat and specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'deadline pressure / story rejections / source anxiety / publication self-doubt',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'journalism school / media program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'journalism schools / media programs / newsrooms',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'journalism school / newsroom',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'journalist / reporter',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'newsroom applicant / aspiring journalist',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'newsroom interview / editorial pitch',
  },
  'fashion-designer': {
    'YOUR TARGET CAREER': 'fashion designer',
    'YOUR STATUS': 'aspiring fashion designer / design student',
    'GOAL': 'fashion design skills / collection launch',
    'EXAM': 'design portfolio review / fashion school entrance',
    'TYPE': 'fashion house interview / design portfolio review',
    'SPORT': 'fashion design and creative direction',
    'YOUR TOPIC': 'fashion design and style',
    'YOUR NICHE': 'my fashion specialty and aesthetic',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'collection launch anxiety / design rejections / creative self-doubt / fashion week pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'fashion school / design program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'fashion schools / design programs / fashion houses',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'fashion school / fashion house',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional fashion designer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'fashion house applicant / aspiring fashion designer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'fashion house interview / collection presentation',
  },
  'interior-designer': {
    'YOUR TARGET CAREER': 'interior designer',
    'YOUR STATUS': 'aspiring interior designer / design student',
    'GOAL': 'interior design skills / design business launch',
    'EXAM': 'NCIDQ design exam / design portfolio review',
    'TYPE': 'design firm interview / client presentation',
    'SPORT': 'interior design and space planning',
    'YOUR TOPIC': 'interior design and home aesthetics',
    'YOUR NICHE': 'my interior design style and specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'client presentation anxiety / design rejections / creative self-doubt / project deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'interior design school / design program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'interior design schools / design programs / design firms',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'interior design school / design firm',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'interior designer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'design firm applicant / aspiring interior designer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'design firm interview / client presentation',
  },
  'data-scientist': {
    'YOUR TARGET CAREER': 'data scientist',
    'YOUR STATUS': 'aspiring data scientist / data analyst',
    'GOAL': 'data science skills / ML expertise',
    'EXAM': 'data science interview / technical assessment',
    'TYPE': 'data science interview / technical interview',
    'SPORT': 'data science and machine learning',
    'YOUR TOPIC': 'data science and machine learning',
    'YOUR NICHE': 'my data science specialty and industry',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'technical interview anxiety / model failures / imposter syndrome / project deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'data science bootcamp / graduate program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'data science bootcamps / graduate programs / tech companies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'data science bootcamp / tech company',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'data scientist',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'data science job applicant / aspiring data scientist',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'data science interview / technical project presentation',
  },
  'youtuber': {
    'YOUR TARGET CAREER': 'YouTuber / content creator',
    'YOUR STATUS': 'aspiring YouTuber / new content creator',
    'GOAL': 'YouTube growth / content creation career',
    'EXAM': 'YouTube monetization review / brand partnership pitch',
    'TYPE': 'brand collaboration meeting / creator interview',
    'SPORT': 'content creation and YouTube',
    'YOUR TOPIC': 'YouTube content creation',
    'YOUR NICHE': 'my YouTube niche and content style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'camera anxiety / low view counts / creator self-doubt / upload schedule pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'creator program / YouTube accelerator',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'creator programs / brand partnerships / MCN networks',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'creator program / brand',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional YouTuber / content creator',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'brand partnership applicant / aspiring YouTuber',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'brand collaboration pitch / creator showcase',
  },
  'police-officer': {
    'YOUR TARGET CAREER': 'police officer',
    'YOUR STATUS': 'aspiring police officer / law enforcement candidate',
    'GOAL': 'law enforcement career / police academy graduation',
    'EXAM': 'police written exam / physical fitness test',
    'TYPE': 'police department interview / background interview',
    'SPORT': 'physical fitness and law enforcement training',
    'YOUR TOPIC': 'law enforcement and public safety',
    'YOUR NICHE': 'my law enforcement specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'academy pressure / test anxiety / self-doubt during training / high-stakes situation pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'police academy / law enforcement program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'police academies / law enforcement programs / police departments',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'police academy / police department',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'police officer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'police department applicant / academy candidate',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'police department interview / oral board examination',
  },
  'fitness-trainer': {
    'YOUR TARGET CAREER': 'personal trainer / fitness coach',
    'YOUR STATUS': 'aspiring personal trainer / fitness enthusiast',
    'GOAL': 'fitness coaching skills / personal training certification',
    'EXAM': 'personal training certification exam / fitness assessment',
    'TYPE': 'gym interview / client consultation',
    'SPORT': 'fitness training and exercise science',
    'YOUR TOPIC': 'personal training and fitness coaching',
    'YOUR NICHE': 'my fitness specialty and training style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'client progress anxiety / training program failures / imposter syndrome / certification exam pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'personal training certification / fitness program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'certification programs / fitness academies / gyms',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'certification program / gym',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'certified personal trainer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'gym applicant / aspiring personal trainer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'gym interview / client consultation presentation',
  },
  'voice-actor': {
    'YOUR TARGET CAREER': 'voice actor',
    'YOUR STATUS': 'aspiring voice actor / beginner voice talent',
    'GOAL': 'voice acting skills / demo reel creation',
    'EXAM': 'voice acting audition / demo review',
    'TYPE': 'casting director audition / agent meeting',
    'SPORT': 'voice performance and acting',
    'YOUR TOPIC': 'voice acting and audio performance',
    'YOUR NICHE': 'my voice acting specialty and style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'audition anxiety / bad takes / self-doubt about voice quality / studio recording pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'voice acting program / audio school',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'voice acting programs / audio schools / casting agencies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'voice acting program / agency',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'professional voice actor',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'casting auditionee / aspiring voice actor',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'voice acting audition / demo reel presentation',
  },
  'astronaut': {
    'YOUR TARGET CAREER': 'astronaut',
    'YOUR STATUS': 'aspiring astronaut / STEM professional',
    'GOAL': 'space career / astronaut selection',
    'EXAM': 'NASA astronaut selection test / STEM qualification',
    'TYPE': 'NASA interview / space agency selection',
    'SPORT': 'physical fitness and space training',
    'YOUR TOPIC': 'space exploration and astronautics',
    'YOUR NICHE': 'my STEM specialty for space',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'mission pressure / technical failures / self-doubt in a competitive field / high-stakes training',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'NASA program / astronaut training',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'NASA programs / space agencies / astronaut training programs',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'NASA / space agency',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'astronaut',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'NASA applicant / aspiring astronaut',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'NASA astronaut selection interview / mission briefing',
  },
  'diplomat': {
    'YOUR TARGET CAREER': 'diplomat / foreign service officer',
    'YOUR STATUS': 'aspiring diplomat / international relations student',
    'GOAL': 'diplomacy skills / foreign service career',
    'EXAM': 'Foreign Service Officer Test (FSOT) / diplomatic exam',
    'TYPE': 'foreign service oral assessment / embassy interview',
    'SPORT': 'diplomacy and international relations',
    'YOUR TOPIC': 'diplomacy and international affairs',
    'YOUR NICHE': 'my diplomatic specialty and regional focus',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'high-stakes negotiation anxiety / failed diplomacy / self-doubt in competitive field / assessment pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'foreign service program / international relations school',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'foreign service programs / international schools / embassies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'foreign service program / embassy',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'diplomat / foreign service officer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'foreign service applicant / aspiring diplomat',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'foreign service oral assessment / embassy interview',
  },
  'ai-engineer': {
    'YOUR TARGET CAREER': 'AI engineer / machine learning engineer',
    'YOUR STATUS': 'aspiring AI engineer / ML practitioner',
    'GOAL': 'AI/ML engineering skills / AI career launch',
    'EXAM': 'ML technical interview / AI coding assessment',
    'TYPE': 'AI company interview / technical interview',
    'SPORT': 'AI engineering and machine learning',
    'YOUR TOPIC': 'artificial intelligence and machine learning',
    'YOUR NICHE': 'my AI specialty and ML domain',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'technical interview anxiety / model failures / imposter syndrome / AI research deadline pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'AI bootcamp / ML graduate program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'AI bootcamps / ML programs / AI companies',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'AI bootcamp / AI company',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'AI engineer / ML engineer',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'AI job applicant / aspiring ML engineer',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'AI company interview / ML project presentation',
  },
  'nurse': {
    'YOUR TARGET CAREER': 'registered nurse',
    'YOUR STATUS': 'aspiring nurse / nursing student',
    'GOAL': 'nursing skills / RN licensure',
    'EXAM': 'NCLEX-RN exam / nursing boards',
    'TYPE': 'nursing school interview / hospital interview',
    'SPORT': 'nursing and healthcare',
    'YOUR TOPIC': 'nursing and patient care',
    'YOUR NICHE': 'my nursing specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'clinical anxiety / patient emergencies / imposter syndrome / board exam pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'nursing school / BSN program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'nursing schools / BSN programs / hospitals',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'nursing school / hospital',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'registered nurse',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'nursing school applicant / aspiring nurse',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'nursing school interview / hospital hiring interview',
  },
  'become-rich': {
    'YOUR TARGET CAREER': 'financially free / wealth builder',
    'YOUR STATUS': 'aspiring investor / income builder',
    'GOAL': 'financial freedom / wealth building',
    'EXAM': 'financial certification / investment assessment',
    'TYPE': 'investor meeting / financial planning session',
    'SPORT': 'financial discipline and wealth building',
    'YOUR TOPIC': 'personal finance and wealth building',
    'YOUR NICHE': 'my income stream and investment strategy',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'investment anxiety / financial losses / money mindset blocks / market pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'finance course / investment program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'finance courses / investment programs / financial advisors',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'finance program / investment firm',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'financially independent / wealthy investor',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'aspiring investor / financial freedom seeker',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'investor pitch / financial advisor meeting',
  },
  'lose-weight': {
    'YOUR TARGET CAREER': 'fit and healthy person',
    'YOUR STATUS': 'aspiring fitness achiever / weight loss beginner',
    'GOAL': 'weight loss / physical fitness',
    'EXAM': 'fitness assessment / body composition check',
    'TYPE': 'health check / fitness assessment',
    'SPORT': 'fitness and weight training',
    'YOUR TOPIC': 'fitness and weight loss',
    'YOUR NICHE': 'my fitness style and weight loss approach',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'plateau frustration / missed workouts / body image self-doubt / social eating pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'fitness program / weight loss program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'fitness programs / weight loss programs / gyms',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'fitness program / gym',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'fit and healthy person',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'fitness program participant / weight loss journey starter',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'fitness assessment / progress check-in',
  },
  'run-marathon': {
    'YOUR TARGET CAREER': 'marathon runner',
    'YOUR STATUS': 'aspiring marathon runner / recreational runner',
    'GOAL': 'marathon completion / running fitness',
    'EXAM': 'marathon race / qualifying event',
    'TYPE': 'race registration / training assessment',
    'SPORT': 'marathon running and endurance training',
    'YOUR TOPIC': 'marathon training and running',
    'YOUR NICHE': 'my marathon goal and training approach',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'race day nerves / bad training runs / self-doubt about distance / injury pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'marathon training program / running club',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'marathon training programs / running clubs / races',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'marathon training program / race',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'marathon finisher',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'marathon training participant / aspiring marathon runner',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'race start / marathon finish line',
  },
  'open-cafe': {
    'YOUR TARGET CAREER': 'café owner / entrepreneur',
    'YOUR STATUS': 'aspiring café owner / food business hopeful',
    'GOAL': 'café launch / food business success',
    'EXAM': 'food safety certification / business license',
    'TYPE': 'investor meeting / bank loan interview',
    'SPORT': 'food business and hospitality',
    'YOUR TOPIC': 'café business and coffee culture',
    'YOUR NICHE': 'my café concept and specialty',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'launch anxiety / slow days / self-doubt about the business / investor rejection',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'food business program / hospitality school',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'food business programs / hospitality schools / investors',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'food business program / bank',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'successful café owner',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'business loan applicant / aspiring café owner',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'investor pitch / bank loan meeting',
  },
  'learn-language': {
    'YOUR TARGET CAREER': 'fluent language speaker',
    'YOUR STATUS': 'aspiring language learner / beginner speaker',
    'GOAL': 'language fluency / conversational mastery',
    'EXAM': 'language proficiency exam / JLPT / DELF / DELE',
    'TYPE': 'language proficiency test / fluency assessment',
    'SPORT': 'language learning and practice',
    'YOUR TOPIC': 'language learning and linguistics',
    'YOUR NICHE': 'my target language and learning style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'speaking anxiety / grammar mistakes / plateau frustration / native speaker intimidation',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'language school / immersion program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'language schools / immersion programs / language exchanges',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'language school / immersion program',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'fluent language speaker',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'language program participant / aspiring fluent speaker',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'language proficiency exam / fluency assessment',
  },
  'travel-europe': {
    'YOUR TARGET CAREER': 'world traveler / travel content creator',
    'YOUR STATUS': 'aspiring backpacker / travel planner',
    'GOAL': 'European backpacking trip / travel adventure',
    'EXAM': 'travel budget assessment / visa application',
    'TYPE': 'travel brand meeting / visa interview',
    'SPORT': 'travel and adventure',
    'YOUR TOPIC': 'European travel and backpacking',
    'YOUR NICHE': 'my travel style and European destinations',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'solo travel anxiety / getting lost abroad / culture shock / budget running low',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'travel program / study abroad program',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'travel programs / study abroad programs / travel brands',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'travel brand / tourism board',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'experienced backpacker / travel creator',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'travel brand applicant / aspiring travel creator',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'brand sponsorship pitch / travel content presentation',
  },
  'buy-house': {
    'YOUR TARGET CAREER': 'homeowner',
    'YOUR STATUS': 'aspiring homeowner / first-time buyer',
    'GOAL': 'home purchase / real estate ownership',
    'EXAM': 'mortgage pre-approval / credit assessment',
    'TYPE': 'bank loan interview / realtor meeting',
    'SPORT': 'financial planning and real estate',
    'YOUR TOPIC': 'home buying and real estate',
    'YOUR NICHE': 'my home preferences and target neighborhood',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'offer rejection anxiety / bidding war stress / financial self-doubt / closing pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'mortgage program / homebuyer education',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'mortgage programs / homebuyer courses / real estate agents',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'mortgage program / bank',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'homeowner',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'mortgage applicant / aspiring homeowner',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'bank mortgage interview / home offer presentation',
  },
  'find-love': {
    'YOUR TARGET CAREER': 'person in a fulfilling relationship',
    'YOUR STATUS': 'single person seeking connection / self-improvement journey',
    'GOAL': 'finding a life partner / meaningful relationship',
    'EXAM': 'dating profile review / relationship readiness',
    'TYPE': 'first date / social event',
    'SPORT': 'dating and social skills',
    'YOUR TOPIC': 'relationships and personal connection',
    'YOUR NICHE': 'my personality and relationship style',
    'NERVES BEFORE GAMES / RECOVERING FROM MISTAKES / SELF-DOUBT / PRESSURE SITUATIONS':
      'dating anxiety / rejection / self-doubt about attractiveness / social pressure',
    'MEDICAL SCHOOL / LAW SCHOOL / PROGRAM NAME': 'dating coaching program / social skills workshop',
    'MEDICAL SCHOOLS / LAW SCHOOLS / PhD PROGRAMS / FIRE DEPARTMENTS':
      'dating apps / social events / relationship coaching programs',
    'MEDICAL SCHOOL / LAW SCHOOL / FIREFIGHTER DEPARTMENT': 'dating app / social community',
    'DOCTOR / LAWYER / PROFESSIONAL ATHLETE / FIREFIGHTER / SCIENTIST': 'person in a loving partnership',
    'MEDICAL SCHOOL APPLICANT / LAW SCHOOL APPLICANT / FIREFIGHTER CANDIDATE / RESEARCH SCIENTIST':
      'dating app user / socially active single person',
    'RESIDENCY INTERVIEW / FELLOWSHIP APPLICATION / ACADEMIC JOB TALK / RESEARCH FUNDING PITCH':
      'first date / relationship milestone conversation',
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

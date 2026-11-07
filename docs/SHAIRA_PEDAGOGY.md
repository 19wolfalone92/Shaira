# SHAIRA — Russian from zero to B2: teacher's syllabus

## Learner and teaching philosophy
Shaira is a beginner who reads English and/or Filipino/Tagalog. The app is an **adult-friendly** companion for an iPhone, inspired by the separate English_Child application's structured, beginner-first route. Do not assume that she can already read Russian or type Cyrillic. No mandatory payment, advertisements, account or paid AI APIs. Every learning explanation and curated translation is bilingual EN/Filipino.

**The route labels Pre-A1 through B2 describe content targets, NOT an achieved or officially tested CEFR level.** Even completing every exercise cannot prove B2: independent testing must check spontaneous conversation, authentic reading, listening and extended writing.

### Instructional loop — concrete steps
1. **See and identify:** uppercase / lowercase Cyrillic; distinguish visually deceptive letters В, Н, Р, С, У.
2. **Listen:** hear models, syllables, words, sentence rhythm and stress. Synthetic browser voices are optional, may be unavailable offline or sound imperfect, and are not native audio recordings.
3. **Repeat aloud:** shadow a model slowly then at ordinary speed. The app currently lets the learner self-mark practice; it **does not assess pronunciation**.
4. **Read:** blend sounds into syllables; read known words, short sentences, dialogues, then complex texts.
5. **Retrieve:** practise words with progressively expanding intervals. Wrong answers return sooner. Study is not enough; recall matters.
6. **Write:** copy letters (both cases), words and full sentences by touch; enter accurately spelled Russian sentences with the Cyrillic keyboard; write freely in a private journal.
7. **Use grammar in context:** connect cases, agreement, verb aspect, motion, complex sentences and discourse markers to concrete communicative tasks.
8. **Transfer:** repeat with people in real life; speak with a competent Russian speaker; have longer texts reviewed by a teacher or language partner.

## Actual implemented content (initial release)
- 33 Russian letters exposed in the previous alphabet module + handwriting canvas with words and sentences.
- 20 × 6 = **120 beginner picture words**, sourced from the owner's English_Child educational sets, with Russian targets and EN/Filipino explanations.
- 32 **teacher-authored thematic units** across 5 levels, containing six words, a contextual rule, an example, a text and comprehension question, a Russian sentence typing task, a free-writing prompt and a model response.
- 7 activity types per unit: vocabulary, listen/choose, grammar/phrase matching, reading comprehension, sentence writing, speaking shadowing, open writing journal.
- 20 additional EN/Filipino-supported **Russian dialogues** (greetings through B2 argument).
- 120 + (32 × 6) = **312 learning word records**; some words intentionally repeat in context, so distinct lexical item count is lower than 312.
- 224 unit activity slots + 20 beginner themes + 20 dialogues = **264 activity slots**. Some slots are self-reported practice (not scored).
- Review intervals: 1, 3, 7, 14, 30 days when eligible; wrong answers scheduled immediately; early review must not postpone an actual due date.
- Free-writing drafts only saved locally on this device; automatic essay evaluation is NOT implemented.
- Listening tasks are only marked as listening if the browser exposes speech synthesis. Speech quality and voice availability are not independently tested yet.

## Path to real competence: content map and assessment
| Stage | Skills and focus | Example output task | Independent human assessment |
|---|---|---|---|
| **Pre-A1** | Cyrillic, sound-symbol relations, greetings, family, 1–10, household words | Introduce yourself in 2–3 memorised phrases; copy words | Distinguish letters/sounds with unfamiliar examples |
| **A1** | Personal pronouns, noun gender, present conjugations, basic accusative and prepositional, questions | Tell about family, home and routine | Understand unscripted simple questions, write original paragraphs |
| **A2** | Past/future, dative/instrumental/genitive, transport, directions, quantities and plans | Tell an event in 6–10 connected sentences | Read a short novel text, talk about plans without rehearsed script |
| **B1** | Aspect, directionality of motion verbs, conditionals, reported speech, opinion and narration | Explain personal experience and justify a decision | Support extended informal dialogue and independently written texts |
| **B2** | Relative clauses, participles, adverbial participles, register, critical reading, argument, cohesive essays | Respond to a nuanced text; 180–250-word position essay | Understand normal-speed authentic speech, evaluate unfamiliar texts, discuss pros/cons and produce structured writing |

### Critical remaining work before any credible claim of "full B2"
1. **Scale and variety:** curated thousands of lexical items, multiple natural examples per item, diverse authentic B1/B2 texts, graded books and news-style excerpts (permission-cleared).
2. **Reliable speech/audio:** native Russian recordings with proper stress, reduction and sentence prosody; accessible subtitles and offline delivery where possible.
3. **More grammar coverage:** complete six case paradigms, alternations, animacy, verb conjugation exceptions, aspectual pairs, prefixed motion verbs, participle forms, advanced word order and text cohesion with many independent tasks each.
4. **Comprehension depth:** passage-level inference, open response, long-form listening, paraphrase and synthesis; quizzes should not be solvable by simple keyword spotting.
5. **Writing assessment:** handwriting tracing with stroke order guides and human review; spelling, dictated texts, paragraph cohesion, genre and style, revisions and teacher scoring rubrics for essays.
6. **Speech assessment:** user-initiated microphone with informed consent or human speaking checks. Web speech recognition varies by browser and may require a network service.
7. **Benchmarking:** independently reviewed task bank for each CEFR level and real evaluations (four skills), not just activity completion.

## Writing progression (especially important)
| Stage | Mechanically checkable | Human-reviewed / self-checked |
|---|---|---|
| Starter | Alphabet case, Cyrillic spelling of known words | Upper/lowercase letter forms and Cyrillic handwriting |
| A1 | Copy and type sentences; basic words in context | 30–60-word self-introduction |
| A2 | Case endings in prompted sentences | 80–120-word description or informal letter |
| B1 | Aspect and sequence in short controlled prompts | 120–180-word personal narrative or opinion |
| B2 | Targeted constructions and register choices | 180–250-word argument with thesis, reasons, counterargument and revision |

The handwriting canvas is deliberately described as **freehand drawing, not handwriting recognition**. Long-form journal text is not automatically graded; a saved draft does not imply correctness.

## Recommended weekly rhythm for an adult beginner
- **5 sessions/week**, 15–30 minutes as convenient, initially short if learning Cyrillic is hard. Start by practising only 3–6 new words.
- **Daily whenever due:** spaced review; if no words are due, practice is optional and should not advance the SRS schedule.
- **2–3 sessions/week:** read aloud, imitate rhythm, say answers spontaneously.
- **2 sessions/week:** write a few new Russian sentences; gradually increase to paragraphs and essays.
- **Weekly:** independent check of comprehension and communication with a person, not memorised app content.
- No compulsory streaks, punishment for errors, artificial promises of level certification or high-pressure timers.

## Architecture / future Work handoff
- \`assets/academy-data.js\` contains 5 level records and 32 expanded units.
- \`assets/first-words.js\` contains 20 themed picture-word packages.
- \`assets/dialogues.js\` contains 20 role-play conversations.
- \`assets/academy-ui.js\` renders course map, activity flows, quizzes, spaced retrieval, speaking prompts and writing journal.
- \`assets/app.js\` remains the foundation for standalone beginner lessons, language switch and handwriting canvas.
- \`assets/academy.css\` contains new responsive layouts.
- \`tests/academy.test.mjs\` validates content integrity, screens, local progress and route flows.
- \`sw.js\` must include every module under a new cache version for offline correctness.
- No external endpoints, logins or secret keys. Content is stored only in browser localStorage; users should export important drafts manually if device changes.

## Acceptance checklist for the next release
- Try all routes in EN and Filipino and complete one exercise for each of seven unit modes, beginner theme and dialogue.
- Confirm correct quiz passes and wrong answers do not mark completion.
- Confirm SRS due dates change only after eligible, actually graded attempts.
- Type Cyrillic via both phone's Russian keyboard and built-in keyboard; confirm ё, ь and ъ.
- With audio disabled, ensure no false claim of listening assessment.
- On a real iPhone Safari, test canvas touch and scroll locking, small screen layout, voice playback, service-worker offline launch and safe-area padding.
- Accessibility: VoiceOver reading, focus, contrast, 200% zoom, reduced motion.
- Confirm EN/Filipino translations and Russian examples with qualified native speakers before broader distribution.

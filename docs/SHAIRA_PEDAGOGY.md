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

## Implemented programme — expanded adult edition (2026-11-07)
- 33 Russian letters exposed in the previous alphabet module + handwriting canvas with words and sentences.
- 40 × 6 = **240 themed vocabulary cards**: 120 early word-picture cards plus 120 additional adult-life vocabulary cards with Russian/English/Filipino translations.
- 32 **teacher-authored thematic units** across 5 levels, containing six words, a contextual rule, an example, a text and comprehension question, a Russian sentence typing task, a free-writing prompt and a model response.
- 7 activity types per unit: vocabulary, listen/choose, grammar/phrase matching, reading comprehension, sentence writing, speaking shadowing, open writing journal.
- 20 additional EN/Filipino-supported **Russian dialogues** (greetings through B2 argument).
- 240 + (32 × 6) = **432 learning word records**. Repeated words appear in contexts; this is not a count of unique lexical lemmas.
- 224 unit activity slots + 40 beginner/adult vocabulary themes + 20 dialogues = **284 academy activity slots**; added 100 independent grammar questions, 20 graded readings (40 comprehension checks), and 30 structured writing assignments. Some unit slots are self-reported practice (not assessed).
- Review intervals: 1, 3, 7, 14, 30 days when eligible; wrong answers scheduled immediately; early review must not postpone an actual due date.
- Writing portfolio drafts are saved locally with word-count, punctuation and paragraph/connective checks. Those checks do NOT assess spelling, grammar, coherence or substantive quality.
- Listening tasks are only marked as listening if the browser exposes speech synthesis. Speech quality and voice availability are not independently tested yet. Synthetic voice audio is not a substitute for independently verified native Russian recordings.

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
- No external endpoints, logins or secret keys. Content is stored only in browser localStorage; the user may export a private JSON progress and draft backup in Settings and restore it on another device.

## Acceptance checklist for the next release
- Try all routes in EN and Filipino and complete one exercise for each of seven unit modes, beginner theme and dialogue.
- Confirm correct quiz passes and wrong answers do not mark completion.
- Confirm SRS due dates change only after eligible, actually graded attempts.
- Type Cyrillic via both phone's Russian keyboard and built-in keyboard; confirm ё, ь and ъ.
- With audio disabled, ensure no false claim of listening assessment.
- On a real iPhone Safari, test canvas touch and scroll locking, small screen layout, voice playback, service-worker offline launch and safe-area padding.
- Accessibility: VoiceOver reading, focus, contrast, 200% zoom, reduced motion.
- Confirm EN/Filipino translations and Russian examples with qualified native speakers before broader distribution.


## Added adult independent practice

The **Grammar Trainer** offers 20 independently authored contextual four-choice questions for each of five course stages. It reports a 10-question session score, remembers per-item results, provides English and Filipino rule explanations, and deliberately does not equate a score with CEFR proficiency. **Graded Reading** adds four original texts per stage (20 texts in total), each with questions, a reading guide, selected vocabulary and a free-writing task. B2 texts use longer, nuanced arguments rather than beginner phrase lists.

The **Writing Portfolio** contains six original assignments per stage (30 in total), with an adult situation, a Russian model opening, a recommended length and a self-edit reminder. Format-only checks do not score correctness. All drafts and lab records are included in local JSON backup/restore. This supports independent practice, but a fully self-sufficient B2 claim remains premature without native audio, teacher-grade feedback, broader vocabulary, novel assessments and real speaker validation.

**User-experience principles:** a calm, reading-first mobile design instead of a preschool visual style; compact daily-learning choices; visible starting point; progress without artificial streak pressure; large iPhone touch targets; no subscriptions or hidden paid dependencies. Actual Safari device checks and independent linguistic review are still required.


## Offline grammatical reference (added)

The handbook contains **30 bilingual rules** from Cyrillic and stress to six cases, verb aspect, motion, adverbial participles, relative clauses and B2 argument structure, each with four Russian examples and a common mistake. It complements, but cannot substitute for, a full morphology textbook, many independent practice contexts and review by a qualified native speaker. The handbook is offline, searchable through its topic menu, and uses device Russian TTS if present.


---

## Daily adult teaching route (November 2026)

The Home-screen learner route is now **Today**, an implemented 210-session structured study schedule covering all five levels of course-target material, not 210 calendar days or certification. See [DAILY_TEACHING_PLAN.md](DAILY_TEACHING_PLAN.md) for the actual 14 first sessions and the 7-day cycle.

Each study session binds a genuine app lesson activity to an explanation-led Russian question, Cyrillic spelling task (device or built-in keyboard), and spoken rehearsal. Vocabulary SRS is linked for review. Scores are factual and recent; quizzes cannot be completed by selecting the first choice repeatedly. Stage progress describes curriculum coverage rather than an assessment of real communication.

An adult learner can choose a comfortable study-time target (20/40/60 minutes), pause without penalties, and review a six-skill learning passport that distinguishes scored grammar/reading from self-reported speaking and ungraded writing. A local JSON backup includes the current daily lesson, finished sessions, and mistakes for feedback.

**Important:** Full independent B2 requires thousands of varied words and contexts, native-speaker audio/listening comprehension, independent oral assessment, teacher-standard writing correction, and external four-skill tests. The current system is a substantive practical daily foundation, not proof of having learned everything.

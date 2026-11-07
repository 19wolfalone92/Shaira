# Shaira — Russian Academy 🇷🇺

An adult-first, free-to-use iPhone PWA for **Shaira** to practise Russian **every study day**, starting with the very first Cyrillic letters. **The entire learner-facing interface, exercises, explanations and feedback are in English**; Russian appears as the language being learned. The project is inspired by the structure of `English_Child`, but the presentation, themes and longer assignments are intended for an adult.

**Open:** https://19wolfalone92.github.io/Shaira/ — Safari → Share → Add to Home Screen.

## Your daily Russian teacher

**Today** is the first screen. It leads Shaira through **210 guided study sessions** across Pre-A1, A1, A2, B1 and B2-target practice (42 guided sessions per stage). Each session includes genuine app activities (including new listening tasks on relevant days) plus independently checked mini-grammar and Cyrillic spelling exercises, one oral practice, English explanations, optional spaced review, a flexible 20/40/60-minute preference, and local skill history. The first 14 sessions explicitly guide an absolute beginner through letters, sounds, first nouns, phrases and introductory grammar. Lessons do not advance just because the date changes: practical work must be done.

See **[DAILY_TEACHING_PLAN.md](docs/DAILY_TEACHING_PLAN.md)** for the first two weeks and teaching cycle, and **[B2_CURRICULUM_MAP.md](docs/B2_CURRICULUM_MAP.md)** for the entire staged route and what still separates it from genuinely verified B2. Each of the five stages now ends with a separate, 10-question review requiring 8/10 plus successful writing and comprehension. These checkpoints measure only selected taught skills.

## v0.7: a fuller independent Russian study environment

**Four major study tools are now available:** **Hear the Difference** (30 real Russian sound contrasts / 60 possible listening targets), **Writing Coach** (29 specific pattern hints plus structural revision support across writing and reading activities), **Personal Study Coach** (seven factual practice indicators and individual next-action suggestions), and **Search all course materials** (800+ offline-searchable Russian/English entries with direct links). A Russian keyboard and spoken draft readback support adult written work. Phonetic practice is part of the daily route, with a reading fallback where device Russian TTS is unavailable. No free-writing grade, accent score or independent B2 certification is implied.

Detailed release scope: **[V07_COMPLETE_SKILLS.md](docs/V07_COMPLETE_SKILLS.md)**.

## What actually works

| Course area | Available material |
| --- | --- |
| Alphabet and writing | 33 Cyrillic letters, reading/spelling foundations, touch handwriting for letters, words and sentences |
| Vocabulary | 81 adult-relevant themed packs × 6 cards = **486 Russian-English cards**, from beginner words through nuanced B2 vocabulary |
| Academy path | 32 original topic units across **Pre-A1, A1, A2, B1 and B2** |
| Unit practice | 7 formats per unit: vocabulary, listen/choose, phrase/grammar basics, reading, controlled writing, shadowing and open writing |
| Conversation | 30 contextual Russian dialogues; optional private microphone recording and playback in speaking lessons (browser permitting) |
| Independent grammar | **100 contextual questions**, **30 grammar handbook chapters**, 32 deeper teaching studios (96 Russian examples and 64 new questions), and 5 independent 10-question stage reviews |
| Reading | **35 levelled texts**, 70 comprehension questions and 5 additional unseen stage-review texts (including an extended argument at B2) |
| Writing portfolio | **45 guided writing tasks**, from basic sentences to extended B2-style arguments, on-device drafts and format-only self-review |
| Listening comprehension | **30 audio-first listening scenarios** across five study stages. English questions; hidden Russian transcripts; scores are not awarded if the learner reveals the script. Uses device TTS, not native recordings. |
| Russian case laboratory | **24 nouns × 6 cases × singular/plural = 288 explicit forms**, adaptive 10-question productive writing practice, real scores and local progress |
| Retention | Spaced vocabulary review after 1, 3, 7, 14 and 30 days; meaningful four-way choices even for one due word |
| Backup | Export/import the daily route, all stage reviews, structured studios, noun-case practice, listening attempts, grammar scores, reading history and private drafts through Settings |
| Offline | Static curriculum, exercises and texts cached by service worker after first online visit |

### Important about level labels

**These are teaching-path targets, not CEFR certificates.** The 210 sessions are a first structured study sequence, not 210 guaranteed days to B2. The 5 short stage reviews and the 288 case forms do not substitute for long-form authentic listening, independent speaking evaluation or expert feedback on essays. The app includes materials labelled through B2 but does **not** yet constitute a complete, independently validated route to real B2. Thousands of additional reviewed lexical entries, varied grammar/reading/writing tasks, native-speaker recordings, dependable audio and speaking assessment, teacher-quality essay feedback and independent examinations are still needed. A user cannot reliably establish B2 by completion counters alone.

Synthetic Russian speech uses the browser/device voice when available; it may not work offline. Optional recorded speaking samples are kept only in temporary browser memory and never uploaded. The handwritten canvas permits tracing but **does not recognise writing**, and the writing portfolio does **not** judge grammar or semantics automatically. No mandatory account, ad, analytics, paid API or server is included.

### English-first design

The app now keeps **English as the sole student-facing instruction language** even when a device previously used Filipino or a progress backup includes a Filipino preference. English is used for menus, task prompts, questions, explanations, skill feedback and settings; Russian texts, words, grammar forms and listening scripts remain in Russian intentionally. Legacy Filipino translations stay in the source for compatibility but are not presented in the current interface.

## Learning strategy

1. Begin with Cyrillic, syllables, short words and phrases.
2. Learn 3–6 new practical words and review them later on schedule.
3. Follow topic units in order and do listening, grammar, reading, speech and writing rather than only quizzes.
4. Complete the independent grammar trainer and graded reading at the current level.
5. Write original Russian paragraphs; use the self-edit checklist and seek feedback from a qualified speaker for longer texts.
6. Repeat unfamiliar topics and test the skill in situations not already memorised.

Detailed teaching programme: [SHAIRA_PEDAGOGY.md](docs/SHAIRA_PEDAGOGY.md). Development handoff: [WORK_HANDOFF.md](docs/WORK_HANDOFF.md).

## Local development / CI

No dependencies or API keys. Use Node.js 20+ to run `npm run check`. A local HTTP server suffices: `python3 -m http.server 8000`; then open `http://localhost:8000`. CI uses GitHub Actions to verify syntax and tests; deployment workflow publishes `main` to GitHub Pages.

## Privacy and backup

All lessons and drafts live in browser localStorage only. Use Settings → **Export progress** to save a private JSON file, and import on another device (import **replaces** existing local data). No cloud account, sync or tracking. Clear browser data only after exporting anything important.

© 2026 Shaira learning project.

## New: Variety Lab, Verb Lab and interactive Russian scenarios

**Variety Lab** offers **13 different exercise formats** in each 12-question round: Russian–English recognition, English–Russian recall, typed Russian words, grammar, noun-case endings, conjugation, word-order assembly, sentence translation, proofreading, reading comprehension, four-pair matching, Russian audio identification and synthetic-voice dictation. Questions are sampled from curated material and prioritise unseen, due and previously failed items. The latest mixed-skills session must score at least **9/12, including two productive correct answers**, at each weekly review in the guided route.

**Verb Lab** includes **24 selected verbs** with 240 explicitly written Russian present and past forms and optional spoken examples.

**Choose Your Response** is a library of **15 interactive adult scenarios** with 45 situational decisions, varied scripted replies and English explanations. Scenarios cover conversations with neighbours, shops, work, travel, repairs and nuanced arguments. These model real-life language but are not live AI conversations.

All these modules work without paid APIs and keep exercise history locally. Backups now include the mixed-task review schedule and scenario scores. The Russian TTS depends on device capabilities; no native human audio or automatic pronunciation grading is claimed. The course still cannot certify B2.

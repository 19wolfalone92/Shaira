# Shaira — Russian Academy 🇷🇺

An adult-first, free-to-use iPhone PWA for **Shaira** to practise Russian **every study day**, starting with the very first Cyrillic letters. Learning guidance is in **English and Filipino/Tagalog**. The project is inspired by the structure of `English_Child`, but the presentation, themes and longer assignments are intended for an adult.

**Open:** https://19wolfalone92.github.io/Shaira/ — Safari → Share → Add to Home Screen.

## Your daily Russian teacher

**Today** is the first screen. It leads Shaira through **210 guided study sessions** across Pre-A1, A1, A2, B1 and B2-target practice (42 guided sessions per stage). Each session includes two genuine app activities plus independently checked mini-grammar and Cyrillic spelling exercises, one oral practice, bilingual explanations, optional spaced review, a flexible 20/40/60-minute preference, and local skill history. The first 14 sessions explicitly guide an absolute beginner through letters, sounds, first nouns, phrases and introductory grammar. Lessons do not advance just because the date changes: practical work must be done.

See **[DAILY_TEACHING_PLAN.md](docs/DAILY_TEACHING_PLAN.md)** for the exact first two weeks, seven-day learning cycle, evidence requirements and real limitations.

## What actually works

| Course area | Available material |
| --- | --- |
| Alphabet and writing | 33 Cyrillic letters, reading/spelling foundations, touch handwriting for letters, words and sentences |
| Vocabulary | 40 bilingual themed packs × 6 cards = **240 cards** (120 early words + 120 practical adult words) |
| Academy path | 32 original topic units across **Pre-A1, A1, A2, B1 and B2** |
| Unit practice | 7 formats per unit: vocabulary, listen/choose, phrase/grammar basics, reading, controlled writing, shadowing and open writing |
| Conversation | 20 contextual Russian dialogues; optional private microphone recording and playback in speaking lessons (browser permitting) |
| Independent grammar | **100 contextual questions** (20 per stage) with explanation and **30 offline grammar handbook chapters** with examples |
| Reading | **20 original levelled texts**, 40 comprehension questions, word glossary, speaking aloud and associated writing tasks |
| Writing portfolio | **30 guided tasks**, from basic sentences to extended B2-style arguments, on-device drafts and format-only self-review |
| Retention | Spaced vocabulary review after 1, 3, 7, 14 and 30 days; meaningful four-way choices even for one due word |
| Backup | Export/import all progress, daily plan sessions, grammar scores, reading history and drafts through Settings |
| Offline | Static curriculum, exercises and texts cached by service worker after first online visit |

### Important about level labels

**These are teaching-path targets, not CEFR certificates.** The 210 sessions are a first structured study sequence, not 210 guaranteed days to B2. The app includes materials labelled through B2 but does **not** yet constitute a complete, independently validated route to real B2. Thousands of additional reviewed lexical entries, varied grammar/reading/writing tasks, native-speaker recordings, dependable audio and speaking assessment, teacher-quality essay feedback and independent examinations are still needed. A user cannot reliably establish B2 by completion counters alone.

Synthetic Russian speech uses the browser/device voice when available; it may not work offline. Optional recorded speaking samples are kept only in temporary browser memory and never uploaded. The handwritten canvas permits tracing but **does not recognise writing**, and the writing portfolio does **not** judge grammar or semantics automatically. No mandatory account, ad, analytics, paid API or server is included.

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

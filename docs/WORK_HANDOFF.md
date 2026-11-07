# Shaira — production handoff for ChatGPT Work

## Project goal
Build a friendly, effective, iPhone-first Russian learning app for a complete beginner. Student-facing interface, instructional prompts, explanations and feedback MUST be **English-only** by explicit user instruction (November 7, 2026); the app retains older bilingual source data as dormant compatibility content. The learner should gain **Russian literacy and grammar**, not merely memorise conversation phrases. Keep basic functionality free, independent of paid APIs, and usable offline when practical.

## Current baseline (as of 2026-10-30)
- Source: repository `19wolfalone92/Shaira`, default branch `main`.
- Technology: dependency-free static PWA (ES modules + CSS), responsive iPhone layout.
- 13 functioning micro-lessons in 4 paths: Cyrillic alphabet (all 33 letters), reading/spelling, everyday language, elementary grammar.
- English-only student UI, Russian speech via Web Speech API where supported, built-in Cyrillic keyboard, freehand canvas, multiple-choice/typing/dictation checks, progress in localStorage.
- Service worker caches first-party static files for offline use; PNG icons for iOS and PWA installability.
- GitHub Actions: `Verify Shaira` checks content and UI smoke tests; `Publish Shaira PWA` is prepared for GitHub Pages.
- No external APIs, analytics, cloud database, accounts, advertising, or secrets.

## Immediate activation
1. On GitHub: Settings → Pages → Build and deployment → GitHub Actions.
2. Verify `Verify Shaira` and `Publish Shaira PWA` runs on the main branch. No deployment success is assumed until GitHub reports it.
3. Open the resulting HTTPS address on an actual iPhone in Safari and use Share → Add to Home Screen. Check offline after first online load. Test English and Filipino UI, Russian voice availability, a complete lesson and reload persistence.
4. Run `npm run check` with Node.js 20+ locally/CI. No Node dependencies need to be installed.

## Development priorities (next Work run)
### P0 — correct, trustworthy beginner course
- Verify Russian content with a native speaker / qualified Russian teacher; verify Filipino with a native speaker.
- Expand alphabet training with individual grapheme/phoneme pages, hard/soft consonants, stress and vowel reduction. Give difficult concepts multiple examples.
- Add reading drills, syllable blending, word stress, orthographic correctness, and comprehension checks.
- Improve writing practice beyond freehand: stroke order and templates; **never claim** that freehand canvas is automatic handwriting assessment.
- Make quizzes varied, repeat until mastered, show meaningful explanations for wrong answers.
- Build a sequenced A1 curriculum covering 6 cases, noun/adjective agreement, verb conjugations and aspects, tenses, verbs of motion, negation, question patterns, and real beginner reading passages.

### P1 — progress and pedagogy
- Add spaced repetition, mastery scores per concept, practical checkpoints and review of mistakes.
- Make optional audio offline using properly licensed recorded Russian clips or local assets. Browser speech synthesis isn't guaranteed on all iPhones; test with installed Russian voices.
- Add accessible writing/canvas alternatives for learners who cannot draw by touch.
- Avoid over-reliance on transliteration beyond earliest lessons.

### P2 — polish and expansion
- Add richer spoken dialogues, graded reading, vocabulary themes and exercises.
- Evaluate optionally exporting/importing progress with user's explicit action; continue avoiding mandatory accounts or hidden synchronization.
- Test real iPhone Safari performance, VoiceOver, large text, safe-area margins, reduced motion, screen readers and low-bandwidth mode.
- Add more automated unit/integration/browser tests, including service worker offline behavior and cache update/migration.

## Architecture notes
- `assets/lessons.js`: data models `sections`, `lessons`, `alphabet`, `keyboardRows`. Add localized `en` and `tl` values whenever introducing educational content.
- `assets/app.js`: render + navigation, quiz lifecycle, TTS, localStorage, canvas, localizations. Break into modules as feature scope grows.
- `assets/styles.css`: mobile layout.
- `sw.js`: explicit cache version must be bumped when updating shell resources to ensure returning devices get new assets.
- `tests/`: content integrity and browser-DOM smoke tests.
- No build tooling required initially. Prefer small, testable changes; keep each new lesson validated.

## Acceptance checklist
- All 33 Russian letters present and enterable by learner.
- EN and Filipino toggling works without resetting learning progress.
- Correct answers persist across reloads; wrong answers don't award completion.
- Dictation falls back gracefully if Russian TTS is unavailable.
- Writing canvas supports touch/stylus without page scrolling while drawing.
- First-time online PWA install, offline launch, update flow and icon verified on iPhone.
- No account or payment required; no personal data transmitted.
- Course claims reflect what is actually implemented.

## Known limitations
This is a working **foundation**, not a finished language course. Current handwriting is freehand only (no automatic recognition). Quizzes are one per lesson and not yet adaptively spaced. Voice depends on the browser's installed TTS voices. Local progress is device-specific. Deployment and real-device behavior still require verification.


---

## Handoff update — comprehensive Shaira Academy expansion (2026-11-07)

This repository is now **far more substantial** than the initial 13 beginner lessons. Read **docs/SHAIRA_PEDAGOGY.md** for the detailed teacher's syllabus, real completion gaps, writing plan and level checks. Do not replace the working app with another outline; expand and test existing code.

### Implemented in this branch
- Added \`assets/first-words.js\`: 20 packs / 120 picture words, adapted from the owner's English_Child model and translated into EN/Filipino.
- Added \`assets/academy-data.js\`: 5 CEFR-target stages, 32 original thematic units (6 bilingual words each, targeted rule, model, contextual reading, comprehension check, controlled Russian spelling, free-writing task with example).
- Added \`assets/dialogues.js\`: 20 Russian conversations (with EN/Filipino translations).
- Added \`assets/academy-ui.js\` and \`academy.css\`: 7 practice tracks per unit, contextual dialogues, beginner word map, spaced repetition, saved journal, practice points.
- Upgraded handwriting canvas to practise lowercase/uppercase letters, words and full sentences. It does not perform recognition.
- Integrated academy in navigation and static PWA offline cache. Added content integrity and interactive smoke tests.
- Total activity slots: 264. Do not mistake them for 264 full lessons or CEFR certification.

### Priority next
1. Test actual iPhone Safari install, offline operation, touch/pen writing, keyboard, navigation, Russian voices, VoiceOver, 200% text zoom. Fix any bugs before producing further learning content.
2. Grow each stage with much deeper exercise banks and quality native audio. For B2 add real paragraphs and multi-paragraph texts, inferential reading questions and teacher-reviewed 180–250-word essay tasks.
3. Build meaningful mastery checkpoints and feedback; currently there are too few questions per grammar topic to confirm acquisition.
4. Progress **export/import** is now implemented in Settings using a validated JSON backup. Test backup transfer between actual iPhones, recovery after Safari data loss and accessibility.
5. Have qualified native speakers check all Russian examples and Filipino explanations, with change tracking.
6. Deploy verified changes from feature branch via PR and merge only after CI passes. Published Pages output currently follows main.

**Acceptance is pedagogical and functional, not numeric marketing claims.** A "B2" label on a unit does not mean Shaira can genuinely perform at B2.


## Expansion 2026-11-07 — adult learning experience

- The homepage and Academy were restyled as an **adult** study environment. Foundations/first words remain, but early-childhood visuals are no longer the primary navigation.
- Added `assets/adult-word-packs.js` (120 practical adult vocabulary cards); existing child-source first-word set remains as beginner reference, total 40 packs (240 bilingual cards).
- Added `assets/grammar-drills.js` (100 explanations-backed exercises), `assets/reading-library.js` (20 original graded reading passages and 40 comprehension checks), `assets/writing-tasks.js` (30 writing portfolio assignments).
- Added `assets/learning-labs.js` and `assets/learning-labs.css` with independent grammar/reading/writing routes, saved scores/drafts and structured self-review.
- Added `assets/adult-theme.css`; all modules are cached offline. `assets/backup.js` now backs up lab sessions and drafts as well as Academy progress.
- Main limitations remain **genuine B2 proof**, native-speaker audio, speaking assessment, qualified corrections for free writing, exhaustive grammatical coverage and enough unique lexemes.
- Before calling this a complete course: expand contextual task variety substantially, human-review bilingual translations, verify all modules on a real iPhone Safari and independently benchmark four core skills.


---

## November 7, 2026 — Daily Teacher functional build

The user explicitly prioritised genuine daily learning across ALL skills, analogous to the teaching pathway in the English_Child app but designed for adult Shaira. Implemented:
- New first-screen \`#today\`, 210 planned guided study sessions with 14 original beginner days and real task evidence. \`assets/daily-content.js\`, \`assets/daily-plan.js\`, \`assets/daily-ui.js\`, \`assets/daily.css\`.
- Tasks span alphabet, vocabulary, grammar, reading, listening, speaking, typed Russian, and longer writing. Grammar and spelling mini-exercises cannot be checked merely by marking a task done; they need correct inputs.
- Independent grammar scores require >=8/10 from the newest session; reading requires a fresh fully correct comprehension attempt; writing requires a recent saved Cyrillic draft and length target. Optional handbook/speech practice is plainly labelled self-attested, not graded.
- Randomised answer locations in all new grammar/reading/dialogue tests and harder spaced review (four distinct choices even with one due word).
- Six factual skill-coverage counters, personal session length preferences, local learner history and recent error feedback, offline cache and backup of daily progress.
- Tests: \`tests/daily-path.test.mjs\` covers 210 session content references, progression, assessment evidence, spelling, audio fallback, bilingual UI, saving and privacy.

**Do not** claim 210 sessions attain CEFR B2 or that the app already contains enough independently assessable material to replace every Russian textbook. Student wants that end goal, but it remains a measurable roadmap rather than a completed linguistic validation. Continue by expanding authentic audio, lexical depth, multiple worked examples for all grammar cases, more diverse unseen exercises, substantial writing and oral correction, and real iPhone QA. Build on the shipped daily route rather than replacing it with another static list.


## November 7, 2026 — progressive study + stage reviews + morphology

- Added 32 substantial adult bilingual Studios matching all 32 topic units. The package teaches 96 practical Russian examples, 64 new MCQ tasks and 32 productive Russian reconstructions (not a proxy for communicative competence).
- Added 5 independent stage reviews (50 new questions): reading, contextual grammar, and Russian writing. Pass >=8/10 including >=1 correct written answer and >=1 reading-comprehension item, with fresh timestamp. Stage review required before advancing into the next daily stage.
- A1/A2 now also include the noun-case lab: 24 nouns with 288 explicit inflected forms across six cases and singular/plural. A 10-question adaptive session must score >=8/10. Routes: #academy/mastery, #academy/checkpoint/STAGE, #academy/cases, #academy/cases/quiz, #academy/cases/noun/ID.
- English and Filipino question text and explanations; typed Cyrillic keyboards for mastery and noun cases; no cloud or paid APIs.
- All progress, including studios, independent checkpoints and morphology attempts, is included in backward-compatible sanitized local JSON export/import, with rollback.
- Offline assets: studio-lessons.js, stage-checkpoints.js, mastery-engine.js, mastery-ui.js, mastery.css, declension-tables.js, case-trainer.js, case-trainer.css.
- Tests: mastery.test.mjs and cases.test.mjs, plus original daily-path.test.mjs and all smoke tests.
- Actual TORFL-II/B2 still requires much deeper lexical, authentic listening and independently graded spontaneous speaking/writing. Read docs/B2_CURRICULUM_MAP.md.


## November 7, 2026 — English-first expanded learning release (v0.5.0)

- The learner-facing language is now **English** on all routes, including settings, exercise instructions and explanations. Loading a legacy Filipino language setting or restoring a Filipino-tagged JSON backup normalises to English; Russian texts and forms remain Russian.
- Extended the existing 40 vocabulary packs with **41 new adult-themed six-word packs**, total **81×6=486** Russian/English cards. Preserved old IDs and progress; staged topics now include advanced argumentation and professional communication.
- Added **15 longer Russian graded reading texts** with EN reading guides, glossaries and 30 fresh context comprehension items: **35 total graded passages**.
- Added **15 original adult writing prompts**, from introductory messages to balanced B2-style policy essays: **45 total tasks**.
- Added **10 new practical dialogue scenes**, including formal business and nuanced discussion: **30 dialogue scenes** total.
- Added **30 English-guided audio-first listening scenarios** (6 per study stage); Russian transcript is hidden until after answering, with a reading-only reveal action that does not count as listening. Uses browser Russian TTS and explicitly does not claim native audio.
- Integrated listening into eligible speaking/listening daily study days; unavailable-TTS fallback redirects to reading without labelling it as a listening grade. Backups include validated listening history. Offline shell includes every new asset.
- QA tests cover language lock, all new material, 210 daily references, listening grading, backup and browser degradation. Actual proficiency B2 remains unproven and requires authentic recorded audio and independent writing/oral evaluation.

## November 7, 2026 — expanded v0.6 varied adult Russian course

- Added Variety Lab: 13 scored modalities, adaptive twelve-question rounds, recognition, meaning recall, independent writing, noun cases, verb conjugations, sentence assembly, error correction, contextual reading, four-pair matching, and Russian synthetic-voice listening/dictation. New per-question local SRS history prioritises unseen, due and mistaken prompts.
- Added 24 curated Russian verb paradigms (240 present/past forms), plus a browsable and voice-enabled Verb Lab reference.
- Added 40 authored sentence-building models and 40 common-error pairs with English explanations; the practice engine additionally uses the existing vocabulary, grammar, noun-case and reading corpora.
- Added 15 contextual branching adult conversation missions, 45 choices and two different dialogue consequences for each choice. This is curated decision-based dialogue, NOT free conversation or an AI proficiency assessment.
- Each weekly guided revision now requires a fresh mixed round >=9/12, with >=2 correct productive written/order tasks.
- Offline PWA assets, smoke/integration and content tests, backward-compatible sanitised JSON backup now cover new modules and scenario scores.
- English-only learner instructions remain mandatory. Native-speaker audio, intelligent semantic essay grading, accent evaluation and independent B2 proficiency verification remain absent.

## November 7, 2026 — comprehensive v0.7 addition

Added 30 curated phonetic contrasts / 60 audio targets (real audio-first grading where browser TTS exists), a weekly sound activity across all 210 guided sessions, an English offline Writing Coach with 29 narrowly scoped grammar patterns and structural hints in both writing studios, and an explicit seven-skill Personal Study Coach based on actual local learning records. Added 800+ entry English/Russian search across all course libraries and new deep links in home, Academy and Practice Centre. Updated offline cache and sanitized backup for phonetics progress. This is not native-speaker audio or automatic free-text grading. See docs/V07_COMPLETE_SKILLS.md.

## November 7, 2026 — v0.8 true-zero staircase

Shaira must NOT be shown a complex 10-vowel + six-word + grammar Day 1 when she has absolutely no Russian. New learners now see 78 micro-rungs on `#today`; the first six are А, М, О, ма, мама, quick review. Teach all 33 letters individually and interleave 11 short syllables, 11 short words, 11 reviews, then 12 essential phrases. English instructions, optional synthetic voice and finger tracing (not automatically graded). Each rung takes ~2–5 minutes and uses only previously seen letters in required reading.

Difficulty picker: Gentle 2 recognition questions (default), Steady 3 with one written answer, Challenge 4 with two written answers. Optional, explicitly chosen 6/6 unseen check verifies the next three rungs; no silent bypass and no punitive failure. Selected mode and verified progress persist in `shaira-microsteps-v1` and are sanitized in the unchanged version-1 portable backup.

Backward compatibility: learners already active in the original 210-day route, grammar, Academy or writing retain prior progress and are not forced into a new onboarding. Once 78 foundational rungs are complete, the existing 210-session program begins. New files: assets/first-steps-{data,engine,ui}.js, first-steps.css; tests/first-steps.test.mjs. See docs/TRUE_BEGINNER_STAIRCASE.md.

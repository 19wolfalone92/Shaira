# Shaira — production handoff for ChatGPT Work

## Project goal
Build a friendly, effective, iPhone-first Russian learning app for a complete beginner. Student-facing explanations must be available in **English or Filipino/Tagalog**. The learner should gain **Russian literacy and grammar**, not merely memorise conversation phrases. Keep basic functionality free, independent of paid APIs, and usable offline when practical.

## Current baseline (as of 2026-10-30)
- Source: repository `19wolfalone92/Shaira`, default branch `main`.
- Technology: dependency-free static PWA (ES modules + CSS), responsive iPhone layout.
- 13 functioning micro-lessons in 4 paths: Cyrillic alphabet (all 33 letters), reading/spelling, everyday language, elementary grammar.
- EN/Filipino switch, Russian speech via Web Speech API where supported, built-in Cyrillic keyboard, freehand canvas, multiple-choice/typing/dictation checks, progress in localStorage.
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
4. Add opt-in local progress **export/import** before users entrust important drafts to this app.
5. Have qualified native speakers check all Russian examples and Filipino explanations, with change tracking.
6. Deploy verified changes from feature branch via PR and merge only after CI passes. Published Pages output currently follows main.

**Acceptance is pedagogical and functional, not numeric marketing claims.** A "B2" label on a unit does not mean Shaira can genuinely perform at B2.

# Shaira — Learn Russian 🇷🇺

An iPhone-first, offline-capable Russian-learning progressive web app (PWA), built especially for **Shaira**. Lessons and explanations in **English or Filipino/Tagalog**, Russian targets throughout. Inspired by the owner's separate \`English_Child\` learning app, with an adult-friendly interface.

## Try it
Published via GitHub Pages: https://19wolfalone92.github.io/Shaira/

On iPhone, open the HTTPS site in Safari and choose **Share → Add to Home Screen**. The home-screen icon behaves like an app. Initial load needs internet; previously cached content can run offline. Russian speech synthesis uses available iOS voices and may be unavailable offline depending on the device.

## Included now
- **Cyrillic from zero:** 33 uppercase/lowercase letters; first syllables and phrases; handwriting canvas for letters, words and sentences.
- **First 120 picture words:** 20 themed packs of six words with English and Filipino.
- **Russian Academy:** 5 target stages (Pre-A1, A1, A2, B1, B2), 32 substantive units covering gender, six cases, tenses, aspect, motion, complex syntax, discourse and writing.
- **7 complementary activities per unit:** vocabulary, listen/choose, grammar/phrase study, reading comprehension, controlled writing, speaking/shadowing and open writing workshop.
- **20 dialogue scenarios:** from greetings and shopping to debates and interpreting sources.
- **Spaced recall:** due words rescheduled after 1/3/7/14/30 days, correct and wrong-answer handling.
- **Local progress, points and writing drafts:** no account, ads, analytics, paid services or server.

**264 activity slots in this release:** 32 × 7 unit activities, 20 first-word themes and 20 dialogues. Completing these slots does **not** equate to achieving any official CEFR level. Some activities are self-marked practice; free-writing and pronunciation are not automatically assessed.

## Important limitations
This is an **expanded, functioning course foundation with B2-oriented units**, *not* a complete independently validated B2 curriculum. Genuine B2 requires more vocabulary, longer authentic reading and listening, sustained speaking, essay feedback from teachers and independent evaluation of all four skills. The current app contains 312 curated word records, including deliberate overlaps, not thousands of unique words. Synthetic speech depends on the device. The handwriting canvas does not recognise handwriting.

For the learning sequence, writing objectives and future expansion checklist, see [teacher syllabus](docs/SHAIRA_PEDAGOGY.md) and [Work handoff](docs/WORK_HANDOFF.md).

## Local development
Dependency-free JS + CSS app; run any HTTP server from repository root:

\`\`\`bash
python3 -m http.server 8000
# open http://localhost:8000
\`\`\`

Validate with Node.js 20+:

\`\`\`bash
npm run check
\`\`\`

No npm installation or paid API keys required.

## Deploy
GitHub Pages uses the included \`.github/workflows/pages.yml\` on pushes to \`main\`. Select **Settings → Pages → Build and deployment → GitHub Actions** once. CI workflow \`.github/workflows/ci.yml\` checks JS syntax and tests on pushes/PRs. Confirm both workflows report success before treating a release as deployed.

## Privacy
All learning progress and drafts stay in the browser's localStorage; there is no server, sign-in or tracking. Clearing Safari site data removes them. There is no cloud sync. You can export both lesson progress and writing drafts as a local JSON file, then restore that file on another device from Settings. Keep exported files private.

© 2026 Shaira learning project.

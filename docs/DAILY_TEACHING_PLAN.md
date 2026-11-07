# SHAIRA — Daily Russian Teacher
## Adult first-language English/Filipino · measurable daily study routine · v1

**Purpose:** Make daily Russian practice a learner experience rather than a list of disconnected lessons. This system draws on the owner's \`English_Child\` teacher-path idea but was redesigned for **an adult**, not a preschool child.

### What is shipped
- \`#today\` is the default first screen, with an accessible five-tab bottom navigation (Today, Academy, Review, Write, Settings).
- **210 guided study sessions**: 42 for each of the five CEFR-*target* stages Pre-A1, A1, A2, B1, B2. The course tracks completed *sessions*, not calendar dates or hours spent. **It does not certify B2.**
- The **first 14 sessions** have authored bilingual beginner guidance: 13 original alphabet/reading/first-grammar foundation lessons, then a checkpoint. The lesson works include 13 themed vocabulary packs and mini-exercises.
- Subsequent sessions use a **seven-day adult teaching cycle** with context-specific authored reading, grammar, vocabulary, dialogue, spoken practice and writing.
- **Every session contains** two linked real exercises, one randomly-positioned-choice grammar microcheck with bilingual feedback, one exact-model Russian spelling task with an onscreen Cyrillic keyboard and optional TTS, and a spoken phrase to practise aloud (self-attested; not graded).
- **Spaced vocabulary recall** is always accessible from Today and Review and the UI displays words due.
- Each self-study screen shows its actual progress (not a fake level): a task is complete only after a real exercise was completed in the corresponding module, with recent timestamps, except for clearly disclosed self-attested speaking and handbook study.
- Flexible study-time preference: 20, 40 or 60 minutes. Task estimates remain indicative. A learner can stop after one part and return later without losing their work. No punitive streaks or timed lockouts.
- Five separate stage timelines and six factual skill counters: seen vocabulary, grammar items answered, listening practice slots, passed graded readings, nonempty writing drafts and self-attested spoken units.
- Finished session history, errors for targeted review, local JSON backup and offline shell caching.

### What one guided week actually asks the learner to do

| Learning day | Core linked activities | Daily independent practice |
|---|---|---|
| 1 — learn | First vocabulary pack + unit vocabulary challenge | Grammar multiple-choice, Cyrillic spelling, speak one phrase |
| 2 — notice grammar | Grammar handbook with explicit self-attestation + 10-question grammar session (8/10 required) | Same three mini-practices |
| 3 — hear and speak | Unit listening/recognition + unit speaking/shadowing (recording optional) | Same three mini-practices |
| 4 — read | Levelled reading passage comprehension (all correct) + short unit reading | Same three mini-practices |
| 5 — write | Russian sentence spelling + stage writing portfolio saved to device with minimum suggested length | Same three mini-practices |
| 6 — converse | Scenario dialogue comprehension + oral shadowing | Same three mini-practices |
| 7 — integrate | New 10-question grammar checkpoint (8/10) + passage comprehension | Same three mini-practices |

A session that is not finished remains current. The next study day becomes available after the current session passes. The app does not increment the day index just because the calendar changes.

**Important:** the course repeats a smaller body of verified material for deliberate practice. It is not 210 entirely distinct complete language lessons, nor is this a guaranteed path to B2 after 210 calendar days.

### First 14 adult beginner sessions

1. Vowels and hearing Russian sounds.
2. First consonants and writing their shapes.
3. Misleading Cyrillic/Latin lookalikes.
4. Blending syllables into words.
5. Essential everyday nouns and «Это».
6. Listening/spelling the first words.
7. Greetings and the difference between polite and familiar forms.
8. Introducing oneself and asking for names.
9. Thanks, please and simple manners.
10. Personal pronouns.
11. Gender of Russian nouns and possessives.
12. Present-tense actions.
13. The idea of noun cases and sentence objects.
14. A self-introduction, dialogue and the first grammar checkpoint.

These guided sessions launch the learner into the Pre-A1 stage; no prior Russian literacy or typing knowledge is assumed.

### Learning evidence and honest feedback

- \`legacy\`: actual beginner lesson completion.
- \`pack\`: all vocabulary cards correctly recalled in a fresh practice attempt.
- \`unit\`: the corresponding Academy activity completed at or after the current session start.
- \`grammar\`: the latest independent 10-question quiz must score at least 8/10 *after the current session start*. An old best score or a new score of 5/10 does not count.
- \`reading\`: the most recent reading comprehension attempt must answer all its questions correctly, and be after session start. A previous pass alone cannot substitute.
- \`writing\`: written draft saved after session start, containing Russian letters and at least the stage's suggested minimum length. **No automatic grammar grading** and no claim of paragraph correctness.
- \`handbook\`: user explicitly selects “I studied these examples”. This is self-attested, and the grammar trainer provides the independently checked work.
- \`speak\`: the learner explicitly self-marks speaking; microphone samples are only optional and local.
- \`listen\`: if device Russian voice synthesis cannot be used, the student gets a **reading-comprehension fallback** rather than a false listening grade. Other listening tasks can be synthetic audio, not native recordings.
- \`review\`: review cards now offer four plausible choices even when only one word is due; no single-option freebies.

Wrong mini-quiz/spelling attempts are recorded for feedback. The model answer is shown after an incorrect attempt, and the learner must correct the response; this is **practice, not an exam**.

### A practical daily routine

For an adult beginner, choose **20–40 minutes** per sitting initially. Split it into 5–10 minutes of review, 10–15 minutes of new material and 5–15 minutes of speaking and/or writing. If time permits, a longer 60-minute session can add independent reading and a free-writing task.

Every week, say something spontaneous outside the prompts; listen to unprepared speech with a native speaker; write and revise an original message. Without reliable speech and essay assessment, **practice completion cannot demonstrate independent competence**.

### Still required before claiming a truly complete B2 course

1. Thousands of qualified, example-rich, distinct lexical items with productive recall (not just translated cards).
2. Full case, conjugation, aspect, motion-verb, spelling and punctuation coverage with broad, independent quizzes and open-ended responses.
3. Native Russian recordings for phonetics and authentic long-form listening, offline access, and variation in speaker/speed.
4. Spoken interaction and pronunciation feedback, with privacy-conscious, opt-in recording.
5. Advanced essay feedback: grammatical correction, style, coherence and arguments; model revisions and instructor-reviewed feedback.
6. New independent tests at each CEFR stage that **do not reuse training questions**, with four-skill evidence.
7. Full iPhone Safari QA, VoiceOver, accent/stress accuracy, EN/Filipino translation review with qualified speakers.

This is a **major functional daily-teaching expansion**, not a claim that all 7 items above have been solved.

### Integration

- \`assets/daily-content.js\`: initial daily teacher notes and weekly cycles.
- \`assets/daily-plan.js\`: pure daily plan generator, evidence checks, progress, skill metrics, goal settings.
- \`assets/daily-ui.js\` and \`assets/daily.css\`: bilingual Today UI, quick question feedback, spelling and on-screen keyboard, stage tracking.
- Existing exercises provide the real student work: \`assets/lessons.js\`, \`academy-ui.js\`, \`learning-labs.js\`, \`grammar-drills.js\`, \`reading-library.js\`, \`writing-tasks.js\`, \`grammar-handbook.js\`, \`first-words.js\`, \`dialogues.js\`.
- Existing backed-up \`shaira-daily-v1\` is validated and restored through \`assets/backup.js\`. All daily assets cached offline in \`sw.js\`.
- \`tests/daily-path.test.mjs\` validates all 210 plans and actual mastery gating. Work on a feature branch, run \`npm run check\`, verify Pages and iPhone before release.

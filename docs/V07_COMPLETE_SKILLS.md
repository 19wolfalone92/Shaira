# SHAIRA 0.7 — all-skill Russian learning expansion

This release strengthens independent learning on iPhone with **English-only learner instructions**. Russian remains the target language in audio, text, grammar, spelling and conversation. All progress is stored on the device and may be included in an explicit backup.

## 1. Hear the Difference: Russian phonetics

- 30 authored sound/close-word contrasts across Pre-A1, A1, A2, B1 and B2-target practice (six pairs per stage, 60 possible targets).
- Sound-first choices, slower voice playback, explanation of pronunciation and meaning, spaced repetition of missed or unpractised variants.
- Browser Russian TTS is synthetic; it does not replace native audio and has no accent scoring.
- If the audio API is absent, sound items become reading references rather than fake listening grades.
- A phonetics exercise is now assigned during every seven-session cycle of the 210-session guided pathway. On audio-incompatible devices, a real reading task is offered instead.

## 2. Writing Coach: structure and revision

- Available inside the independent writing portfolio (45 prompts) and reading-based writing exercises (35 levelled texts).
- Checks Russian Cyrillic usage, length targets, punctuation, paragraphs and logical connectors.
- Offers explanations for 29 narrow recurring Russian grammar-pattern errors and actionable revision steps. Uses Unicode-aware Russian text matching; does not automatically rewrite users' words.
- Includes a Russian on-screen keyboard and optional synthetic speech playback of the learner's draft.
- The coach is **not** a complete grammar, meaning or essay evaluator. No automated writing grade or CEFR score is awarded.

## 3. Personal Study Coach: real study guidance

- Seven actual practice areas: vocabulary, grammar, reading, writing, listening, phonetics and guided conversation.
- Prioritises overdue spaced vocabulary reviews, insufficient recent grammar results, unfamiliar mixed tasks and uncompleted current-stage exercises.
- Every recommendation links to an existing working part of the app. No fabricated proficiency or completion score.
- Counts indicate learning activity or selected task performance, **not the learner's Russian CEFR level**.

## 4. Search across the complete course

- Offline index with 800+ entries spanning Russian-English vocabulary, grammar, noun inflections, verbs, readings, writing tasks, dialogues, audio clips, sound contrasts and roleplay scenarios.
- Search in English or Russian. Search uses ё/е-tolerant matching for findability, but spelling grading still distinguishes them.
- Category filtering, search-as-you-type and direct links to original exercises.
- No external API requests, no translation of private notes to a third party.

## Existing learning content retained

- 210 sequential study sessions (42 per stage), 14 explicitly scaffolded first lessons, 32 teaching studios.
- 81 word themes / 486 Russian-English cards, 288 noun-case forms, 24 verbs / 240 forms.
- 100 standalone grammar questions, 35 graded readings, 45 writing projects, 30 dialogues, 30 TTS listening scenarios.
- 13-mode adaptive Variety Lab, 15 scripted real-life roleplay missions, five independent level checkpoints.
- English interface, offline Service Worker, private progress and backup export/import.

## Still required for a genuinely independent B2 education

A B2 label is a curriculum target, **not verified mastery**. The short app checkpoints cannot replace the five components of an independent TORFL assessment. A genuinely self-sufficient course needs thousands of curated contextual vocabulary entries, professionally recorded native Russian across speakers and listening speeds, feedback on spontaneous conversations and pronunciation, semantic essay grading by a qualified reviewer, a much larger independent corpus of unfamiliar tests and real-iPhone Safari/VoiceOver quality assurance. Do not claim 100% B2 or human-level linguistic feedback without those prerequisites.

### Validation

Automated Node.js tests cover all added tools, graded audio conditions and fallbacks, 210-day integration, content counts, search facets, offline cache references and validated backup restoration. GitHub CI and GitHub Pages deployment must both pass before the release is considered delivered. Native-iPhone manual QA is a separate task and has not been performed.

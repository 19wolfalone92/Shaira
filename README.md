# Shaira — Learn Russian 🇷🇺

An iPhone-first, offline-capable progressive web app (PWA) to learn Russian from zero through English or Filipino/Tagalog, including reading, spelling, writing and grammar.

## Local development

The app is dependency-free. Serve the repository over localhost (service workers require HTTPS or localhost), e.g. `python3 -m http.server 8000`, then visit http://localhost:8000.

Run content/integrity tests with `node --test tests/*.test.mjs` (Node 20+).

## Deployment

Static app designed for GitHub Pages. Go to **Settings → Pages → Build and deployment → GitHub Actions** once. The included workflow then deploys on pushes to `main`. On iPhone, open the HTTPS site in Safari, tap Share → Add to Home Screen. Online is needed for the first visit; cached material can subsequently work offline.

## Scope and limitations

Initial curriculum covers Cyrillic, reading, spelling, beginner phrases, personal pronouns, noun genders and basic verb forms. Every lesson has a knowledge check. Built-in handwriting canvas is a freehand practice area, **not handwriting recognition**. Russian speech uses the browser/device speech synthesizer and may be unavailable depending on installed voices. Progress is stored *only on this device* in localStorage; no account, analytics, server or cloud sync. English and Filipino explanations are included.

## Roadmap

Expand complete A1→A2 grammar lessons, dictation, listening assessment, spaced repetition, printable handwriting tracing, accessible learning diagnostics, optional audio recorded by a native speaker, independent linguist review, optional sync with explicit consent. Current version is a functional starter, not a completed Russian course.

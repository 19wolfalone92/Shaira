/* Each worker serves one consistent version of the public course. */
importScripts("./assets/audio/cache-list.js");

const CACHE = "shaira-static-v23";
const SHELL = ["./", "./index.html", "./assets/styles.css", "./assets/lessons.js", "./assets/academy-data.js", "./assets/daily-plan.js", "./assets/daily-content.js", "./assets/daily-ui.js", "./assets/daily.css", "./assets/studio-lessons.js", "./assets/stage-checkpoints.js", "./assets/mastery-engine.js", "./assets/mastery-ui.js", "./assets/mastery.css", "./assets/declension-tables.js", "./assets/case-trainer.js", "./assets/case-trainer.css", "./assets/listening-clips.js", "./assets/listening-ui.js", "./assets/listening.css", "./assets/extended-word-packs.js", "./assets/extra-readings.js", "./assets/extra-writing-tasks.js", "./assets/extra-dialogues.js", "./assets/verb-paradigms.js", "./assets/practice-content.js", "./assets/practice-engine.js", "./assets/practice-ui.js", "./assets/practice.css", "./assets/verb-ui.js", "./assets/verb.css", "./assets/scenario-missions.js", "./assets/scenario-ui.js", "./assets/scenario.css", "./assets/phonetics-content.js", "./assets/phonetics-ui.js", "./assets/phonetics.css", "./assets/writing-coach.js", "./assets/study-coach.js", "./assets/study-coach.css", "./assets/course-search.js", "./assets/course-search-ui.js", "./assets/course-search.css", "./assets/first-steps-data.js", "./assets/first-steps-engine.js", "./assets/first-steps-ui.js", "./assets/first-steps.css", "./assets/first-words.js", "./assets/adult-word-packs.js", "./assets/backup.js", "./assets/grammar-drills.js", "./assets/grammar-handbook.js", "./assets/reading-library.js", "./assets/learning-labs.js", "./assets/writing-tasks.js", "./assets/learning-labs.css", "./assets/adult-theme.css", "./assets/dialogues.js", "./assets/academy-ui.js", "./assets/speaking-recorder.js", "./assets/academy.css", "./assets/app.js", "./manifest.webmanifest", "./icons/icon.svg", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./assets/russian-audio.js", "./assets/audio/cache-list.js"];
const scope = self.registration.scope;
const indexURL = new URL("index.html", scope).href;
const assets = new Set([...SHELL, ...AUDIO_FILES].map(path => new URL(path, scope).href));

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([...assets].map(url => new Request(url, {cache:"reload"})));
    // An open session stays with its worker until all Shaira windows close.
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("shaira-static-") && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function serve(url, request) {
  const cache = await caches.open(CACHE);
  return (await cache.match(url)) ?? fetch(request);
}

self.addEventListener("fetch", event => {
  const {request} = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate") {
    url.search = "";
    url.hash = "";
    if (url.href === scope || url.href === indexURL) event.respondWith(serve(indexURL, request));
  } else if (assets.has(url.href)) {
    event.respondWith(serve(url.href, request));
  }
});

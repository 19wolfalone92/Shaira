/* Cache only this app's public static files. No user progress or personal data is sent anywhere. */
const CACHE = "shaira-static-v19";
const SHELL = ["./", "./index.html", "./assets/styles.css", "./assets/lessons.js", "./assets/academy-data.js", "./assets/daily-plan.js", "./assets/daily-content.js", "./assets/daily-ui.js", "./assets/daily.css", "./assets/studio-lessons.js", "./assets/stage-checkpoints.js", "./assets/mastery-engine.js", "./assets/mastery-ui.js", "./assets/mastery.css", "./assets/declension-tables.js", "./assets/case-trainer.js", "./assets/case-trainer.css", "./assets/listening-clips.js", "./assets/listening-ui.js", "./assets/listening.css", "./assets/extended-word-packs.js", "./assets/extra-readings.js", "./assets/extra-writing-tasks.js", "./assets/extra-dialogues.js", "./assets/verb-paradigms.js", "./assets/practice-content.js", "./assets/practice-engine.js", "./assets/practice-ui.js", "./assets/practice.css", "./assets/verb-ui.js", "./assets/verb.css", "./assets/scenario-missions.js", "./assets/scenario-ui.js", "./assets/scenario.css", "./assets/phonetics-content.js", "./assets/phonetics-ui.js", "./assets/phonetics.css", "./assets/writing-coach.js", "./assets/study-coach.js", "./assets/study-coach.css", "./assets/first-words.js", "./assets/adult-word-packs.js", "./assets/backup.js", "./assets/grammar-drills.js", "./assets/grammar-handbook.js", "./assets/reading-library.js", "./assets/learning-labs.js", "./assets/writing-tasks.js", "./assets/learning-labs.css", "./assets/adult-theme.css", "./assets/dialogues.js", "./assets/academy-ui.js", "./assets/speaking-recorder.js", "./assets/academy.css", "./assets/app.js", "./manifest.webmanifest", "./icons/icon.svg", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("shaira-static-") && k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => (await caches.match("./index.html")) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
    if (response.ok && response.type === "basic") {
      const clone = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, clone)));
    }
    return response;
  })));
});

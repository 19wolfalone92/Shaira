import { sections, lessons, alphabet, keyboardRows } from "./lessons.js";

const STORAGE_KEY = "shaira-progress-v1";
const dictionary = {
  en: {
    tagline:"Russian, from the very first letter", home:"Learn", review:"Review", write:"Write", settings:"Settings",
    hello:"Hi, Shaira! 🌷", start:"A little Russian every day.", completed:"lessons completed",
    keep:"Your learning path", group:"Explore lessons", done:"Completed", begin:"Start lesson", continue:"Open lesson",
    back:"Back to lessons", goal:"Today's idea", card:"Study card", next:"Next card", check:"Check what you learned",
    listen:"Listen 🔊", answer:"Your answer in Russian", choose:"Choose one answer", checkAnswer:"Check answer",
    correct:"Correct! Excellent work.", incorrect:"Not quite. Try once more.", nextLesson:"Back to the course",
    cardCounter:"Card", lessonComplete:"Lesson completed!", finish:"Finish lesson", quick:"Quick practice",
    practiceIntro:"Review one question at a time. Practice doesn't change lesson completion.",
    newQuestion:"Another question", startReview:"Try this question", freehand:"Handwriting practice",
    writeIntro:"Trace the shape with your finger or stylus. This is freehand drawing, not handwriting recognition.",
    tip:"Draw slowly, then listen and copy the letter.", clear:"Clear", newLetter:"Next letter", letter:"Letter",
    language:"Explanation language", langInfo:"Russian content stays Russian. Explanations switch instantly.",
    progress:"Your progress", local:"Saved on this device only (no sign-in or cloud sync).",
    reset:"Erase local progress", resetConfirm:"Delete all lesson progress saved in this browser?",
    install:"Install on iPhone", installInfo:"In Safari, open the deployed HTTPS site, tap Share, then Add to Home Screen.",
    offline:"Offline lessons", offlineInfo:"After the first online visit, cached pages work offline. Spoken audio depends on iPhone voices.",
    audioUnavailable:"Russian voice playback is not supported in this browser.",
    answerHint:"Use the Cyrillic keyboard below or your phone keyboard.",
    keyboard:"Russian keyboard", skip:"Study next card →", progressSuffix:"of", learn:"Read • Write • Speak",
    errorStorage:"Progress cannot be saved in this browser session.", results:"Practice question",
    welcome:"Your first Russian steps", welcomeDesc:"Letters, reading, spelling, everyday speech, and real grammar—all at your pace.",
    footer:"Made for learning, not for collecting data.", about:"Shaira • Russian from zero"
  },
  tl: {
    tagline:"Ruso, mula sa unang titik", home:"Aralin", review:"Balikan", write:"Sumulat", settings:"Mga setting",
    hello:"Kumusta, Shaira! 🌷", start:"Kaunting Ruso bawat araw.", completed:"araling natapos",
    keep:"Iyong landas sa pag-aaral", group:"Pumili ng aralin", done:"Tapos na", begin:"Simulan", continue:"Buksan",
    back:"Bumalik sa mga aralin", goal:"Ideya ngayong araw", card:"Kard ng aralin", next:"Susunod na kard",
    check:"Subukan ang natutuhan", listen:"Makinig 🔊", answer:"Sagot sa Ruso", choose:"Pumili ng isang sagot",
    checkAnswer:"Suriin ang sagot", correct:"Tama! Napakahusay.", incorrect:"Hindi pa. Subukan muli.",
    nextLesson:"Bumalik sa kurso", cardCounter:"Kard", lessonComplete:"Tapos na ang aralin!",
    finish:"Tapusin ang aralin", quick:"Mabilis na pagsasanay",
    practiceIntro:"Isang tanong bawat pagkakataon. Hindi binabago ng pagsasanay ang bilang ng natapos na aralin.",
    newQuestion:"Ibang tanong", startReview:"Subukan ang tanong", freehand:"Pagsasanay sa pagsulat",
    writeIntro:"Iguhit ang titik gamit ang daliri o stylus. Malayang pagguhit ito, hindi awtomatikong pagsuri.",
    tip:"Dahan-dahang gumuhit, makinig, at gayahin ang titik.", clear:"Burahin", newLetter:"Susunod na titik",
    letter:"Titik", language:"Wika ng paliwanag",
    langInfo:"Mananatiling Ruso ang nilalaman. Magbabago agad ang mga paliwanag.",
    progress:"Iyong pag-usad", local:"Sa device lang naka-save (walang account o cloud sync).",
    reset:"Burahin ang pag-usad", resetConfirm:"Burahin ba ang lahat ng natapos na aralin sa browser na ito?",
    install:"I-install sa iPhone",
    installInfo:"Sa Safari, buksan ang na-publish na HTTPS site, pindutin ang Share, saka Add to Home Screen.",
    offline:"Mga araling offline", offlineInfo:"Pagkatapos ng unang pagbisita online, gagana offline ang mga naka-cache na pahina. Nakadepende sa iPhone ang audio.",
    audioUnavailable:"Hindi sinusuportahan ng browser na ito ang boses sa Ruso.",
    answerHint:"Gamitin ang Cyrillic keyboard sa ibaba o ang keyboard ng telepono.",
    keyboard:"Keyboard sa Ruso", skip:"Susunod na kard →", progressSuffix:"sa", learn:"Bumasa • Sumulat • Magsalita",
    errorStorage:"Hindi ma-save ang pag-usad sa browser na ito.", results:"Tanong sa pagsasanay",
    welcome:"Unang hakbang sa Ruso",
    welcomeDesc:"Mga titik, pagbabasa, pagbabaybay, pang-araw-araw na pag-uusap, at gramatika—sa sarili mong bilis.",
    footer:"Para sa pag-aaral, hindi para mangolekta ng data.", about:"Shaira • Ruso mula sa simula"
  }
};

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { language: raw.language === "tl" ? "tl" : "en",
      completed: Array.isArray(raw.completed) ? raw.completed.filter(id => lessons.some(l => l.id === id)) : [] };
  } catch { return { language:"en", completed:[] }; }
}
const state = loadState();
let lessonCardIndex = 0;
let feedback = null;
let reviewLesson = lessons[0].id;
let letterIndex = 0;
let drawingCleanup = null;

const el = document.getElementById("app");
const phrase = key => dictionary[state.language][key] || key;
const loc = value => typeof value === "string" ? value : (value?.[state.language] || value?.en || "");
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const progressPercent = () => Math.round(state.completed.length / lessons.length * 100);

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { showToast(phrase("errorStorage")); }
}
function showToast(message) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = message;
  node.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { node.hidden = true; }, 2800);
}
function navigate(route) {
  location.hash = route;
  if (location.hash.slice(1) === route) render();
}
function currentRoute() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith("lesson/") && lessons.some(l => l.id === hash.slice(7))) return hash;
  return ["home","review","write","settings"].includes(hash) ? hash : "home";
}
function speak(text) {
  if (!("speechSynthesis" in window)) { showToast(phrase("audioUnavailable")); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  utterance.rate = 0.78;
  const voices = window.speechSynthesis.getVoices();
  const russian = voices.find(v => v.lang.toLowerCase().startsWith("ru"));
  if (russian) utterance.voice = russian;
  window.speechSynthesis.speak(utterance);
}
function icon(id) {
  return {home:"⌂",review:"✦",write:"✎",settings:"⚙"}[id];
}
function navBar(route) {
  const active = route.split("/")[0] === "lesson" ? "home" : route;
  return `<nav class="bottom-nav" aria-label="Main navigation">${["home","review","write","settings"].map(id =>
    `<a href="#${id}" class="nav-item ${active === id ? "active" : ""}" ${active === id ? 'aria-current="page"' : ""}><span aria-hidden="true">${icon(id)}</span><small>${phrase(id)}</small></a>`).join("")}</nav>`;
}
function header() {
  return `<header class="topbar"><div class="brand-mark" aria-hidden="true">Ш</div><div><div class="brand">shaira<span class="brand-dot">.</span></div><div class="brand-caption">${phrase("tagline")}</div></div><span class="top-counter" aria-label="${state.completed.length} ${phrase("completed")}">${state.completed.length}/${lessons.length} ✓</span></header>`;
}
function home() {
  return `<section class="hero"><div class="hero-copy"><span class="pill">🇷🇺 ${phrase("learn")}</span><h1>${phrase("hello")}</h1><p>${phrase("welcomeDesc")}</p></div><div class="hero-flower" aria-hidden="true">Ж</div></section>
  <section class="progress-card" aria-label="${phrase("progress")}"><div class="progress-top"><strong>${phrase("keep")}</strong><span>${progressPercent()}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${progressPercent()}%"></div></div><small>${state.completed.length} ${phrase("progressSuffix")} ${lessons.length} ${phrase("completed")}</small></section>
  <h2 class="section-heading">${phrase("group")}</h2>
  ${sections.map(section => {
    const items = lessons.filter(l => l.section === section.id);
    return `<section class="course-section" aria-labelledby="group-${section.id}">
      <div class="course-heading"><div class="course-icon">${section.icon}</div><div><h3 id="group-${section.id}">${escapeHtml(loc(section.title))}</h3><p>${escapeHtml(loc(section.subtitle))}</p></div><span class="count">${items.filter(l => state.completed.includes(l.id)).length}/${items.length}</span></div>
      <div class="lesson-list">${items.map((lesson,i)=>`<button class="lesson-row" data-action="open-lesson" data-id="${lesson.id}">
        <span class="lesson-number ${state.completed.includes(lesson.id)?"finished":""}">${state.completed.includes(lesson.id)?"✓":i+1}</span>
        <span class="lesson-info"><strong>${escapeHtml(loc(lesson.title))}</strong><small>${state.completed.includes(lesson.id)?phrase("done"):escapeHtml(loc(lesson.goal))}</small></span>
        <span class="arrow" aria-hidden="true">›</span></button>`).join("")}</div></section>`;
  }).join("")}`;
}
function quizMarkup(lesson) {
  const quiz = lesson.quiz;
  const audio = quiz.type === "dictation" ? `<button class="audio-large" type="button" data-action="speak" data-text="${escapeHtml(quiz.speak)}">🔊 ${phrase("listen")}</button>` : "";
  const isChoice = quiz.type === "choice";
  return `<div class="quiz" id="quiz"><span class="eyebrow">${phrase("check")}</span><h2>${escapeHtml(loc(quiz.prompt))}</h2>${audio}
    ${isChoice ? `<div class="options" role="group" aria-label="${phrase("choose")}">${quiz.choices.map(opt=>`<button type="button" class="option" data-action="choose" data-value="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`).join("")}</div>` :
    `<form id="answer-form" autocomplete="off"><label for="answer-input">${phrase("answer")}</label><input id="answer-input" name="answer" type="text" lang="ru" spellcheck="false" autocomplete="off" autocapitalize="off" required placeholder="АБВ…" />
    <small class="input-hint">${phrase("answerHint")}</small><button class="primary-button" type="submit">${phrase("checkAnswer")}</button></form>${keyboard()}`}
    <div class="feedback ${feedback?.correct ? "success" : "error"}" ${feedback ? "" : "hidden"} role="status">${feedback ? escapeHtml(feedback.message) : ""}</div>
    ${feedback?.correct ? `<button class="primary-button" type="button" data-action="finish-lesson">${phrase("finish")} →</button>` : ""}</div>`;
}
function keyboard() {
  return `<div class="cyrillic-keyboard" aria-label="${phrase("keyboard")}"><div class="key-caption">${phrase("keyboard")}</div>${keyboardRows.map(row=>`<div class="key-row">${Array.from(row).map(key=>`<button type="button" data-action="type-key" data-char="${key.toLowerCase()}" aria-label="${key}">${key.toLowerCase()}</button>`).join("")}</div>`).join("")}<div class="key-row"><button type="button" class="space-key" data-action="type-key" data-char=" ">space</button><button type="button" data-action="delete-key">⌫</button></div></div>`;
}
function lessonPage(id) {
  const lesson = lessons.find(l => l.id === id);
  const section = sections.find(s => s.id === lesson.section);
  const count = lesson.cards.length;
  const inCards = lessonCardIndex < count;
  const card = lesson.cards[Math.min(lessonCardIndex, count - 1)];
  return `<div class="detail-heading"><button class="text-button" data-action="go-home">← ${phrase("back")}</button><span class="eyebrow">${escapeHtml(loc(section.title))}</span><h1>${escapeHtml(loc(lesson.title))}</h1><div class="goal-box"><strong>${phrase("goal")}</strong><p>${escapeHtml(loc(lesson.goal))}</p></div></div>
  ${inCards ? `<div class="study-card"><div class="card-top"><span>${phrase("cardCounter")} ${lessonCardIndex+1}/${count}</span><span class="card-step">${Math.round((lessonCardIndex+1)/count*100)}%</span></div>
    <div class="russian-text" lang="ru">${escapeHtml(card.ru)}</div>
    <button type="button" class="sound-button" data-action="speak" data-text="${escapeHtml(card.ru)}" aria-label="${phrase("listen")}">🔊 ${phrase("listen")}</button>
    <p class="translation">${escapeHtml(loc(card))}</p></div>
    <button class="primary-button wide" type="button" data-action="next-card">${lessonCardIndex+1 === count ? phrase("check") : phrase("next")} →</button>` : quizMarkup(lesson)}`;
}
function reviewPage() {
  const lesson = lessons.find(l => l.id === reviewLesson) || lessons[0];
  return `<div class="page-intro"><span class="eyebrow">✦ ${phrase("review")}</span><h1>${phrase("quick")}</h1><p>${phrase("practiceIntro")}</p></div>
    <div class="mini-lesson-title">${escapeHtml(loc(lesson.title))}</div>
    ${quizMarkup(lesson)}
    <button class="secondary-button wide" type="button" data-action="new-question">${phrase("newQuestion")} ↻</button>`;
}
function writePage() {
  const letter = alphabet[letterIndex % alphabet.length];
  return `<div class="page-intro"><span class="eyebrow">✎ ${phrase("write")}</span><h1>${phrase("freehand")}</h1><p>${phrase("writeIntro")}</p></div>
    <div class="write-card"><div class="writing-guide"><span>${phrase("letter")} ${letterIndex%alphabet.length+1}/${alphabet.length}</span><button class="sound-button" type="button" data-action="speak" data-text="${letter}">🔊 ${phrase("listen")}</button></div>
      <div class="letter-large" lang="ru">${letter} <span>${letter.toLowerCase()}</span></div>
      <div class="canvas-wrap"><div class="guide-letter" aria-hidden="true">${letter}</div><canvas id="writing-canvas" aria-label="${phrase("freehand")}" role="img"></canvas></div>
      <p class="canvas-caption">${phrase("tip")}</p><div class="write-buttons"><button class="secondary-button" type="button" data-action="clear-canvas">${phrase("clear")}</button><button class="primary-button" type="button" data-action="next-letter">${phrase("newLetter")} →</button></div></div>`;
}
function settingsPage() {
  return `<div class="page-intro"><span class="eyebrow">⚙ ${phrase("settings")}</span><h1>${phrase("settings")}</h1></div>
    <section class="settings-card"><h2>${phrase("language")}</h2><p>${phrase("langInfo")}</p><div class="lang-switch" role="group" aria-label="${phrase("language")}">
      <button type="button" data-action="language" data-value="en" class="${state.language==="en"?"selected":""}" aria-pressed="${state.language==="en"}">🇬🇧 English</button>
      <button type="button" data-action="language" data-value="tl" class="${state.language==="tl"?"selected":""}" aria-pressed="${state.language==="tl"}">🇵🇭 Filipino</button></div></section>
    <section class="settings-card"><h2>${phrase("progress")}</h2><p>${state.completed.length}/${lessons.length} ${phrase("completed")}. ${phrase("local")}</p>
      <button type="button" class="danger-button" data-action="reset">${phrase("reset")}</button></section>
    <section class="settings-card"><h2>📱 ${phrase("install")}</h2><p>${phrase("installInfo")}</p></section>
    <section class="settings-card"><h2>☁ ${phrase("offline")}</h2><p>${phrase("offlineInfo")}</p></section>`;
}
function render() {
  if (drawingCleanup) { drawingCleanup(); drawingCleanup = null; }
  const route = currentRoute();
  const page = route === "home" ? home() : route === "review" ? reviewPage() : route === "write" ? writePage() :
    route === "settings" ? settingsPage() : lessonPage(route.slice(7));
  document.documentElement.lang = state.language === "tl" ? "fil" : "en";
  document.title = "Shaira · Learn Russian";
  el.innerHTML = `${header()}<main id="main-content" class="main-content">${page}<footer class="footer">${phrase("footer")}</footer></main>${navBar(route)}<div id="toast" class="toast" role="status" hidden></div>`;
  if (route === "write") initializeCanvas();
}
function checkAnswer(value) {
  const route = currentRoute();
  const lesson = route === "review" ? lessons.find(l => l.id === reviewLesson) : lessons.find(l => l.id === route.slice(7));
  if (!lesson) return;
  const normalize = str => String(str).trim().replace(/\s+/g," ").toLocaleLowerCase("ru-RU");
  const correct = normalize(value) === normalize(lesson.quiz.answer);
  feedback = { correct, message: phrase(correct ? "correct" : "incorrect") };
  if (correct && route !== "review" && !state.completed.includes(lesson.id)) {
    state.completed.push(lesson.id);
    save();
  }
  // Preserve typed input after wrong answers.
  render();
  if (!correct && lesson.quiz.type !== "choice") document.getElementById("answer-input")?.focus();
}
function initializeCanvas() {
  const canvas = document.getElementById("writing-canvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(ratio,0,0,ratio,0,0);
  ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 6;
  ctx.strokeStyle = "#574bce";
  let drawing = false;
  const coords = ev => { const bounds=canvas.getBoundingClientRect(); return [ev.clientX-bounds.left,ev.clientY-bounds.top]; };
  function down(ev) { ev.preventDefault(); drawing = true; canvas.setPointerCapture?.(ev.pointerId); const [x,y]=coords(ev); ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+.01,y+.01);ctx.stroke(); }
  function move(ev) { if (!drawing) return; ev.preventDefault(); const [x,y]=coords(ev); ctx.lineTo(x,y);ctx.stroke(); }
  function up() { drawing=false; }
  canvas.addEventListener("pointerdown",down); canvas.addEventListener("pointermove",move);
  canvas.addEventListener("pointerup",up); canvas.addEventListener("pointercancel",up);
  drawingCleanup = () => {canvas.removeEventListener("pointerdown",down);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",up);};
}
document.addEventListener("click", event => {
  const button=event.target.closest("[data-action]");
  if (!button) return;
  const action=button.dataset.action;
  if (action === "open-lesson") { lessonCardIndex=0;feedback=null;navigate("lesson/"+button.dataset.id); }
  else if (action === "go-home") navigate("home");
  else if (action === "next-card") { lessonCardIndex++;feedback=null;render(); }
  else if (action === "speak") speak(button.dataset.text);
  else if (action === "choose") checkAnswer(button.dataset.value);
  else if (action === "finish-lesson") { feedback=null;navigate("home"); }
  else if (action === "new-question") {
    const current=reviewLesson;
    const alternatives=lessons.filter(l=>l.id!==current);
    reviewLesson=alternatives[Math.floor(Math.random()*alternatives.length)]?.id || current;
    feedback=null;render();
  }
  else if (action === "next-letter") {letterIndex++;render();}
  else if (action === "clear-canvas") {const canvas=document.getElementById("writing-canvas");canvas?.getContext("2d")?.clearRect(0,0,canvas.width,canvas.height);}
  else if (action === "language") { state.language=button.dataset.value === "tl" ? "tl" : "en"; save();feedback=null;render(); }
  else if (action === "reset") { if (window.confirm(phrase("resetConfirm"))) {state.completed=[];save();render();} }
  else if (action === "type-key" || action === "delete-key") {
    const input=document.getElementById("answer-input");if(!input)return;
    const start=input.selectionStart ?? input.value.length, end=input.selectionEnd ?? start;
    if(action==="type-key"){
      const chr=button.dataset.char || "";
      input.setRangeText(chr,start,end,"end");
    }else if(start!==end)input.setRangeText("",start,end,"end");
    else if(start>0)input.setRangeText("",start-1,start,"end");
    input.focus();
  }
});
document.addEventListener("submit", event => {
  if (event.target.id !== "answer-form") return;
  event.preventDefault();
  const value=document.getElementById("answer-input")?.value;
  if (value) checkAnswer(value);
});
window.addEventListener("hashchange",() => {lessonCardIndex=0;feedback=null;render();});
render();
if ("serviceWorker" in navigator) {
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}

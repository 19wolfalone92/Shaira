import { sections, lessons, alphabet, keyboardRows } from "./lessons.js";
import { academyHtml, handleAcademyAction, handleAcademySubmit, academyStatistics } from "./academy-ui.js";
import { downloadBackup, restoreBackup } from "./backup.js";
import {labHtml,labAction,labInput,labStats} from "./learning-labs.js";

const STORAGE_KEY = "shaira-progress-v1";
const dictionary = {
  en: {
    tagline:"Russian, from the very first letter", home:"Learn", academy:"School", review:"Review", write:"Write", settings:"Settings",
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
    tagline:"Ruso, mula sa unang titik", home:"Aralin", academy:"Akademya", review:"Balikan", write:"Sumulat", settings:"Mga setting",
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
let writingMode = "letters";
let lowerCase = false;
const handwritingWords = ["мама","папа","дом","кот","мир","вода","книга","семья","привет","спасибо","солнце","язык","друзья","любовь","письмо","здравствуйте"];
const handwritingSentences = ["Это дом.","Меня зовут Шаира.","Я учу русский.","Как дела?","У меня есть книга.","Мне нравится музыка.","Я читаю письмо.","Я тебя люблю."];
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
  return hash === "academy" || hash.startsWith("academy/") ? hash : ["home","review","write","settings"].includes(hash) ? hash : "home";
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
  return {home:"⌂",academy:"🎓",review:"✦",write:"✎",settings:"⚙"}[id];
}
function navBar(route) {
  const active = route.startsWith("academy") ? "academy" : route.split("/")[0] === "lesson" ? "home" : route;
  return `<nav class="bottom-nav" aria-label="Main navigation">${["home","academy","review","write","settings"].map(id =>
    `<a href="#${id}" class="nav-item ${active === id ? "active" : ""}" ${active === id ? 'aria-current="page"' : ""}><span aria-hidden="true">${icon(id)}</span><small>${phrase(id)}</small></a>`).join("")}</nav>`;
}
function header() {
  return `<header class="topbar"><div class="brand-mark" aria-hidden="true">Ш</div><div><div class="brand">shaira<span class="brand-dot">.</span></div><div class="brand-caption">${phrase("tagline")}</div></div><a class="top-counter" href="#academy" aria-label="${phrase("progress")}">${academyStatistics().completed} ✓</a></header>`;
}
function home() {
  const a=academyStatistics(),labs=labStats();
  const first=lessons.find(l=>!state.completed.includes(l.id));
  const l=state.language, fil=l==="tl";
  const headline=fil?"Kumusta, Shaira. Simulan natin ang Ruso.":"Shaira, Russian starts here.";
  const detail=fil?"Isang kumpletong landas sa pagbabasa, pagsulat at pakikipag-usap. Magsimula sa alpabeto at umusad sa sariling bilis.":
    "Learn to read, write and communicate in Russian. Start with Cyrillic and build your skills at your own pace.";
  const summaryTitle=fil?"Iyong pag-unlad":"Your learning path";
  const sectionsText=fil?["Alpabeto at unang pantig","Mga pangunahing salita","Gramatika at pagbasa","Pagsulat ng sariling teksto"]:
    ["Alphabet and first syllables","Essential vocabulary","Grammar and reading","Independent writing"];
  const routeCards=[
    {href:first?"#lesson/"+first.id:"#academy/first-words",icon:"Аа",heading:sectionsText[0],sub:fil?"33 titik • tunog at baybay":"33 letters • sounds and spelling"},
    {href:"#academy/first-words",icon:"01",heading:sectionsText[1],sub:fil?"120 salita • maiikling paksa":"120 words • practical topics"},
    {href:"#academy/lab",icon:"✳",heading:sectionsText[2],sub:fil?"100 tanong • 20 mahabang teksto":"100 questions • 20 graded texts"},
    {href:"#academy/library",icon:"✎",heading:sectionsText[3],sub:fil?"Sulat • mga draft • rebisyon":"Writing • drafts • revision"}
  ];
  return '<section class="adult-welcome"><div class="adult-welcome-copy"><span class="adult-eyebrow">SHAIRA · LEARN RUSSIAN</span><h1>'+headline+'</h1><p>'+detail+'</p>'+
     '<a class="adult-cta" href="'+routeCards[0].href+'">'+(fil?"Simulan ang unang aralin":"Start the first lesson")+' →</a></div><div class="adult-russian" aria-hidden="true">Я</div></section>'+
   '<section class="adult-progress"><h2>'+summaryTitle+'</h2><div class="adult-progress-row"><span><strong>'+state.completed.length+'</strong><small>/'+lessons.length+' '+(fil?"panimulang aralin":"foundation lessons")+'</small></span>'+
   '<span><strong>'+a.completed+'</strong><small>/'+a.activities+' '+(fil?"pagsasanay":"course activities")+'</small></span>'+
   '<span><strong>'+labs.readingsPassed+'</strong><small>/'+labs.readingsTotal+' '+(fil?"teksto":"reading texts")+'</small></span></div>'+
   '<p class="adult-muted">'+(fil?"Layunin ang aktuwal na kasanayan, hindi lamang ang bilang ng natapos.":"The goal is real competence, not a completion counter.")+'</p></section>'+
   '<h2 class="adult-heading">'+(fil?"Pumili ng pagsasanay":"Choose your next step")+'</h2><div class="adult-route-grid">'+
   routeCards.map(x=>'<a href="'+x.href+'"><span>'+x.icon+'</span><div><strong>'+x.heading+'</strong><small>'+x.sub+'</small></div><b>›</b></a>').join("")+'</div>'+
   '<a class="adult-course-link" href="#academy"><span>↗</span><div><strong>'+(fil?"Buksan ang buong kurso: Pre-A1 hanggang B2":"Explore the full course: Pre-A1 through B2")+'</strong>'+
    '<small>'+(fil?"Iisang landas ng pag-aaral na may mga paksa at gawain":"A structured learning route with topics and practice")+'</small></div></a>'+
   '<details class="adult-foundations" '+(state.completed.length===0?'open':'')+'><summary><strong>'+(fil?"Unang mga aralin: alpabeto, pagbasa, parirala":"Foundation lessons: alphabet, reading, phrases")+'</strong><span>'+state.completed.length+'/'+lessons.length+'</span></summary>'+
    sections.map(section=>'<section class="course-section"><div class="course-heading"><div class="course-icon">'+section.icon+'</div><div><h3>'+escapeHtml(loc(section.title))+'</h3><p>'+escapeHtml(loc(section.subtitle))+'</p></div></div>'+
    '<div class="lesson-list">'+lessons.filter(lesson=>lesson.section===section.id).map(lesson=>
     '<button class="lesson-row" type="button" data-action="open-lesson" data-id="'+lesson.id+'"><span class="lesson-number '+(state.completed.includes(lesson.id)?"finished":"")+'">'+(state.completed.includes(lesson.id)?"✓":"→")+'</span>'+
     '<span class="lesson-info"><strong>'+escapeHtml(loc(lesson.title))+'</strong><small>'+escapeHtml(loc(lesson.goal))+'</small></span><span class="arrow">›</span></button>').join("")+'</div></section>').join("")+'</details>';
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
    ${feedback?.correct && currentRoute() !== "review" ? `<button class="primary-button" type="button" data-action="finish-lesson">${phrase("finish")} →</button>` : ""}</div>`;
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
  const items = writingMode==="words" ? handwritingWords : writingMode==="sentences" ? handwritingSentences : alphabet;
  const position=letterIndex%items.length,raw=items[position];
  const target=writingMode==="letters"&&lowerCase?raw.toLowerCase():raw;
  const t=state.language==="tl"?{
    letters:"Mga titik",words:"Mga salita",sentences:"Mga pangungusap",case:"Malaki/maliit na titik",
    description:"Magsanay sa mga titik, salita at pangungusap. Sundan ang mapusyaw na hugis gamit ang daliri o stylus.",
    explanation:"Hindi awtomatikong sinusuri ng app ang sinulat mo. Pakinggan, kopyahin, saka ihambing ang hugis."
  }:{
    letters:"Letters",words:"Words",sentences:"Sentences",case:"Uppercase / lowercase",
    description:"Practise letters, words and full sentences. Trace the pale guide with your finger or stylus.",
    explanation:"Drawing is not automatically marked. Listen, copy, then compare your shapes."
  };
  const modeButtons=["letters","words","sentences"].map(id=>
    '<button type="button" data-action="write-mode" data-value="'+id+'" aria-pressed="'+(writingMode===id)+'" class="'+(writingMode===id?"selected":"")+'">'+t[id]+'</button>').join("");
  const heading=writingMode==="letters" ?
    '<div class="letter-large" lang="ru">'+escapeHtml(target)+' <span>'+escapeHtml(target===raw?raw.toLowerCase():raw.toUpperCase())+'</span></div>'+
      '<button class="case-toggle" type="button" data-action="letter-case">'+t.case+' ⇆</button>' :
    '<div class="writing-target" lang="ru">'+escapeHtml(target)+'</div>';
  return '<div class="page-intro"><span class="eyebrow">✎ '+phrase("write")+'</span><h1>'+phrase("freehand")+'</h1><p>'+t.description+'</p></div>'+
    '<div class="writing-modes" role="group" aria-label="'+phrase("write")+'">'+modeButtons+'</div>'+
    '<div class="write-card"><div class="writing-guide"><span>'+(position+1)+'/'+items.length+'</span><button class="sound-button" type="button" data-action="speak" data-text="'+escapeHtml(target)+'">🔊 '+phrase("listen")+'</button></div>'+
    heading+
    '<div class="canvas-wrap"><div class="guide-letter '+(writingMode==="sentences"?"sentence":writingMode==="words"?"long":"")+'" aria-hidden="true">'+escapeHtml(target)+'</div><canvas id="writing-canvas" aria-label="'+phrase("freehand")+'" role="img"></canvas></div>'+
    '<p class="canvas-caption">'+t.explanation+'</p><div class="write-buttons"><button class="secondary-button" type="button" data-action="clear-canvas">'+phrase("clear")+'</button><button class="primary-button" type="button" data-action="next-letter">'+phrase("newLetter")+' →</button></div>'+
    '<a class="writing-academy-link" href="#academy">'+(state.language==="tl"?"📚 Magpatuloy sa kursong pagsulat":"📚 Continue sentence writing in the Academy")+' →</a></div>';
}
function settingsPage() {
  const academy = academyStatistics();
  const labs = labStats();
  return `<div class="page-intro"><span class="eyebrow">⚙ ${phrase("settings")}</span><h1>${phrase("settings")}</h1></div>
    <section class="settings-card"><h2>${phrase("language")}</h2><p>${phrase("langInfo")}</p><div class="lang-switch" role="group" aria-label="${phrase("language")}">
      <button type="button" data-action="language" data-value="en" class="${state.language==="en"?"selected":""}" aria-pressed="${state.language==="en"}">🇬🇧 English</button>
      <button type="button" data-action="language" data-value="tl" class="${state.language==="tl"?"selected":""}" aria-pressed="${state.language==="tl"}">🇵🇭 Filipino</button></div></section>
    <section class="settings-card"><h2>${phrase("progress")}</h2><p>${state.completed.length}/${lessons.length} ${phrase("completed")}. ${phrase("local")}</p>
      <button type="button" class="danger-button" data-action="reset">${phrase("reset")}</button></section>
    <section class="settings-card"><h2>🎓 ${state.language==="tl"?"Pag-usad sa Akademya":"Academy progress"}</h2><p>${academy.completed}/${academy.activities} ${state.language==="tl"?"gawaing nasanay":"activities practised"} · ${academy.knownWords} ${state.language==="tl"?"salitang napag-aralan":"studied words"} · ${academy.dueWords} ${state.language==="tl"?"dapat balikan":"due to review"} · ${labs.grammarAttempts} ${state.language==="tl"?"pagsubok sa gramatika":"grammar sessions"} · ${labs.readingsPassed} ${state.language==="tl"?"tekstong nabasa":"reading checks passed"}</p></section>
    <section class="settings-card"><h2>💾 ${state.language==="tl"?"I-save at ibalik ang pag-usad":"Export and restore progress"}</h2><p>${state.language==="tl"?"I-save ang progreso at mga draft sa isang pribadong JSON file. Ang pag-import ay papalit sa kasalukuyang pag-usad sa device na ito.":"Save your lessons and writing drafts in a private JSON file. Import replaces progress on this device. Keep this file private."}</p><div class="backup-buttons"><button class="secondary-button" type="button" data-action="export-backup">📤 ${state.language==="tl"?"I-export":"Export progress"}</button><button class="secondary-button" type="button" data-action="import-backup">📥 ${state.language==="tl"?"I-import":"Import backup"}</button></div><input id="backup-file" type="file" accept=".json,application/json" hidden aria-label="Shaira JSON backup"></section>
    <section class="settings-card"><h2>📱 ${phrase("install")}</h2><p>${phrase("installInfo")}</p></section>
    <section class="settings-card"><h2>☁ ${phrase("offline")}</h2><p>${phrase("offlineInfo")}</p></section>`;
}
function render() {
  if (drawingCleanup) { drawingCleanup(); drawingCleanup = null; }
  const route = currentRoute();
  const page = route === "home" ? home() : route === "academy/lab" || route.startsWith("academy/grammar") || route.startsWith("academy/library") ? labHtml(route,state.language) : route.startsWith("academy") ? academyHtml(route,state.language) : route === "review" ? reviewPage() : route === "write" ? writePage() :
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
  // Keep the learner on the same question for another attempt.
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
  const labButton=event.target.closest("[data-lab]");
  if(labButton){labAction(labButton,{language:()=>state.language,route:currentRoute,render,speak,navigate,notice:showToast});return;}
  const academyButton=event.target.closest("[data-aca]");
  if(academyButton){handleAcademyAction(academyButton,{language:()=>state.language,route:currentRoute,render,speak,navigate});return;}
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
  else if (action === "write-mode") {writingMode=["letters","words","sentences"].includes(button.dataset.value)?button.dataset.value:"letters";letterIndex=0;render();}
  else if (action === "letter-case") {lowerCase=!lowerCase;render();}
  else if (action === "clear-canvas") {const canvas=document.getElementById("writing-canvas");canvas?.getContext("2d")?.clearRect(0,0,canvas.width,canvas.height);}
  else if (action === "language") { state.language=button.dataset.value === "tl" ? "tl" : "en"; save();feedback=null;render(); }
  else if (action === "export-backup") { try {downloadBackup();}catch(error){showToast(String(error.message||error));} }
  else if (action === "import-backup") { document.getElementById("backup-file")?.click(); }
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
document.addEventListener("input", event => {labInput(event,{language:()=>state.language});});
document.addEventListener("submit", event => {
  if(handleAcademySubmit(event,{language:()=>state.language,route:currentRoute,render,speak}))return;
  if (event.target.id !== "answer-form") return;
  event.preventDefault();
  const value=document.getElementById("answer-input")?.value;
  if (value) checkAnswer(value);
});
document.addEventListener("change", async event => {
  if(event.target.id!=="backup-file")return;
  const file=event.target.files?.[0];
  if(!file)return;
  try {
    if(file.size>3000000)throw new Error("Backup file is too large.");
    const data=await file.text();
    const confirmMessage=state.language==="tl"?"Papalitan ng backup ang kasalukuyang progreso at draft sa device. Magpatuloy?":"Importing will replace current progress and drafts on this device. Continue?";
    if(!window.confirm(confirmMessage))return;
    restoreBackup(data);
    window.location.reload();
  } catch(error){showToast(String(error.message||error));}
  finally{event.target.value="";}
});
window.addEventListener("hashchange",() => {lessonCardIndex=0;feedback=null;render();});
render();
if ("serviceWorker" in navigator) {
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}

import {stages,units,activityModes,getUnit,getStage,academyLessonTotal} from "./academy-data.js";
import {firstWordPacks} from "./first-words.js";
import {dialogues} from "./dialogues.js";
import {startPrivateRecording,stopPrivateRecording,discardPrivateRecording,isRecordingSupported} from "./speaking-recorder.js";
const KEY="shaira-academy-v1";
const MS_DAY=86400000, STEPS=[1,3,7,14,30];
const UI={
  en:{title:"Your Russian Academy",intro:"A real learning path from letters to complex ideas. Start small; practise every skill.",start:"Start here",progress:"Learning progress",total:"activities practised",back:"Back",curriculum:"Curriculum",review:"Memory garden",reviewInfo:"Bring back words after 1, 3, 7, 14 and 30 days.",due:"due now",practice:"Review words",track:"Explore this stage",detail:"What you will learn",goal:"Your target",vocab:"New vocabulary",continue:"Let's practise",learnFirst:"Look, listen and repeat first",testNow:"Now remember the words",choose:"Choose the meaning",tryAgain:"Not yet. Review and try again.",good:"Yes! Keep going.",next:"Next →",finish:"Activity completed!",restart:"Try again",show:"Show translation",hide:"Hide translation",readQuestion:"Check your reading",writePrompt:"Type your Russian answer",writeHint:"You can use the Cyrillic keyboard or your phone's Russian keyboard.",send:"Check my answer",showAnswer:"Show model answer",sample:"Sample response — not the only valid answer",journalPrompt:"Write freely in Russian",journalInfo:"A writing workshop, not automatic grammar marking. Save a draft, compare with the model and ask a teacher for feedback.",save:"Save draft",saved:"Draft saved on this device",count:"words written",keyboard:"Russian keyboard",speak:"Listen & repeat aloud",spoken:"I practised aloud",speechInfo:"Speak the sentence yourself, then mark it practised. This app does not score pronunciation.",audio:"Play Russian audio",noAudio:"Speech synthesis is unavailable: use the displayed Russian text and practise reading.",read:"Read the passage",model:"Study this example",meaning:"Meaning",completed:"Completed",reviewEmpty:"No studied words yet. Start a vocabulary unit first.",reviewAll:"No due words; you can practise known ones without changing their review schedule.",reset:"Start over",notice:"Activity counts are practice milestones, not proof of CEFR competence.",learnMore:"Open unit",studyNext:"Continue studying",saveError:"Your browser cannot save right now.",correct:"Correct",answer:"Correct answer",submit:"Check",retry:"Practice again",today:"Today's memory",notTested:"Listening unavailable: this question is reading practice and is not marked as listening.",writeCourse:"Sentence writing",letters:"Cyrillic tracing",writingHelp:"Use the writing workshop for longer compositions, or the letter canvas for handwriting.",talk:"Say the sentence out loud",question:"Check understanding",word:"word",words:"words",modelNote:"Russian spelling and punctuation are checked for the exact model sentence. Your own essays require human feedback.",courseGuide:"Every unit has vocabulary, listening, grammar, reading, sentence writing, speaking and a writing workshop.",stars:"practice points",doneMode:"Practised",settings:"Your drafts are private to this browser. Clearing browser data erases them.",journalMin:"A few sentences are enough to begin; at B2 aim for a structured longer text.",offline:"Available without an account. Audio depends on installed voices."},
  tl:{title:"Akademya ng Ruso",intro:"Landas mula sa alpabeto hanggang masalimuot na ideya. Magsimula nang dahan-dahan at sanayin ang bawat kasanayan.",start:"Magsimula rito",progress:"Pag-usad sa pag-aaral",total:"gawaing nasanay",back:"Bumalik",curriculum:"Kurso",review:"Hardin ng alaala",reviewInfo:"Balikan ang mga salita pagkaraan ng 1, 3, 7, 14 at 30 araw.",due:"dapat balikan",practice:"Balikan ang salita",track:"Tingnan ang antas",detail:"Matututuhan mo",goal:"Iyong layunin",vocab:"Bagong bokabularyo",continue:"Magsanay",learnFirst:"Tingnan, pakinggan at ulitin muna",testNow:"Subukan nang alalahanin",choose:"Piliin ang kahulugan",tryAgain:"Hindi pa. Balikan at subukan uli.",good:"Tama! Magpatuloy.",next:"Susunod →",finish:"Natapos ang gawain!",restart:"Subukan uli",show:"Ipakita ang salin",hide:"Itago ang salin",readQuestion:"Suriin ang binasa",writePrompt:"Isulat ang sagot sa Ruso",writeHint:"Gamitin ang Cyrillic keyboard o keyboard ng telepono.",send:"Suriin ang sagot",showAnswer:"Ipakita ang halimbawang sagot",sample:"Halimbawang tugon — hindi lamang ito ang tamang sagot",journalPrompt:"Malayang sumulat sa Ruso",journalInfo:"Pagsasanay ito sa pagsulat, hindi awtomatikong pagsusuri ng gramatika. I-save ang draft, ihambing at magtanong sa guro.",save:"I-save ang draft",saved:"Na-save sa device na ito",count:"salitang naisulat",keyboard:"Keyboard sa Ruso",speak:"Makinig at ulitin nang malakas",spoken:"Nagsanay akong magsalita",speechInfo:"Ikaw ang magsalita at itala na nagsanay ka. Hindi sinusuri ng app ang bigkas.",audio:"Patugtugin ang boses",noAudio:"Walang boses sa browser: basahin ang nakasulat na Ruso.",read:"Basahin ang teksto",model:"Aralin ang halimbawa",meaning:"Kahulugan",completed:"Tapos na",reviewEmpty:"Wala pang napag-aralang salita. Magsimula sa bokabularyo.",reviewAll:"Walang salitang dapat balikan ngayon; maaari pa ring magsanay nang hindi gagalawin ang iskedyul.",reset:"Magsimula uli",notice:"Hindi sertipikasyon ng CEFR ang dami ng natapos na gawain.",learnMore:"Buksan ang yunit",studyNext:"Magpatuloy",saveError:"Hindi ma-save sa browser na ito.",correct:"Tama",answer:"Tamang sagot",submit:"Suriin",retry:"Ulitin ang pagsasanay",today:"Alaala ngayon",notTested:"Walang audio: pagbabasa ang pagsasanay na ito, hindi ito bibilangin bilang listening.",writeCourse:"Pagsulat ng pangungusap",letters:"Pagsulat ng mga titik",writingHelp:"Gamitin ang writing workshop para sa mas mahabang sulatin o ang canvas para sa mga titik.",talk:"Sabihin nang malakas",question:"Suriin ang pag-unawa",word:"salita",words:"mga salita",modelNote:"Sinusuri ang eksaktong halimbawang pangungusap. Kailangan ng guro para sa sariling sanaysay.",courseGuide:"May salita, pakikinig, gramatika, pagbabasa, pagsulat ng pangungusap, pagsasalita at writing workshop sa bawat yunit.",stars:"puntos sa pagsasanay",doneMode:"Nagsanay",settings:"Pribado ang mga draft sa browser na ito. Mawawala ang mga ito kung lilinisin ang browser data.",journalMin:"Magsimula sa ilang pangungusap; sa B2, subukan ang mas mahabang organisadong teksto.",offline:"Gumagana nang walang account. Ang audio ay nakadepende sa voice ng device."}
};
const defaultStore=()=>({done:{},memory:{},drafts:{},points:0});
function loadStore(){
  try{const raw=JSON.parse(localStorage.getItem(KEY)||"{}");return {...defaultStore(),...raw,
    done:raw?.done&&typeof raw.done==="object"?raw.done:{},
    memory:raw?.memory&&typeof raw.memory==="object"?raw.memory:{},
    drafts:raw?.drafts&&typeof raw.drafts==="object"?raw.drafts:{},
    points:Number.isFinite(raw.points)?raw.points:0};}
  catch{return defaultStore();}
}
const store=loadStore();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tx=(en,tl,l)=>l==="tl"?tl:en;
const val=(v,l)=>v?.[l]||v?.en||"";
const wordKey=(u,w)=>u.id+":"+w.ru;
const modeDone=(u,m)=>!!store.done[u.id+"/"+m];
const wordPackUnit=p=>({id:p.id,words:p.words});
const totalActivities=academyLessonTotal+firstWordPacks.length+dialogues.length;
const unitDone=u=>activityModes.filter(m=>modeDone(u,m.id)).length;
const pct=(done,total)=>Math.round(100*done/Math.max(1,total));
const buttons=(opts,action)=>opts.map((opt,i)=>'<button type="button" class="aca-choice" data-aca="'+action+'" data-choice="'+esc(i)+'">'+esc(opt)+'</button>').join("");
const marker=(u,m)=>modeDone(u,m.id)?'<span class="aca-check">✓</span>':'<span class="aca-chev">›</span>';
const speechAvailable=()=>typeof window!=="undefined"&&"speechSynthesis" in window;
let session=null;
let transient={notice:""};
function persist(){
  try{localStorage.setItem(KEY,JSON.stringify(store));return true;}
  catch{return false;}
}
function mark(u,mode){
  const key=u.id+"/"+mode;
  if(!store.done[key])store.points+=10;
  store.done[key]=Date.now();persist();
}
const tokens=s=>String(s||"").trim().split(/\s+/).filter(Boolean);
const standard=s=>String(s).toLocaleLowerCase("ru-RU").normalize("NFC").replace(/[«»"„”“!?.:,;—–\s]+/g," ").trim();
function randomOrder(n){const a=Array.from({length:n},(_,i)=>i);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function buildWordQuiz(u,l,mode,reviewItems){
  const all=reviewItems||u.words.map(w=>({u,w}));
  return all.map(({u:unit,w})=>{
    const pool=reviewItems ? reviewItems.map(x=>x.w).concat(units.flatMap(x=>x.words),firstWordPacks.flatMap(x=>x.words)) : unit.words;
    const seen=new Set([val(w,l)]);
    const distractors=[];
    for(const d of pool){if(d.ru===w.ru||seen.has(val(d,l)))continue;seen.add(val(d,l));distractors.push(d);if(distractors.length>=12)break;}
    const chosen=randomOrder(distractors.length).slice(0,3).map(i=>distractors[i]);
    const choices=[w,...chosen].map(x=>val(x,l));
    const order=randomOrder(choices.length);
    return {u:unit,w,choices:order.map(i=>choices[i]),correct:val(w,l)};
  });
}
function schedule(u,w,correct,scheduled=true){
  const key=wordKey(u,w),old=store.memory[key]||{stage:-1,due:0,seen:0,correct:0};
  const now=Date.now(),due=Number(old.due)||0;
  let stage=old.stage;
  let next=due;
  if(!correct){stage=-1;next=now;}
  else if(scheduled&&due<=now){stage=Math.min(4,stage+1);next=now+STEPS[stage]*MS_DAY;}
  store.memory[key]={stage,due:next,seen:old.seen+1,correct:old.correct+Number(correct)};
  persist();
}
function memoryDue(){
  const all=units.concat(firstWordPacks.map(wordPackUnit));
  const map=new Map(all.flatMap(u=>u.words.map(w=>[wordKey(u,w),{u,w}])));
  const known=Object.entries(store.memory).filter(([k,v])=>map.has(k)&&v&&v.seen>0).map(([k,v])=>({...map.get(k),record:v}));
  const due=known.filter(x=>Number(x.record.due)<=Date.now()).sort((a,b)=>a.record.due-b.record.due);
  return {known,due};
}
function ensureSession(route,l){
  if(session?.key===route&&session.lang===l)return session;
  const [,tag,id,mode]=route.split("/");
  const u=getUnit(id);
  const pack=firstWordPacks.find(p=>p.id===id);
  const dialogue=dialogues.find(d=>d.id===id);
  if(tag==="dialogues"&&dialogue){
    session={key:route,lang:l,mode:"dialogue",phase:"quiz",d:dialogue,choices:randomOrder(dialogue.choices.length).map(i=>dialogue.choices[i]),answered:false,good:false,correct:dialogue.answer,show:false};
  }else if(tag==="first-words"&&pack){
    const pseudo=wordPackUnit(pack);
    session={key:route,lang:l,u:pseudo,mode:"first-words",phase:"study",index:0,mistakes:0,answered:false,show:false,tasks:buildWordQuiz(pseudo,l,"words"),message:""};
  }else if(tag==="lesson"&&u&&activityModes.some(m=>m.id===mode)){
    session={key:route,lang:l,u,mode,phase:"study",index:0,mistakes:0,answered:false,show:false,choices:randomOrder(u.question.choices.length).map(i=>u.question.choices[i]),
      tasks:["words","listen"].includes(mode)?buildWordQuiz(u,l,mode):[],options:[],correct:"",message:""};
  }else if(route==="academy/review"){
    const {known,due}=memoryDue(),items=due.length?due.slice(0,10):known.slice(0,8);
    session={key:route,lang:l,mode:"review",phase:items.length?"quiz":"empty",index:0,mistakes:0,answered:false,scheduled:due.length>0,
      tasks:buildWordQuiz(null,l,"review",items),message:"",u:null};
  }else session=null;
  return session;
}
function top(eyebrow,title,subtitle){
  return '<div class="aca-head"><span class="aca-kicker">'+esc(eyebrow)+'</span><h1>'+esc(title)+'</h1>'+ (subtitle?'<p>'+esc(subtitle)+'</p>':'')+'</div>';
}
function baseNav(l){
  return '<div class="aca-mini-nav"><a href="#academy">🏫 '+esc(UI[l].curriculum)+'</a><a href="#academy/review">🌿 '+esc(UI[l].review)+'</a><a href="#write">✍️ '+esc(UI[l].letters)+'</a></div>';
}
function overview(l){
  const d=Object.keys(store.done).length;
  const memory=memoryDue();
  return '<div class="aca-hero"><div class="aca-stars" aria-hidden="true">А Б В</div><span class="aca-overline">SHAIRA · LANGUAGE ACADEMY</span><h1>'+UI[l].title+'</h1><p>'+UI[l].intro+'</p><div class="aca-hero-badges"><span>🇷🇺 Pre-A1 → B2</span><span>✍️ '+units.length+' '+UI[l].word+' / '+units.length+' units</span></div></div>'+
  '<div class="aca-summary"><div><b>'+d+'/'+totalActivities+'</b><small>'+UI[l].total+'</small></div><div><b>⭐ '+store.points+'</b><small>'+UI[l].stars+'</small></div><div><b>'+memory.due.length+'</b><small>'+UI[l].due+'</small></div></div>'+
  '<section class="aca-path-info"><strong>🌟 '+UI[l].courseGuide+'</strong><p>'+UI[l].notice+'</p></section>'+
  '<a class="aca-review-call" href="#academy/first-words"><span>Аа</span><span><strong>'+tx(firstWordPacks.length*6+" Russian word cards",firstWordPacks.length*6+" Russian word cards",l)+'</strong><small>'+tx(firstWordPacks.length+" practical topics · 6 words each",firstWordPacks.length+" practical topics · 6 words each",l)+'</small></span><b>›</b></a>'+
  '<a class="aca-review-call" href="#academy/dialogues"><span>💬</span><span><strong>'+tx("Russian conversation lab","Pagsasanay sa usapan sa Ruso",l)+'</strong><small>'+tx("20 situations: say it, listen, understand","20 sitwasyon: magsalita, makinig, umunawa",l)+'</small></span><b>›</b></a>'+
  '<a class="aca-review-call" href="#academy/cases"><span>А</span><span><strong>'+tx("Russian noun cases","Mga kaso ng pangngalan sa Ruso",l)+'</strong><small>'+tx("288 singular and plural forms · six cases · typed practice","288 anyong isahan at maramihan · 6 na kaso · pagsusulat",l)+'</small></span><b>›</b></a>'+ 
  '<a class="aca-review-call" href="#academy/mastery"><span>▥</span><span><strong>'+tx("Complete Russian course","Kumpletong kurso sa Ruso",l)+'</strong><small>'+tx("32 structured chapters, productive practice and stage review exams","32 magkakasunod na paksa, pagsasanay at pagsusuri sa antas",l)+'</small></span><b>›</b></a>'+ 
  '<a class="aca-review-call" href="#academy/handbook"><span>А</span><span><strong>'+tx("Russian grammar handbook","Manwal sa gramatikang Ruso",l)+'</strong><small>'+tx("30 explained rules and example patterns from Cyrillic through B2","30 tuntunin at halimbawa mula Cyrillic hanggang B2",l)+'</small></span><b>›</b></a>'+
  '<a class="aca-review-call" href="#academy/writing"><span>✎</span><span><strong>'+tx("Writing portfolio","Portfolio ng pagsusulat",l)+'</strong><small>'+tx("30 guided assignments · saved private drafts","30 gawaing pagsulat · pribadong mga draft",l)+'</small></span><b>›</b></a>'+
  '<a class="aca-review-call" href="#academy/lab"><span>✳</span><span><strong>'+tx("Grammar and reading studio","Pagsasanay sa gramatika at pagbasa",l)+'</strong><small>'+tx("100 grammar drills · 20 graded texts · independent writing","100 pagsasanay sa gramatika · 20 teksto · sariling pagsulat",l)+'</small></span><b>›</b></a>'+
  '<div class="aca-stage-list">'+stages.map((stage,i)=>{
    const list=units.filter(x=>x.stage===stage.id), n=list.reduce((s,x)=>s+unitDone(x),0),max=list.length*activityModes.length;
    return '<a class="aca-stage-card" href="#academy/level/'+stage.id+'"><span class="aca-stage-index">'+(i+1)+'</span><span class="aca-stage-icon">'+stage.icon+'</span><span class="aca-stage-copy"><small>'+stage.label+'</small><strong>'+val(stage,l)+'</strong><span class="aca-track"><i style="width:'+pct(n,max)+'%"></i></span><em>'+n+'/'+max+'</em></span><span class="aca-chev">›</span></a>';
  }).join("")+'</div>'+
  '<a class="aca-review-call" href="#academy/review"><span>🧠</span><span><strong>'+UI[l].review+'</strong><small>'+UI[l].reviewInfo+'</small></span><b>'+memory.due.length+'</b></a>'+baseNav(l);
}
function firstWordsPage(route,l){
  const packId=route.split("/")[2];
  if(!packId){
    return '<a class="aca-back" href="#academy">← '+UI[l].back+'</a>'+top("🧸 Pre-A1",tx(firstWordPacks.length*6+" Russian word cards",firstWordPacks.length*6+" Russian word cards",l),tx("Learn six words at a time. Listen, read, repeat and test your recall.","Anim na salita bawat aralin. Makinig, bumasa, ulitin at alalahanin.",l))+
      '<div class="aca-units">'+firstWordPacks.map((p,i)=>
        '<a class="aca-unit-card" href="#academy/first-words/'+p.id+'"><span class="aca-unit-icon">'+p.icon+'</span><span><small>'+(i+1)+'/40</small><strong>'+esc(val(p.title,l))+'</strong><em>'+(modeDone(p,"words")?UI[l].completed:"6 "+UI[l].words)+'</em></span><span class="aca-chev">›</span></a>').join("")+'</div>';
  }
  const p=firstWordPacks.find(x=>x.id===packId);if(!p)return firstWordsPage("academy/first-words",l);
  const s=ensureSession(route,l);
  const header='<a class="aca-back" href="#academy/first-words">← '+UI[l].back+'</a>'+top(p.icon+" Pre-A1",val(p.title,l),tx("Look, say and remember.","Tingnan, sabihin at tandaan.",l));
  if(s.phase==="done")return header+'<div class="aca-celebrate">🌟<h2>'+UI[l].finish+'</h2><a class="aca-cta aca-link" href="#academy/first-words">'+UI[l].studyNext+' →</a></div>';
  if(s.phase==="quiz")return header+answersHtml(s,l,"words");
  return header+'<section class="aca-panel"><h2>'+UI[l].learnFirst+'</h2><div class="aca-word-grid">'+p.words.map(w=>
    '<div><span class="aca-emoji">'+w.icon+'</span><button class="aca-sound" data-aca="sound" data-text="'+esc(w.ru)+'">🔊</button><b lang="ru">'+esc(w.ru)+'</b><small>'+esc(val(w,l))+'</small></div>').join("")+'</div><button class="aca-cta aca-wide" data-aca="start-quiz">'+UI[l].testNow+' →</button></section>';
}
function dialoguesPage(route,l){
  const id=route.split("/")[2];
  if(!id)return '<a class="aca-back" href="#academy">← '+UI[l].back+'</a>'+
    top("💬 "+UI[l].talk,tx("Russian conversation lab","Pagsasanay sa usapan sa Ruso",l),tx("Read each line, listen, repeat aloud and check meaning.","Basahin, pakinggan, ulitin nang malakas at suriin ang kahulugan.",l))+
    '<div class="aca-units">'+dialogues.map(d=>'<a class="aca-unit-card" href="#academy/dialogues/'+d.id+'"><span class="aca-unit-icon">'+d.icon+'</span><span><small>'+getStage(d.stage).label+'</small><strong>'+esc(val(d.title,l))+'</strong><em>'+(store.done["dialogue/"+d.id+"/complete"]?UI[l].completed:UI[l].talk)+'</em></span><span class="aca-chev">›</span></a>').join("")+'</div>';
  const d=dialogues.find(x=>x.id===id);if(!d)return dialoguesPage("academy/dialogues",l);
  const s=ensureSession(route,l);
  return '<a class="aca-back" href="#academy/dialogues">← '+UI[l].back+'</a>'+
    top(d.icon+" "+getStage(d.stage).label,val(d.title,l),val(d.goal,l))+
    '<section class="aca-panel"><h2>🗣️ '+UI[l].speak+'</h2><p class="aca-muted">'+UI[l].speechInfo+'</p>'+
    '<div class="aca-dialogue">'+d.lines.map(line=>'<div class="aca-dialogue-line '+(line.who==="А"?"aca-speaker-a":"aca-speaker-b")+'"><b>'+line.who+'</b><div><strong lang="ru">'+esc(line.ru)+'</strong>'+(s.show?'<small>'+esc(val(line,l))+'</small>':"")+'</div><button class="aca-sound" data-aca="sound" data-text="'+esc(line.ru)+'">🔊</button></div>').join("")+'</div>'+
    '<button class="aca-text-btn" data-aca="toggle-translation">'+(s.show?UI[l].hide:UI[l].show)+'</button></section>'+
    '<section class="aca-task"><h2>'+UI[l].question+'</h2><p>'+esc(val(d.question,l))+'</p><div class="aca-choices">'+buttons(s.choices,"dialogue-answer")+'</div>'+
    (s.answered?'<div class="aca-feedback '+(s.good?"aca-ok":"aca-not")+'" role="status"><strong>'+(s.good?UI[l].good:UI[l].tryAgain)+'</strong><p>'+(s.good?"⭐ +10":"")+'</p>'+
    '<button data-aca="dialogue-next" class="aca-cta">'+(s.good?UI[l].studyNext:UI[l].retry)+' →</button></div>':"")+
    '</section>';
}
function stagePage(id,l){
  const stage=getStage(id);if(!stage)return overview(l);
  const list=units.filter(u=>u.stage===id);
  return '<a class="aca-back" href="#academy">← '+UI[l].back+'</a>'+top(stage.icon+" "+stage.label,val(stage,l),val(stage.target,l))+
  '<div class="aca-path-info"><strong>'+tx("Practise the grammar of this level with 20 explained questions.","Magsanay ng gramatika sa antas na ito sa 20 tanong na may paliwanag.",l)+'</strong><div class="aca-mini-nav"><a href="#academy/grammar/'+id+'">✳ '+tx("Grammar trainer","Pagsasanay sa gramatika",l)+'</a><a href="#academy/library">▤ '+tx("Reading library","Aklatan sa pagbabasa",l)+'</a></div></div>'+
  '<div class="aca-units">'+list.map((u,i)=>'<a class="aca-unit-card" href="#academy/unit/'+u.id+'"><span class="aca-unit-icon">'+u.icon+'</span><span><small>'+stage.label+' • '+(i+1)+'/'+list.length+'</small><strong>'+val(u.title,l)+'</strong><em>'+unitDone(u)+'/'+activityModes.length+' '+UI[l].total+'</em></span><span class="aca-chev">›</span></a>').join("")+'</div>'+baseNav(l);
}
function unitPage(id,l){
  const u=getUnit(id);if(!u)return overview(l);
  const s=getStage(u.stage);
  const sample='<div class="aca-example" lang="ru"><button class="aca-sound" data-aca="sound" data-text="'+esc(u.example.ru)+'" aria-label="'+UI[l].audio+'">🔊</button><strong>'+esc(u.example.ru)+'</strong><small>'+esc(val(u.example,l))+'</small></div>';
  return '<a class="aca-back" href="#academy/level/'+s.id+'">← '+UI[l].back+' · '+s.label+'</a>'+
    top(u.icon+' '+s.label,val(u.title,l),val(u.rule,l))+
    '<section class="aca-panel"><h2>'+UI[l].model+'</h2>'+sample+'</section>'+
    '<section class="aca-panel"><h2>'+UI[l].vocab+'</h2><div class="aca-glossary">'+u.words.map(w=>'<div><button class="aca-sound" data-aca="sound" data-text="'+esc(w.ru)+'" aria-label="'+UI[l].audio+'">🔊</button><strong lang="ru">'+esc(w.ru)+'</strong><span>'+esc(val(w,l))+'</span></div>').join("")+'</div></section>'+
    '<h2 class="aca-section-title">'+UI[l].continue+'</h2><p class="aca-muted">'+tx("These tasks build familiarity. To test grammar in new situations, use the separate trainer.","Panimulang pagsasanay ito. Para sa bagong halimbawa ng gramatika, gamitin ang trainer.",l)+'</p><div class="aca-activities">'+activityModes.map(m=>
      '<a class="aca-mode" href="#academy/lesson/'+u.id+'/'+m.id+'"><span>'+m.emoji+'</span><strong>'+tx(m.en,m.tl,l)+'</strong>'+marker(u,m)+'</a>').join("")+'</div>'+baseNav(l);
}
function russianBoard(){
  const rows=["ё й ц у к е н г ш щ з х ъ","ф ы в а п р о л д ж э","я ч с м и т ь б ю"];
  return '<div class="aca-board">'+rows.map(row=>'<div>'+row.split(" ").map(ch=>'<button type="button" data-aca="key" data-letter="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+'<div><button class="aca-space" data-aca="key" data-letter=" ">space</button><button type="button" data-aca="delete">⌫</button></div></div>';
}
function answersHtml(s,l,type){
  const title=type==="listen"?UI[l].choose:type==="review"?UI[l].today:UI[l].choose;
  const x=s.tasks[s.index];
  const subject=type==="listen"&&speechAvailable()?
    '<div class="aca-word-big">🔊</div><button class="aca-cta" data-aca="sound" data-text="'+esc(x.w.ru)+'">'+UI[l].audio+'</button>' :
    '<div class="aca-word-big" lang="ru">'+esc(x.w.ru)+'</div>'+
    (type!=="listen"?'<button class="aca-sound" data-aca="sound" data-text="'+esc(x.w.ru)+'">🔊 '+UI[l].audio+'</button>':'<p>'+UI[l].noAudio+'</p>');
  return '<div class="aca-task"><span class="aca-task-count">'+(s.index+1)+' / '+s.tasks.length+'</span><h2>'+title+'</h2>'+subject+
    '<div class="aca-choices">'+buttons(x.choices,"answer")+'</div>'+feedback(s,l)+'</div>';
}
function feedback(s,l){
  if(!s.answered)return "";
  return '<div class="aca-feedback '+(s.good?"aca-ok":"aca-not")+'" role="status"><strong>'+esc(s.good?UI[l].good:UI[l].tryAgain)+'</strong>'+
   (!s.good&&s.correct?'<p>'+UI[l].answer+': <span lang="ru">'+esc(s.correct)+'</span></p>':'')+
   '<button type="button" class="aca-cta" data-aca="next-task">'+UI[l].next+'</button></div>';
}
function lessonPage(id,mode,l){
  const u=getUnit(id);if(!u)return overview(l);
  const m=activityModes.find(x=>x.id===mode);if(!m)return unitPage(id,l);
  const s=ensureSession("academy/lesson/"+id+"/"+mode,l);
  if(s.mode==="grammar" && !s.options.length)prepareChoices(s,l);
  const header='<a class="aca-back" href="#academy/unit/'+id+'">← '+UI[l].back+'</a>'+
   top(u.icon+' '+getStage(u.stage).label,tx(m.en,m.tl,l),val(u.title,l))+
   '<div class="aca-session-meter"><span style="width:'+Math.round((s.index/Math.max(s.tasks.length,1))*100)+'%"></span></div>';
  if(s.phase==="done")return header+'<div class="aca-celebrate"><div>🌟 🪻 ✨</div><h2>'+UI[l].finish+'</h2><p>'+UI[l].notice+'</p>'+
     '<a class="aca-cta aca-link" href="#academy/unit/'+id+'">'+UI[l].studyNext+' →</a></div>';
  if(mode==="words"){
    if(s.phase==="study"){
      return header+'<section class="aca-panel"><h2>'+UI[l].learnFirst+'</h2><div class="aca-word-grid">'+u.words.map(w=>
        '<div><button class="aca-sound" data-aca="sound" data-text="'+esc(w.ru)+'">🔊</button><b lang="ru">'+esc(w.ru)+'</b><small>'+esc(val(w,l))+'</small></div>').join("")+'</div>'+
        '<button type="button" class="aca-cta aca-wide" data-aca="start-quiz">'+UI[l].testNow+' →</button></section>';
    }
    return header+answersHtml(s,l,"words");
  }
  if(mode==="listen"){
    if(s.phase==="study")return header+'<section class="aca-panel"><h2>'+UI[l].listen+'</h2><p>'+UI[l].learnFirst+'</p>'+
      '<div class="aca-example"><button class="aca-sound" data-aca="sound" data-text="'+esc(u.example.ru)+'">🔊 '+UI[l].audio+'</button><strong lang="ru">'+esc(u.example.ru)+'</strong></div>'+
      '<p class="aca-muted">'+(speechAvailable()?UI[l].choose:UI[l].notTested)+'</p>'+
      '<button class="aca-cta aca-wide" data-aca="start-quiz">'+UI[l].continue+'</button></section>';
    return header+answersHtml(s,l,"listen");
  }
  if(mode==="grammar"){
    return header+'<section class="aca-panel"><h2>'+UI[l].detail+'</h2><p>'+esc(val(u.rule,l))+'</p><div class="aca-example"><button class="aca-sound" data-aca="sound" data-text="'+esc(u.example.ru)+'">🔊</button><strong lang="ru">'+esc(u.example.ru)+'</strong><small>'+esc(val(u.example,l))+'</small></div></section>'+
      '<section class="aca-task"><h2>'+UI[l].question+'</h2><p>'+esc(val(u.example,l))+'</p><div class="aca-choices">'+buttons(s.options,"single")+'</div>'+feedback(s,l)+'</section>';
  }
  if(mode==="read"){
    return header+'<section class="aca-panel"><h2>'+UI[l].read+'</h2><div class="aca-reading" lang="ru">'+esc(u.reading.ru)+'</div>'+
      '<button class="aca-sound" data-aca="sound" data-text="'+esc(u.reading.ru)+'">🔊 '+UI[l].audio+'</button>'+
      '<button class="aca-text-btn" data-aca="toggle-translation">'+(s.show?UI[l].hide:UI[l].show)+'</button>'+
      (s.show?'<p class="aca-translation">'+esc(val(u.reading,l))+'</p>':"")+'</section>'+
      '<section class="aca-task"><h2>'+UI[l].readQuestion+'</h2><p>'+esc(val(u.question.prompt,l))+'</p>'+
       '<div class="aca-choices">'+buttons(s.choices,"single")+'</div>'+feedback(s,l)+'</section>';
  }
  if(mode==="write"){
    return header+'<section class="aca-panel"><h2>'+UI[l].writeCourse+'</h2><p>'+esc(val(u.writing.prompt,l))+'</p>'+
      '<div class="aca-example"><button class="aca-sound" data-aca="sound" data-text="'+esc(u.example.ru)+'">🔊</button>'+
      '<strong lang="ru">'+esc(u.example.ru)+'</strong><small>'+esc(val(u.example,l))+'</small></div>'+
      '<p class="aca-muted">'+UI[l].modelNote+'</p></section>'+
      '<section class="aca-task"><label class="aca-input-label" for="aca-answer">'+UI[l].writePrompt+'</label>'+
      '<form id="aca-form"><input id="aca-answer" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" required placeholder="Русский текст…" value="'+esc(s.typed||"")+'">'+
      '<small class="aca-muted">'+UI[l].writeHint+'</small><button class="aca-cta aca-wide" type="submit">'+UI[l].send+'</button></form>'+russianBoard()+
      (s.answered?feedback(s,l):'')+'</section>';
  }
  if(mode==="speak"){
    return header+'<section class="aca-panel"><h2>🗣️ '+UI[l].speak+'</h2><p>'+UI[l].speechInfo+'</p>'+
      '<div class="aca-example"><button class="aca-sound" data-aca="sound" data-text="'+esc(u.example.ru)+'">🔊 '+UI[l].audio+'</button><strong lang="ru">'+esc(u.example.ru)+'</strong><small>'+esc(val(u.example,l))+'</small></div>'+
      '<div class="aca-reading" lang="ru">'+esc(u.reading.ru)+'</div>'+
      '<button class="aca-sound" data-aca="sound" data-text="'+esc(u.reading.ru)+'">🔊 '+UI[l].audio+'</button>'+
      '<div class="aca-recorder"><h3>'+tx("Record and listen to yourself","I-record at pakinggan ang iyong sarili",l)+'</h3><p>'+tx("Optional. Microphone access requires permission. Audio stays in this session; nothing is uploaded or saved.","Opsyonal. Kailangan ng pahintulot sa mikropono. Sa session lang ang audio; walang ina-upload o sine-save.",l)+'</p>'+
      '<div class="aca-recorder-buttons"><button class="aca-secondary" type="button" data-aca="record-start">'+tx("● Start recording","● Magsimulang mag-record",l)+'</button>'+
      '<button class="aca-secondary" type="button" data-aca="record-stop" hidden>'+tx("■ Stop","■ Itigil",l)+'</button></div>'+
      '<p id="aca-rec-status" role="status">'+(isRecordingSupported()?tx("Ready when you are.","Handa kung kailan ka handa.",l):tx("Microphone recording unavailable; speaking aloud still works.","Walang recording sa browser; maaari pa ring magsalita nang malakas.",l))+'</p>'+
      '<audio id="aca-rec-play" controls hidden aria-label="'+tx("Your private recording","Pribadong recording",l)+'"></audio></div>'+
      '<button class="aca-cta aca-wide" data-aca="practice-done">'+UI[l].spoken+' ✓</button></section>';
  }
  if(mode==="journal"){
    return header+'<section class="aca-panel"><h2>📝 '+UI[l].journalPrompt+'</h2><p>'+esc(val(u.journal.prompt,l))+'</p><p class="aca-muted">'+UI[l].journalInfo+'</p>'+
      '<label class="aca-input-label" for="aca-draft">'+UI[l].writePrompt+'</label>'+
      '<textarea id="aca-draft" lang="ru" rows="9" spellcheck="true" placeholder="Пиши по-русски…">'+esc(store.drafts[u.id]||"")+'</textarea>'+
      '<div class="aca-draft-actions"><small>'+tokens(store.drafts[u.id]).length+' '+UI[l].count+'</small><button type="button" class="aca-cta" data-aca="save-draft">'+UI[l].save+'</button></div>'+
      '<button type="button" class="aca-text-btn" data-aca="toggle-translation">'+(s.show?UI[l].hide:UI[l].showAnswer)+'</button>'+
      (s.show?'<div class="aca-sample"><strong>'+UI[l].sample+'</strong><p lang="ru">'+esc(u.journal.model)+'</p></div>':"")+
      (s.message?'<p class="aca-feedback aca-ok" role="status">'+esc(s.message)+'</p>':"")+'</section>';
  }
  return overview(l);
}
function reviewPage(l){
  const s=ensureSession("academy/review",l);
  const {known,due}=memoryDue();
  const intro='<a class="aca-back" href="#academy">← '+UI[l].back+'</a>'+
    top("🧠 "+UI[l].today,UI[l].review,UI[l].reviewInfo)+
    '<div class="aca-summary"><div><b>'+known.length+'</b><small>'+UI[l].words+'</small></div><div><b>'+due.length+'</b><small>'+UI[l].due+'</small></div></div>';
  if(s.phase==="empty")return intro+'<div class="aca-panel">'+UI[l].reviewEmpty+'</div>';
  if(s.phase==="done")return intro+'<div class="aca-celebrate"><div>🧠 🌱</div><h2>'+UI[l].finish+'</h2><a class="aca-cta aca-link" href="#academy">'+UI[l].studyNext+' →</a></div>';
  return intro+(!s.scheduled?'<p class="aca-info">'+UI[l].reviewAll+'</p>':'')+answersHtml(s,l,"review");
}
export function academyHtml(route,l="en"){
  if(!UI[l])l="en";
  if(route==="academy")return overview(l);
  if(route==="academy/review")return reviewPage(l);
  if(route==="academy/dialogues"||route.startsWith("academy/dialogues/"))return dialoguesPage(route,l);
  if(route==="academy/first-words"||route.startsWith("academy/first-words/"))return firstWordsPage(route,l);
  const p=route.split("/");
  if(p[1]==="level")return stagePage(p[2],l);
  if(p[1]==="unit")return unitPage(p[2],l);
  if(p[1]==="lesson")return lessonPage(p[2],p[3],l);
  return overview(l);
}
function prepareChoices(s,l){
  if(s.mode!=="grammar")return;
  const neighbours=units.filter(x=>x.stage===s.u.stage&&x.id!==s.u.id).slice(0,5);
  const pool=[s.u.example.ru,...neighbours.map(x=>x.example.ru)].filter((x,i,a)=>a.indexOf(x)===i);
  s.options=randomOrder(Math.min(4,pool.length)).map(i=>pool[i]);
  if(!s.options.includes(s.u.example.ru))s.options[0]=s.u.example.ru;
  s.correct=s.u.example.ru;
}
function correctOne(s,input,l,api){
  if(s.answered)return;
  s.answered=true;
  s.good=standard(input)===standard(s.correct);
  if(!s.good){s.mistakes++;}
  else if(["grammar","read","write"].includes(s.mode)){
    if(s.mistakes===0)mark(s.u,s.mode);
  }
  s.message=s.good?UI[l].good:UI[l].tryAgain;
  api.render();
}
function moveNext(s,l,api){
  s.answered=false;s.message="";
  if(["words","first-words","listen","review"].includes(s.mode)){
    s.index++;
    if(s.index>=s.tasks.length){
      if(s.mistakes>0){
        s.phase="study";s.index=0;s.mistakes=0;
        if(s.mode==="review")s.phase="quiz";
      }else{
        if(s.mode==="first-words")mark(s.u,"words");
        else if(s.mode==="words"||(s.mode==="listen"&&speechAvailable()))mark(s.u,s.mode);
        if(s.mode==="review"){store.lastReview=Date.now();persist();}
        s.phase="done";
      }
    }
  }else if(!s.good||s.mistakes>0){
    // A second correct answer after a prior wrong attempt is practice, not a passed check.
    s.answered=false;s.good=false;s.mistakes=0;
    if(s.mode==="read")s.show=false;
  }else s.phase="done";
  api.render();
}
export async function handleAcademyAction(button,api){
  const action=button.dataset.aca;
  const l=api.language() === "tl"?"tl":"en";
  const route=api.route(),s=ensureSession(route,l);
  if(action==="sound"){api.speak(button.dataset.text||"");return;}
  if(!s)return;
  if(action==="record-start"&&s.mode==="speak"){
    const status=document.getElementById("aca-rec-status");
    const start=document.querySelector('[data-aca="record-start"]');
    const stop=document.querySelector('[data-aca="record-stop"]');
    if(status)status.textContent=tx("Requesting microphone permission…","Humihingi ng pahintulot sa mikropono…",l);
    if(start)start.disabled=true;
    try{
      const key=s.key;
      await startPrivateRecording(url=>{
        if(session?.key!==key)return;
        const player=document.getElementById("aca-rec-play");
        if(player&&url){player.src=url;player.hidden=false;}
        const statusNow=document.getElementById("aca-rec-status");
        if(statusNow)statusNow.textContent=tx(url?"Play back your recording and compare it with the Russian model.":"No audio was captured.","Pakinggan ang recording at ihambing sa modelong Ruso.",l);
        const startNow=document.querySelector('[data-aca="record-start"]');
        const stopNow=document.querySelector('[data-aca="record-stop"]');
        if(startNow){startNow.disabled=false;startNow.hidden=false;}
        if(stopNow)stopNow.hidden=true;
      });
      if(session?.key!==key){discardPrivateRecording();return;}
      if(start)start.hidden=true;
      if(stop)stop.hidden=false;
      if(status)status.textContent=tx("Recording locally… Tap Stop when finished.","Nagri-record sa device… Pindutin ang Itigil.",l);
    }catch(e){if(start)start.disabled=false;if(status)status.textContent=String(e.message||e);}
    return;
  }
  if(action==="record-stop"&&s.mode==="speak"){stopPrivateRecording();return;}
  if(action==="toggle-translation"){s.show=!s.show;api.render();return;}
  if(action==="dialogue-answer"&&s.mode==="dialogue"){
    if(s.answered)return;
    s.answered=true;s.good=s.choices[Number(button.dataset.choice)]===s.d.answer;
    if(s.good)mark({id:"dialogue/"+s.d.id},"complete");
    api.render();return;
  }
  if(action==="dialogue-next"&&s.mode==="dialogue"){
    if(s.good)api.navigate("academy/dialogues");else{s.answered=false;api.render();}
    return;
  }
  if(action==="start-quiz"){
    s.phase="quiz";s.index=0;s.mistakes=0;s.answered=false;
    if(s.mode==="grammar")prepareChoices(s,l);
    api.render();return;
  }
  if(action==="answer" && (["words","first-words","listen","review"].includes(s.mode))){
    if(s.answered)return;
    const x=s.tasks[s.index],selected=x.choices[Number(button.dataset.choice)];
    s.good=selected===x.correct;s.correct=x.correct;s.answered=true;
    if(!s.good)s.mistakes++;
    if(s.mode==="words"||s.mode==="first-words")schedule(x.u,x.w,s.good,true);
    if(s.mode==="review")schedule(x.u,x.w,s.good,s.scheduled);
    api.render();return;
  }
  if(action==="single"){
    if(s.mode==="grammar"&&s.options.length===0)prepareChoices(s,l);
    s.correct=s.mode==="read"?s.u.question.answer:s.u.example.ru;
    const options=s.mode==="read"?s.choices:s.options;
    correctOne(s,options[Number(button.dataset.choice)],l,api);return;
  }
  if(action==="next-task"){moveNext(s,l,api);return;}
  if(action==="practice-done"){discardPrivateRecording();mark(s.u,"speak");s.phase="done";api.render();return;}
  if(action==="save-draft"){
    const input=document.getElementById("aca-draft"),draft=input?.value||"";
    store.drafts[s.u.id]=draft;
    if(tokens(draft).length>=3)mark(s.u,"journal");
    if(!persist()){s.message=UI[l].saveError;}else s.message=UI[l].saved;
    api.render();return;
  }
  if(action==="key"||action==="delete"){
    const input=document.getElementById("aca-answer");if(!input)return;
    const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
    if(action==="key")input.setRangeText(button.dataset.letter||"",start,end,"end");
    else if(start!==end)input.setRangeText("",start,end,"end");
    else if(start>0)input.setRangeText("",start-1,start,"end");
    s.typed=input.value;input.focus();return;
  }
}
export function handleAcademySubmit(event,api){
  if(event.target.id!=="aca-form")return false;
  event.preventDefault();
  const s=ensureSession(api.route(),api.language());
  if(!s||s.mode!=="write")return true;
  const input=document.getElementById("aca-answer");
  s.typed=input?.value||"";
  s.correct=s.u.writing.answer;
  correctOne(s,s.typed,api.language(),api);
  return true;
}
export function academyStatistics(){
  const m=memoryDue();
  return {units:units.length,firstWordPacks:firstWordPacks.length,dialogues:dialogues.length,activities:totalActivities,completed:Object.keys(store.done).length,knownWords:m.known.length,dueWords:m.due.length,points:store.points};
}

export function stopSpeakingRehearsal(){discardPrivateRecording();}

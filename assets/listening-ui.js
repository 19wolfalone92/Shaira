// Private synthetic listening practice for Shaira. No recordings are uploaded or saved.
// Progress means a TTS-assisted listening comprehension attempt, not native-speech mastery.
import {listeningClips,listeningForStage} from "./listening-clips.js";
import {stages} from "./academy-data.js";
export const LISTENING_KEY="shaira-listening-v1";
const txt={
 title:"Listen to Russian",intro:"Hear the Russian message first, then answer in English. The transcript stays hidden until you have answered. Listen again as often as you need.",
 back:"Back to Academy",choose:"Choose a listening topic",clip:"Listening exercise",level:"Study topic",
 play:"Play Russian speech",slow:"Play slowly",question:"What did you understand?",answer:"Select the correct answer",
 hidden:"The Russian transcript appears after your attempt.",mustPlay:"Tap Play Russian speech before answering.",unavailable:"Russian audio is not available in this browser. This activity cannot count as listening; use Reading Library instead.",
 explanation:"Why this answer?",transcript:"Russian transcript",read:"Read the transcript",
 correct:"Correct answer",incorrect:"Not yet. Compare the sentence with the English explanation.",replay:"Try another listening attempt",
 result:"Practice result",notCertified:"This exercise uses your device's synthetic Russian voice, not a recorded native speaker. Listening practice is not proof of a CEFR level.",
 attempts:"attempts",passed:"clips answered correctly",newClip:"Next listening clip",backIndex:"All listening clips",
 hint:"Try answering before revealing the Russian text. For real listening progress, practise with native speakers as well.",
 reveal:"Reveal text for reading (not graded as listening)",ungraded:"Reading version shown. This is no longer a listening test."
};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const object=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const available=()=>typeof window!=="undefined"&&"speechSynthesis" in window&&typeof SpeechSynthesisUtterance!=="undefined";
export function loadListening(storage=globalThis.localStorage){
 try{
  const data=object(JSON.parse(storage.getItem(LISTENING_KEY)||"{}"));
  return {items:object(data.items)};
 }catch{return{items:{}};}
}
export function listeningStats(storage=globalThis.localStorage){
 const data=loadListening(storage).items;
 return {total:listeningClips.length,practised:Object.values(data).filter(x=>x?.attempts>0).length,
   correct:Object.values(data).filter(x=>x?.passed).length};
}
export function recordListening(id,correct,storage=globalThis.localStorage,now=Date.now()){
 if(!listeningClips.some(x=>x.id===id)||typeof correct!=="boolean")return false;
 const data=loadListening(storage),p=object(data.items[id]);
 data.items[id]={attempts:Math.min(100000,(Number(p.attempts)||0)+1),
   passed:p.passed===true||correct,lastPassed:correct,last:now};
 try{storage.setItem(LISTENING_KEY,JSON.stringify(data));return true;}catch{return false;}
}
const shuffled=a=>{const x=a.slice();for(let i=x.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
let session=null;
const newSession=id=>{const clip=listeningClips.find(x=>x.id===id);return{
 id,options:shuffled(clip.choices),played:false,revealed:false,chosen:null,finished:false,saved:false,message:""
};};
function clipPage(id){
 const clip=listeningClips.find(x=>x.id===id);
 if(!clip)return listing();
 if(session?.id!==id)session=newSession(id);
 const s=session,idx=listeningClips.indexOf(clip);
 return '<a href="#academy/listening" class="lp-audio-back">← '+txt.backIndex+'</a>'+
 '<section class="lp-audio-hero"><small>'+clip.stage.toUpperCase()+' · '+txt.clip+' '+(idx+1)+'/'+listeningClips.length+'</small>'+
 '<h1>'+esc(clip.title)+'</h1><p>'+txt.intro+'</p>'+
 '<div class="lp-audio-buttons"><button type="button" data-listening="play" class="lp-audio-main" '+(!available()?"disabled":"")+'>🔊 '+txt.play+'</button>'+
 '<button type="button" data-listening="slow" '+(!available()?"disabled":"")+'>0.7× '+txt.slow+'</button></div>'+
 (!available()?'<p class="lp-audio-warning">'+txt.unavailable+'</p>':"")+
 '<p class="lp-audio-muted">'+txt.notCertified+'</p></section>'+
 '<section class="lp-audio-question"><h2>'+txt.question+'</h2><p>'+esc(clip.question)+'</p>'+
 (s.chosen===null?'<div class="lp-audio-options">'+s.options.map((v,i)=>'<button type="button" data-listening="answer" data-choice="'+i+'" '+
 (!s.played?"disabled":"")+'>'+esc(v)+'</button>').join("")+'</div>':
 '<div class="lp-audio-feedback '+(s.chosen===clip.answer?"good":"wrong")+'"><b>'+txt[s.chosen===clip.answer?"correct":"incorrect"]+'</b>'+
 '<p>'+txt.answer+': <strong>'+esc(clip.answer)+'</strong></p><p>'+txt.explanation+': '+esc(clip.why)+'</p></div>')+
 (s.message?'<p role="status" class="lp-audio-warning">'+esc(s.message)+'</p>':"")+
 '<p class="lp-audio-muted">'+(s.played?txt.hidden:txt.mustPlay)+'</p>'+
 (s.chosen!==null||s.revealed?'<div class="lp-audio-transcript"><h3>'+txt.transcript+'</h3><p lang="ru">'+esc(clip.russian)+'</p></div>':
 '<button class="lp-audio-reveal" type="button" data-listening="reveal">'+txt.reveal+'</button>')+
 (s.revealed&&s.chosen===null?'<p class="lp-audio-warning">'+txt.ungraded+'</p>':"")+
 (s.chosen!==null?'<div class="lp-audio-finish"><button class="lp-audio-main" data-listening="retry">'+txt.replay+'</button>'+
 (listeningClips[idx+1]?'<a href="#academy/listening/'+listeningClips[idx+1].id+'">'+txt.newClip+' →</a>':"")+'</div>':"")+
 '</section><p class="lp-audio-muted">'+txt.hint+'</p>';
}
function listing(){
 const stats=listeningStats(),records=loadListening().items;
 return '<a href="#academy" class="lp-audio-back">← '+txt.back+'</a>'+
 '<section class="lp-audio-hero"><small>SHAIRA · RUSSIAN LISTENING</small><h1>'+txt.title+'</h1>'+
 '<p>'+txt.intro+'</p><div class="lp-audio-stats"><strong>'+stats.correct+'/'+stats.total+'</strong><span>'+txt.passed+'</span></div>'+
 '<p class="lp-audio-muted">'+txt.notCertified+'</p></section>'+
 stages.map(stage=>'<section class="lp-audio-stage"><h2>'+esc(stage.label)+' · '+esc(stage.en)+'</h2>'+
 listeningForStage(stage.id).map((c,i)=>'<a href="#academy/listening/'+c.id+'"><span>🔊</span><div><strong>'+esc(c.title)+'</strong>'+
 '<small>'+(records[c.id]?.passed?"✓ "+txt.correct:records[c.id]?.attempts?"↻ "+txt.attempts:txt.clip+' '+(i+1))+'</small></div><b>›</b></a>').join("")+'</section>').join("");
}
export const listeningHtml=route=>route==="academy/listening"?listing():clipPage(route.split("/")[2]);
export function listeningAction(btn,api){
 const action=btn.dataset.listening,id=api.route().split("/")[2],clip=listeningClips.find(x=>x.id===id);
 if(!clip)return;
 if(session?.id!==id)session=newSession(id);
 if(action==="play"||action==="slow"){
  if(!available()){session.message=txt.unavailable;api.render();return;}
  session.played=true;
  api.speak(clip.russian,action==="slow"?0.64:0.85);
  return;
 }
 if(action==="reveal"){
  session.revealed=true;session.message=txt.ungraded;api.render();return;
 }
 if(action==="retry"){session=newSession(id);api.render();return;}
 if(action==="answer"&&session.chosen===null){
  if(!session.played||session.revealed){session.message=session.revealed?txt.ungraded:txt.mustPlay;api.render();return;}
  const selected=session.options[Number(btn.dataset.choice)];
  if(selected===undefined)return;
  session.chosen=selected;session.saved=recordListening(id,selected===clip.answer);
  if(!session.saved)session.message="Progress could not be saved in this browser.";
  api.render();
 }
}

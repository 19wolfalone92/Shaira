// Data-driven personal study dashboard for the adult Russian course.
// Recommendations are based on actual practice records, not inferred proficiency.
import {stages} from "./academy-data.js";
import {firstWordPacks} from "./first-words.js";
import {readingsForStage} from "./reading-library.js";
import {writingForStage} from "./writing-tasks.js";
import {listeningForStage} from "./listening-clips.js";
import {soundForStage} from "./phonetics-content.js";
import {scenarioMissions} from "./scenario-missions.js";
const parse=(storage,key)=>{try{const x=JSON.parse(storage.getItem(key)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{};}catch{return{};}};
const map=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
const percent=(v,t)=>Math.min(100,Math.max(0,Math.round(100*v/Math.max(1,t))));
const n=x=>Number.isFinite(Number(x))&&Number(x)>0?Number(x):0;
const COUNTS={starter:0,a1:42,a2:84,b1:126,b2:168};
export function studyCoachData(storage=globalThis.localStorage,now=Date.now()){
 const daily=parse(storage,"shaira-daily-v1"),academy=parse(storage,"shaira-academy-v1"),
  labs=parse(storage,"shaira-labs-v1"),listening=parse(storage,"shaira-listening-v1"),
  mixes=parse(storage,"shaira-mixed-practice-v1"),sounds=parse(storage,"shaira-phonetics-v1"),
  scenarios=parse(storage,"shaira-scenarios-v1"),cases=parse(storage,"shaira-case-practice-v1");
 const index=Math.min(209,Math.max(0,Number.isInteger(daily.index)?daily.index:0));
 const stage=stages[Math.floor(index/42)]||stages[0],level=stage.id;
 const memories=Object.values(map(academy.memory));
 const due=memories.filter(m=>m&&Number(m.seen)>0&&Number(m.due)<=now).length;
 const readingRows=readingsForStage(level),readingRecords=map(labs.readings);
 const textsPassed=readingRows.filter(p=>readingRecords[p.id]?.passed===true).length;
 const nextRead=readingRows.find(p=>!readingRecords[p.id]?.passed)||readingRows[0];
 const writingRows=writingForStage(level),drafts=map(labs.drafts);
 const essays=writingRows.filter(t=>String(drafts["portfolio:"+t.id]||"").trim().length>0).length;
 const nextWrite=writingRows.find(t=>!String(drafts["portfolio:"+t.id]||"").trim())||writingRows[0];
 const audioRows=listeningForStage(level),audioRecords=map(listening.items);
 const audioPassed=audioRows.filter(p=>audioRecords[p.id]?.passed===true).length;
 const nextAudio=audioRows.find(p=>audioRecords[p.id]?.passed!==true)||audioRows[0];
 const soundRows=soundForStage(level),soundRecords=map(sounds.items);
 const soundsPractised=soundRows.filter(p=>Number(soundRecords[p.id+":0"]?.seen)>0||
     Number(soundRecords[p.id+":1"]?.seen)>0).length;
 const nextSound=soundRows.find(p=>!Number(soundRecords[p.id+":0"]?.seen)&&
  !Number(soundRecords[p.id+":1"]?.seen))||soundRows[0];
 const sceneRows=scenarioMissions.filter(s=>s.stage===level),sceneRecords=map(scenarios.records);
 const roleplaysPassed=sceneRows.filter(s=>sceneRecords[s.id]?.passed===true).length;
 const nextScene=sceneRows.find(s=>sceneRecords[s.id]?.passed!==true)||sceneRows[0];
 const grammar=map(labs.grammar)[level]||{},lastGrammar=n(grammar.lastScore),grammarGood=Number(grammar.lastScore)>=8;
 const mixRows=Array.isArray(mixes.sessions)?mixes.sessions.filter(x=>x.stage===level):[];
 const lastMixed=mixRows.at(-1),mixDone=!!lastMixed?.passed;
 const mixDue=Object.values(map(mixes.items)).filter(x=>Number(x.seen)>0&&Number(x.due)<=now).length;
 const caseCount=Array.isArray(cases.sessions)?cases.sessions.length:0;
 const coverage=[
  {id:"words",label:"Vocabulary reviewed",current:memories.filter(m=>Number(m?.seen)>0).length,
     total:firstWordPacks.flatMap(p=>p.words).length,kind:"practice"},
  {id:"grammar",label:"Latest grammar result",current:lastGrammar,total:10,kind:"latest",status:grammarGood},
  {id:"reading",label:"Texts understood at this stage",current:textsPassed,total:readingRows.length,kind:"practice"},
  {id:"writing",label:"Writing drafts created",current:essays,total:writingRows.length,kind:"practice"},
  {id:"listening",label:"Listening clips passed",current:audioPassed,total:audioRows.length,kind:"practice"},
  {id:"sound",label:"Sound contrasts attempted",current:soundsPractised,total:soundRows.length,kind:"practice"},
  {id:"speaking",label:"Guided roleplays passed",current:roleplaysPassed,total:sceneRows.length,kind:"practice"}
 ];
 const suggestions=[
  {id:"course",priority:1,title:"Continue your guided lesson",reason:"Your next structured lesson combines multiple skills.",href:"#today",action:"Open Today's Lesson"},
  {id:"review",priority:due?0:9,title:"Spaced vocabulary review",
     reason:due?due+" word"+(due===1?" is":"s are")+" due for review.":"No vocabulary cards are currently due; you can review voluntarily.",
     href:"#academy/review",action:"Review Russian words",due},
  {id:"grammar",priority:grammarGood?8:2,title:"Strengthen grammar",
     reason:grammarGood?"Latest grammar practice reached 8/10. Keep practising unfamiliar examples.":
       "The latest grammar score is below 8/10, or no practice is recorded at this level.",
     href:"#academy/grammar/"+level,action:"Practise ten grammar questions"},
  {id:"mixed",priority:mixDone?8:3,title:"Vary your exercise formats",reason:
    mixDone?"Your last mixed-practice round passed; use another for new examples.":
      "Try a variety of written, listening, reading and word-form questions.",
     href:"#academy/mix/"+level,action:"Open Variety Lab"},
  {id:"reading",priority:textsPassed===readingRows.length?9:4,title:"Understand new Russian texts",
     reason:textsPassed+" of "+readingRows.length+" stage readings passed.",
     href:"#academy/library/"+nextRead.id,action:"Read: "+nextRead.title.en},
  {id:"writing",priority:essays===writingRows.length?9:5,title:"Write and revise in Russian",
     reason:essays+" of "+writingRows.length+" writing prompts have drafts. The Writing Coach offers structural hints, not grading.",
     href:"#academy/writing/task/"+nextWrite.id,action:"Write: "+nextWrite.title.en},
  {id:"audio",priority:audioPassed===audioRows.length?9:6,title:"Practise listening",
     reason:audioPassed+" of "+audioRows.length+" synthetic listening questions passed at this stage.",
     href:"#academy/listening/"+nextAudio.id,action:"Listen: "+nextAudio.title},
  {id:"sounds",priority:soundsPractised===soundRows.length?9:7,title:"Hear Russian sound contrasts",
     reason:soundsPractised+" of "+soundRows.length+" phonetic pairs attempted.",
     href:"#academy/sounds/"+nextSound.id,action:"Hear: "+nextSound.focus},
  {id:"roleplay",priority:roleplaysPassed===sceneRows.length?9:7,title:"Practise real-life conversations",
     reason:roleplaysPassed+" of "+sceneRows.length+" scripted scenarios passed at this stage; free speech is not assessed.",
     href:"#academy/scenarios/"+nextScene.id,action:"Respond: "+nextScene.title}
 ];
 suggestions.sort((a,b)=>a.priority-b.priority);
 return {stage:level,stageLabel:stage.label,lesson:Math.min(210,index+1),due,mixDue,caseCount,
  coverage,suggestions,practised:coverage.reduce((a,x)=>a+x.current,0),
  note:"These figures count attempts and recorded practice only; they do not estimate CEFR proficiency, natural speaking ability or essay quality."};
}
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function coachHtml(){
 const d=studyCoachData();
 return '<a href="#academy" class="coach-back">← Back to Academy</a>'+
  '<section class="coach-hero"><span>SHAIRA · YOUR STUDY COMPASS</span><h1>Your Russian Study Coach</h1>'+
   '<p>Personal recommendations based on your actual practice. Study at your own pace, and strengthen whichever skill needs attention.</p>'+
   '<div class="coach-stage"><strong>Current course stage: '+esc(d.stageLabel)+'</strong><span>Guided session '+d.lesson+'/210</span></div>'+
   '<p class="coach-note">'+esc(d.note)+'</p></section>'+
  '<section class="coach-coverage"><h2>Practice coverage · not a language level</h2>'+
   d.coverage.map(c=>'<div class="coach-skill"><div><strong>'+esc(c.label)+'</strong>'+
     '<span>'+c.current+'/'+c.total+'</span></div><i><em style="width:'+percent(c.current,c.total)+'%"></em></i></div>').join("")+
   '</section>'+
  '<section class="coach-recommend"><h2>Recommended next actions</h2><p>Suggestions respond to missing or due practice. They are not a diagnosis.</p>'+
   d.suggestions.map((s,i)=>'<a href="'+esc(s.href)+'"><span>'+(i+1)+'</span><div>'+
     '<strong>'+esc(s.title)+'</strong><small>'+esc(s.reason)+'</small><b>'+esc(s.action)+' →</b></div></a>').join("")+
   '</section><p class="coach-note">All study records remain private on your device. Export a backup in Settings before changing phones.</p>';
}

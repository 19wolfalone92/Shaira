// Shaira daily teacher: deterministic 210-session progression across all five course stages.
// Progress is local. "Study day" is a lesson sequence, not a CEFR certification or elapsed-day guarantee.
import {stages,units} from "./academy-data.js";
import {firstWordPacks} from "./first-words.js";
import {dialogues} from "./dialogues.js";
import {grammarDrills} from "./grammar-drills.js";
import {grammarHandbook} from "./grammar-handbook.js";
import {readingLibrary} from "./reading-library.js";
import {writingTasks,writingWordTargets} from "./writing-tasks.js";
import {lessons} from "./lessons.js";
import {openingDays,weeklyThemes} from "./daily-content.js";
import {studioForUnit} from "./studio-lessons.js";
import {checkpointForStage} from "./stage-checkpoints.js";
import {MASTERY_KEY,loadMastery} from "./mastery-engine.js";

export const DAILY_KEY="shaira-daily-v1";
export const DAYS_PER_STAGE=42;
export const GUIDED_STUDY_DAYS=DAYS_PER_STAGE*stages.length;
export const LEGACY_DAYS=13;

const localized=(en,tl)=>({en,tl});
const safeRecord=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const parse=(storage,key)=>{try{return safeRecord(JSON.parse(storage.getItem(key)||"{}"));}catch{return {};}};
export const normalizedRussian=s=>String(s??"").normalize("NFC").toLocaleLowerCase("ru-RU").replace(/[«»"„”“!?.,:;—–\s]+/gu," ").trim();
export const wordTotal=s=>String(s??"").trim().split(/\s+/u).filter(Boolean).length;
export const dateKey=(now=new Date())=>now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
const stageOf=index=>stages[Math.min(stages.length-1,Math.floor(Math.max(0,index)/DAYS_PER_STAGE))];
const group=(arr,stage)=>arr.filter(x=>x.stage===stage);
const stableIndex=(n,max)=>((n%max)+max)%max;
const selected=(items,index)=>items[stableIndex(index,items.length)];
const title=(en,tl)=>localized(en,tl);
const task=(id,kind,href,english,filipino,minutes,extra={})=>
 ({id,kind,href,title:title(english,filipino),minutes,...extra});

export function makeDay(index){
 if(!Number.isInteger(index)||index<0||index>=GUIDED_STUDY_DAYS)return null;
 const stage=stageOf(index),level=stage.id,levelNo=stages.indexOf(stage);
 const within=index%DAYS_PER_STAGE,week=Math.floor(within/7),weekday=within%7;
 const stageUnits=group(units,level);
 const unit=selected(stageUnits,week*2+(weekday>=4?1:0));
 const pack=selected(firstWordPacks,levelNo*8+week*2+(weekday>=5?1:0));
 const stageDialogues=group(dialogues,level);
 const dialogue=selected(stageDialogues,week);
 const passage=selected(group(readingLibrary,level),week);
 const writing=selected(group(writingTasks,level),week);
 const handbook=selected(group(grammarHandbook,level),week);
 const stageDrills=group(grammarDrills,level);
 const openingQuizOrder=[11,0,2,1,5,6,7,18,8,19,17,18,13,9];
 const quiz=selected(stageDrills,index<openingQuizOrder.length?openingQuizOrder[index]:within*7+week);
 const spelling=level==="starter"
   ? {ru:unit.words[stableIndex(index,unit.words.length)].ru,
      prompt:localized("Type the Russian word for: "+unit.words[stableIndex(index,unit.words.length)].en,
         "Isulat sa Ruso ang: "+unit.words[stableIndex(index,unit.words.length)].tl)}
   : {ru:unit.writing.answer,prompt:unit.writing.prompt};
 const voiceLine=index<openingDays.length?openingDays[index].ru:unit.example.ru;
 const tasks=[];
 if(index<LEGACY_DAYS){
   const lesson=lessons[index];
   tasks.push(task("legacy:"+lesson.id,"legacy","#lesson/"+lesson.id,
      "Learn: "+lesson.title.en,"Aralin: "+lesson.title.tl,10,{key:lesson.id}));
   const firstPacks=[0,10,4,3,8,7,1,11,16,13,14,17,19];
   const earlyPack=firstWordPacks[firstPacks[index]];
   tasks.push(task("pack:"+earlyPack.id,"pack","#academy/first-words/"+earlyPack.id,
      "Learn 6 words: "+earlyPack.title.en,"Anim na salita: "+earlyPack.title.tl,12,{key:earlyPack.id+"/words"}));
 }else if(index===13){
   tasks.push(task("dialogue:"+stageDialogues[0].id,"dialogue","#academy/dialogues/"+stageDialogues[0].id,
      "Introduce yourself in a dialogue","Ipakilala ang sarili sa usapan",10,
      {key:"dialogue/"+stageDialogues[0].id+"/complete"}));
   tasks.push(task("grammar:"+level,"grammar","#academy/grammar/"+level,
      "First grammar checkpoint: 8/10","Unang pagsusuri: 8/10",15,{level}));
 }else{
   if(weekday===0){
     tasks.push(task("pack:"+pack.id,"pack","#academy/first-words/"+pack.id,
       "New words: "+pack.title.en,"Bagong salita: "+pack.title.tl,12,{key:pack.id+"/words"}));
     tasks.push(task("unit-words:"+unit.id,"unit","#academy/lesson/"+unit.id+"/words",
       "Use words in context: "+unit.title.en,"Gamitin ang salita: "+unit.title.tl,12,{key:unit.id+"/words"}));
   }else if(weekday===1){
     tasks.push(task("handbook:"+handbook.id,"handbook","#academy/handbook/"+handbook.id,
       "Understand the rule: "+handbook.title.en,"Unawain ang tuntunin: "+handbook.title.tl,8,{key:handbook.id}));
     tasks.push(task("grammar:"+level,"grammar","#academy/grammar/"+level,
       "Grammar practice: reach 8/10","Pagsasanay sa gramatika: 8/10",18,{level}));
   }else if(weekday===2){
     tasks.push(task("listen:"+unit.id,"listen","#academy/lesson/"+unit.id+"/listen",
       "Listen and identify Russian words","Makinig at kilalanin ang salita",10,{key:unit.id+"/listen",fallback:unit.id+"/read",unitId:unit.id}));
     tasks.push(task("speak:"+unit.id,"speak","#academy/lesson/"+unit.id+"/speak",
       "Speak and compare with the model","Magsalita at ihambing sa modelo",12,{key:unit.id+"/speak"}));
   }else if(weekday===3){
     tasks.push(task("reading:"+passage.id,"reading","#academy/library/"+passage.id,
       "Read and understand: "+passage.title.en,"Basahin at unawain: "+passage.title.tl,18,{key:passage.id}));
     tasks.push(task("unit-read:"+unit.id,"unit","#academy/lesson/"+unit.id+"/read",
       "Read a short text accurately","Basahin nang tama ang maikling teksto",9,{key:unit.id+"/read"}));
   }else if(weekday===4){
     tasks.push(task("unit-write:"+unit.id,"unit","#academy/lesson/"+unit.id+"/write",
       "Spell a Russian sentence","Baybayin ang pangungusap sa Ruso",10,{key:unit.id+"/write"}));
     tasks.push(task("portfolio:"+writing.id,"writing","#academy/writing/task/"+writing.id,
       "Write: "+writing.title.en,"Sumulat: "+writing.title.tl,20,
       {key:"portfolio:"+writing.id,minimum:writingWordTargets[level][0],level}));
   }else if(weekday===5){
     tasks.push(task("dialogue:"+dialogue.id,"dialogue","#academy/dialogues/"+dialogue.id,
       "Conversation: "+dialogue.title.en,"Usapan: "+dialogue.title.tl,12,
       {key:"dialogue/"+dialogue.id+"/complete"}));
     tasks.push(task("speak:"+unit.id,"speak","#academy/lesson/"+unit.id+"/speak",
       "Respond aloud without reading","Sumagot nang malakas nang hindi nagbabasa",10,{key:unit.id+"/speak"}));
   }else{
     tasks.push(task("grammar:"+level,"grammar","#academy/grammar/"+level,
       "Weekly grammar checkpoint: at least 8/10","Lingguhang pagsusuri ng gramatika: 8/10",18,{level}));
     tasks.push(task("reading:"+passage.id,"reading","#academy/library/"+passage.id,
       "Re-read and answer without hints","Basahin muli at sumagot nang walang tulong",15,{key:passage.id}));
   }
 }
 if(index>=14&&(weekday===0||weekday===4)){
   const skill=studioForUnit(unit.id);
   if(skill)tasks.unshift(task("studio:"+unit.id,"studio","#academy/mastery/"+unit.id,
      "Learn and practise: "+unit.title.en,"Aralin at sanayin: "+unit.title.tl,15,{key:unit.id}));
 }
 if(within===DAYS_PER_STAGE-1){
   const checkpoint=checkpointForStage(level);
   if(checkpoint)tasks.push(task("checkpoint:"+level,"checkpoint","#academy/checkpoint/"+level,
     "Stage review: "+stage.label,"Pagsusuri sa antas: "+stage.label,20,{key:level}));
 }
 const intro=index<openingDays.length?openingDays[index]:weeklyThemes[weekday];
 return {
  index,number:index+1,total:GUIDED_STUDY_DAYS,stage:level,stageLabel:stage.label,week:week+1,
  weekday,intro,unit,pack,handbook,reading:passage,writing,dialogue,quiz,spelling,voiceLine,tasks,
  target:stage.target,estimatedMinutes:5+tasks.reduce((total,t)=>total+t.minutes,0)
 };
}
export function readDayState(storage=globalThis.localStorage){
 const state=parse(storage,DAILY_KEY);
 return {
   index:Number.isInteger(state.index)&&state.index>=0&&state.index<=GUIDED_STUDY_DAYS?state.index:0,
   startedAt:Number.isFinite(state.startedAt)&&state.startedAt>=0?state.startedAt:0,
   startedDate:typeof state.startedDate==="string"?state.startedDate:"",
   goal:[20,40,60].includes(state.goal)?state.goal:40,
   marks:safeRecord(state.marks),challenges:safeRecord(state.challenges),
   finished:Array.isArray(state.finished)?state.finished.filter(x=>Number.isInteger(x.day)&&x.day>=0&&x.day<GUIDED_STUDY_DAYS).slice(-GUIDED_STUDY_DAYS):[],
   errors:safeRecord(state.errors)
 };
}
export function saveDayState(state,storage=globalThis.localStorage){
 try{storage.setItem(DAILY_KEY,JSON.stringify(state));return true;}
 catch{return false;}
}
export function beginDay(storage=globalThis.localStorage,now=new Date()){
 const state=readDayState(storage);
 if(state.index<GUIDED_STUDY_DAYS&&!state.startedAt){
   state.startedAt=now.getTime();state.startedDate=dateKey(now);saveDayState(state,storage);
 }
 return state;
}
export function snapshot(storage=globalThis.localStorage){
 const academy=parse(storage,"shaira-academy-v1");
 const labs=parse(storage,"shaira-labs-v1");
 const legacy=parse(storage,"shaira-progress-v1");
 const mastery=loadMastery(storage);
 return {academy,labs,legacy,mastery};
}
export function stepComplete(step,state,snap,audioAvailable=true){
 const t=Number(state.startedAt)||0;
 if(!t)return false;
 const done=safeRecord(snap.academy.done),l=safeRecord(snap.labs);
 if(step.kind==="legacy")return Array.isArray(snap.legacy.completed)&&snap.legacy.completed.includes(step.key);
 if(["pack","unit","speak","dialogue"].includes(step.kind))return Number(done[step.key])>=t;
 if(step.kind==="listen")return Number(done[audioAvailable?step.key:step.fallback])>=t;
 if(step.kind==="handbook")return state.marks[String(state.index)+":"+step.id]===true;
 if(step.kind==="grammar"){
   const rec=safeRecord(safeRecord(l.grammar)[step.level]);
   return Number(rec.last)>=t&&Number(rec.lastScore)>=8;
 }
 if(step.kind==="reading"){
   const rec=safeRecord(safeRecord(l.readings)[step.key]);
   return Number(rec.last)>=t&&rec.lastPassed===true;
 }
 if(step.kind==="studio"){
   const row=safeRecord(safeRecord(snap.mastery).studios)[step.key];
   return Number(row?.last)>=t&&Number(row?.lastScore)===3;
 }
 if(step.kind==="checkpoint"){
   const row=safeRecord(safeRecord(snap.mastery).checkpoints)[step.key];
   return Number(row?.last)>=t&&row?.lastPassed===true&&
     Number(row?.lastScore)>=8&&Number(row?.correctTyped)>=1&&Number(row?.correctReading)>=1;
 }
 if(step.kind==="writing"){
   const rec=String(safeRecord(l.drafts)[step.key]||"");
   return Number(safeRecord(l.draftUpdated)[step.key])>=t &&
       wordTotal(rec)>=step.minimum && /[\u0400-\u052F]/u.test(rec);
 }
 return false;
}
export function dayStatus(day,state,snap,audioAvailable=true){
 if(!day)return {complete:true,steps:[],done:0,total:0,checks:0};
 const steps=day.tasks.map(step=>({...step,complete:stepComplete(step,state,snap,audioAvailable)}));
 const checks=safeRecord(state.challenges[String(day.index)]);
 const quick=Number(checks.quiz===true)+Number(checks.spell===true)+Number(checks.oral===true);
 const done=steps.filter(s=>s.complete).length+quick;
 return {steps,quiz:checks.quiz===true,spell:checks.spell===true,oral:checks.oral===true,
    wrongQuiz:Math.max(0,Number(checks.wrongQuiz)||0),wrongSpell:Math.max(0,Number(checks.wrongSpell)||0),
    done,total:steps.length+3,complete:done===steps.length+3};
}
export function markQuick(kind,storage=globalThis.localStorage){
 if(!["quiz","spell","oral"].includes(kind))return false;
 const state=beginDay(storage),id=String(state.index);
 const entry={...safeRecord(state.challenges[id]),[kind]:true};
 state.challenges[id]=entry;
 return saveDayState(state,storage);
}
export function addMistake(kind,storage=globalThis.localStorage){
 if(!["Quiz","Spell"].includes(kind))return false;
 const state=beginDay(storage),id=String(state.index),entry={...safeRecord(state.challenges[id])};
 entry["wrong"+kind]=Math.min(10000,(Number(entry["wrong"+kind])||0)+1);
 state.challenges[id]=entry;
 return saveDayState(state,storage);
}
export function markReference(step,storage=globalThis.localStorage){
 const state=beginDay(storage);
 if(!step||step.kind!=="handbook")return false;
 state.marks[String(state.index)+":"+step.id]=true;
 return saveDayState(state,storage);
}
export function changeGoal(goal,storage=globalThis.localStorage){
 if(![20,40,60].includes(goal))return false;
 const state=readDayState(storage);state.goal=goal;
 return saveDayState(state,storage);
}
export function finishDay(storage=globalThis.localStorage,now=new Date(),audioAvailable=true){
 const state=beginDay(storage,now),day=makeDay(state.index);
 if(!day)return {success:false,reason:"All guided sessions are complete."};
 const summary=dayStatus(day,state,snapshot(storage),audioAvailable);
 if(!summary.complete)return {success:false,reason:"Required activities are not finished.",remaining:summary.steps.filter(x=>!x.complete).map(x=>x.id)};
 const checks=safeRecord(state.challenges[String(day.index)]);
 state.finished.push({day:day.index,stage:day.stage,date:dateKey(now),completedAt:now.getTime(),
   wrongQuiz:Number(checks.wrongQuiz)||0,wrongSpell:Number(checks.wrongSpell)||0});
 state.finished=state.finished.slice(-GUIDED_STUDY_DAYS);
 state.index=Math.min(GUIDED_STUDY_DAYS,state.index+1);
 state.startedAt=0;state.startedDate="";
 const ok=saveDayState(state,storage);
 return {success:ok,state,completedDay:day,reason:ok?"":"Could not save your daily progress."};
}
export function skillsReport(state){
 const completed=state.finished;
 const stagesReport=stages.map(stage=>({
   stage:stage.id,label:stage.label,
   days:completed.filter(f=>f.stage===stage.id).length,
   total:DAYS_PER_STAGE
 }));
 const recent=completed.slice(-7);
 return {days:completed.length,stageRows:stagesReport,
    recentMistakes:recent.reduce((t,x)=>t+(Number(x.wrongQuiz)||0)+(Number(x.wrongSpell)||0),0),
    spellingNeedsPractice:recent.filter(x=>Number(x.wrongSpell)>0).length,
    grammarNeedsPractice:recent.filter(x=>Number(x.wrongQuiz)>0).length,
    lastStudied:completed.length?completed[completed.length-1].date:null};
}

export function skillOverview(snap){
 const academy=safeRecord(snap.academy),labs=safeRecord(snap.labs),done=safeRecord(academy.done);
 const memory=safeRecord(academy.memory),grammar=safeRecord(labs.grammar),readings=safeRecord(labs.readings),drafts=safeRecord(labs.drafts);
 const trackedGrammar=new Set(Object.values(grammar).flatMap(stage=>Object.keys(safeRecord(stage?.items))));
 return [
  {id:"words",count:Object.values(memory).filter(r=>r&&Number(r.seen)>0).length,total:firstWordPacks.length*6+units.length*6},
  {id:"grammar",count:trackedGrammar.size,total:grammarDrills.length},
  {id:"listen",count:Object.keys(done).filter(k=>k.endsWith("/listen")).length,total:units.length},
  {id:"reading",count:Object.values(readings).filter(x=>x?.passed===true).length,total:readingLibrary.length},
  {id:"writing",count:Object.entries(drafts).filter(([k,v])=>k.startsWith("portfolio:")&&String(v||"").trim().length>0).length,total:writingTasks.length},
  {id:"speaking",count:Object.keys(done).filter(k=>k.endsWith("/speak")).length,total:units.length}
 ];
}

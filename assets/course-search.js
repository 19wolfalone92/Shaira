// Fully offline cross-course search for English-speaking Russian learners.
// Only searches original bundled pedagogical material; no network calls or tracking.
import {firstWordPacks} from "./first-words.js";
import {grammarHandbook} from "./grammar-handbook.js";
import {grammarDrills} from "./grammar-drills.js";
import {readingLibrary} from "./reading-library.js";
import {writingTasks} from "./writing-tasks.js";
import {dialogues} from "./dialogues.js";
import {listeningClips} from "./listening-clips.js";
import {NOUNS} from "./declension-tables.js";
import {VERBS} from "./verb-paradigms.js";
import {SOUND_PAIRS} from "./phonetics-content.js";
import {scenarioMissions} from "./scenario-missions.js";
import {units} from "./academy-data.js";
const item=(id,type,title,subtitle,detail,href,stage="starter")=>({
 id,type,title:String(title||""),subtitle:String(subtitle||""),detail:String(detail||""),
 href,stage
});
export const COURSE_TYPES=[
 {id:"all",label:"All materials"},{id:"vocabulary",label:"Vocabulary"},
 {id:"grammar",label:"Grammar"},{id:"nouns",label:"Noun cases"},
 {id:"verbs",label:"Verbs"},{id:"reading",label:"Reading"},
 {id:"writing",label:"Writing"},{id:"dialogues",label:"Dialogues"},
 {id:"listening",label:"Listening"},{id:"phonetics",label:"Pronunciation"},
 {id:"roleplay",label:"Roleplay"}
];
export const SEARCH_ENTRIES=[
 ...firstWordPacks.flatMap((p,i)=>p.words.map((w,k)=>item(
   "word:"+p.id+":"+k,"vocabulary",w.ru,w.en,
   p.title.en+" / "+w.en,"#academy/first-words/"+p.id,p.stage||(i<20?"starter":"a1")))),
 ...grammarHandbook.map(p=>item("handbook:"+p.id,"grammar",p.title.en,"Grammar explanation",
   p.rule.en+" "+p.examples.map(e=>e.ru).join(" "),"#academy/handbook/"+p.id,p.stage)),
 ...grammarDrills.map(p=>item("drill:"+p.id,"grammar",p.instruction.en,p.context.en,
   p.choices.join(" ")+" "+p.explanation.en,"#academy/grammar/"+p.stage,p.stage)),
 ...readingLibrary.map(p=>item("reading:"+p.id,"reading",p.title.en,p.guide.en,
   p.text+" "+p.task.en+" "+p.glossary.map(x=>x.ru+" "+x.en).join(" "),"#academy/library/"+p.id,p.stage)),
 ...writingTasks.map(p=>item("writing:"+p.id,"writing",p.title.en,p.brief.en,
   p.model+" "+p.check.en,"#academy/writing/task/"+p.id,p.stage)),
 ...dialogues.map(p=>item("dialogue:"+p.id,"dialogues",p.title.en,p.goal.en,
   p.lines.map(l=>l.ru+" "+l.en).join(" "),"#academy/dialogues/"+p.id,p.stage)),
 ...listeningClips.map(p=>item("listening:"+p.id,"listening",p.title,p.question,
   p.russian+" "+p.why,"#academy/listening/"+p.id,p.stage)),
 ...NOUNS.map(p=>item("noun:"+p.id,"nouns",p.forms.sg[0],p.en,
   p.forms.sg.join(" ")+" "+p.forms.pl.join(" "),"#academy/cases/noun/"+p.id,"a1")),
 ...VERBS.map(p=>item("verb:"+p.id,"verbs",p.infinitive,p.en,
   p.now.join(" ")+" "+p.past.join(" ")+" "+p.example,"#academy/verbs/"+p.id,p.stage)),
 ...SOUND_PAIRS.map(p=>item("phonetics:"+p.id,"phonetics",p.a.ru+" / "+p.b.ru,p.focus,
   p.a.en+" "+p.b.en+" "+p.explain,"#academy/sounds/"+p.id,p.stage)),
 ...scenarioMissions.map(p=>item("scenario:"+p.id,"roleplay",p.title,p.setting,
   p.turns.map(t=>t.speaker+" "+t.goal+" "+t.options.join(" ")).join(" "),"#academy/scenarios/"+p.id,p.stage)),
 ...units.map(p=>item("unit:"+p.id,"vocabulary",p.title.en,"Grammar and vocabulary in context",
   p.words.map(w=>w.ru+" "+w.en).join(" ")+" "+p.example.ru,"#academy/lesson/"+p.id+"/words",p.stage))
];
export const searchNormalize=v=>String(v??"").normalize("NFC").toLocaleLowerCase("ru-RU").replaceAll("ё","е").replace(/[.,!?;:()«»"']/g," ").replace(/\s+/gu," ").trim();
export function searchMaterials(query,{type="all",limit=40}={}){
 const clean=searchNormalize(String(query??"").slice(0,100));
 if(clean.length<2)return [];
 const terms=clean.split(" ").filter(Boolean).slice(0,5),typeFilter=COURSE_TYPES.some(t=>t.id===type)?type:"all";
 return SEARCH_ENTRIES.map((entry,i)=>{
  if(typeFilter!=="all"&&entry.type!==typeFilter)return null;
  const title=searchNormalize(entry.title),sub=searchNormalize(entry.subtitle),
   detail=searchNormalize(entry.detail);
  if(!terms.every(term=>title.includes(term)||sub.includes(term)||detail.includes(term)))return null;
  const points=terms.reduce((n,term)=>n+
    (title===term?100:title.startsWith(term)?60:title.includes(term)?35:0)+
    (sub.startsWith(term)?25:sub.includes(term)?12:0)+
    (detail.includes(term)?2:0),0);
  return {entry,points,index:i};
 }).filter(Boolean).sort((a,b)=>b.points-a.points||a.index-b.index)
 .slice(0,Math.min(100,Math.max(1,Math.floor(limit)))).map(x=>x.entry);
}

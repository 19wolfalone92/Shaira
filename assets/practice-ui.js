import {stages} from "./academy-data.js";
import {bankForStage,selectMix,gradeMixAnswer,loadMix,mixStats,
 recordMixAnswer,recordMixSession,MIX_LENGTH,MIX_STAGES} from "./practice-engine.js";
import {hasRussianVoice} from "./russian-audio.js";
const labels={
 recognize:"Russian → English",recall:"English → Russian",spell:"Write a Russian word",
 grammar:"Grammar in context",case:"Declension challenge",verb:"Conjugate a verb",
 order:"Build a Russian sentence",translate:"Translate into Russian",repair:"Find the correct sentence",
 read:"Read and infer",match:"Match four pairs",hear:"Listen and understand",dictate:"Russian dictation"
};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const russianKeys=["ё й ц у к е н г ш щ з х ъ","ф ы в а п р о л д ж э","я ч с м и т ь б ю"];
let session=null;
function start(stage,audio=hasRussianVoice()){
 session={stage,items:selectMix(stage,loadMix(),{audio}),index:0,
 answered:[],feedback:null,entered:"",chosenTokens:[],matchRu:null,matched:[],matchedWrong:false,hadWrongMatch:false,choices:null,
 played:false,audioError:false,result:null,saveError:false};
}
function goStage(stage){
 if(!MIX_STAGES.includes(stage))stage="starter";
 if(session?.stage!==stage||session.items.length!==MIX_LENGTH)start(stage);
 return session;
}
function keyboard(){
 return '<details class="mx-keyboard"><summary>⌨ Russian keyboard</summary>'+
 russianKeys.map(row=>'<div>'+row.split(" ").map(ch=>
  '<button type="button" data-mix="key" data-char="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+
 '<div><button type="button" data-mix="key" data-char=" " class="mx-space">Space</button>'+
 '<button type="button" data-mix="backspace">⌫</button></div></details>';
}
function overview(){
 const stats=mixStats();
 return '<a class="mx-back" href="#academy">← Back to Academy</a>'+
 '<section class="mx-hero"><span>SHAIRA · FLEXIBLE PRACTICE</span><h1>Variety Lab</h1>'+
 '<p>Practise Russian in different ways every round: vocabulary, sentence building, grammar, case endings, verbs, proofreading, reading and Russian writing. Questions vary and target mistakes.</p>'+
 '<div class="mx-metrics"><div><strong>'+stats.practised+'</strong><small>Different exercises tried</small></div>'+
 '<div><strong>'+stats.accuracy+'%</strong><small>All-time answer accuracy</small></div>'+
 '<div><strong>'+stats.due+'</strong><small>Questions ready for review</small></div></div></section>'+
 '<section class="mx-guide"><h2>Choose your study level</h2><p>Each round uses 12 questions from different formats. An earlier error returns for review; previously unseen tasks are prioritised. You can practise any level.</p>'+
 stages.map(s=>'<a href="#academy/mix/'+s.id+'"><span>'+s.icon+'</span><div><strong>'+s.label+' · '+esc(s.en)+'</strong>'+
 '<small>'+bankForStage(s.id,{audio:false}).length+' available task variations across mixed skills</small></div><b>›</b></a>').join("")+'</section>'+
 '<p class="mx-honesty">No timers or punishment. These are practice scores, not official CEFR assessments. Pronunciation and open essays are not automatically evaluated.</p>';
}
function question(s){
 const q=s.items[s.index],idx=s.index+1;
 if(!q)return '<p>No exercise is available at this level.</p>';
 const done=s.feedback!==null;
 const title=labels[q.mode]||q.mode;
 const inner=q.mode==="order"?
   '<div class="mx-assembled" role="status" aria-live="polite">'+(s.chosenTokens.length?
     s.chosenTokens.map((id,pos)=>'<button type="button" data-mix="undo-token" data-position="'+pos+'" '+(done?"disabled":"")+' lang="ru">'+
       esc(q.tokens.find(x=>x.id===id)?.word||"")+' ↩</button>').join(""):'<span>Tap the Russian words in the correct order.</span>')+
   '</div><div class="mx-token-pool">'+q.tokens.filter(x=>!s.chosenTokens.includes(x.id)).map(x=>
      '<button type="button" data-mix="token" data-token="'+x.id+'" lang="ru" '+(done?"disabled":"")+'>'+esc(x.word)+'</button>').join("")+'</div>'+
   (!done?'<button type="button" data-mix="submit-order" class="mx-primary" '+(s.chosenTokens.length!==q.tokens.length?"disabled":"")+'>Check word order</button>':""):
 q.mode==="match"?
  '<div class="mx-match"><div><h3>Russian</h3>'+q.pairs.map((p,i)=>
    '<button type="button" data-mix="pick-ru" data-item="'+i+'" lang="ru" class="'+(s.matchRu===p.ru?"selected":"")+'" '+
    (done||s.matched.some(x=>x.ru===p.ru)?"disabled":"")+'>'+esc(p.ru)+'</button>').join("")+'</div>'+
  '<div><h3>English</h3>'+s.matchOptions.map((x,i)=>
    '<button type="button" data-mix="pick-en" data-item="'+i+'" '+(done||s.matched.some(p=>p.en===x)?"disabled":"")+'>'+esc(x)+'</button>').join("")+'</div></div>'+
   '<p class="mx-muted">Select a Russian item, then its English meaning. '+s.matched.length+'/4 pairs matched.</p>'+
   (s.matchedWrong?'<p class="mx-warning" role="status">Not this pair. Try a different match.</p>':""):
 ["spell","case","verb","translate","dictate"].includes(q.mode)?
  '<form id="mx-answer-form"><label for="mx-answer">Type in Russian</label>'+
   '<input id="mx-answer" lang="ru" required spellcheck="false" autocorrect="off" autocomplete="off" value="'+esc(s.entered)+'" '+(done||q.audio&&!s.played?"disabled":"")+'>'+
   '<p class="mx-muted">Check exact spelling, word forms and ё. Punctuation and letter case do not affect this drill.</p>'+
   (!done&&(!q.audio||s.played)?'<button class="mx-primary" type="submit">Check my writing</button>'+keyboard():"")+'</form>':
 '<div class="mx-options">'+s.choices.map((v,i)=>
   '<button type="button" data-mix="choice" data-choice="'+i+'" '+(done||q.audio&&!s.played?"disabled":"")+
   ' class="'+(done?(v===q.answer?"mx-correct":s.selected===v?"mx-wrong":""):"")+'">'+esc(v)+'</button>').join("")+'</div>';
 const display=q.mode==="hear"||q.mode==="dictate"?"":q.display?
  '<div class="mx-display" '+(/[\u0400-\u052F]/u.test(q.display)?'lang="ru"':"")+'>'+esc(q.display)+'</div>':"";
 const audio=q.audio&&!done?
 '<div class="mx-audio"><button type="button" data-mix="play">🔊 Play Russian</button>'+
 '<button type="button" data-mix="slow">Slow playback</button><small>'+(s.played?"Audio played":"Listen to the full example before answering")+'</small></div>'+
 (s.audioError?'<p class="mx-warning" role="status">Russian audio could not play.</p>'+
  '<button type="button" class="mx-primary" data-mix="restart-text">Start a round without audio</button>':""):"";
 return '<section class="mx-question"><div class="mx-top"><span>'+esc(title)+'</span><b>Question '+idx+'/'+s.items.length+'</b></div>'+
 '<div class="mx-progress"><i style="width:'+Math.round((idx-1)/s.items.length*100)+'%"></i></div>'+
 '<h2>'+esc(q.prompt)+'</h2>'+display+audio+inner+
 (done?'<section class="mx-feedback '+(s.feedback.correct?"good":"bad")+'" role="status">'+
  '<strong>'+(s.feedback.correct?"✓ Correct":"↻ Not yet")+'</strong><p>Model answer: <span lang="ru">'+esc(q.answer)+'</span></p>'+
  '<p>'+esc(q.explanation)+'</p><button type="button" class="mx-primary" data-mix="next">'+
  (idx===s.items.length?"See my session results":"Next exercise →")+'</button></section>':"")+
 '</section>';
}
function result(s){
 const r=s.result,errors=s.answered.filter(x=>!x.correct);
 return '<section class="mx-result"><span>'+(r.passed?"✓":"↻")+'</span><h1>'+r.score+'/'+MIX_LENGTH+' correct</h1>'+
 '<h2>'+(r.passed?"Practice checkpoint passed":"More practice recommended")+'</h2>'+
 '<p>'+r.productive+' productive answers correct. For this learning checkpoint, aim for at least 9/12 overall, including two correct written or word-order tasks.</p>'+
 (!r.saved?'<p class="mx-warning">Could not save your results on this device.</p>':"")+
 (errors.length?'<details open><summary>Review '+errors.length+' missed exercises</summary>'+
 errors.map(x=>'<article><b>'+esc(labels[x.mode]||x.mode)+'</b><p>Correct: <span lang="ru">'+esc(x.answer)+'</span></p>'+
  '<p>'+esc(x.explanation)+'</p></article>').join("")+'</details>':"<p>All twelve answers were correct in this session.</p>")+
 '<button type="button" data-mix="restart" class="mx-primary">New varied round ↻</button>'+
 '<a class="mx-link" href="#academy/mix">Choose another level</a>'+
 '<p class="mx-honesty">A practice score reflects selected questions only. It is not a complete CEFR language assessment.</p></section>';
}
export function mixerHtml(route){
 if(route==="academy/mix")return overview();
 const stage=route.split("/")[2];
 if(!MIX_STAGES.includes(stage))return overview();
 const s=goStage(stage);
 if(!s.choices&&s.items[s.index]?.options)s.choices=s.items[s.index].options;
 if(!s.matchOptions&&s.items[s.index]?.mode==="match")s.matchOptions=shuffled(s.items[s.index].pairs.map(p=>p.en));
 return '<a class="mx-back" href="#academy/mix">← Back to Practice Lab</a>'+
 '<section class="mx-header"><span>SHAIRA · '+stage.toUpperCase()+'</span><h1>Flexible Russian practice</h1>'+
 '<p>Different tasks, new combinations and review of earlier mistakes.</p></section>'+
 (s.result?result(s):question(s));
}
function shuffled(items){
 const x=items.slice();for(let i=x.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;
}
function gradeAndShow(s,answer,api){
 const q=s.items[s.index],correct=gradeMixAnswer(q,answer)&&!(q.mode==="match"&&s.hadWrongMatch);
 const saved=recordMixAnswer(q.id,correct);
 s.saveError=!saved||s.saveError;
 s.feedback={correct};
 s.answered.push({id:q.id,mode:q.mode,answer:q.answer,entered:answer,correct,explanation:q.explanation});
 api.render();
}
function next(s,api){
 s.index++;s.feedback=null;s.entered="";s.selected=null;s.played=false;s.audioError=false;
 s.chosenTokens=[];s.matchRu=null;s.matched=[];s.matchedWrong=false;s.hadWrongMatch=false;s.matchOptions=null;s.choices=null;
 if(s.index>=s.items.length){
  s.result=recordMixSession(s.stage,s.answered);
  if(s.result&&s.saveError)s.result.saved=false;
 }
 api.render();
}
export function mixerAction(btn,api){
 const stage=api.route().split("/")[2],s=goStage(stage),q=s.items[s.index],a=btn.dataset.mix;
 if(a==="restart"||a==="restart-text"){start(stage,a==="restart-text"?false:undefined);api.render();return;}
 if(s.result||!q)return;
 if(a==="next"&&s.feedback){next(s,api);return;}
 if(s.feedback)return;
 if(a==="play"||a==="slow"){
  if(!q.audio)return;
  const route=api.route(),index=s.index;
  api.speak(q.audio,a==="slow"?0.62:0.82,ok=>{
   if(session!==s||api.route()!==route||s.index!==index||s.feedback)return;
   const input=document.getElementById("mx-answer");
   if(input)s.entered=input.value;
   if(ok)s.played=true;
   s.audioError=!ok;
   api.render();
  });
  return;
 }
 if(a==="key"||a==="backspace"){
  const input=document.getElementById("mx-answer");if(!input)return;
  const x=input.selectionStart??input.value.length,z=input.selectionEnd??x;
  if(a==="key")input.setRangeText(btn.dataset.char||"",x,z,"end");
  else if(x!==z)input.setRangeText("",x,z,"end");
  else if(x>0)input.setRangeText("",x-1,x,"end");
  s.entered=input.value;input.focus();return;
 }
 if(a==="choice"){
  if(q.audio&&!s.played)return;
  const index=Number(btn.dataset.choice);
  if(!Number.isInteger(index)||index<0||index>=s.choices.length)return;
  s.selected=s.choices[index];gradeAndShow(s,s.selected,api);return;
 }
 if(a==="token"&&q.mode==="order"){
  const id=Number(btn.dataset.token);
  if(q.tokens.some(x=>x.id===id)&&!s.chosenTokens.includes(id))s.chosenTokens.push(id);
  api.render();return;
 }
 if(a==="undo-token"&&q.mode==="order"){
  const index=Number(btn.dataset.position);
  if(Number.isInteger(index)&&index>=0&&index<s.chosenTokens.length)s.chosenTokens.splice(index,1);
  api.render();return;
 }
 if(a==="submit-order"&&q.mode==="order"&&s.chosenTokens.length===q.tokens.length){
  gradeAndShow(s,s.chosenTokens.map(id=>q.tokens.find(x=>x.id===id).word).join(" "),api);return;
 }
 if(a==="pick-ru"&&q.mode==="match"){
  const index=Number(btn.dataset.item),v=q.pairs[index]?.ru;
  if(v&&!s.matched.some(x=>x.ru===v)){s.matchRu=v;s.matchedWrong=false;api.render();}
  return;
 }
 if(a==="pick-en"&&q.mode==="match"&&s.matchRu){
  const index=Number(btn.dataset.item),en=s.matchOptions[index];
  const target=q.pairs.find(x=>x.ru===s.matchRu);
  if(!en||s.matched.some(x=>x.en===en))return;
  if(target?.en===en){s.matched.push(target);s.matchRu=null;s.matchedWrong=false;
   if(s.matched.length===q.pairs.length){gradeAndShow(s,s.matched,api);return;}
  }else{s.matchedWrong=true;s.hadWrongMatch=true;}
  api.render();return;
 }
}
export function mixerSubmit(event,api){
 if(event.target.id!=="mx-answer-form")return false;
 event.preventDefault();
 const s=goStage(api.route().split("/")[2]);
 if(s.result||s.feedback)return true;
 const q=s.items[s.index];
 if(!q)return true;
 if(q.audio&&!s.played)return true;
 const input=document.getElementById("mx-answer");
 if(!input)return true;
 s.entered=input.value;
 gradeAndShow(s,s.entered,api);return true;
}

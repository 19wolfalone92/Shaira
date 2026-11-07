import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FIRST_STEPS,microAudioId} from "../assets/first-steps-data.js";
import {SOUND_PAIRS} from "../assets/phonetics-content.js";
import {listeningClips} from "../assets/listening-clips.js";
import {audioClips} from "../assets/audio/index.js";
import {startPrivateRecording,discardPrivateRecording} from "../assets/speaking-recorder.js";

test("all beginner and graded audio has a bundled MP3 and is included in the offline cache",()=>{
 const expected=new Set([
  ...FIRST_STEPS.map(microAudioId),
  ...SOUND_PAIRS.flatMap(pair=>[pair.id+"-0",pair.id+"-1"]),
  ...listeningClips.map(clip=>clip.id),
 ]);
 assert.equal(expected.size,157);
 assert.deepEqual(new Set(Object.keys(audioClips)),expected);
 for(const [id,encoded] of Object.entries(audioClips)){
  const bytes=Buffer.from(encoded,"base64");
  assert.ok(bytes.length>800,id);
  assert.equal(bytes.subarray(0,3).toString(),"ID3",id);
 }
 const audioIndex=readFileSync(new URL("../assets/audio/index.js",import.meta.url),"utf8");
 const cacheList=readFileSync(new URL("../assets/audio/cache-list.js",import.meta.url),"utf8");
 const worker=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
 assert.match(worker,/importScripts\("\.\/assets\/audio\/cache-list\.js"\)/);
 assert.match(cacheList,/\.\/assets\/audio\/index\.js/);
 for(const [,name] of audioIndex.matchAll(/from "\.\/([^"]+)"/g))assert.ok(cacheList.includes("./assets/audio/"+name),name);
});

test("leaving speaking practice before microphone permission resolves releases the late stream",async()=>{
 const own=Object.getOwnPropertyDescriptor(globalThis,"navigator"),original=globalThis.MediaRecorder;
 let resolvePermission,stopped=0;
 Object.defineProperty(globalThis,"navigator",{configurable:true,value:{mediaDevices:{
  getUserMedia:()=>new Promise(resolve=>{resolvePermission=resolve;})
 }}});
 globalThis.MediaRecorder=class{constructor(){assert.fail("A discarded attempt must not start recording.");}};
 try{
  const attempt=startPrivateRecording(()=>assert.fail("A discarded attempt must not publish audio."));
  discardPrivateRecording();
  resolvePermission({getTracks:()=>[{stop(){stopped++;}}]});
  assert.equal(await attempt,false);
  assert.equal(stopped,1);
 }finally{
  Object.defineProperty(globalThis,"navigator",own);
  globalThis.MediaRecorder=original;
 }
});

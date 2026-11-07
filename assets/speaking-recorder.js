/* Local-only speaking rehearsal. Explicit user microphone permission; no upload.
 * Audio is ephemeral in browser memory; it is not saved in progress or backups.
 */
let active=null,objectURL=null;
function releaseStream(stream){try{stream?.getTracks()?.forEach(track=>track.stop());}catch{}}
export function isRecordingSupported(){
  return typeof navigator!=="undefined"&&!!navigator.mediaDevices?.getUserMedia&&typeof MediaRecorder!=="undefined";
}
export async function startPrivateRecording(onStop){
  if(!isRecordingSupported())throw new Error("Microphone recording is unavailable in this browser.");
  if(active)throw new Error("Please stop the current recording first.");
  if(objectURL){URL.revokeObjectURL(objectURL);objectURL=null;}
  const current={recorder:null,stream:null};
  active=current;
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    current.stream=stream;
    if(active!==current){releaseStream(stream);return false;}
    const recorder=new MediaRecorder(stream),chunks=[];
    current.recorder=recorder;
    recorder.addEventListener("dataavailable",event=>{if(event.data&&event.data.size)chunks.push(event.data);});
    recorder.addEventListener("stop",()=>{
      releaseStream(stream);
      if(active!==current)return; // discarded session, do not create a blob URL
      active=null;
      if(!chunks.length)return onStop?.(null);
      const blob=new Blob(chunks,{type:recorder.mimeType||chunks[0].type||"audio/mp4"});
      objectURL=URL.createObjectURL(blob);
      onStop?.(objectURL);
    },{once:true});
    recorder.start();
    return true;
  }catch(error){
    releaseStream(current.stream);
    if(active!==current)return false;
    active=null;
    throw error;
  }
}
export function stopPrivateRecording(){
  if(active?.recorder&&active.recorder.state!=="inactive"){active.recorder.stop();return true;}
  return false;
}
export function discardPrivateRecording(){
  if(active){
    const current=active;active=null;
    releaseStream(current.stream);
    try{if(current.recorder&&current.recorder.state!=="inactive")current.recorder.stop();}catch{}
  }
  if(objectURL){try{URL.revokeObjectURL(objectURL);}catch{}objectURL=null;}
}

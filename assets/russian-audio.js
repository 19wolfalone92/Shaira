import {audioClips} from "./audio/index.js";

let active = null;
const failedVoices = new Set();

function russianVoice() {
  const voices = globalThis.window?.speechSynthesis?.getVoices?.() ?? [];
  const available = voices.filter(voice => /^ru(?:[-_]|$)/i.test(voice.lang) &&
    !failedVoices.has(voice.voiceURI || voice.name));
  return available.find(voice => voice.localService) ?? available[0];
}

export function hasRussianVoice() {
  return typeof globalThis.SpeechSynthesisUtterance === "function" && !!russianVoice();
}

export function stopRussianAudio() {
  const playback = active;
  active = null;
  playback?.stop();
}

export function playRussian(text, rate, complete, clipId) {
  stopRussianAudio();
  const speed = Math.min(1.2, Math.max(0.5, Number(rate) || 0.85));
  function finish(playback, ok) {
    if (active !== playback) return;
    active = null;
    complete(ok);
  }
  const clip = audioClips[clipId];
  if (clip && typeof globalThis.Audio === "function") {
    const player = new Audio("data:audio/mpeg;base64," + clip);
    const playback = {stop: () => player.pause()};
    active = playback;
    player.playbackRate = speed;
    player.addEventListener("ended", () => finish(playback, true), {once:true});
    player.addEventListener("error", () => finish(playback, false), {once:true});
    try { player.play().catch(() => finish(playback, false)); }
    catch { finish(playback, false); }
    return;
  }
  const voice = russianVoice();
  if (!voice || typeof globalThis.SpeechSynthesisUtterance !== "function") {
    complete(false);
    return;
  }
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  utterance.voice = voice;
  utterance.rate = speed;
  const playback = {stop: () => synth.cancel()};
  active = playback;
  utterance.onend = () => finish(playback, true);
  utterance.onerror = event => {
    if (active === playback && ["language-unavailable","voice-unavailable","synthesis-unavailable"].includes(event.error))
      failedVoices.add(voice.voiceURI || voice.name);
    finish(playback, false);
  };
  try { synth.speak(utterance); }
  catch { finish(playback, false); }
}

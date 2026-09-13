"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {Play,Pause} from "lucide-react";

const MALE_PT_BR_HINTS=["antonio","felipe","thiago","ricardo","daniel","paulo","male","mascul"];

function pickVindeVoice(voices:SpeechSynthesisVoice[]){
  const ptbr=voices.filter(v=>/^pt(-|_)BR$/i.test(v.lang)||/portugu.*brasil/i.test(`${v.name} ${v.lang}`));
  const pool=ptbr.length?ptbr:voices.filter(v=>/^pt/i.test(v.lang));
  const saved=typeof window!=="undefined"?window.localStorage.getItem("vinde_gospel_voice"):null;
  if(saved){const found=pool.find(v=>v.voiceURI===saved);if(found)return found}
  const preferred=pool.find(v=>MALE_PT_BR_HINTS.some(h=>v.name.toLowerCase().includes(h)))||pool[0]||voices[0];
  if(preferred&&typeof window!=="undefined")window.localStorage.setItem("vinde_gospel_voice",preferred.voiceURI);
  return preferred;
}
function fmt(n:number){if(!Number.isFinite(n))return "0:00";const m=Math.floor(n/60),s=Math.floor(n%60);return `${m}:${String(s).padStart(2,"0")}`}

export function GospelAudioButton({audioUrl,text}:{audioUrl?:string|null;text:string}){
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
  const [playing,setPlaying]=useState(false);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [current,setCurrent]=useState(0);
  const [duration,setDuration]=useState(0);
  const preferredVoice=useMemo(()=>pickVindeVoice(voices),[voices]);

  useEffect(()=>{
    if(typeof window==="undefined"||!("speechSynthesis" in window))return;
    const load=()=>setVoices(window.speechSynthesis.getVoices());
    load();window.speechSynthesis.addEventListener?.("voiceschanged",load);
    return()=>{window.speechSynthesis.removeEventListener?.("voiceschanged",load);window.speechSynthesis.cancel()}
  },[]);

  async function toggle(){
    if(audioUrl){const a=audioRef.current;if(!a)return;if(a.paused){await a.play();setPlaying(true)}else{a.pause();setPlaying(false)}return}
    if(!("speechSynthesis" in window))return;
    if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();setPlaying(false);return}
    const u=new SpeechSynthesisUtterance(text);utteranceRef.current=u;u.lang="pt-BR";if(preferredVoice)u.voice=preferredVoice;u.rate=.82;u.pitch=.78;u.volume=1;u.onend=()=>setPlaying(false);u.onerror=()=>setPlaying(false);window.speechSynthesis.cancel();window.speechSynthesis.speak(u);setPlaying(true)
  }

  if(!audioUrl)return <button type="button" className="moment-audio-toggle" onClick={toggle} aria-label={playing?"Pausar Evangelho":"Ouvir Evangelho"}>{playing?<Pause size={17}/>:<Play size={17}/>}<span>{playing?"Pausar":"Play"}</span></button>;

  return <div className="moment-audio-player">
    <button type="button" className="moment-audio-toggle" onClick={toggle} aria-label={playing?"Pausar Evangelho":"Ouvir Evangelho"}>{playing?<Pause size={17}/>:<Play size={17}/>}<span>{playing?"Pausar":"Play"}</span></button>
    <div className="moment-audio-timeline">
      <span>{fmt(current)}</span>
      <input aria-label="Progresso do áudio" type="range" min={0} max={duration||0} step="0.1" value={Math.min(current,duration||0)} onChange={e=>{const a=audioRef.current;if(a)a.currentTime=Number(e.target.value)}}/>
      <span>{fmt(duration)}</span>
    </div>
    <audio ref={audioRef} src={audioUrl} onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>setCurrent(e.currentTarget.currentTime)} onEnded={()=>{setPlaying(false);setCurrent(0)}} onPause={()=>setPlaying(false)} preload="metadata"/>
  </div>
}

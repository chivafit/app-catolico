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
  const estimatedDuration=useMemo(()=>Math.max(18,Math.round((text.trim().split(/\s+/).length/125)*60)),[text]);
  const preferredVoice=useMemo(()=>pickVindeVoice(voices),[voices]);
  const total=audioUrl?duration:estimatedDuration;

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
    const u=new SpeechSynthesisUtterance(text);utteranceRef.current=u;u.lang="pt-BR";if(preferredVoice)u.voice=preferredVoice;u.rate=.82;u.pitch=.78;u.volume=1;u.onboundary=e=>{if(typeof e.charIndex==="number"&&text.length)setCurrent(estimatedDuration*Math.min(1,e.charIndex/text.length))};u.onend=()=>{setPlaying(false);setCurrent(estimatedDuration)};u.onerror=()=>setPlaying(false);window.speechSynthesis.cancel();setCurrent(0);window.speechSynthesis.speak(u);setPlaying(true)
  }

  return <div className="moment-audio-player">
    <button type="button" className="moment-audio-toggle" onClick={toggle} aria-label={playing?"Pausar Evangelho":"Ouvir Evangelho"}>{playing?<Pause size={18}/>:<Play size={18}/>}</button>
    <div className="moment-audio-progress-wrap">
      {audioUrl?<input aria-label="Progresso do áudio" type="range" min={0} max={duration||0} step="0.1" value={Math.min(current,duration||0)} onChange={e=>{const a=audioRef.current;if(a)a.currentTime=Number(e.target.value)}}/>:<div className="moment-audio-progress" aria-hidden="true"><span style={{width:`${Math.min(100,total?current/total*100:0)}%`}}/></div>}
      <span className="moment-audio-time">{fmt(current)} / {fmt(total)}</span>
    </div>
    {audioUrl&&<audio ref={audioRef} src={audioUrl} onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>setCurrent(e.currentTarget.currentTime)} onEnded={()=>{setPlaying(false);setCurrent(0)}} onPause={()=>setPlaying(false)} preload="metadata"/>}
  </div>
}

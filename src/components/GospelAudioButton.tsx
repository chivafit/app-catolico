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

export function GospelAudioButton({audioUrl,text}:{audioUrl?:string|null;text:string}){
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
  const [playing,setPlaying]=useState(false);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const preferredVoice=useMemo(()=>pickVindeVoice(voices),[voices]);

  useEffect(()=>{
    if(typeof window==="undefined"||!("speechSynthesis" in window))return;
    const load=()=>setVoices(window.speechSynthesis.getVoices());
    load();window.speechSynthesis.addEventListener?.("voiceschanged",load);
    return()=>{window.speechSynthesis.removeEventListener?.("voiceschanged",load);window.speechSynthesis.cancel()}
  },[]);

  async function toggle(){
    if(audioUrl){
      const a=audioRef.current;if(!a)return;
      if(a.paused){await a.play();setPlaying(true)}else{a.pause();setPlaying(false)}
      return;
    }
    if(!("speechSynthesis" in window))return;
    if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();setPlaying(false);return}
    const u=new SpeechSynthesisUtterance(text);
    utteranceRef.current=u;
    u.lang="pt-BR";
    if(preferredVoice)u.voice=preferredVoice;
    u.rate=.82;
    u.pitch=.78;
    u.volume=1;
    u.onend=()=>setPlaying(false);
    u.onerror=()=>setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }

  return <>
    <button className="moment-audio" onClick={toggle} aria-label={playing?"Pausar Evangelho":"Ouvir Evangelho"}>
      <span className="moment-audio-icon">{playing?<Pause size={22}/>:<Play size={22}/>}</span>
      {playing?"Pausar Evangelho":"Ouvir Evangelho"}
    </button>
    {audioUrl&&<audio ref={audioRef} src={audioUrl} onEnded={()=>setPlaying(false)} onPause={()=>setPlaying(false)} preload="metadata"/>}
  </>
}

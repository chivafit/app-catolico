import {BookOpen,Heart,CheckCircle2,Sparkles,Volume2} from "lucide-react";
import {AppShell} from "@/components/AppShell";
import {DailyActions} from "@/components/DailyActions";
import {DailyHistory} from "@/components/DailyHistory";
import {GospelAudioButton} from "@/components/GospelAudioButton";
import {MomentTopActions} from "@/components/MomentTopActions";
import {MomentLoginPrompt,MomentSteps,MomentStreakBadge} from "@/components/MomentJourneyUX";
import {getTodayDevotional} from "@/lib/data";
import journey from "@/components/JourneyFinish.module.css";
import "./momento-editorial.css";

const bibleImage="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=88";

export default async function Momento(){
 const d=await getTodayDevotional();
 const now=new Date();
 const dateLabel=now.toLocaleDateString("pt-BR",{day:"2-digit",month:"long"});
 const gospel=d?.scripture_excerpt||"Naquele tempo, os onze discípulos foram para a Galileia, ao monte que Jesus lhes tinha indicado. Quando o viram, prostraram-se diante dele. Alguns, porém, duvidaram. Então, Jesus aproximou-se e disse-lhes: «Toda a autoridade me foi dada no céu e na terra. Ide, portanto, e fazei discípulos de todos os povos.»";
 const heroTitle=d?.title||"Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.";
 const ref=d?.scripture_reference||"Mt 11,28";
 return <AppShell><div className="moment-editorial">
  <div className="moment-editorial-toolbar"><div><span>JORNADA DE HOJE</span><p>Sua dose diária de fé</p></div><div className="moment-editorial-toolbar-right"><MomentStreakBadge/><MomentTopActions id={d?.id} title={heroTitle}/></div></div>
  <div className="moment-editorial-date">{dateLabel}</div>
  <section className="moment-editorial-hero" style={{backgroundImage:`url(${bibleImage})`}}><div className="moment-editorial-hero-copy"><blockquote>“{heroTitle}”</blockquote><span>{ref}</span></div></section>
  <div className="moment-editorial-audio"><div className="moment-editorial-audio-label"><span><Volume2 size={18}/></span><div><small>OUVIR</small><strong>Evangelho de hoje</strong></div></div><GospelAudioButton audioUrl={d?.audio_url} text={gospel}/></div>
  <MomentSteps/>
  <section className="moment-editorial-reading" id="evangelho"><div className="moment-editorial-label"><BookOpen size={15}/> PALAVRA DO DIA</div><h2>Evangelho de hoje</h2><h3>{ref}</h3><p>{gospel}</p></section>
  <section className="moment-editorial-feature reflection" id="reflexao"><span className="moment-editorial-feature-icon"><Sparkles/></span><div><small>REFLEXÃO</small><h2>O que essa Palavra quer dizer para você hoje?</h2><p>{d?.reflection||"Reserve alguns minutos para acolher a Palavra e perceber o que ela desperta em você hoje."}</p></div></section>
  <div className="moment-editorial-pair"><section id="oracao"><span><Heart size={18}/></span><small>ORAÇÃO</small><h3>Fale com Deus</h3><p>{d?.prayer||"Senhor, orienta minhas escolhas e meu dia. Amém."}</p></section><section id="proposito"><span><CheckCircle2 size={18}/></span><small>PROPÓSITO</small><h3>Leve para o dia</h3><p>{d?.purpose||"Faça hoje um gesto concreto de escuta e cuidado."}</p></section></div>
  <MomentLoginPrompt/>
  <section className={journey.wrap}><div className={journey.hero}><div><span className={journey.kicker}>SUA JORNADA</span><h2>Continue cultivando constância.</h2><p>Pequenos passos, grandes encontros com Deus.</p></div><div className={journey.historyDock}><DailyHistory/></div></div><DailyActions devotionalId={d?.id} title={heroTitle}/></section>
 </div></AppShell>
}

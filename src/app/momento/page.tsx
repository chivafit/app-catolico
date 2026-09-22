import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {DailyActions} from "@/components/DailyActions";
import {GospelAudioButton} from "@/components/GospelAudioButton";
import {MomentTopActions} from "@/components/MomentTopActions";
import {MomentLoginPrompt,MomentStreakBadge} from "@/components/MomentJourneyUX";
import {getTodayDevotional} from "@/lib/data";
import s from "./momento.module.css";

const steps=[["#evangelho","Palavra"],["#reflexao","Reflexão"],["#oracao","Oração"],["#proposito","Propósito"]];

export default async function Momento(){
 const d=await getTodayDevotional();
 const dateLabel=new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long"});
 const gospel=d?.scripture_excerpt||"O texto do Evangelho de hoje será publicado em instantes.";
 const verse=d?.title||"Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.";
 const ref=d?.scripture_reference||"Mt 11, 28";

 return <AppShell hideHeader>
  <div className={s.page}>
   <header className={s.top}>
    <Link href="/" className="inner-back" aria-label="Voltar"><ChevronLeft size={22}/></Link>
    <MomentStreakBadge/>
    <MomentTopActions id={d?.id} title={verse}/>
   </header>

   <section className={s.intro}>
    <span className="eyebrow">Jornada de hoje · {dateLabel}</span>
    <h1>Evangelho de hoje</h1>
    <p className={s.ref}>{ref}</p>
   </section>

   <section className={s.word} style={d?.image_url?{backgroundImage:`url(${d.image_url})`}:undefined}>
    <p className="scripture">“{verse}”</p>
   </section>

   <div className={s.audio}>
    <div className={s.audioCopy}>
     <small className="eyebrow">Ouvir</small>
     <strong>Evangelho de hoje</strong>
    </div>
    <GospelAudioButton audioUrl={d?.audio_url} text={gospel}/>
   </div>

   <nav className={s.steps} aria-label="Etapas do momento">
    <div className={s.stepBars}>{steps.map(([href],i)=><span key={href} data-done={i===0||undefined}/>)}</div>
    <div className={s.stepLabels}>{steps.map(([href,label],i)=><a href={href} key={href} data-current={i===0||undefined}>{label}</a>)}</div>
   </nav>

   <section className="section" id="evangelho">
    <span className="eyebrow">Palavra do dia</span>
    <p className={s.reading}>{gospel}</p>
   </section>

   <section className={s.reflection} id="reflexao">
    <span className="eyebrow">Reflexão</span>
    <h2>O que essa Palavra quer dizer para você hoje?</h2>
    <p>{d?.reflection||"Reserve alguns minutos para acolher a Palavra e perceber o que ela desperta em você hoje."}</p>
   </section>

   <div className={s.pair}>
    <section id="oracao">
     <span className="eyebrow">Oração</span>
     <h3>Fale com Deus</h3>
     <p className={s.prayerText}>{d?.prayer||"Senhor, orienta minhas escolhas e meu dia. Amém."}</p>
    </section>
    <section id="proposito">
     <span className="eyebrow">Propósito</span>
     <h3>Leve para o dia</h3>
     <p>{d?.purpose||"Faça hoje um gesto concreto de escuta e cuidado."}</p>
    </section>
   </div>

   <MomentLoginPrompt/>
   <div className={s.finish}><DailyActions devotionalId={d?.id} title={verse}/></div>
  </div>
 </AppShell>;
}

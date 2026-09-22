"use client";
import Link from "next/link";
import {ArrowRight,ChevronRight,Church,Flame,HandCoins,HandHeart,MapPin,Volume2} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";
import type {FaithRecommendation} from "@/lib/recommendations";
import s from "./HomeReference.module.css";

type Devotional={title?:string|null;scripture_reference?:string|null;scripture_excerpt?:string|null;audio_url?:string|null};
type Event={id:string;title:string;starts_at:string;location?:string|null;image_url?:string|null;parishes?:{name?:string|null}|null};
type Parish={name?:string|null;city?:string|null;state?:string|null};
type Mass={id:string;starts_at:string;label?:string|null};

const greet=()=>{const h=Number(new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",hour12:false}).format(new Date()));return h<12?"Bom dia":h<18?"Boa tarde":"Boa noite"};
const paths=[
 {href:"/oracoes",label:"Oração do dia",text:"Terço, Salve-Rainha e intenções",icon:HandHeart},
 {href:"/igreja",label:"Minha igreja",text:"Avisos, pastorais e secretaria",icon:Church},
 {href:"/doacoes",label:"Ofertar",text:"Dízimo, campanhas e obras sociais",icon:HandCoins}
];

export function HomeReference({devotional,event,parish,nextMass,streak=0}:{
 devotional:Devotional|null;event:Event|null;parish?:Parish|null;nextMass?:Mass|null;streak?:number;
 recommendations?:FaithRecommendation[];
}){
 const {user,profile}=useAuth();
 const firstName=(profile?.full_name||user?.email?.split("@")[0]||"").split(/\s|\./)[0];
 const initials=(profile?.full_name||user?.email||"Vinde").split(/\s|@/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
 const today=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
 const verse=devotional?.scripture_excerpt||devotional?.title||"Vinde a mim, vós todos que estais cansados, e eu vos aliviarei.";
 const ref=devotional?.scripture_reference||"Mt 11, 28–30";
 const evDate=event?new Date(event.starts_at):null;

 return <div className={s.page}>
  <header className={s.header}>
   <Link href="/" className={s.brand}>
    <img src="/vinde-mark.svg" alt="" width={30} height={30}/>
    <span>Vinde</span>
   </Link>
   <Link href={user?"/perfil":"/entrar"} className={s.avatar} aria-label={user?"Abrir perfil":"Entrar"}>{initials}</Link>
  </header>

  <section className={s.greeting}>
   <span className="eyebrow">{today}</span>
   <h1>{firstName?`${greet()}, ${firstName}.`:`${greet()}.`}</h1>
  </section>

  <Link href="/momento" className={s.word}>
   <div className={s.wordMedia} style={devotional?.["image_url" as never]?{backgroundImage:`url(${devotional["image_url" as never]})`}:undefined}>
    <span className="eyebrow">Palavra de hoje</span>
    <p className="scripture">“{verse}”</p>
   </div>
   <div className={s.wordFoot}>
    <span className={s.wordRef}>{ref}</span>
    {devotional?.audio_url&&<span className={s.wordAudio}><Volume2 size={17}/> Ouvir</span>}
   </div>
   <span className={`cta-gold ${s.wordCta}`}>Viver este momento <ArrowRight size={18}/></span>
  </Link>

  {streak>0&&<p className={s.streak}><Flame size={16}/> {streak} {streak===1?"dia":"dias"} seguidos com a Palavra</p>}

  {parish&&<section className="section">
   <span className="eyebrow">Sua paróquia</span>
   <h2 className={s.parishName}>{parish.name}</h2>
   <div className={s.massRow}>
    <div>
     <span className="meta">{nextMass?"Próxima missa, hoje":"Missas e horários"}</span>
     {nextMass&&<strong className={s.massTime}>{String(nextMass.starts_at).slice(0,5).replace(":","h")}{nextMass.label?<em> · {nextMass.label}</em>:null}</strong>}
    </div>
    <Link href="/igreja#horarios">Horários <ChevronRight size={16}/></Link>
   </div>
  </section>}

  <section className="section">
   <span className="eyebrow">Caminhos de hoje</span>
   <div className={s.paths}>
    {paths.map(({href,label,text,icon:Icon})=><Link href={href} key={href} className="row">
     <span className="row-icon"><Icon size={20}/></span>
     <span><strong>{label}</strong><small>{text}</small></span>
     <ChevronRight size={18}/>
    </Link>)}
   </div>
  </section>

  {event&&<section className="section">
   <div className={s.sectionHead}>
    <span className="eyebrow">Próximo encontro</span>
    <Link href="/eventos">Agenda</Link>
   </div>
   <Link href="/eventos" className={s.event}>
    {event.image_url&&<img src={event.image_url} alt=""/>}
    <span>
     <strong>{event.title}</strong>
     {evDate&&<small className={s.eventDate}>{evDate.toLocaleDateString("pt-BR",{day:"2-digit",month:"long"})} · {evDate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}).replace(":","h")}</small>}
     <small className="meta"><MapPin size={13}/> {event.parishes?.name||event.location||"Sua paróquia"}</small>
    </span>
   </Link>
  </section>}
 </div>;
}

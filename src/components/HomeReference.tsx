"use client";
import Link from "next/link";
import {BookOpen,Heart,Bus,ShoppingBag,Church,UsersRound,ArrowRight,MapPin,HandHeart,CalendarHeart,Sparkles} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";
import type {FaithRecommendation} from "@/lib/recommendations";
import styles from "@/app/vindeReference.module.css";

type Devotional={title?:string|null;scripture_reference?:string|null};
type Event={id:string;title:string;starts_at:string;location?:string|null;image_url?:string|null;parishes?:{name?:string|null}|null};
const banner="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=86";
const eventFallback="https://images.unsplash.com/photo-1559005446-facbaebc2537?auto=format&fit=crop&fm=jpg&q=82&w=1200";
const recIcon=(kind:FaithRecommendation["kind"])=>kind==="liturgy"?<BookOpen/>:kind==="parish"?<Church/>:kind==="prayer"?<HandHeart/>:kind==="event"?<CalendarHeart/>:kind==="campaign"?<Heart/>:kind==="pilgrimage"?<Bus/>:<ShoppingBag/>;
const quick=[
 {href:"/momento",label:"Evangelho",icon:BookOpen},
 {href:"/igreja",label:"Igrejas",icon:Church},
 {href:"/peregrinacoes",label:"Peregrinações",icon:Bus},
 {href:"/loja",label:"Loja",icon:ShoppingBag},
 {href:"/doacoes",label:"Doações",icon:Heart},
 {href:"/explorar",label:"Comunidade",icon:UsersRound}
];
export function HomeReference({devotional,event,recommendations=[]}:{devotional:Devotional|null;event:Event|null;recommendations?:FaithRecommendation[]}){
 const {user,profile}=useAuth();
 const initials=(profile?.full_name||user?.email||"Vinde").split(/\s|@/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
 const evDate=event?new Date(event.starts_at):null;
 return <div className={styles.page}>
  <header className={styles.header}><div className={styles.brand}><img src="/vinde-mark.svg" alt="" style={{width:38,height:38}}/><div className={styles.brandText}><strong>Vinde</strong><small>Mais perto do essencial.</small></div></div><Link href={user?"/perfil":"/entrar"} className={styles.avatar}>{initials}</Link></header>
  <Link href="/momento" className={styles.hero} style={{backgroundImage:`url(${banner})`}}><span className={styles.heroKicker}>FÉ, COM VOCÊ EM TODOS OS CAMINHOS</span><h1>{devotional?.title||"Descansar em Deus"}</h1><p>{devotional?.scripture_reference||"Mt 11,28–30"}</p><div className={styles.heroCta}>Viver este momento <ArrowRight size={17}/></div></Link>
  <section className={styles.quick}>{quick.map(({href,label,icon:Icon})=><Link href={href} key={href}><Icon size={23}/><span>{label}</span></Link>)}</section>
  <section className={styles.section}><div className={styles.sectionHead}><h2>Um lugar para você</h2><Link href="/explorar">Explorar</Link></div><Link href="/igreja" className={styles.feature}><span className={styles.featureIcon}><Church/></span><div><strong>Minha Igreja</strong><small>Comunidade, horários e vida paroquial</small></div><ArrowRight size={18}/></Link></section>
  {event&&<section className={styles.section}><div className={styles.sectionHead}><h2>Encontros que aproximam</h2><Link href="/eventos">Agenda</Link></div><Link href="/eventos" className={styles.event}><img src={event.image_url||eventFallback} alt=""/><div><span>PRÓXIMO ENCONTRO</span><h3>{event.title}</h3><p><MapPin size={11}/> {event.parishes?.name||event.location||"Sua paróquia"}</p>{evDate&&<small>{evDate.toLocaleDateString("pt-BR",{day:"2-digit",month:"long"})} · {evDate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</small>}</div><ArrowRight size={17}/></Link></section>}
  {recommendations.length>0&&<section className={styles.section}><div className={styles.sectionHead}><h2><Sparkles size={18}/> Para o seu caminho</h2><Link href="/explorar">Ver mais</Link></div><div className={styles.recs}>{recommendations.slice(0,3).map(r=><Link href={r.href} key={r.id} className={styles.rec}><span className={styles.recIcon}>{recIcon(r.kind)}</span><div><strong>{r.title}</strong><small>{r.subtitle.replace(/\s+[—-]\s+Demo\b/gi,"")}</small></div><ArrowRight size={17}/></Link>)}</div></section>}
 </div>
}

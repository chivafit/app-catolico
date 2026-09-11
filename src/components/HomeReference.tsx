"use client";
import Link from "next/link";
import {BookOpen,Heart,Bus,CalendarDays,ShoppingBag,Church,Sparkles,ArrowRight,Flame,MapPin,Clock3} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";
import type {FaithRecommendation} from "@/lib/recommendations";

type Devotional={title?:string|null;scripture_reference?:string|null};
type Event={id:string;title:string;starts_at:string;location?:string|null;image_url?:string|null;parishes?:{name?:string|null}|null};
type Parish={id?:string;name?:string|null;city?:string|null;state?:string|null};
type MassSchedule={id?:string;weekday?:number;starts_at?:string;label?:string|null};
const eventFallback="https://images.unsplash.com/photo-1559005446-facbaebc2537?auto=format&fit=crop&fm=jpg&q=82&w=1200";

export function HomeReference({devotional,event,parish,massSchedules=[],recommendations=[]}:{devotional:Devotional|null;event:Event|null;parish?:Parish|null;massSchedules?:MassSchedule[];recommendations?:FaithRecommendation[]}){
 const {user,profile}=useAuth();const first=(profile?.full_name||user?.email?.split("@")[0]||"Maria").split(" ")[0];
 const now=new Date();const dateLabel=now.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
 const evDate=event?new Date(event.starts_at):null;const today=!!evDate&&evDate.toDateString()===now.toDateString();
 const initials=(profile?.full_name||user?.email||"VI").split(/\s|@/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
 const weekday=now.getDay();const todayMasses=massSchedules.filter(m=>m.weekday===weekday).slice(0,2);
 const journeyCopy="Você esteve aqui em 3 manhãs desta semana.";
 return <div className="home-v3">
  <header className="home-v3-head"><div><span className="home-v3-date">{dateLabel}</span><h1>Boa tarde, {first}</h1></div><div className="home-v3-head-actions"><span className="streak"><Flame size={15}/> Caminhada</span><Link href={user?"/perfil":"/entrar"} className="home-v3-avatar">{initials}</Link></div></header>
  <Link href="/momento" className="home-v3-daily"><span>SEU MOMENTO • 5 MIN</span><h2>{devotional?.title||"Eu estou convosco todos os dias."}</h2><p>{devotional?.scripture_reference||"Mt 28,20"}</p><div className="home-v3-cta">Começar agora <ArrowRight size={17}/></div></Link>
  <section className="week-v3"><div><strong>Sua caminhada</strong><small>{journeyCopy}</small></div><div className="week-days">{["S","T","Q","Q","S","S","D"].map((d,i)=><span className={i<3?"done":i===3?"today":""} key={i}>{i<3?"✓":d}</span>)}</div></section>

  <section className="home-v3-section"><div className="v3-section-head"><h2>Na sua paróquia hoje</h2><Link href="/igreja">Abrir igreja</Link></div><Link href="/igreja" className="home-parish-today"><div className="home-parish-icon"><Church size={22}/></div><div className="home-parish-copy"><strong>{parish?.name||"Sua comunidade"}</strong><small>{parish?.city&&parish?.state?`${parish.city} • ${parish.state}`:"Horários, avisos e vida paroquial"}</small><div className="home-parish-times">{todayMasses.length?todayMasses.map((m,i)=><span key={m.id||i}><Clock3 size={13}/>{String(m.starts_at||"").slice(0,5)}</span>):<span><Clock3 size={13}/> Ver horários de hoje</span>}</div></div><ArrowRight size={18}/></Link></section>

  {event&&<section className="home-v3-section"><div className="v3-section-head"><h2>Próximo da sua comunidade</h2><Link href="/eventos">Agenda</Link></div><Link href="/eventos" className="v3-event"><img src={event.image_url||eventFallback} alt=""/><div><span>{today?"HOJE":"PRÓXIMO EVENTO"}</span><h3>{event.title}</h3><p><MapPin size={13}/>{event.parishes?.name||event.location||"Sua paróquia"}</p><strong>{evDate?.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</strong></div></Link></section>}

  {recommendations.length>0&&<section className="home-v3-section"><div className="v3-section-head"><h2><Sparkles size={18}/> Para você</h2><Link href="/explorar">Explorar</Link></div><div className="v3-recs">{recommendations.slice(0,3).map(r=><Link href={r.href} key={r.id}><div><strong>{r.title}</strong><small>{r.subtitle}</small></div><ArrowRight size={17}/></Link>)}</div></section>}

  <section className="home-v3-section"><div className="v3-section-head"><h2>Descubra mais</h2><Link href="/explorar">Ver tudo</Link></div><div className="v3-modules"><Link href="/peregrinacoes" className="v3-module cobalt"><Bus/><div><strong>Peregrinações</strong><small>Destinos que movem a fé</small></div><ArrowRight/></Link><Link href="/livros" className="v3-module sand"><BookOpen/><div><strong>Livraria</strong><small>Leituras para sua jornada</small></div><ArrowRight/></Link><Link href="/campanhas" className="v3-module charcoal"><Heart/><div><strong>Campanhas</strong><small>Ajude uma causa hoje</small></div><ArrowRight/></Link><Link href="/loja" className="v3-module navy"><ShoppingBag/><div><strong>Loja</strong><small>Artigos e presentes</small></div><ArrowRight/></Link></div></section>
  <section className="home-v3-shortcuts"><Link href="/eventos"><CalendarDays/>Eventos</Link><Link href="/loja"><ShoppingBag/>Loja</Link><Link href="/explorar"><Sparkles/>Explorar</Link></section>
 </div>;
}

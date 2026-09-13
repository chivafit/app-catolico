"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {Search,MapPin,Clock3,ChevronRight,Navigation,CalendarDays,Bell,Heart,UsersRound} from "lucide-react";
import "./church-home.css";

const fallback="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=84";
const hh=(v?:string|null)=>v?String(v).slice(0,5):"";
const mon=(d:Date)=>d.toLocaleDateString("pt-BR",{month:"short"}).replace(".","").toUpperCase();
export default function Igreja(){
 const [parishes,setParishes]=useState<any[]>([]),[schedules,setSchedules]=useState<any[]>([]),[events,setEvents]=useState<any[]>([]),[posts,setPosts]=useState<any[]>([]),[q,setQ]=useState(""),[selectedId,setSelectedId]=useState<string>("");
 useEffect(()=>{const s=getSupabase();Promise.all([
  s.from("parishes").select("*").order("name"),
  s.from("mass_schedules").select("*").eq("active",true).order("weekday").order("starts_at"),
  s.from("events").select("*").eq("status","published").order("starts_at").limit(8),
  s.from("parish_posts").select("*").not("published_at","is",null).order("published_at",{ascending:false}).limit(8)
 ]).then(([p,m,e,n])=>{const list=p.data||[];setParishes(list);setSchedules(m.data||[]);setEvents(e.data||[]);setPosts(n.data||[]);if(list[0])setSelectedId(list[0].id)})},[]);
 const filtered=useMemo(()=>parishes.filter(p=>!q||`${p.name} ${p.city||""} ${p.address||""}`.toLowerCase().includes(q.toLowerCase())),[parishes,q]);
 const selected=parishes.find(p=>p.id===selectedId)||filtered[0]||parishes[0];
 const today=new Date().getDay();const selectedMasses=schedules.filter(m=>m.parish_id===selected?.id);const todayMasses=selectedMasses.filter(m=>Number(m.weekday)===today);
 const parishEvents=events.filter(e=>e.parish_id===selected?.id).slice(0,3);const parishPosts=posts.filter(p=>p.parish_id===selected?.id).slice(0,4);
 const address=selected?[selected.address,selected.city,selected.state].filter(Boolean).join(", "):"Piumhi, MG";
 const mapSrc=`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;const directions=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
 return <AppShell><div className="church-home">
  <section className="church-hero" style={{backgroundImage:`url(${selected?.photo_url||fallback})`}}><div className="church-hero-copy"><span>SUA COMUNIDADE NO VINDE</span><h1>{selected?.name||"Encontre sua comunidade"}</h1><p><MapPin size={12}/>{selected?.city||"Piumhi"}{selected?.state?` · ${selected.state}`:""}</p></div></section>
  <div className="church-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar igreja, cidade ou comunidade"/></div>
  <div className="church-quick"><a href={directions} target="_blank" rel="noreferrer"><Navigation/><span>Como chegar</span></a><a href="#eventos"><CalendarDays/><span>Eventos</span></a><Link href="/campanhas"><Heart/><span>Doações</span></Link></div>
  <section className="church-mass-card" id="horarios"><span className="church-mass-icon"><Clock3 size={20}/></span><div><small>MISSAS HOJE</small><strong>{todayMasses.length?todayMasses.map(m=>hh(m.starts_at)).join(" · "):"Veja os horários da comunidade"}</strong></div><a href="#outras">Ver igreja</a></section>
  {parishPosts.length>0&&<section className="church-section"><div className="church-section-head"><h2>Hoje na comunidade</h2><span>Avisos</span></div><div className="church-notices">{parishPosts.map(p=><article className="church-notice" key={p.id}><div className="church-notice-top"><Bell size={15}/> COMUNICADO</div><strong>{p.title}</strong><p>{p.body}</p></article>)}</div></section>}
  <section className="church-section" id="eventos"><div className="church-section-head"><h2>Próximos encontros</h2><Link href="/eventos">Ver agenda</Link></div>{parishEvents.length?<div className="church-events">{parishEvents.map(e=>{const d=new Date(e.starts_at);return <Link href="/eventos" key={e.id} className="church-event"><span className="church-event-date"><b>{String(d.getDate()).padStart(2,"0")}</b><span>{mon(d)}</span></span><div><strong>{e.title}</strong><small>{e.location||selected?.name||"Sua comunidade"}</small></div><ChevronRight size={17}/></Link>})}</div>:<div className="church-notice"><strong>Nenhum encontro publicado ainda.</strong><p>Quando sua comunidade cadastrar um evento, ele aparecerá aqui.</p></div>}</section>
  {selected&&<section className="church-section"><div className="church-section-head"><h2>Onde estamos</h2><a href={directions} target="_blank" rel="noreferrer">Abrir rota</a></div><div className="church-map-card"><iframe title="Mapa da comunidade" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="church-map-foot"><div><strong>{selected.name}</strong><small>{address}</small></div><a href={directions} target="_blank" rel="noreferrer">Como chegar</a></div></div></section>}
  <section className="church-section" id="outras"><div className="church-section-head"><h2>Encontre outra igreja</h2><span>{filtered.length} comunidades</span></div><div className="church-list">{filtered.map(p=><button type="button" key={p.id} className={p.id===selected?.id?"active":""} onClick={()=>setSelectedId(p.id)}><img src={p.photo_url||fallback} alt=""/><div><strong>{p.name}</strong><small><MapPin size={10}/>{p.address||p.city||"Piumhi"}</small></div><ChevronRight size={17}/></button>)}</div></section>
  <Link href="/explorar" className="church-closing"><UsersRound size={20}/><div><small>VIVA MAIS PERTO</small><strong>Descubra encontros, caminhos e experiências no Vinde.</strong></div><ChevronRight size={17}/></Link>
 </div></AppShell>
}

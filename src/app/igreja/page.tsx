"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {Search,MapPin,Clock3,ChevronRight,Navigation,CalendarDays,Bell,Heart,UsersRound,Church as ChurchIcon} from "lucide-react";
import styles from "./igreja.module.css";

const fallback="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=84";
const hh=(v?:string|null)=>v?String(v).slice(0,5):"";
export default function Igreja(){
 const [parishes,setParishes]=useState<any[]>([]),[schedules,setSchedules]=useState<any[]>([]),[events,setEvents]=useState<any[]>([]),[posts,setPosts]=useState<any[]>([]),[q,setQ]=useState(""),[selectedId,setSelectedId]=useState<string>("");
 useEffect(()=>{const s=getSupabase();Promise.all([
  s.from("parishes").select("*").order("name"),
  s.from("mass_schedules").select("*").eq("active",true).order("weekday").order("starts_at"),
  s.from("events").select("*").eq("status","published").order("starts_at").limit(10),
  s.from("parish_posts").select("*").not("published_at","is",null).order("published_at",{ascending:false}).limit(8)
 ]).then(([p,m,e,n])=>{const list=p.data||[];setParishes(list);setSchedules(m.data||[]);setEvents(e.data||[]);setPosts(n.data||[]);if(list[0])setSelectedId(list[0].id)})},[]);
 const filtered=useMemo(()=>parishes.filter(p=>!q||`${p.name} ${p.city||""} ${p.address||""}`.toLowerCase().includes(q.toLowerCase())),[parishes,q]);
 const selected=parishes.find(p=>p.id===selectedId)||filtered[0]||parishes[0];
 const today=new Date().getDay();
 const todayMasses=schedules.filter(m=>m.parish_id===selected?.id&&Number(m.weekday)===today);
 const parishEvents=events.filter(e=>e.parish_id===selected?.id).slice(0,3);
 const parishPosts=posts.filter(p=>p.parish_id===selected?.id).slice(0,3);
 const address=selected?[selected.address,selected.city,selected.state].filter(Boolean).join(", "):"Piumhi, MG";
 const mapSrc=`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
 const directions=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
 return <AppShell><div className={styles.page}>
  <section className={styles.intro}><span className={styles.eyebrow}>SUA COMUNIDADE</span><h1>Igreja perto de você.</h1><p>Encontre paróquias, horários, eventos e caminhos para participar mais da vida da comunidade.</p></section>
  <label className={styles.search}><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar igreja, cidade ou endereço"/></label>
  {selected&&<section className={styles.hero} style={{backgroundImage:`url(${selected.photo_url||fallback})`}}><div className={styles.heroCopy}><small>COMUNIDADE SELECIONADA</small><h2>{selected.name}</h2><p><MapPin size={12}/>{selected.city||"Piumhi"}{selected.state?` · ${selected.state}`:""}</p></div></section>}
  <div className={styles.actions}><a href={directions} target="_blank" rel="noreferrer"><Navigation/><span>Como chegar</span></a><a href="#horarios"><Clock3/><span>Horários</span></a><a href="#eventos"><CalendarDays/><span>Eventos</span></a><Link href="/campanhas"><Heart/><span>Doações</span></Link></div>
  {selected&&<section className={styles.mapWrap}><div className={styles.map}><iframe title="Mapa da igreja" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div><div className={styles.mapBar}><div><small>LOCALIZAÇÃO</small><strong>{address}</strong></div><a href={directions} target="_blank" rel="noreferrer"><Navigation size={14}/>Rota</a></div></section>}
  <section className={styles.section} id="horarios"><div className={styles.sectionHead}><h2>Missas de hoje</h2><span>{selected?.name||"Comunidade"}</span></div><div className={styles.massCard}><span className={styles.massIcon}><Clock3 size={19}/></span><div><small>HORÁRIOS</small><strong>{todayMasses.length?todayMasses.map(m=>hh(m.starts_at)).join(" · "):"Consulte a programação da paróquia"}</strong></div></div></section>
  {parishPosts.length>0&&<section className={styles.section}><div className={styles.sectionHead}><h2>Hoje na comunidade</h2><span>Avisos</span></div><div className={styles.notices}>{parishPosts.map(p=><article className={styles.notice} key={p.id}><span><Bell size={16}/></span><div><strong>{p.title}</strong><p>{p.body}</p></div></article>)}</div></section>}
  <section className={styles.section} id="eventos"><div className={styles.sectionHead}><h2>Próximos encontros</h2><Link href="/eventos">Ver agenda</Link></div>{parishEvents.length?<div className={styles.events}>{parishEvents.map(e=><Link href="/eventos" key={e.id} className={styles.event}><span><CalendarDays size={17}/></span><div><strong>{e.title}</strong><small>{new Date(e.starts_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"long"})}{e.location?` · ${e.location}`:""}</small></div><ChevronRight size={16}/></Link>)}</div>:<div className={styles.empty}>Nenhum evento publicado para esta comunidade.</div>}</section>
  <section className={styles.section}><div className={styles.sectionHead}><h2>Outras igrejas</h2><span>{filtered.length} {filtered.length===1?"igreja":"igrejas"}</span></div><div className={styles.churches}>{filtered.map(p=><button type="button" key={p.id} className={`${styles.church} ${p.id===selected?.id?styles.selected:""}`} onClick={()=>setSelectedId(p.id)}><img src={p.photo_url||fallback} alt=""/><div><strong>{p.name}</strong><small><MapPin size={10}/>{p.address||p.city||"Piumhi"}</small></div><ChevronRight size={16}/></button>)}</div></section>
  <Link href="/explorar" className={styles.footerCard}><ChurchIcon size={20}/><div><small>DESCUBRA MAIS</small><strong>Explore eventos, peregrinações e experiências de fé no Vinde.</strong></div><ChevronRight size={17}/></Link>
 </div></AppShell>
}

"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {Search,MapPin,Clock3,ChevronRight,Navigation,CalendarDays,Bell,Heart,UsersRound} from "lucide-react";
import styles from "@/app/vindeReference.module.css";
import polish from "@/app/vindePolish.module.css";

const fallback="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=84";
const hh=(v?:string|null)=>v?String(v).slice(0,5):"";
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
 const parishEvents=events.filter(e=>e.parish_id===selected?.id).slice(0,3);const parishPosts=posts.filter(p=>p.parish_id===selected?.id).slice(0,2);
 const address=selected?[selected.address,selected.city,selected.state].filter(Boolean).join(", "):"Piumhi, MG";
 const mapSrc=`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;const directions=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
 return <AppShell><div className={`${styles.page} ${polish.communityV2}`}>
  <div className={polish.communityHero} style={{backgroundImage:`linear-gradient(0deg,rgba(16,35,58,.84),rgba(16,35,58,.08)),url(${selected?.photo_url||fallback})`}}><span>COMUNIDADE VINDE</span><h1>{selected?.name||"Sua comunidade"}</h1><p>{selected?.city||"Piumhi"} · fé vivida perto de você</p></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar igreja ou comunidade"/></div>
  <div className={polish.communityActions}><a href={directions} target="_blank" rel="noreferrer"><Navigation/><span>Como chegar</span></a><a href="#horarios"><Clock3/><span>Horários</span></a><a href="#eventos"><CalendarDays/><span>Eventos</span></a><Link href="/campanhas"><Heart/><span>Doações</span></Link></div>
  <div className={styles.map}><iframe title="Mapa das igrejas" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div>
  {selected&&<section className={polish.communityCard}><div className={polish.communityCardTop}><img src={selected.photo_url||fallback} alt=""/><div><small>SUA COMUNIDADE</small><h2>{selected.name}</h2><p><MapPin size={12}/>{selected.address||`${selected.city||""} - ${selected.state||""}`}</p></div></div><div className={polish.communityMass} id="horarios"><Clock3 size={18}/><div><small>MISSAS HOJE</small><strong>{todayMasses.length?todayMasses.map(m=>hh(m.starts_at)).join(" · "):"Consulte os horários"}</strong></div></div></section>}
  {parishPosts.length>0&&<section className={styles.section}><div className={styles.sectionHead}><h2>Hoje na comunidade</h2><span>Avisos</span></div><div className={polish.communityNotices}>{parishPosts.map(p=><div key={p.id}><Bell size={17}/><div><strong>{p.title}</strong><p>{p.body}</p></div></div>)}</div></section>}
  <section className={styles.section} id="eventos"><div className={styles.sectionHead}><h2>Próximos encontros</h2><Link href="/eventos">Ver todos</Link></div>{parishEvents.length?<div className={polish.communityEvents}>{parishEvents.map(e=><Link href="/eventos" key={e.id}><span><CalendarDays size={16}/></span><div><strong>{e.title}</strong><small>{new Date(e.starts_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"long"})}{e.location?` · ${e.location}`:""}</small></div><ChevronRight size={17}/></Link>)}</div>:<div className={styles.empty}>Nenhum evento publicado para esta comunidade.</div>}</section>
  <section className={styles.section}><div className={styles.sectionHead}><h2>Outras igrejas</h2><span>{filtered.length}</span></div><div className={polish.communityChurchList}>{filtered.map(p=><button type="button" key={p.id} className={p.id===selected?.id?polish.selected:""} onClick={()=>setSelectedId(p.id)}><img src={p.photo_url||fallback} alt=""/><div><strong>{p.name}</strong><small><MapPin size={10}/>{p.address||p.city||"Piumhi"}</small></div><ChevronRight size={17}/></button>)}</div></section>
  <Link href="/explorar" className={polish.communityClosing}><UsersRound size={20}/><div><small>VIVA MAIS PERTO</small><strong>Explore tudo o que acontece no Vinde.</strong></div><ChevronRight size={17}/></Link>
 </div></AppShell>
}

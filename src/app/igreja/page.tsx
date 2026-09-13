"use client";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {Search,MapPin,Clock3,ChevronRight,Navigation} from "lucide-react";
import styles from "@/app/vindeReference.module.css";

const fallback="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1000&q=82";
const hh=(v?:string|null)=>v?String(v).slice(0,5):"";
export default function Igreja(){
 const [parishes,setParishes]=useState<any[]>([]),[schedules,setSchedules]=useState<any[]>([]),[q,setQ]=useState(""),[selectedId,setSelectedId]=useState<string>("");
 useEffect(()=>{const s=getSupabase();Promise.all([s.from("parishes").select("*").order("name"),s.from("mass_schedules").select("*").eq("active",true).order("weekday").order("starts_at")]).then(([p,m])=>{const list=p.data||[];setParishes(list);setSchedules(m.data||[]);if(list[0])setSelectedId(list[0].id)})},[]);
 const filtered=useMemo(()=>parishes.filter(p=>!q||`${p.name} ${p.city||""} ${p.address||""}`.toLowerCase().includes(q.toLowerCase())),[parishes,q]);
 const selected=parishes.find(p=>p.id===selectedId)||filtered[0]||parishes[0];
 const today=new Date().getDay();
 const selectedMasses=schedules.filter(m=>m.parish_id===selected?.id);
 const todayMasses=selectedMasses.filter(m=>Number(m.weekday)===today);
 const address=selected?[selected.address,selected.city,selected.state].filter(Boolean).join(", "):"Piumhi, MG";
 const mapSrc=`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
 const directions=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
 return <AppShell><div className={styles.page}>
  <div className={`${styles.title} ${styles.center}`}><h1>Igrejas</h1><p>Encontre uma igreja perto de você.</p></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar igreja ou cidade"/></div>
  <div className={styles.map}><iframe title="Mapa das igrejas" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div>
  {selected&&<section className={styles.churchCard}><img src={selected.photo_url||fallback} alt=""/><div className={styles.churchInfo}><h2>{selected.name}</h2><p>{selected.address||`${selected.city||""} - ${selected.state||""}`}</p><div className={styles.mass}><Clock3 size={15}/><div><small>MISSAS HOJE</small><strong>{todayMasses.length?todayMasses.map(m=>hh(m.starts_at)).join(" · "):"Consulte os horários"}</strong></div></div></div><div className={styles.churchActions}><button type="button" onClick={()=>document.getElementById("igrejas-lista")?.scrollIntoView({behavior:"smooth"})}><MapPin size={15}/> Ver no mapa</button><a className={styles.primary} href={directions} target="_blank" rel="noreferrer"><Navigation size={15}/> Como chegar</a></div></section>}
  <section className={styles.churchList} id="igrejas-lista"><div className={styles.sectionHead}><h2>Igrejas em Piumhi</h2><span>{filtered.length}</span></div>{filtered.length?filtered.map(p=>{const pm=schedules.filter(m=>m.parish_id===p.id&&Number(m.weekday)===today);return <button type="button" key={p.id} className={`${styles.churchItem} ${p.id===selected?.id?styles.selected:""}`} onClick={()=>setSelectedId(p.id)}><img src={p.photo_url||fallback} alt=""/><div><strong>{p.name}</strong><small><MapPin size={10}/>{p.address||p.city||"Piumhi"}</small>{pm.length>0&&<small><Clock3 size={10}/>{pm.map(x=>hh(x.starts_at)).join(" · ")}</small>}</div><ChevronRight size={17}/></button>}):<div className={styles.empty}>Nenhuma igreja encontrada.</div>}</section>
 </div></AppShell>
}

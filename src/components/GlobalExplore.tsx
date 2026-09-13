"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {Search,ChevronRight} from "lucide-react";
import {getSupabase} from "@/lib/supabase";
import styles from "@/app/vindeReference.module.css";

type Kind="all"|"event"|"pilgrimage"|"content";
type Item={id:string;kind:Exclude<Kind,"all">;title:string;subtitle:string;href:string;image:string};
const labels:Record<Kind,string>={all:"Todos",event:"Eventos",pilgrimage:"Peregrinações",content:"Conteúdos"};
const fall={event:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",pilgrimage:"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",content:"https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80"};
const norm=(v:string)=>(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function GlobalExplore(){
 const [all,setAll]=useState<Item[]>([]),[q,setQ]=useState(""),[kind,setKind]=useState<Kind>("all"),[loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const s=getSupabase();const [ev,pi,de]=await Promise.all([
  s.from("events").select("id,title,description,location,image_url,status").eq("status","published").limit(30),
  s.from("pilgrimages").select("id,title,destination,image_url,status,pilgrimage_destinations(name,slug,hero_image_url)").eq("status","published").limit(30),
  s.from("daily_devotionals").select("id,title,scripture_reference,image_url,published").eq("published",true).limit(30)
 ]);const rows:Item[]=[];(ev.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"event",title:x.title,subtitle:x.location||x.description||"Evento",href:"/eventos",image:x.image_url||fall.event}));(pi.data||[]).forEach((x:any)=>{const d=Array.isArray(x.pilgrimage_destinations)?x.pilgrimage_destinations[0]:x.pilgrimage_destinations;rows.push({id:x.id,kind:"pilgrimage",title:x.title||d?.name||x.destination,subtitle:d?.name||x.destination||"Peregrinação",href:d?.slug?`/peregrinacoes/${d.slug}?trip=${x.id}`:"/peregrinacoes",image:x.image_url||d?.hero_image_url||fall.pilgrimage})});(de.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"content",title:x.title,subtitle:x.scripture_reference||"Palavra do dia",href:"/momento",image:x.image_url||fall.content}));setAll(rows);setLoading(false)})()},[]);
 const filtered=useMemo(()=>all.filter(x=>(kind==="all"||x.kind===kind)&&(!q||norm(`${x.title} ${x.subtitle}`).includes(norm(q)))),[all,q,kind]);
 return <div className={styles.page}>
  <div className={`${styles.title} ${styles.center}`}><h1>Explorar</h1><p>Encontre experiências, conteúdos e caminhos para viver sua fé.</p></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar no Vinde"/></div>
  <div className={styles.chips}>{(Object.keys(labels) as Kind[]).map(k=><button key={k} className={kind===k?styles.active:""} onClick={()=>setKind(k)}>{labels[k]}</button>)}</div>
  <div className={styles.sectionHead}><h2>Descubra</h2><span>{filtered.length} opções</span></div>
  {loading?<div className={styles.empty}>Carregando experiências…</div>:filtered.length?<div className={styles.list}>{filtered.map(x=><Link href={x.href} key={`${x.kind}-${x.id}`} className={styles.row}><img src={x.image} alt=""/><div><strong>{x.title}</strong><small>{x.subtitle}</small></div><ChevronRight size={18}/></Link>)}</div>:<div className={styles.empty}>Nada encontrado para esta busca.</div>}
 </div>
}

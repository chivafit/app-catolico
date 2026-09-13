// @ts-nocheck
"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {Search,ChevronRight} from "lucide-react";
import styles from "@/app/vindeReference.module.css";

const fallback="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=82";
const brl=(c:number|null)=>c==null?"Sob consulta":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
export default function Peregrinacoes(){
 const [trips,setTrips]=useState<any[]>([]),[destinations,setDestinations]=useState<any[]>([]),[q,setQ]=useState(""),[origin,setOrigin]=useState("");
 useEffect(()=>{const s=getSupabase();Promise.all([s.from("pilgrimages").select("*,pilgrimage_destinations(name,slug,hero_image_url)").eq("status","published").order("starts_at"),s.from("pilgrimage_destinations").select("*").eq("active",true).order("featured",{ascending:false}).order("name")]).then(([a,b])=>{setTrips(a.data||[]);setDestinations(b.data||[])})},[]);
 const origins=useMemo(()=>Array.from(new Set(trips.map(x=>x.origin_city).filter(Boolean))),[trips]);
 const list=trips.filter(t=>(!origin||t.origin_city===origin)&&(!q||`${t.title||""} ${t.destination||""}`.toLowerCase().includes(q.toLowerCase())));
 const hero=list[0]||trips[0];const heroDest=hero?(Array.isArray(hero.pilgrimage_destinations)?hero.pilgrimage_destinations[0]:hero.pilgrimage_destinations):null;
 return <AppShell><div className={styles.page}>
  <div className={`${styles.title} ${styles.center}`}><h1>Peregrinações</h1><p>Viagens de fé, encontros e destinos que transformam.</p></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar destino"/></div>
  <div className={styles.filterRow}><select value={origin} onChange={e=>setOrigin(e.target.value)}><option value="">Todas as saídas</option>{origins.map((x:any)=><option key={x}>{x}</option>)}</select><select defaultValue=""><option value="">Qualquer período</option><option>Próximas viagens</option></select></div>
  {hero&&<Link href={`/peregrinacoes/${heroDest?.slug||"aparecida"}?trip=${hero.id}`} className={styles.pilgHero} style={{backgroundImage:`url(${hero.image_url||heroDest?.hero_image_url||fallback})`}}><span>EM DESTAQUE</span><h2>{hero.title||hero.destination}</h2><p>{hero.destination||heroDest?.name} · {new Date(hero.starts_at).toLocaleDateString("pt-BR")}</p><ChevronRight size={20}/></Link>}
  <section className={styles.section}><div className={styles.sectionHead}><h2>Próximas viagens</h2><span>{list.length} opções</span></div>{list.length?<div className={styles.pilgRows}>{list.slice(1,6).map(t=>{const d=Array.isArray(t.pilgrimage_destinations)?t.pilgrimage_destinations[0]:t.pilgrimage_destinations;return <Link key={t.id} href={`/peregrinacoes/${d?.slug||"aparecida"}?trip=${t.id}`} className={styles.pilgRow}><img src={t.image_url||d?.hero_image_url||fallback} alt=""/><div><strong>{t.title||t.destination}</strong><small>{new Date(t.starts_at).toLocaleDateString("pt-BR")} · {brl(t.price_cents)}</small>{t.origin_city&&<small>Saída de {t.origin_city}</small>}</div><ChevronRight size={18}/></Link>})}</div>:<div className={styles.empty}>Nenhuma viagem encontrada.</div>}</section>
  <section className={styles.section}><div className={styles.sectionHead}><h2>Destinos que inspiram</h2><span>Explore</span></div><div className={styles.destGrid}>{destinations.slice(0,6).map(d=><Link href={`/peregrinacoes/${d.slug}`} className={styles.dest} key={d.id} style={{backgroundImage:`url(${d.hero_image_url||fallback})`}}><strong>{d.name}</strong><small>{d.region||d.country||"Destino de fé"}</small></Link>)}</div></section>
 </div></AppShell>
}

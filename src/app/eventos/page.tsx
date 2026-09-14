// @ts-nocheck
"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {EventRegistration} from "@/components/EventRegistration";
import {getSupabase} from "@/lib/supabase";
import {Search,ChevronDown,CalendarDays,ChevronRight,Bus} from "lucide-react";
import styles from "./eventos.module.css";

export default function Eventos(){
 const [items,setItems]=useState<any[]>([]),[q,setQ]=useState(""),[city,setCity]=useState(""),[date,setDate]=useState(""),[cat,setCat]=useState(""),[loading,setLoading]=useState(true),[notifyState,setNotifyState]=useState<"idle"|"done"|"unsupported">("idle");
 useEffect(()=>{getSupabase().from("events").select("*,parishes(city,state)").eq("status","published").not("parish_id","is",null).order("starts_at").then(({data})=>{setItems(data||[]);setLoading(false)})},[]);
 const cities=useMemo(()=>Array.from(new Set(items.map(x=>x.parishes?.city).filter(Boolean))),[items]);
 const cats=useMemo(()=>Array.from(new Set(items.map(x=>x.category).filter(Boolean))),[items]);
 const list=items.filter(x=>(!q||`${x.title} ${x.description||""} ${x.location||""}`.toLowerCase().includes(q.toLowerCase()))&&(!city||x.parishes?.city===city)&&(!cat||x.category===cat)&&(!date||String(x.starts_at).slice(0,10)===date));
 const catalogEmpty=!loading&&items.length===0;
 const filtersDisabled=loading||catalogEmpty;
 async function requestNotify(){
  if(typeof window==="undefined"||!("Notification" in window)){setNotifyState("unsupported");return}
  const permission=await Notification.requestPermission();
  setNotifyState(permission==="granted"?"done":"unsupported");
 }
 return <AppShell><div className={styles.page}>
  <div className={styles.hero}><div className={styles.eyebrow}>Eventos da Igreja</div><h1>Encontros para viver a fé.</h1><p>Festas de padroeiro, novenas, retiros, formações e celebrações das comunidades católicas.</p></div>

  <label className={styles.search}><Search size={17}/><input placeholder="Buscar evento da Igreja..." value={q} onChange={e=>setQ(e.target.value)} disabled={catalogEmpty}/></label>

  <div className={styles.filters}>
   <label className={`${styles.filterControl} ${filtersDisabled?styles.disabled:""}`}><span>{city||"Todas as cidades"}</span><ChevronDown size={15}/><select value={city} onChange={e=>setCity(e.target.value)} disabled={filtersDisabled} aria-label="Filtrar por cidade"><option value="">Todas as cidades</option>{cities.map((c:any)=><option key={c}>{c}</option>)}</select></label>
   <label className={`${styles.filterControl} ${filtersDisabled?styles.disabled:""}`}><span>{cat||"Todos os tipos"}</span><ChevronDown size={15}/><select value={cat} onChange={e=>setCat(e.target.value)} disabled={filtersDisabled} aria-label="Filtrar por tipo"><option value="">Todos os tipos</option>{cats.map((c:any)=><option key={c}>{c}</option>)}</select></label>
   <label className={styles.dateWrap}><input className={styles.dateInput} type="date" value={date} onChange={e=>setDate(e.target.value)} disabled={filtersDisabled}/></label>
  </div>

  <div className={styles.sectionHead}><h2>Próximos eventos da Igreja</h2>{!loading&&list.length>0&&<span>{list.length} {list.length===1?"evento":"eventos"}</span>}</div>

  {loading?<div className={styles.loading}>Carregando eventos…</div>:list.length?<div className={styles.grid}>{list.map(x=><article className={styles.eventCard} key={x.id}>{x.category&&<span className="tag">{x.category}</span>}<h2>{x.title}</h2><p>{x.all_day?new Date(x.starts_at).toLocaleDateString("pt-BR"):new Date(x.starts_at).toLocaleString("pt-BR")}<br/>{x.location||"Local a confirmar"}</p>{x.description&&<p>{x.description}</p>}<EventRegistration eventId={x.id}/></article>)}</div>:<>
   <div className={styles.emptyState}><span className={styles.emptyIcon}><CalendarDays size={20}/></span><div><strong>Nenhum evento católico confirmado no momento</strong><p>{catalogEmpty?"Novos eventos das paróquias aparecerão aqui assim que forem publicados.":"Nenhum evento corresponde aos filtros selecionados agora."}</p><button type="button" onClick={requestNotify}>{notifyState==="done"?"Aviso ativado":notifyState==="unsupported"?"Ative nas configurações":"Avisar quando tiver evento"}</button></div></div>
   {catalogEmpty&&<Link href="/peregrinacoes" className={styles.crossSell}><span><Bus size={19}/></span><div><small>ENQUANTO ISSO</small><strong>Veja nossas peregrinações</strong></div><ChevronRight size={17}/></Link>}
  </>}
 </div></AppShell>
}

"use client";
import {useEffect,useMemo,useState} from "react";
import {Search,MapPin,CalendarDays,Users} from "lucide-react";
import {AppShell} from "@/components/AppShell";
import {EventRegistration} from "@/components/EventRegistration";
import {getSupabase} from "@/lib/supabase";

type EventItem={id:string;title:string;description?:string|null;starts_at:string;location?:string|null;category?:string|null;image_url?:string|null;price_cents?:number|null;capacity?:number|null;parishes?:{city?:string|null;state?:string|null;name?:string|null}|null};
const fallback="https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1200&q=82";
const money=(c?:number|null)=>!c?"Gratuito":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);

export default function Eventos(){
 const [items,setItems]=useState<EventItem[]>([]),[q,setQ]=useState(""),[city,setCity]=useState(""),[date,setDate]=useState(""),[cat,setCat]=useState("");
 useEffect(()=>{getSupabase().from("events").select("*,parishes(city,state,name)").eq("status","published").order("starts_at").then(({data})=>setItems((data||[]) as EventItem[]))},[]);
 const cities=useMemo(()=>Array.from(new Set(items.map(x=>x.parishes?.city).filter((x):x is string=>Boolean(x)))),[items]);
 const cats=useMemo(()=>Array.from(new Set(items.map(x=>x.category).filter((x):x is string=>Boolean(x)))),[items]);
 const list=items.filter(x=>(!q||`${x.title} ${x.description||""} ${x.location||""}`.toLowerCase().includes(q.toLowerCase()))&&(!city||x.parishes?.city===city)&&(!cat||x.category===cat)&&(!date||String(x.starts_at).slice(0,10)===date));
 return <AppShell><div className="product-page">
  <section className="product-hero"><span className="product-kicker">EVENTOS E ENCONTROS</span><h1>Viva a fé também em comunidade.</h1><p>Retiros, encontros, celebrações, formações e experiências próximas de você.</p></section>
  <div className="product-toolbar"><div className="product-search"><Search size={19}/><input placeholder="Buscar evento, retiro ou encontro..." value={q} onChange={e=>setQ(e.target.value)}/></div><select className="product-filter" value={city} onChange={e=>setCity(e.target.value)}><option value="">Todas as cidades</option>{cities.map(c=><option key={c}>{c}</option>)}</select><select className="product-filter" value={cat} onChange={e=>setCat(e.target.value)}><option value="">Todos os tipos</option>{cats.map(c=><option key={c}>{c}</option>)}</select><input className="product-filter" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
  <section className="product-section"><div className="product-section-head"><h2>Próximos eventos</h2><span>{list.length} encontrado{list.length===1?"":"s"}</span></div>{list.length?<div className="editorial-grid">{list.map(x=>{const d=new Date(x.starts_at);const day=String(d.getDate()).padStart(2,"0"),month=d.toLocaleDateString("pt-BR",{month:"short"}).replace(".","").toUpperCase();return <article className="editorial-card" key={x.id}><div className="editorial-image" style={{backgroundImage:`url(${x.image_url||fallback})`}}>{x.category&&<span className="editorial-badge">{x.category}</span>}</div><div className="editorial-body"><div className="event-row"><div className="event-datebox"><strong>{day}</strong><span>{month}</span></div><div className="event-row-copy"><h3>{x.title}</h3><p>{d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p></div></div><div className="editorial-meta"><span><MapPin size={14}/>{x.location||x.parishes?.name||"Local a confirmar"}</span>{x.capacity&&<span><Users size={14}/>{x.capacity} vagas</span>}</div>{x.description&&<p>{x.description}</p>}<div className="editorial-price">{money(x.price_cents)}</div><EventRegistration eventId={x.id}/></div></article>})}</div>:<div className="empty-state"><CalendarDays size={28}/><h3>Nenhum evento encontrado.</h3><p>Ajuste os filtros para ampliar sua busca.</p></div>}</section>
 </div></AppShell>;
}

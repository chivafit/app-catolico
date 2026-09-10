"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {Search,MapPin,CalendarDays,Church,ShoppingBag,BookOpen,Bus,X} from "lucide-react";
import {getSupabase} from "@/lib/supabase";

type Kind="all"|"church"|"event"|"pilgrimage"|"product"|"book"|"content";
type Result={id:string;kind:Exclude<Kind,"all">;title:string;subtitle:string;city?:string;category?:string;date?:string;href:string;verified?:boolean};
const labels:Record<Kind,string>={all:"Todos",church:"Igrejas",event:"Eventos",pilgrimage:"Peregrinações",product:"Loja",book:"Livros",content:"Conteúdos"};
const icons:any={church:Church,event:CalendarDays,pilgrimage:Bus,product:ShoppingBag,book:BookOpen,content:BookOpen};
const norm=(v?:string|null)=>(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

export function GlobalExplore(){
 const [all,setAll]=useState<Result[]>([]),[q,setQ]=useState(""),[kind,setKind]=useState<Kind>("all"),[city,setCity]=useState(""),[date,setDate]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{(async()=>{try{const s=getSupabase();const [pa,ev,pi,pr,de]=await Promise.all([
  s.from("parishes").select("id,name,slug,city,state,address,verified").order("name").limit(100),
  s.from("events").select("id,title,description,starts_at,location,status,parishes(city,state)").eq("status","published").order("starts_at").limit(100),
  s.from("pilgrimages").select("id,title,destination,origin_city,starts_at,status").eq("status","published").order("starts_at").limit(100),
  s.from("products").select("id,name,slug,category,description,active").eq("active",true).order("created_at",{ascending:false}).limit(100),
  s.from("daily_devotionals").select("id,title,scripture_reference,devotional_date,published").eq("published",true).order("devotional_date",{ascending:false}).limit(60)
 ]);
 const errs=[pa,ev,pi,pr,de].map(x=>x.error).filter(Boolean);if(errs.length)throw errs[0];
 const rows:Result[]=[];
 (pa.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"church",title:x.name,subtitle:[x.address,x.city,x.state].filter(Boolean).join(" · "),city:x.city,href:`/igrejas/${x.slug}`,verified:x.verified}));
 (ev.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"event",title:x.title,subtitle:[x.location,x.parishes?.city].filter(Boolean).join(" · "),city:x.parishes?.city,date:x.starts_at,href:"/explorar"}));
 (pi.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"pilgrimage",title:x.title||x.destination,subtitle:[x.origin_city?`Saída de ${x.origin_city}`:null,x.destination].filter(Boolean).join(" · "),city:x.origin_city,date:x.starts_at,href:"/peregrinacoes"}));
 (pr.data||[]).forEach((x:any)=>{const isBook=norm(x.category).includes("livr")||norm(x.category).includes("bibli");rows.push({id:x.id,kind:isBook?"book":"product",title:x.name,subtitle:x.description||x.category||"Marketplace Ágora Fide",category:x.category,href:isBook?"/livros":"/loja"})});
 (de.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"content",title:x.title,subtitle:x.scripture_reference||"Momento Diário",date:x.devotional_date,href:"/momento"}));
 setAll(rows)}catch(e:any){setError(e?.message||"Não foi possível carregar a busca.")}finally{setLoading(false)}})()},[]);
 const cities=useMemo(()=>Array.from(new Set(all.map(x=>x.city).filter(Boolean) as string[])).sort(),[all]);
 const results=useMemo(()=>all.filter(x=>{if(kind!=="all"&&x.kind!==kind)return false;if(city&&norm(x.city)!==norm(city))return false;if(date&&x.date&&String(x.date).slice(0,10)!==date)return false;if(date&&!x.date)return false;if(q){const hay=norm(`${x.title} ${x.subtitle} ${x.city||""} ${x.category||""}`);if(!hay.includes(norm(q)))return false}return true}),[all,q,kind,city,date]);
 return <><div className="page-title"><div className="eyebrow">Descoberta</div><h1>Explorar</h1><p className="muted">Encontre igrejas, eventos, peregrinações, livros, produtos e conteúdos em um só lugar.</p></div><div className="search-panel"><div className="search-line"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="O que você procura?" aria-label="Busca global"/>{q&&<button aria-label="Limpar busca" onClick={()=>setQ("")}><X size={16}/></button>}</div><div className="chips-scroll">{(Object.keys(labels) as Kind[]).map(k=><button key={k} className={kind===k?"tag chip-button selected":"pill chip-button"} onClick={()=>setKind(k)}>{labels[k]}</button>)}</div><div className="filter-row"><label><MapPin size={14}/><select value={city} onChange={e=>setCity(e.target.value)}><option value="">Todas as cidades</option>{cities.map(c=><option key={c}>{c}</option>)}</select></label><label><CalendarDays size={14}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div></div>{loading?<div className="card">Buscando experiências…</div>:error?<div className="card"><b>Não foi possível carregar.</b><p className="muted">{error}</p></div>:<><div className="section-head"><h2>{q?`Resultados para “${q}”`:kind==="all"?"Descobrir agora":labels[kind]}</h2><span className="muted">{results.length} resultado{results.length===1?"":"s"}</span></div>{results.length?<div className="card search-results">{results.map(r=>{const Icon=icons[r.kind];return <Link href={r.href} className="search-result" key={`${r.kind}-${r.id}`}><div className="result-icon"><Icon size={18}/></div><div><span className="tiny muted">{labels[r.kind]}{r.verified?" · verificada":""}</span><h3>{r.title}</h3><p className="tiny muted">{r.subtitle}</p></div><b>›</b></Link>})}</div>:<div className="card onboarding"><h2>Nada encontrado.</h2><p className="muted">Tente outro termo ou remova um dos filtros.</p><button className="cta secondary" onClick={()=>{setQ("");setKind("all");setCity("");setDate("")}}>Limpar filtros</button></div>}</>}</>}

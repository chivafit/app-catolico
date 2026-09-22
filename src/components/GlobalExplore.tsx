"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {Bell,ChevronRight,HeartHandshake,Search,Sparkles} from "lucide-react";
import {getSupabase} from "@/lib/supabase";
import s from "./GlobalExplore.module.css";

type Kind="all"|"event"|"pilgrimage"|"content";
type Item={id:string;kind:Exclude<Kind,"all">;title:string;subtitle:string;href:string;image:string|null};
const labels:Record<Kind,string>={all:"Todos",event:"Eventos",pilgrimage:"Peregrinações",content:"Conteúdos"};
const norm=(v:string)=>(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const solidarity:Item={id:"solidarity-piumhi",kind:"content",title:"Solidariedade em Piumhi",subtitle:"Instituições locais verificadas e canais seguros para colaborar.",href:"/solidariedade",image:null};

export function GlobalExplore(){
 const [all,setAll]=useState<Item[]>([]),[q,setQ]=useState(""),[kind,setKind]=useState<Kind>("all"),
  [loading,setLoading]=useState(true),[notifyState,setNotifyState]=useState<"idle"|"done"|"unsupported">("idle");

 useEffect(()=>{let active=true;(async()=>{
  const c=getSupabase();
  const [ev,pi,de]=await Promise.all([
   c.from("events").select("id,title,description,location,image_url,status").eq("status","published").limit(30),
   c.from("pilgrimages").select("id,title,destination,image_url,status,pilgrimage_destinations(name,slug,hero_image_url)").eq("status","published").limit(30),
   c.from("daily_devotionals").select("id,title,scripture_reference,image_url,published").eq("published",true).limit(30)
  ]);
  const rows:Item[]=[solidarity];
  (ev.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"event",title:x.title,subtitle:x.location||x.description||"Evento",href:"/eventos",image:x.image_url||null}));
  (pi.data||[]).forEach((x:any)=>{const d=Array.isArray(x.pilgrimage_destinations)?x.pilgrimage_destinations[0]:x.pilgrimage_destinations;
   rows.push({id:x.id,kind:"pilgrimage",title:x.title||d?.name||x.destination,subtitle:d?.name||x.destination||"Peregrinação",href:d?.slug?`/peregrinacoes/${d.slug}?trip=${x.id}`:"/peregrinacoes",image:x.image_url||d?.hero_image_url||null})});
  (de.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"content",title:x.title,subtitle:x.scripture_reference||"Palavra do dia",href:"/momento",image:x.image_url||null}));
  if(active){setAll(rows);setLoading(false)}
 })();return()=>{active=false}},[]);

 const filtered=useMemo(()=>all.filter(x=>(kind==="all"||x.kind===kind)&&(!q||norm(`${x.title} ${x.subtitle}`).includes(norm(q)))),[all,q,kind]);
 const featured=filtered[0];
 const rest=filtered.slice(1,7);
 const kindLabel=(x:Item)=>x.id==="solidarity-piumhi"?"Solidariedade":labels[x.kind];

 async function askNotifications(){
  if(typeof window==="undefined"||!("Notification" in window)){setNotifyState("unsupported");return}
  const permission=await Notification.requestPermission();
  setNotifyState(permission==="granted"?"done":"unsupported");
 }

 return <div className={s.page}>
  <span className="eyebrow">Explorar</span>
  <h1>Caminhos para viver a fé por inteiro.</h1>

  <label className={`search ${s.search}`}>
   <Search size={19}/>
   <input value={q} onChange={e=>setQ(e.target.value)} placeholder="O que você procura hoje?"/>
  </label>

  <div className={s.filters}>{(Object.keys(labels) as Kind[]).map(k=>
   <button key={k} type="button" aria-pressed={kind===k} className={`chip ${kind===k?"active":""}`} onClick={()=>setKind(k)}>{labels[k]}</button>
  )}</div>

  {loading?<p className={s.loading}>Carregando experiências…</p>
  :featured?<>
   <Link href={featured.href} className={s.featured} style={featured.image?{backgroundImage:`url(${featured.image})`}:undefined}>
    <span className="eyebrow">{kindLabel(featured)}</span>
    <h2>{featured.title}</h2>
    <p>{featured.subtitle}</p>
   </Link>

   {rest.length>0&&<section className="section">
    <span className="eyebrow">Descubra algo novo</span>
    <div className={s.feed}>{rest.map(x=><Link href={x.href} key={`${x.kind}-${x.id}`} className={s.item}>
     {x.image?<img src={x.image} alt=""/>:<span className={s.itemPlaceholder}/>}
     <span>
      <small className="eyebrow">{kindLabel(x)}</small>
      <strong>{x.title}</strong>
      <small className="meta">{x.subtitle}</small>
     </span>
     <ChevronRight size={18}/>
    </Link>)}</div>
   </section>}

   <Link href="/momento" className={s.closing}>
    <span>
     <small className="eyebrow">Um minuto para você</small>
     <strong>Comece pela Palavra de hoje.</strong>
    </span>
    <Sparkles size={19}/>
   </Link>
  </>:<div className={s.empty}>
   <span className="row-icon"><HeartHandshake size={20}/></span>
   <strong>{q?"Nenhum resultado para esta busca":"Nada novo por aqui ainda"}</strong>
   <p>{q?"Tente outro termo ou limpe a busca para continuar explorando.":"Assim que novas experiências forem publicadas, elas aparecerão aqui."}</p>
   {!q&&<button type="button" onClick={askNotifications}><Bell size={15}/> {notifyState==="done"?"Aviso ativado":notifyState==="unsupported"?"Notificação indisponível":"Avisar quando tiver novidade"}</button>}
  </div>}
 </div>;
}

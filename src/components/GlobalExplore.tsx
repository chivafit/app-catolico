"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {Search,ChevronRight,Bus,CalendarDays,Heart,Sparkles,UsersRound,HeartHandshake,Bell} from "lucide-react";
import {getSupabase} from "@/lib/supabase";
import styles from "@/app/vindeReference.module.css";
import polish from "@/app/vindePolish.module.css";

type Kind="all"|"event"|"pilgrimage"|"content";
type Item={id:string;kind:Exclude<Kind,"all">;title:string;subtitle:string;href:string;image:string};
const labels:Record<Kind,string>={all:"Todos",event:"Eventos",pilgrimage:"Peregrinações",content:"Conteúdos"};
const fall={event:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=82",pilgrimage:"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=82",content:"https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=82",solidarity:"https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=82"};
const norm=(v:string)=>(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const paths=[
 {href:"/explorar#comunidade",label:"Comunidade",text:"Grupos, vida paroquial e conexões",icon:UsersRound},
 {href:"/peregrinacoes",label:"Peregrinações",text:"Destinos de fé",icon:Bus},
 {href:"/eventos",label:"Eventos",text:"Encontros e celebrações",icon:CalendarDays},
 {href:"/doacoes",label:"Doações",text:"Apoie uma causa",icon:Heart}
];
const solidarity:Item={id:"solidarity-piumhi",kind:"content",title:"Solidariedade em Piumhi",subtitle:"Instituições locais verificadas e canais seguros para colaborar.",href:"/solidariedade",image:fall.solidarity};

export function GlobalExplore(){
 const [all,setAll]=useState<Item[]>([]),[q,setQ]=useState(""),[kind,setKind]=useState<Kind>("all"),[loading,setLoading]=useState(true),[notifyState,setNotifyState]=useState<"idle"|"done"|"unsupported">("idle");
 useEffect(()=>{let active=true;(async()=>{const s=getSupabase();const [ev,pi,de]=await Promise.all([
  s.from("events").select("id,title,description,location,image_url,status").eq("status","published").limit(30),
  s.from("pilgrimages").select("id,title,destination,image_url,status,pilgrimage_destinations(name,slug,hero_image_url)").eq("status","published").limit(30),
  s.from("daily_devotionals").select("id,title,scripture_reference,image_url,published").eq("published",true).limit(30)
 ]);const rows:Item[]=[solidarity];(ev.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"event",title:x.title,subtitle:x.location||x.description||"Evento",href:"/eventos",image:x.image_url||fall.event}));(pi.data||[]).forEach((x:any)=>{const d=Array.isArray(x.pilgrimage_destinations)?x.pilgrimage_destinations[0]:x.pilgrimage_destinations;rows.push({id:x.id,kind:"pilgrimage",title:x.title||d?.name||x.destination,subtitle:d?.name||x.destination||"Peregrinação",href:d?.slug?`/peregrinacoes/${d.slug}?trip=${x.id}`:"/peregrinacoes",image:x.image_url||d?.hero_image_url||fall.pilgrimage})});(de.data||[]).forEach((x:any)=>rows.push({id:x.id,kind:"content",title:x.title,subtitle:x.scripture_reference||"Palavra do dia",href:"/momento",image:x.image_url||fall.content}));if(active){setAll(rows);setLoading(false)}})();return()=>{active=false}},[]);
 const filtered=useMemo(()=>all.filter(x=>(kind==="all"||x.kind===kind)&&(!q||norm(`${x.title} ${x.subtitle}`).includes(norm(q)))),[all,q,kind]);
 const counts=useMemo(()=>({all:all.length,event:all.filter(x=>x.kind==="event").length,pilgrimage:all.filter(x=>x.kind==="pilgrimage").length,content:all.filter(x=>x.kind==="content").length}),[all]);
 const featured=filtered[0];const rest=filtered.slice(1,7);
 const emptyTitle=q?"Nenhum resultado para esta busca":kind==="event"?"Ainda sem eventos na sua região":kind==="pilgrimage"?"Ainda sem peregrinações disponíveis":kind==="content"?"Ainda sem novos conteúdos":"Nada novo por aqui ainda";
 const emptyText=q?"Tente outro termo ou limpe a busca para continuar explorando.":"Assim que novas experiências forem publicadas, elas aparecerão aqui.";
 async function askNotifications(){if(typeof window==="undefined"||!("Notification" in window)){setNotifyState("unsupported");return}const permission=await Notification.requestPermission();setNotifyState(permission==="granted"?"done":"unsupported")}
 return <div className={`${styles.page} ${polish.exploreV2}`}>
  <div className={polish.exploreHero}><div><span>EXPLORE O VINDE</span><h1>Um lugar para viver sua fé por inteiro.</h1><p>Descubra oração, comunidade, viagens, eventos e escolhas com propósito.</p></div></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="O que você procura hoje?"/></div>
  <div className={polish.explorePaths} id="comunidade">{paths.map(({href,label,text,icon:Icon})=><Link href={href} key={`${href}-${label}`}><span><Icon size={20}/></span><div><strong>{label}</strong><small>{text}</small></div></Link>)}</div>
  <p className={polish.exploreNavHint}>Evangelho, Igreja e Loja já estão na barra abaixo.</p>
  <div className={styles.sectionHead}><h2>Descubra algo novo</h2>{!loading&&<span>{filtered.length} {filtered.length===1?"opção":"opções"}</span>}</div>
  <div className={polish.exploreFilters}>{(Object.keys(labels) as Kind[]).map(k=><button key={k} type="button" className={kind===k?polish.active:""} aria-pressed={kind===k} onClick={()=>setKind(k)}>{labels[k]} <span>{counts[k]}</span></button>)}</div>
  {loading?<div className={polish.exploreLoading}><span className={polish.loadingDot}/><span>Carregando experiências…</span></div>:featured?<><Link href={featured.href} className={polish.exploreFeatured} style={{backgroundImage:`linear-gradient(0deg,rgba(39,33,29,.84),rgba(63,70,51,.04)),url(${featured.image})`}}><span>{featured.id==="solidarity-piumhi"?"SOLIDARIEDADE":labels[featured.kind]}</span><h2>{featured.title}</h2><p>{featured.subtitle}</p><div>Explorar <ChevronRight size={16}/></div></Link>{rest.length>0&&<div className={polish.exploreFeed}>{rest.map(x=><Link href={x.href} key={`${x.kind}-${x.id}`}><img src={x.image} alt=""/><div><small>{x.id==="solidarity-piumhi"?"Solidariedade":labels[x.kind]}</small><strong>{x.title}</strong><p>{x.subtitle}</p></div><ChevronRight size={17}/></Link>)}</div>}<Link href="/momento" className={polish.exploreClosing}><Sparkles size={19}/><div><small>UM MINUTO PARA VOCÊ</small><strong>Comece pela Palavra de hoje.</strong></div><ChevronRight size={17}/></Link></>:<div className={polish.exploreEmpty}><span><HeartHandshake size={21}/></span><div><strong>{emptyTitle}</strong><p>{emptyText}</p></div>{!q&&<button type="button" onClick={askNotifications}><Bell size={14}/>{notifyState==="done"?"Aviso ativado":notifyState==="unsupported"?"Notificação indisponível":"Avisar quando tiver novidade"}</button>}</div>}
 </div>
}

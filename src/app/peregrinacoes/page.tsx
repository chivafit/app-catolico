// @ts-nocheck
"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {Search,ChevronRight,ChevronDown,CalendarDays,Bell,MapPin,Church,Route,HeartHandshake} from "lucide-react";
import styles from "@/app/vindeReference.module.css";

const fallback="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=82";
const brl=(c:number|null)=>c==null?"Sob consulta":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const dateLabel=(v?:string|null)=>v?new Date(v).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}):"Data a confirmar";
const destinationPreview=[
 {label:"Santuários",icon:Church},
 {label:"Romarias",icon:HeartHandshake},
 {label:"Retiros",icon:MapPin},
 {label:"Caminhos de fé",icon:Route}
];

export default function Peregrinacoes(){
 const [trips,setTrips]=useState<any[]>([]),[destinations,setDestinations]=useState<any[]>([]),[q,setQ]=useState(""),[origin,setOrigin]=useState(""),[period,setPeriod]=useState(""),[loading,setLoading]=useState(true),[notifyState,setNotifyState]=useState<"idle"|"done"|"unsupported">("idle");
 useEffect(()=>{const s=getSupabase();Promise.all([
  s.from("pilgrimages").select("*,pilgrimage_destinations(name,slug,hero_image_url)").eq("status","published").order("starts_at"),
  s.from("pilgrimage_destinations").select("*").eq("active",true).order("featured",{ascending:false}).order("name")
 ]).then(([a,b])=>{setTrips(a.data||[]);setDestinations(b.data||[]);setLoading(false)})},[]);
 const origins=useMemo(()=>Array.from(new Set(trips.map(x=>x.origin_city).filter(Boolean))),[trips]);
 const list=useMemo(()=>trips.filter(t=>{
  const matchesOrigin=!origin||t.origin_city===origin;
  const matchesQuery=!q||`${t.title||""} ${t.destination||""}`.toLowerCase().includes(q.toLowerCase());
  const matchesPeriod=!period||new Date(t.starts_at)>=new Date();
  return matchesOrigin&&matchesQuery&&matchesPeriod;
 }),[trips,origin,q,period]);
 const hero=list[0]||null;const heroDest=hero?(Array.isArray(hero.pilgrimage_destinations)?hero.pilgrimage_destinations[0]:hero.pilgrimage_destinations):null;
 const upcoming=hero?list.filter(t=>t.id!==hero.id).slice(0,5):[];
 const availableCount=list.length;
 async function requestNotify(){
  if(typeof window==="undefined"||!("Notification" in window)){setNotifyState("unsupported");return}
  const permission=await Notification.requestPermission();
  setNotifyState(permission==="granted"?"done":"unsupported");
 }
 const heroSpots=hero?.available_spots!=null?Number(hero.available_spots):null;
 return <AppShell><div className={styles.page}>
  <div className={`${styles.title} ${styles.center}`}><h1>Peregrinações</h1><p>Viagens de fé, encontros e destinos que transformam.</p></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar destino"/></div>
  <div className={styles.filterRow}>
   <label className={styles.filterControl}><span>{origin||"Todas as saídas"}</span><ChevronDown size={15}/><select aria-label="Filtrar por cidade de saída" value={origin} onChange={e=>setOrigin(e.target.value)}><option value="">Todas as saídas</option>{origins.map((x:any)=><option key={x}>{x}</option>)}</select></label>
   <label className={styles.filterControl}><span>{period||"Qualquer período"}</span><ChevronDown size={15}/><select aria-label="Filtrar por período" value={period} onChange={e=>setPeriod(e.target.value)}><option value="">Qualquer período</option><option value="Próximas viagens">Próximas viagens</option></select></label>
  </div>

  {!loading&&hero&&<Link href={`/peregrinacoes/${heroDest?.slug||"aparecida"}?trip=${hero.id}`} className={styles.pilgHero} style={{backgroundImage:`url(${hero.image_url||heroDest?.hero_image_url||fallback})`}}>
   <div className={styles.pilgHeroBadges}><span>EM DESTAQUE</span>{heroSpots!=null&&heroSpots>0&&<span className={styles.pilgAvailability}>{heroSpots} {heroSpots===1?"vaga restante":"vagas restantes"}</span>}</div>
   <h2>{hero.title||hero.destination}</h2>
   <p>{hero.destination||heroDest?.name}</p>
   <div className={styles.pilgHeroMeta}><span><CalendarDays size={13}/>{dateLabel(hero.starts_at)}</span>{hero.origin_city&&<span>Saída de {hero.origin_city}</span>}</div>
   <ChevronRight size={20}/>
  </Link>}

  <section className={styles.section}><div className={styles.sectionHead}><h2>Próximas viagens</h2>{!loading&&<span>{availableCount} {availableCount===1?"viagem disponível":"viagens disponíveis"}</span>}</div>
   {loading?<div className={styles.empty}>Carregando saídas…</div>:upcoming.length?<div className={styles.pilgRows}>{upcoming.map(t=>{const d=Array.isArray(t.pilgrimage_destinations)?t.pilgrimage_destinations[0]:t.pilgrimage_destinations;const spots=t.available_spots!=null?Number(t.available_spots):null;return <Link key={t.id} href={`/peregrinacoes/${d?.slug||"aparecida"}?trip=${t.id}`} className={styles.pilgRow}><img src={t.image_url||d?.hero_image_url||fallback} alt=""/><div><strong>{t.title||t.destination}</strong><small><CalendarDays size={11}/>{dateLabel(t.starts_at)} · {brl(t.price_cents)}</small>{t.origin_city&&<small>Saída de {t.origin_city}</small>}{spots!=null&&spots>0&&<span className={styles.pilgRowBadge}>{spots} {spots===1?"vaga restante":"vagas restantes"}</span>}</div><ChevronRight size={18}/></Link>})}</div>:hero?<div className={styles.pilgEmpty}><span><CalendarDays size={20}/></span><div><strong>Sem outras saídas por enquanto</strong><p>A viagem em destaque acima é a única disponível neste momento.</p></div><button type="button" onClick={requestNotify}>{notifyState==="done"?"Aviso ativado":notifyState==="unsupported"?"Ative nas configurações":"Avisar sobre novas saídas"}</button></div>:<div className={styles.pilgEmpty}><span><CalendarDays size={20}/></span><div><strong>Nenhuma viagem encontrada</strong><p>Tente outros filtros ou receba um aviso quando novas saídas forem publicadas.</p></div><button type="button" onClick={requestNotify}>{notifyState==="done"?"Aviso ativado":notifyState==="unsupported"?"Ative nas configurações":"Avisar sobre novas saídas"}</button></div>}
  </section>

  <section className={styles.section}><div className={styles.sectionHead}><h2>Destinos que inspiram</h2>{destinations.length>0&&<span>{destinations.length} {destinations.length===1?"destino":"destinos"}</span>}</div>{destinations.length>0?<div className={styles.destGrid}>{destinations.slice(0,6).map(d=><Link href={`/peregrinacoes/${d.slug}`} className={styles.dest} key={d.id} style={{backgroundImage:`url(${d.hero_image_url||fallback})`}}><strong>{d.name}</strong><small>{d.region||d.country||"Destino de fé"}</small></Link>)}</div>:<div className={styles.pilgPreview}><div className={styles.pilgPreviewHead}><small>O QUE VEM POR AÍ</small><strong>Novos caminhos de fé estão sendo preparados.</strong></div><div className={styles.pilgPreviewGrid}>{destinationPreview.map(({label,icon:Icon})=><div key={label}><span><Icon size={19}/></span><strong>{label}</strong></div>)}</div></div>}</section>
 </div></AppShell>
}

"use client";
import "./peregrinacoes.css";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {EntityFavorite} from "@/components/EntityFavorite";
import {ShareButton} from "@/components/ShareButton";
import {getSupabase} from "@/lib/supabase";
import {Bus,Plane,MapPin,CalendarDays,ShieldCheck,Clock3,ArrowRight,Search} from "lucide-react";

type Organizer={name?:string|null;verified?:boolean|null};
type Destination={id:string;name:string;slug:string;hero_image_url?:string|null;region?:string|null;country?:string|null;category?:string|null;active?:boolean|null};
type Trip={id:string;title?:string|null;destination?:string|null;destination_id?:string|null;origin_city?:string|null;starts_at:string;duration_days?:number|null;transport_type?:string|null;price_cents?:number|null;available_spots?:number|null;image_url?:string|null;travel_organizers?:Organizer|Organizer[]|null;pilgrimage_destinations?:Destination|Destination[]|null};
const brl=(c:number|null|undefined)=>c==null?"Sob consulta":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const fallback="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=82";
const one=<T,>(v:T|T[]|null|undefined):T|undefined=>Array.isArray(v)?v[0]:v||undefined;
const imgFor=(d:Destination|Trip)=>{if("hero_image_url" in d&&d.hero_image_url)return d.hero_image_url;if("image_url" in d&&d.image_url)return d.image_url;return fallback};

export default function Peregrinacoes(){
 const [trips,setTrips]=useState<Trip[]>([]),[destinations,setDestinations]=useState<Destination[]>([]),[origin,setOrigin]=useState(""),[destination,setDestination]=useState(""),[transport,setTransport]=useState("");
 useEffect(()=>{const s=getSupabase();Promise.all([s.from("pilgrimages").select("*,travel_organizers(name,verified),pilgrimage_destinations(name,slug,hero_image_url,region,country,category)").eq("status","published").order("starts_at"),s.from("pilgrimage_destinations").select("*").eq("active",true).order("featured",{ascending:false}).order("name")]).then(([a,b])=>{setTrips((a.data||[]) as Trip[]);setDestinations((b.data||[]) as Destination[])})},[]);
 const origins=useMemo(()=>Array.from(new Set(trips.map(x=>x.origin_city).filter((x):x is string=>Boolean(x)))),[trips]);
 const list=trips.filter(x=>(!origin||x.origin_city===origin)&&(!destination||x.destination_id===destination)&&(!transport||x.transport_type===transport));
 return <AppShell><div className="product-page pilg">
  <section className="product-hero"><span className="product-kicker">PEREGRINAÇÕES</span><h1>Para onde sua fé te leva?</h1><p>Descubra destinos, compare saídas e acompanhe experiências publicadas por organizadores verificados.</p></section>
  <div className="product-toolbar"><select className="product-filter" value={origin} onChange={e=>setOrigin(e.target.value)}><option value="">Cidade de saída</option>{origins.map(x=><option key={x}>{x}</option>)}</select><select className="product-filter" value={destination} onChange={e=>setDestination(e.target.value)}><option value="">Destino</option>{destinations.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select><select className="product-filter" value={transport} onChange={e=>setTransport(e.target.value)}><option value="">Transporte</option><option value="bus">Ônibus</option><option value="air">Aéreo</option></select></div>
  <section className="product-section"><div className="product-section-head"><h2>Viagens disponíveis</h2><span>{list.length} opção{list.length===1?"":"ões"}</span></div>{list.length?<div className="editorial-grid">{list.map(t=>{const organizer=one(t.travel_organizers),dest=one(t.pilgrimage_destinations);return <article className="editorial-card" key={t.id}><Link href={`/peregrinacoes/${dest?.slug||"destino"}?trip=${t.id}`}><div className="editorial-image" style={{backgroundImage:`url(${t.image_url||imgFor(dest||t)})`}}>{organizer?.verified&&<span className="editorial-badge"><ShieldCheck size={11}/> VERIFICADA</span>}</div><div className="editorial-body"><h3>{t.title||t.destination}</h3><div className="editorial-meta"><span><MapPin size={13}/>{t.destination}</span><span><CalendarDays size={13}/>{new Date(t.starts_at).toLocaleDateString("pt-BR")}</span>{t.duration_days&&<span><Clock3 size={13}/>{t.duration_days} dias</span>}<span>{t.transport_type==="air"?<Plane size={13}/>:<Bus size={13}/>} {t.transport_type==="air"?"Aéreo":"Ônibus"}</span></div><div className="editorial-price">{brl(t.price_cents)}</div><p>{t.available_spots==null?"Vagas a confirmar":`${t.available_spots} vagas disponíveis`}{t.origin_city?` • saída de ${t.origin_city}`:""}</p><div className="cta secondary">Ver roteiro <ArrowRight size={16}/></div></div></Link><div className="pilg-actions"><EntityFavorite type="pilgrimage" id={t.id}/><ShareButton title={t.title||t.destination||"Peregrinação"}/></div></article>})}</div>:<div className="empty-state"><Search size={28}/><h3>Nenhuma viagem com esses filtros.</h3><p>Explore os destinos abaixo e acompanhe as próximas saídas.</p></div>}</section>
  <section className="product-section"><div className="product-section-head"><div><span className="product-kicker">INSPIRAÇÃO</span><h2>Destinos que movem a fé</h2></div><span>Explore antes de escolher</span></div><div className="editorial-grid">{destinations.map(d=><Link href={`/peregrinacoes/${d.slug}`} className="editorial-card" key={d.id}><div className="editorial-image" style={{backgroundImage:`url(${imgFor(d)})`}}><span className="editorial-badge">{d.category==="international"?"INTERNACIONAL":"BRASIL"}</span></div><div className="editorial-body"><h3>{d.name}</h3><p>{d.region?`${d.region} • `:""}{d.country}</p><div className="cta secondary">Conhecer destino <ArrowRight size={15}/></div></div></Link>)}</div></section>
  <div className="trust-strip"><ShieldCheck/><div><strong>Marketplace, não operação turística.</strong><p>O Vinde apresenta e distribui experiências de parceiros responsáveis. Operações sujeitas à regulamentação devem ser executadas por organizadores/agências habilitados.</p></div></div>
 </div></AppShell>;
}

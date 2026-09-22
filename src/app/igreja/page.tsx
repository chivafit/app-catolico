"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {useAuth} from "@/components/AuthProvider";
import {getSupabase} from "@/lib/supabase";
import {Bell,CalendarDays,ChevronRight,ClipboardList,Church as ChurchIcon,Clock3,HandCoins,Landmark,MapPin,Navigation,Search,UsersRound} from "lucide-react";
import s from "./igreja.module.css";

const hh=(v?:string|null)=>v?String(v).slice(0,5).replace(":","h"):"";
const life=[
 {slug:"/igreja/pastorais",label:"Pastorais e movimentos",text:"Catequese, ECC, EJC, Terço dos Homens, RCC",icon:UsersRound},
 {slug:"/igreja/secretaria",label:"Sacramentos e secretaria",text:"Batismo, casamento, crisma, intenções",icon:Landmark},
 {slug:"/igreja/secretaria#formacao",label:"Formação e inscrições",text:"Encontros e preparação sacramental",icon:ClipboardList}
];

export default function Igreja(){
 const {profile,loading:authLoading}=useAuth();
 const [parishes,setParishes]=useState<any[]>([]),[schedules,setSchedules]=useState<any[]>([]),
  [events,setEvents]=useState<any[]>([]),[posts,setPosts]=useState<any[]>([]),
  [q,setQ]=useState(""),[searching,setSearching]=useState(false),[selectedId,setSelectedId]=useState("");

 useEffect(()=>{const c=getSupabase();Promise.all([
  c.from("parishes").select("*").order("name"),
  c.from("mass_schedules").select("*").eq("active",true).order("weekday").order("starts_at"),
  c.from("events").select("*").eq("status","published").order("starts_at").limit(10),
  c.from("parish_posts").select("*").not("published_at","is",null).order("published_at",{ascending:false}).limit(8)
 ]).then(([p,m,e,n])=>{setParishes(p.data||[]);setSchedules(m.data||[]);setEvents(e.data||[]);setPosts(n.data||[])})},[]);
 useEffect(()=>{if(!authLoading&&profile?.primary_parish_id)setSelectedId(profile.primary_parish_id)},[authLoading,profile?.primary_parish_id]);

 const filtered=useMemo(()=>parishes.filter(p=>!q||`${p.name} ${p.city||""} ${p.state||""} ${p.address||""}`.toLowerCase().includes(q.toLowerCase())),[parishes,q]);
 const selected=parishes.find(p=>p.id===selectedId);
 const today=new Date().getDay();
 const todayMasses=schedules.filter(m=>m.parish_id===selected?.id&&Number(m.weekday)===today);
 const parishEvents=events.filter(e=>e.parish_id===selected?.id).slice(0,3);
 const parishPosts=posts.filter(p=>p.parish_id===selected?.id).slice(0,2);
 const others=filtered.filter(p=>p.id!==selected?.id).slice(0,4);
 const address=selected?[selected.address,selected.city,selected.state].filter(Boolean).join(", "):"";
 const directions=address?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`:"#";
 const parishParam=selected?.id?`?paroquia=${encodeURIComponent(selected.id)}`:"";

 return <AppShell hideHeader>
  <div className={s.page}>
   <header className={s.hero} style={selected?.photo_url?{backgroundImage:`url(${selected.photo_url})`}:undefined}>
    <div className={s.heroTop}>
     <span className="eyebrow">Sua comunidade</span>
     <button type="button" className={s.searchToggle} onClick={()=>setSearching(v=>!v)} aria-label="Buscar igreja"><Search size={20}/></button>
    </div>
    <div className={s.heroCopy}>
     <h1>{selected?.name||"Escolha sua igreja"}</h1>
     <p className="meta"><MapPin size={15}/> {address||"Horários, avisos e serviços da sua comunidade"}</p>
    </div>
   </header>

   {searching&&<label className={`search ${s.search}`}>
    <Search size={19}/>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar igreja, cidade ou endereço" autoFocus/>
   </label>}

   {!selected&&<Link href="/onboarding" className={s.pick}>
    <span className="row-icon"><ChurchIcon size={20}/></span>
    <span><strong>Escolher minha igreja</strong><small>Para ver horários, avisos e serviços</small></span>
    <ChevronRight size={18}/>
   </Link>}

   {selected&&<>
    <nav className={s.actions}>
     <a href={directions} target="_blank" rel="noreferrer" data-primary><Navigation size={20}/><span>Rota</span></a>
     <a href="#horarios"><Clock3 size={20}/><span>Horários</span></a>
     <a href="#eventos"><CalendarDays size={20}/><span>Eventos</span></a>
     <Link href="/doacoes"><HandCoins size={20}/><span>Ofertar</span></Link>
    </nav>

    <section className={s.block} id="horarios">
     <span className="eyebrow">Missas de hoje</span>
     {todayMasses.length?<div className={s.masses}>{todayMasses.map(m=><div className={s.mass} key={m.id}>
      <strong>{hh(m.starts_at)}</strong>
      <span className="meta">{m.label||"Matriz"}</span>
     </div>)}</div>:<p className={s.empty}>Nenhum horário cadastrado para hoje. Confirme com a secretaria paroquial.</p>}
    </section>

    {parishPosts.length>0&&<section className={s.block}>
     <span className="eyebrow">Hoje na comunidade</span>
     {parishPosts.map(p=><article className={s.notice} key={p.id}>
      <span className={s.noticeTag}><Bell size={15}/> Aviso</span>
      <strong>{p.title}</strong>
      <p>{p.body}</p>
     </article>)}
    </section>}
   </>}

   <section className={s.block}>
    <span className="eyebrow">Participe mais de perto</span>
    <div className={s.rows}>{life.map(({slug,label,text,icon:Icon})=><Link href={`${slug}${parishParam}`} key={label} className="row">
     <span className="row-icon"><Icon size={20}/></span>
     <span><strong>{label}</strong><small>{text}</small></span>
     <ChevronRight size={18}/>
    </Link>)}</div>
   </section>

   {selected&&<section className={s.block} id="eventos">
    <div className={s.head}><span className="eyebrow">Próximos encontros</span><Link href="/eventos">Agenda</Link></div>
    {parishEvents.length?<div className={s.rows}>{parishEvents.map(e=><Link href="/eventos" key={e.id} className="row">
     <span className="row-icon"><CalendarDays size={20}/></span>
     <span><strong>{e.title}</strong><small>{new Date(e.starts_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"long"})}{e.location?` · ${e.location}`:""}</small></span>
     <ChevronRight size={18}/>
    </Link>)}</div>:<p className={s.empty}>Nenhum evento por aqui ainda. <Link href="/explorar">Explorar a região</Link></p>}
   </section>}

   {others.length>0&&<section className={s.block}>
    <span className="eyebrow">Outras igrejas</span>
    <div className={s.churches}>{others.map(p=><button type="button" key={p.id} className={s.church} onClick={()=>setSelectedId(p.id)}>
     {p.photo_url&&<img src={p.photo_url} alt=""/>}
     <span>
      <strong>{p.name}</strong>
      <small className="meta">{[p.city,p.state].filter(Boolean).join(", ")||p.address}</small>
     </span>
     <ChevronRight size={18}/>
    </button>)}</div>
   </section>}
  </div>
 </AppShell>;
}

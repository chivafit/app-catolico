"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {useAuth} from "@/components/AuthProvider";
import {getSupabase} from "@/lib/supabase";
import {CalendarDays,ChevronRight,CircleHelp,Church,HandCoins,Heart,HeartHandshake,LogOut,MapPin,Package,Settings} from "lucide-react";
import s from "./perfil.module.css";

export default function Perfil(){
 const {user,profile,loading,signOut}=useAuth();
 const router=useRouter();
 const [stats,setStats]=useState({favorites:0,orders:0,bookings:0});
 const [parish,setParish]=useState<any>(null);

 useEffect(()=>{
  if(loading)return;
  if(!user){router.replace("/entrar?next=/perfil");return}
  const c=getSupabase();
  Promise.all([
   c.from("favorites").select("entity_id",{count:"exact",head:true}).eq("user_id",user.id),
   c.from("orders").select("id",{count:"exact",head:true}).eq("user_id",user.id),
   c.from("bookings").select("id",{count:"exact",head:true}).eq("user_id",user.id),
   profile?.primary_parish_id?c.from("parishes").select("name,city,state").eq("id",profile.primary_parish_id).maybeSingle():Promise.resolve({data:null}) as any
  ]).then(([a,b,d,p])=>{setStats({favorites:a.count||0,orders:b.count||0,bookings:d.count||0});setParish(p.data)});
 },[user,profile,loading,router]);

 if(loading||!user)return <AppShell hideHeader><p className={s.loading}>Carregando…</p></AppShell>;

 const name=profile?.full_name||user.email?.split("@")[0]||"Usuário Vinde";
 const initials=name.split(" ").slice(0,2).map((x:string)=>x[0]).join("").toUpperCase();
 const avatar=profile?.avatar_url||profile?.photo_url||"";

 const groups=[
  ["Minha fé",[
   {label:"Minha igreja",text:parish?parish.name:"Escolha sua comunidade",href:"/igreja",icon:Church},
   {label:"Meus eventos",text:"Inscrições e encontros",href:"/eventos",icon:CalendarDays},
   {label:"Meus favoritos",text:"Orações e conteúdos salvos",href:"/favoritos",icon:Heart}
  ]],
  ["Solidariedade e pedidos",[
   {label:"Solidariedade",text:"Instituições e causas para ajudar",href:"/solidariedade",icon:HeartHandshake},
   {label:"Minhas doações",text:"Histórico de contribuições",href:"/doacoes",icon:HandCoins},
   {label:"Meus pedidos",text:"Compras e andamento",href:"/pedidos",icon:Package}
  ]],
  ["Conta e suporte",[
   {label:"Configurações",text:"Conta, preferências e privacidade",href:"/configuracoes",icon:Settings},
   {label:"Ajuda e suporte",text:"Dúvidas e informações",href:"/ajuda",icon:CircleHelp}
  ]]
 ] as const;

 return <AppShell hideHeader>
  <div className={s.page}>
   <header className={s.top}>
    <span className="eyebrow">Sua conta no Vinde</span>
    <Link href="/configuracoes" className="inner-avatar" aria-label="Configurações"><Settings size={20}/></Link>
   </header>

   <section className={s.user}>
    <span className={s.avatar}>{avatar?<img src={avatar} alt={`Foto de ${name}`}/>:initials}</span>
    <div>
     <h1>{name}</h1>
     <p className="meta">{user.email}</p>
    </div>
   </section>

   {parish&&<p className={s.parish}><MapPin size={15}/> {parish.name} · {parish.city}/{parish.state}</p>}

   <section className={s.stats}>
    <Link href="/favoritos"><strong>{stats.favorites}</strong><span>Favoritos</span></Link>
    <Link href="/pedidos"><strong>{stats.orders}</strong><span>Pedidos</span></Link>
    <Link href="/peregrinacoes"><strong>{stats.bookings}</strong><span>Reservas</span></Link>
   </section>

   {groups.map(([title,rows])=><section className={s.group} key={title}>
    <span className="eyebrow">{title}</span>
    <div className={s.rows}>{rows.map(({label,text,href,icon:Icon})=><Link href={href} key={label} className="row">
     <span className="row-icon"><Icon size={20}/></span>
     <span><strong>{label}</strong><small>{text}</small></span>
     <ChevronRight size={18}/>
    </Link>)}</div>
   </section>)}

   <button className={s.signout} onClick={async()=>{await signOut();router.push("/")}}>
    <LogOut size={20}/> Sair da conta
   </button>
  </div>
 </AppShell>;
}

"use client";
import "../menu-reference.css";
import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {useAuth} from "@/components/AuthProvider";
import {X,Home,BookOpenText,Church,Search,ShoppingCart,BookOpen,Heart,Bus,Bell,Settings} from "lucide-react";

const main=[
 {label:"Início",href:"/",icon:Home},
 {label:"Momento Diário",href:"/momento",icon:BookOpenText},
 {label:"Minha Igreja",href:"/igreja",icon:Church},
 {label:"Explorar",href:"/explorar",icon:Search},
 {label:"Loja",href:"/loja",icon:ShoppingCart},
 {label:"Livraria",href:"/livros",icon:BookOpen},
 {label:"Campanhas",href:"/campanhas",icon:Heart},
 {label:"Peregrinações",href:"/peregrinacoes",icon:Bus},
];

export default function Menu(){const {user,profile,loading}=useAuth();const router=useRouter();useEffect(()=>{if(!loading&&!user)router.replace("/entrar?next=/menu")},[loading,user,router]);if(loading||!user)return <AppShell hideHeader hideNav><div className="menu-ref-loading">Carregando…</div></AppShell>;const name=profile?.full_name||"Maria Silva";const initials=name.split(" ").slice(0,2).map((x:string)=>x[0]).join("").toUpperCase();return <AppShell hideHeader hideNav><div className="menu-ref-bg"><section className="menu-ref-panel"><button className="menu-ref-close" onClick={()=>router.back()} aria-label="Fechar"><X/></button><Link href="/perfil" className="menu-ref-user"><div className="menu-ref-avatar">{initials}</div><div><h1>{name}</h1><p>{user.email}</p></div></Link><nav className="menu-ref-nav">{main.map(({label,href,icon:Icon})=><Link href={href} key={label}><Icon/><span>{label}</span></Link>)}</nav><div className="menu-ref-more"><h2>Mais</h2><Link href="/configuracoes#notificacoes" className="menu-ref-alert"><span><Bell/><i/></span><b>Notificações</b></Link><Link href="/configuracoes"><Settings/><b>Configurações</b></Link></div></section></div></AppShell>}

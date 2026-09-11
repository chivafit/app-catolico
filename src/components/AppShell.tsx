"use client";
import Link from "next/link";
import {ReactNode,useEffect} from "react";
import {Home,Church,Compass,ShoppingBag,UserRound,ChevronLeft} from "lucide-react";
import {usePathname,useRouter} from "next/navigation";
import {useAuth} from "@/components/AuthProvider";
import {track} from "@/lib/analytics";

const links=[["/","Hoje",Home],["/explorar","Explorar",Compass],["/igreja","Igreja",Church],["/loja","Loja",ShoppingBag],["/perfil","Eu",UserRound]] as const;
const roots=new Set(["/","/explorar","/igreja","/loja","/perfil"]);
const titles:Record<string,string>={explorar:"Explorar",momento:"Momento Diário",peregrinacoes:"Peregrinações",oracoes:"Orações",livros:"Livraria",loja:"Loja",eventos:"Eventos",campanhas:"Campanhas",carrinho:"Carrinho",configuracoes:"Configurações",favoritos:"Favoritos",paroquias:"Paróquias",termos:"Termos de Uso",privacidade:"Privacidade"};

export function AppShell({children,hideHeader=false,hideNav=false}:{children:ReactNode;hideHeader?:boolean;hideNav?:boolean}){
 const path=usePathname();const router=useRouter();const {user,profile}=useAuth();
 useEffect(()=>{track("page_view",{path,parish_id:profile?.primary_parish_id||undefined});if(user)track("active_session",{path,parish_id:profile?.primary_parish_id||undefined})},[path,user?.id,profile?.primary_parish_id]);
 const initials=profile?.full_name?.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()||user?.email?.slice(0,2).toUpperCase()||"VI";
 const avatarUrl=profile?.avatar_url||user?.user_metadata?.avatar_url||user?.user_metadata?.picture||"";
 const inner=!roots.has(path);const segment=path.split("/").filter(Boolean).at(-1)||"";const label=titles[segment]||segment.replace(/-/g," ").replace(/^./,c=>c.toUpperCase());
 function goBack(){if(window.history.length>1)router.back();else router.push("/")}
 const avatar=avatarUrl?<img src={avatarUrl} alt=""/>:<span>{initials}</span>;
 return <><main className={`shell ${hideHeader?"shell-no-header":""} ${hideNav?"shell-no-nav":""}`}>{!hideHeader&&(inner?<header className="inner-topbar"><button onClick={goBack} className="inner-back" aria-label="Voltar"><ChevronLeft size={22}/></button><strong>{label}</strong><Link href={user?"/perfil":"/entrar"} className="inner-avatar" aria-label={user?"Abrir perfil":"Entrar"}>{avatar}</Link></header>:<header className="topbar"><Link href="/" className="brand"><span className="brand-cross">✣</span><span><b>Vinde</b><small>Fé que acompanha você.</small></span></Link><Link href={user?"/perfil":"/entrar"} className="avatar" aria-label={user?"Abrir perfil":"Entrar"}>{avatar}</Link></header>)}{children}</main>{!hideNav&&<nav className="bottomnav" aria-label="Navegação principal">{links.map(([href,label,Icon])=>{const active=href==="/"?path==="/":path.startsWith(href);return <Link onClick={()=>track("nav_click",{entity_type:"navigation",path:href,parish_id:profile?.primary_parish_id||undefined,metadata:{label}})} className={`navitem ${active?"active":""}`} href={href} key={href} aria-current={active?"page":undefined}><Icon size={20}/><span>{label}</span></Link>})}</nav>}</>;
}

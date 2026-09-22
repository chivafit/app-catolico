"use client";
import Link from "next/link";
import {ReactNode,useEffect} from "react";
import {Sun,Church,Compass,BookOpen,ChevronLeft,Settings,ShoppingBag} from "lucide-react";
import {usePathname,useRouter} from "next/navigation";
import {useAuth} from "@/components/AuthProvider";
import {track} from "@/lib/analytics";

const links=[
 ["/","Hoje",Sun],
 ["/momento","Palavra",BookOpen],
 ["/igreja","Igreja",Church],
 ["/explorar","Explorar",Compass],
 ["/loja","Loja",ShoppingBag]
] as const;
const roots=new Set(["/"]);
const titles:Record<string,string>={perfil:"Meu Perfil",momento:"Palavra de hoje",igreja:"Igreja",pastorais:"Pastorais e movimentos",secretaria:"Sacramentos e Secretaria",solicitacoes:"Minhas solicitações",explorar:"Explorar",peregrinacoes:"Peregrinações",oracoes:"Orações",livros:"Livraria",loja:"Loja",eventos:"Eventos",campanhas:"Campanhas",carrinho:"Carrinho",configuracoes:"Configurações",favoritos:"Favoritos",paroquias:"Paróquias",ajuda:"Ajuda e Suporte",termos:"Termos de Uso",privacidade:"Privacidade",solidariedade:"Solidariedade"};

export function AppShell({children,hideHeader=false,hideNav=false}:{children:ReactNode;hideHeader?:boolean;hideNav?:boolean}){
 const path=usePathname();
 const router=useRouter();
 const {user,profile}=useAuth();

 useEffect(()=>{
  track("page_view",{path,parish_id:profile?.primary_parish_id||undefined});
  if(user)track("active_session",{path,parish_id:profile?.primary_parish_id||undefined});
 },[path,user?.id,profile?.primary_parish_id]);

 const initials=profile?.full_name?.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()
  ||user?.email?.slice(0,2).toUpperCase()||"VI";
 const avatarUrl=profile?.avatar_url||profile?.photo_url
  ||(user?.user_metadata?.avatar_url as string|undefined)
  ||(user?.user_metadata?.picture as string|undefined)||"";
 const inner=!roots.has(path);
 const segment=path.split("/").filter(Boolean).at(-1)||"";
 const label=path.startsWith("/loja/")?"Produto":path.startsWith("/solidariedade/")?"Instituição"
  :titles[segment]||segment.replace(/-/g," ").replace(/^./,c=>c.toUpperCase());

 function goBack(){if(window.history.length>1)router.back();else router.push("/")}

 const avatar=avatarUrl?<img src={avatarUrl} alt=""/>:<span>{initials}</span>;
 const rightAction=path==="/perfil"
  ?<Link href="/configuracoes" className="inner-avatar" aria-label="Configurações"><Settings size={20}/></Link>
  :<Link href={user?"/perfil":"/entrar"} className="inner-avatar" aria-label={user?"Abrir perfil":"Entrar"}>{avatar}</Link>;

 return <>
  <main className={`shell ${hideHeader?"shell-no-header":""} ${hideNav?"shell-no-nav":""}`}>
   {!hideHeader&&inner&&<header className="inner-topbar">
    <button onClick={goBack} className="inner-back" aria-label="Voltar"><ChevronLeft size={22}/></button>
    <strong>{label}</strong>
    {rightAction}
   </header>}
   {children}
  </main>
  {!hideNav&&<div className="navdock">
   <nav className="bottomnav">
    {links.map(([href,label,Icon])=>{
     const active=href==="/"?path==="/":path.startsWith(href);
     return <Link
      key={href}
      href={href}
      className={`navitem ${active?"active":""}`}
      onClick={()=>track("nav_click",{entity_type:"navigation",path:href,parish_id:profile?.primary_parish_id||undefined,metadata:{label}})}
     ><Icon size={22}/><span>{label}</span></Link>;
    })}
   </nav>
  </div>}
 </>;
}

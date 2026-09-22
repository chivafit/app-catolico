"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";
import {AlertCircle,ArrowRight,BellRing,Plus,Search,ShoppingCart,Store} from "lucide-react";
import s from "./StoreCatalog.module.css";

const KEY="agora-fide-cart";
const brl=(c:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const countCart=()=>{try{return (JSON.parse(localStorage.getItem(KEY)||"[]") as any[]).reduce((n,x)=>n+(Number(x.quantity)||0),0)}catch{return 0}};

type Product={id:string;name:string;slug:string;description?:string|null;author?:string|null;category?:string|null;price_cents:number;image_url?:string|null};

export function StoreCatalog({initialProducts,loadError}:{initialProducts:Product[];loadError?:string|null}){
 const params=useSearchParams();
 const [products]=useState<Product[]>(initialProducts),[q,setQ]=useState(""),
  [cat,setCat]=useState(params.get("categoria")||""),[cartCount,setCartCount]=useState(0),
  [notifyState,setNotifyState]=useState<"idle"|"done"|"blocked">("idle");

 useEffect(()=>{const sync=()=>setCartCount(countCart());sync();
  window.addEventListener("agora-cart",sync);window.addEventListener("storage",sync);
  return()=>{window.removeEventListener("agora-cart",sync);window.removeEventListener("storage",sync)}},[]);

 const cats=useMemo(()=>Array.from(new Set(products.map(x=>x.category).filter(Boolean) as string[])),[products]);
 useEffect(()=>{if(cat&&!cats.includes(cat))setCat("")},[cat,cats]);

 const list=products.filter(x=>(!q||`${x.name} ${x.description||""} ${x.author||""}`.toLowerCase().includes(q.toLowerCase()))&&(!cat||x.category===cat));
 const featured=products.find(p=>p.image_url)||products[0]||null;
 const rest=list.filter(p=>p.id!==featured?.id);

 async function notifyWhenOpen(){
  if(typeof window==="undefined"||!("Notification" in window)){setNotifyState("blocked");return}
  if(Notification.permission==="granted"){setNotifyState("done");return}
  const permission=await Notification.requestPermission();
  setNotifyState(permission==="granted"?"done":"blocked");
 }

 return <div className={s.page}>
  <header className={s.top}>
   <div>
    <span className="eyebrow">Loja Vinde</span>
    <h1>Escolhas com propósito.</h1>
   </div>
   <Link href="/carrinho" className={s.cart} aria-label="Abrir carrinho">
    <ShoppingCart size={20}/>
    {cartCount>0&&<b>{cartCount>99?"99+":cartCount}</b>}
   </Link>
  </header>

  {featured&&<Link href={`/loja/${featured.slug}`} className={s.featured}>
   <div className={s.featuredCopy}>
    <small className="eyebrow">Destaque da curadoria</small>
    <h2>{featured.name}</h2>
    <p>{featured.description||"Uma escolha especial da curadoria Vinde para estar mais perto do essencial."}</p>
    <span className={s.featuredCta}>Ver produto <ArrowRight size={16}/></span>
   </div>
   <div className={s.featuredMedia}>
    {featured.image_url?<img src={featured.image_url} alt={featured.name}/>:<span>foto do produto</span>}
   </div>
  </Link>}

  <label className={`search ${s.search}`}>
   <Search size={19}/>
   <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar livros, terços e presentes"/>
  </label>

  {cats.length>=2&&<div className={s.cats}>
   <button type="button" className={`chip ${!cat?"active":""}`} onClick={()=>setCat("")}>Tudo</button>
   {cats.map(c=><button key={c} type="button" className={`chip ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>)}
  </div>}

  {loadError?<section className={s.state}>
   <span className="row-icon"><AlertCircle size={20}/></span>
   <strong>Não foi possível carregar a curadoria</strong>
   <p>O catálogo existe, mas houve uma falha ao consultar os produtos. Tente novamente em instantes.</p>
  </section>
  :products.length===0?<section className={s.state}>
   <span className="row-icon"><Store size={20}/></span>
   <strong>Nossa loja está a caminho</strong>
   <p>Estamos preparando uma curadoria de livros, objetos de fé e presentes com propósito.</p>
   <button type="button" onClick={notifyWhenOpen}><BellRing size={16}/> {notifyState==="done"?"Aviso ativado":notifyState==="blocked"?"Ative notificações no navegador":"Avisar quando abrir"}</button>
  </section>
  :<section className="section">
   <div className={s.head}>
    <span className="eyebrow">{cat||q?"Resultados":"Curadoria Vinde"}</span>
    <span className="meta">{list.length} {list.length===1?"item":"itens"}</span>
   </div>
   {rest.length?<div className={s.grid}>{rest.map(p=><Link href={`/loja/${p.slug}`} className={s.product} key={p.id}>
    <div className={s.image}>
     {p.image_url?<img src={p.image_url} alt={p.name}/>:<span>foto do produto</span>}
     <i className={s.plus}><Plus size={17}/></i>
    </div>
    <small className="eyebrow">{p.category||"Curadoria"}</small>
    <strong>{p.name}</strong>
    <span className={s.price}>{brl(p.price_cents)}</span>
   </Link>)}</div>:<p className={s.none}>Nenhum outro produto para este filtro.</p>}
  </section>}
 </div>;
}

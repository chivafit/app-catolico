"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "next/navigation";
import {ShoppingCart,Search,Plus,ArrowRight,BookOpen,Heart,Home,Gift,Store,BellRing,AlertCircle} from "lucide-react";
import shop from "@/app/loja/loja-home.module.css";

const KEY="agora-fide-cart";
const brl=(c:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const countCart=()=>{try{return (JSON.parse(localStorage.getItem(KEY)||"[]") as any[]).reduce((n,x)=>n+(Number(x.quantity)||0),0)}catch{return 0}};
const futureCategories=[
 {label:"Livros",icon:BookOpen},
 {label:"Terços",icon:Heart},
 {label:"Objetos para casa",icon:Home},
 {label:"Presentes",icon:Gift}
];

type Product={id:string;name:string;slug:string;description?:string|null;author?:string|null;category?:string|null;price_cents:number;stock?:number|null;image_url?:string|null;active?:boolean};

export function StoreCatalog({initialProducts,loadError}:{initialProducts:Product[];loadError?:string|null}){
 const params=useSearchParams();
 const initialCategory=params.get("categoria")||"";
 const [products]=useState<Product[]>(initialProducts),[q,setQ]=useState(""),[cat,setCat]=useState(initialCategory),[cartCount,setCartCount]=useState(0),[notifyState,setNotifyState]=useState<"idle"|"done"|"blocked">("idle");
 useEffect(()=>{const sync=()=>setCartCount(countCart());sync();window.addEventListener("agora-cart",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("agora-cart",sync);window.removeEventListener("storage",sync)}},[]);
 const cats=useMemo(()=>Array.from(new Set(products.map(x=>x.category).filter(Boolean) as string[])),[products]);
 useEffect(()=>{if(cat&&!cats.includes(cat))setCat("")},[cat,cats]);
 const list=products.filter(x=>(!q||`${x.name} ${x.description||""} ${x.author||""}`.toLowerCase().includes(q.toLowerCase()))&&(!cat||x.category===cat));
 const featured=products.find(p=>p.image_url)||products[0]||null;
 const catalogEmpty=!loadError&&products.length===0;
 const filteredEmpty=!loadError&&products.length>0&&list.length===0;
 const showCategories=cats.length>=2;
 async function notifyWhenOpen(){
  if(typeof window==="undefined"||!("Notification" in window)){setNotifyState("blocked");return}
  if(Notification.permission==="granted"){setNotifyState("done");return}
  const permission=await Notification.requestPermission();setNotifyState(permission==="granted"?"done":"blocked")
 }
 return <div className={shop.page}>
  <div className={shop.top}><div><span className={shop.eyebrow}>LOJA VINDE</span><h1>Escolhas com propósito.</h1><p>Livros, objetos e presentes para acompanhar a fé no dia a dia.</p></div><Link href="/carrinho" className={shop.cart} aria-label="Abrir carrinho"><ShoppingCart size={19}/>{cartCount>0&&<b>{cartCount>99?"99+":cartCount}</b>}</Link></div>
  {featured&&<Link href={`/loja/${featured.slug}`} className={shop.hero}><div className={shop.heroCopy}><small>DESTAQUE DA CURADORIA</small><h2>{featured.name}</h2><p>{featured.description||"Uma escolha especial da curadoria Vinde para estar mais perto do essencial."}</p><span className={shop.heroCta}>Ver produto <ArrowRight size={15}/></span></div><div className={shop.heroMedia}>{featured.image_url&&<img src={featured.image_url} alt={featured.name}/>}</div></Link>}
  <label className={shop.search}><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar livros, presentes e objetos de fé"/></label>
  {showCategories&&<><div className={shop.categoryHead}><h2>Explore por categoria</h2>{cat&&<button onClick={()=>setCat("")}>Limpar filtro</button>}</div><div className={shop.categories}><button className={`${shop.category} ${!cat?shop.active:""}`} onClick={()=>setCat("")}>Tudo</button>{cats.map(c=><button key={c} className={`${shop.category} ${cat===c?shop.active:""}`} onClick={()=>setCat(c)}>{c}</button>)}</div></>}
  {loadError?<section className={shop.emptyState}><span className={shop.emptyIcon}><AlertCircle size={22}/></span><div><small>LOJA VINDE</small><h2>Não foi possível carregar a curadoria</h2><p>O catálogo existe, mas houve uma falha ao consultar os produtos. Tente novamente em instantes.</p></div></section>:catalogEmpty?<>
   <section className={shop.emptyState}><span className={shop.emptyIcon}><Store size={22}/></span><div><small>LOJA VINDE</small><h2>Nossa loja está a caminho</h2><p>Estamos preparando uma curadoria de livros, objetos de fé e presentes com propósito.</p></div><button type="button" onClick={notifyWhenOpen}><BellRing size={16}/>{notifyState==="done"?"Aviso ativado":notifyState==="blocked"?"Ative notificações no navegador":"Avisar quando abrir"}</button></section>
   <section className={shop.future}><div className={shop.productsHead}><h2>O que vem por aí</h2><span>Em breve</span></div><div className={shop.futureGrid}>{futureCategories.map(({label,icon:Icon})=><div key={label}><span><Icon size={20}/></span><strong>{label}</strong></div>)}</div></section>
  </>:<>
   <div className={shop.productsHead}><h2>{cat||q?"Resultados":"Curadoria Vinde"}</h2><span>{list.length} {list.length===1?"item":"itens"}</span></div>
   {list.length?<section className={shop.grid}>{list.map(p=><Link href={`/loja/${p.slug}`} className={shop.product} key={p.id}><div className={shop.image}>{p.image_url&&<img src={p.image_url} alt={p.name}/>}<i className={shop.plus}><Plus size={16}/></i></div><div className={shop.productBody}><small>{p.category||"Curadoria"}</small><strong>{p.name}</strong><span>{brl(p.price_cents)}</span></div></Link>)}</section>:filteredEmpty?<div className={shop.searchEmpty}><Search size={20}/><strong>Nenhum produto encontrado</strong><p>Tente outro termo ou escolha uma categoria diferente.</p><button type="button" onClick={()=>{setQ("");setCat("")}}>Limpar busca</button></div>:null}
  </>}
 </div>
}

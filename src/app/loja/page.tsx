"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {ShoppingCart,Search,BookOpen,Gift,Church,Heart,Shirt,Sparkles} from "lucide-react";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import "./loja-reference.css";

type Product={id:string;name:string;slug:string;description?:string|null;author?:string|null;category?:string|null;price_cents:number;image_url?:string|null;active?:boolean};
const brl=(c:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const fallback="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=900&q=80";

export default function Loja(){
 const [products,setProducts]=useState<Product[]>([]),[q,setQ]=useState(""),[cat,setCat]=useState("");
 useEffect(()=>{getSupabase().from("products").select("*").eq("active",true).order("created_at",{ascending:false}).then(({data})=>setProducts((data||[]) as Product[]))},[]);
 const cats=useMemo(()=>Array.from(new Set(products.map(x=>x.category).filter((x):x is string=>Boolean(x)))),[products]);
 const list=products.filter(x=>(!q||`${x.name} ${x.description||""} ${x.author||""}`.toLowerCase().includes(q.toLowerCase()))&&(!cat||x.category===cat));
 const findCat=(needle:string)=>cats.find(c=>c.toLowerCase().includes(needle))||"";
 const vitrines=[{label:"Livros e Bíblias",sub:"Para aprofundar sua caminhada",icon:BookOpen,needle:"livr"},{label:"Terços e devoções",sub:"Para a oração de todos os dias",icon:Church,needle:"ter"},{label:"Presentes e sacramentos",sub:"Batizado, Crisma e Eucaristia",icon:Gift,needle:"present"},{label:"Vestuário",sub:"Expressões de fé para usar",icon:Shirt,needle:"vest"}];
 return <AppShell hideHeader><div className="product-page shop-ref">
  <header className="shop-ref-head"><div><span className="product-kicker">MARKETPLACE CATÓLICO</span><h1>Loja</h1></div><Link href="/carrinho" className="shop-cart" aria-label="Carrinho"><ShoppingCart/></Link></header>
  <section className="product-hero light"><span className="product-kicker">CURADORIA VINDE</span><h1>Escolhas que acompanham sua fé.</h1><p>Livros, artigos devocionais, presentes e produtos selecionados por vendedores parceiros.</p></section>
  <div className="product-toolbar"><div className="product-search"><Search size={19}/><input placeholder="Buscar livro, terço, presente..." value={q} onChange={e=>setQ(e.target.value)}/></div><select className="product-filter" value={cat} onChange={e=>setCat(e.target.value)}><option value="">Todas as categorias</option>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
  <section className="product-section"><div className="product-section-head"><div><span className="product-kicker">POR MOMENTO</span><h2>Encontre pelo que você está vivendo</h2></div></div><div className="store-vitrines">{vitrines.map(({label,sub,icon:Icon,needle})=><button className="store-vitrine" key={label} onClick={()=>setCat(findCat(needle))}><Icon/><div><strong>{label}</strong><small>{sub}</small></div></button>)}</div></section>
  <section className="product-section" id="produtos"><div className="product-section-head"><h2>{cat||q?"Resultados":"Escolhidos para você"}</h2><button onClick={()=>{setCat("");setQ("")}} style={{border:0,background:"transparent",fontWeight:800,color:"var(--vinde-green)"}}>Ver todos</button></div>{list.length?<div className="editorial-grid">{list.map(p=><Link href={`/loja/${p.slug}`} className="editorial-card" key={p.id}><div className="editorial-image" style={{backgroundImage:`url(${p.image_url||fallback})`}}><span className="editorial-badge">{p.category||"Vinde"}</span></div><div className="editorial-body"><h3>{p.name}</h3>{p.author&&<p>{p.author}</p>}<div className="editorial-meta"><span><Heart size={13}/> Salvar</span><span><Sparkles size={13}/> Parceiro verificado</span></div><div className="editorial-price">{brl(p.price_cents)}</div></div></Link>)}</div>:<div className="empty-state"><ShoppingCart size={28}/><h3>Nenhum produto encontrado.</h3><p>Tente outra busca ou categoria.</p></div>}</section>
  <div className="trust-strip"><Sparkles/><div><strong>Comércio com contexto.</strong><p>A loja aparece depois da fé e da comunidade: recomendações relacionadas ao momento litúrgico, sacramentos e interesses do usuário, sem transformar o app em vitrine invasiva.</p></div></div>
 </div></AppShell>;
}

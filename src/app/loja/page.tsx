// @ts-nocheck
"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {ShoppingCart,Search,Plus} from "lucide-react";
import {getSupabase} from "@/lib/supabase";
import styles from "@/app/vindeReference.module.css";
const KEY="agora-fide-cart";
const brl=(c:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const countCart=()=>{try{return (JSON.parse(localStorage.getItem(KEY)||"[]") as any[]).reduce((n,x)=>n+(Number(x.quantity)||0),0)}catch{return 0}};
export default function Loja(){
 const [products,setProducts]=useState<any[]>([]),[q,setQ]=useState(""),[cat,setCat]=useState(""),[cartCount,setCartCount]=useState(0);
 useEffect(()=>{getSupabase().from("products").select("*").eq("active",true).order("created_at",{ascending:false}).then(({data})=>setProducts(data||[]));const sync=()=>setCartCount(countCart());sync();window.addEventListener("agora-cart",sync);window.addEventListener("storage",sync);return()=>{window.removeEventListener("agora-cart",sync);window.removeEventListener("storage",sync)}},[]);
 const cats=useMemo(()=>Array.from(new Set(products.map(x=>x.category).filter(Boolean))),[products]);
 const list=products.filter(x=>(!q||`${x.name} ${x.description||""} ${x.author||""}`.toLowerCase().includes(q.toLowerCase()))&&(!cat||x.category===cat));
 return <AppShell><div className={styles.page}>
  <div className={styles.header}><div className={styles.title}><h1>Loja Vinde</h1><p>Escolhas para acompanhar sua fé.</p></div><Link href="/carrinho" className={styles.cartTop}><ShoppingCart size={19}/>{cartCount>0&&<b>{cartCount>99?"99+":cartCount}</b>}</Link></div>
  <div className={styles.search}><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar produtos"/></div>
  <div className={styles.chips}><button className={!cat?styles.active:""} onClick={()=>setCat("")}>Todos</button>{cats.map((c:any)=><button key={c} className={cat===c?styles.active:""} onClick={()=>setCat(c)}>{c}</button>)}</div>
  <div className={styles.sectionHead}><h2>Produtos</h2><span>{list.length} itens</span></div>
  {list.length?<section className={styles.products}>{list.map(p=><Link href={`/loja/${p.slug}`} className={styles.product} key={p.id}><div className={styles.productImg}><img src={p.image_url} alt={p.name}/></div><div className={styles.productBody}><strong>{p.name}</strong><span>{brl(p.price_cents)}</span><i className={styles.cartButton}><Plus size={17}/></i></div></Link>)}</section>:<div className={styles.empty}>Nenhum produto encontrado.</div>}
 </div></AppShell>
}

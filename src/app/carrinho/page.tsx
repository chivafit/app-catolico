"use client";
import "../cart-reference.css";
import Link from "next/link";
import Image from "next/image";
import {useEffect,useMemo,useState} from "react";
import {ArrowRight,Trash2,ShieldCheck,ShoppingBag,Truck} from "lucide-react";
import {AppShell} from "@/components/AppShell";
type Item={id:string;name:string;price_cents:number;quantity:number;image_url?:string};
const KEY="agora-fide-cart";
const brl=(c:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
export default function Carrinho(){
 const [items,setItems]=useState<Item[]>([]);const [notice,setNotice]=useState("");
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{setItems([])}},[]);
 function save(next:Item[]){setItems(next);localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event("agora-cart"))}
 const total=useMemo(()=>items.reduce((s,x)=>s+x.price_cents*x.quantity,0),[items]);
 const count=useMemo(()=>items.reduce((s,x)=>s+x.quantity,0),[items]);
 return <AppShell><div className="cart-ref">
  <section className="cart-ref-intro"><small>LOJA VINDE</small><h1>Sua seleção</h1><p>{count} {count===1?"item escolhido":"itens escolhidos"} para acompanhar sua caminhada.</p></section>
  {items.length?<>
   <div className="cart-ref-head"><h2>Itens do carrinho</h2><button onClick={()=>{save([]);setNotice("Carrinho limpo.")}}>Limpar</button></div>
   <div className="cart-ref-items">{items.map((item,i)=><div className="cart-ref-item" key={item.id}>
    <div className="cart-ref-image">{item.image_url?<Image src={item.image_url} alt={item.name} fill sizes="112px" loading={i===0?"eager":"lazy"} priority={i===0} unoptimized/>:<ShoppingBag size={34}/>}</div>
    <div className="cart-ref-info"><div className="cart-ref-name"><h3>{item.name}</h3><button aria-label={`Remover ${item.name}`} onClick={()=>save(items.filter(x=>x.id!==item.id))}>×</button></div><strong>{brl(item.price_cents)}</strong>
     <div className="cart-ref-actions"><div className="cart-ref-qty"><button aria-label={`Diminuir quantidade de ${item.name}`} onClick={()=>save(items.map(x=>x.id===item.id?{...x,quantity:Math.max(1,x.quantity-1)}:x))}>−</button><b>{item.quantity}</b><button aria-label={`Aumentar quantidade de ${item.name}`} onClick={()=>save(items.map(x=>x.id===item.id?{...x,quantity:x.quantity+1}:x))}>+</button></div><button className="cart-ref-trash" aria-label={`Excluir ${item.name}`} onClick={()=>save(items.filter(x=>x.id!==item.id))}><Trash2 size={17}/></button></div>
    </div></div>)}</div>
   <Link href="/loja" className="cart-ref-more">+ Continuar escolhendo</Link>
   <section className="cart-ref-summary"><div className="cart-ref-summary-title"><div className="cart-ref-summary-icon"><ShoppingBag size={19}/></div><div><small>RESUMO DO PEDIDO</small><h2>Seu pedido</h2></div></div><div><span>Subtotal</span><strong>{brl(total)}</strong></div><div><span className="cart-ref-freight"><Truck size={17}/> Frete</span><button onClick={()=>setNotice("O cálculo de frete será habilitado junto com o checkout.")}>Calcular</button></div><div className="cart-ref-divider"/><div className="cart-ref-total"><span>Total</span><strong>{brl(total)}</strong></div>{notice&&<p className="cart-ref-notice" role="status">{notice}</p>}<button className="cart-ref-checkout" onClick={()=>setNotice("Checkout financeiro ainda não está habilitado no piloto.")}>Finalizar compra <ArrowRight size={21}/></button><p className="cart-ref-secure"><ShieldCheck size={15}/> Compra segura dentro do Vinde</p></section>
  </>:<div className="cart-ref-empty"><div className="cart-ref-empty-icon"><ShoppingBag size={30}/></div><small>SEU CARRINHO</small><h2>Ainda não há itens por aqui.</h2><p>Explore nossa curadoria e encontre algo especial para sua caminhada de fé.</p><Link href="/loja">Explorar a loja <ArrowRight size={18}/></Link></div>}
 </div></AppShell>
}

"use client";
import {useState} from "react";import {ShoppingCart} from "lucide-react";
type Item={id:string;name:string;price_cents:number;quantity:number};
const KEY="agora-fide-cart";
export function CartAdd({id,name,price_cents}:{id:string;name:string;price_cents:number}){const [added,setAdded]=useState(false);function add(){const current:Item[]=JSON.parse(localStorage.getItem(KEY)||"[]");const found=current.find(x=>x.id===id);if(found)found.quantity+=1;else current.push({id,name,price_cents,quantity:1});localStorage.setItem(KEY,JSON.stringify(current));window.dispatchEvent(new Event("agora-cart"));setAdded(true);setTimeout(()=>setAdded(false),1400)}return <button className="cta" onClick={add}><ShoppingCart size={17}/>{added?"Adicionado ✓":"Adicionar ao carrinho"}</button>}

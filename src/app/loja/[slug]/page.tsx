import Link from "next/link";
import {notFound} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {ProductReference} from "@/components/ProductReference";
import {getSupabase} from "@/lib/supabase";
import {STORE_PRODUCT_SELECT} from "@/lib/store-products";
import {isServerFetchTimeout,withServerTimeout} from "@/lib/server-fetch";
import "@/app/product-reference.css";

function LoadError({timeout=false}:{timeout?:boolean}){
 return <AppShell><div className="card"><h2>{timeout?"O produto demorou demais para carregar":"Não foi possível carregar este produto"}</h2><p className="muted">{timeout?"Interrompemos o carregamento para evitar que a tela fique presa.":"Houve um problema ao consultar os dados do produto."}</p><Link className="cta secondary" href="/loja">Voltar para a Loja</Link></div></AppShell>
}

export default async function Produto({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 try{
  const result:any=await withServerTimeout(
   getSupabase().from("products").select(STORE_PRODUCT_SELECT).eq("slug",slug).eq("active",true).maybeSingle(),
   "product by slug"
  );
  if(result.error){
   console.error("[loja/detail] product query failed",{slug,error:result.error});
   return <LoadError/>;
  }
  const p=result.data;
  if(!p)notFound();
  return <AppShell><ProductReference p={p}/></AppShell>;
 }catch(error){
  console.error("[loja/detail] unexpected fetch failure",{slug,error});
  return <LoadError timeout={isServerFetchTimeout(error)}/>;
 }
}

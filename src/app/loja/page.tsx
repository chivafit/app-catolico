import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { brl, getProducts } from "@/lib/data";

export default async function Loja(){
  const products = await getProducts();
  return <AppShell>
    <div className="page-title"><div className="eyebrow">Livraria & marketplace</div><h1>Fé que acompanha sua casa.</h1><p className="muted">Livros, artigos devocionais e presentes selecionados.</p></div>
    <div className="section-head"><h2>Destaques</h2><Link href="/livros" className="muted">Ir para Livraria →</Link></div>
    <section className="grid two">{products.map((p)=><div className="card" key={p.id}><span className="tag">{p.category}</span><h2 style={{marginTop:14}}>{p.name}</h2><p className="muted">Vendido por parceiro verificado</p><p className="product-price">{brl(p.price_cents)}</p><button className="cta">Ver produto</button></div>)}</section>
  </AppShell>;
}

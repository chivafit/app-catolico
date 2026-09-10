import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {brl,getCampaigns,getEvents,getPilgrimages,shortDate} from "@/lib/data";

export default async function Explorar(){
  const [events,campaigns,pilgrimages]=await Promise.all([getEvents(),getCampaigns(),getPilgrimages()]);
  return <AppShell>
    <div className="page-title"><div className="eyebrow">Descobrir</div><h1>Viva experiências de fé.</h1><p className="muted">Eventos, campanhas, retiros e peregrinações em um só lugar.</p></div>
    <section className="grid">{events.slice(0,2).map((e)=><div className="card" key={e.id}><span className="tag">Evento</span><h2 style={{marginTop:14}}>{e.title}</h2><p className="muted">{shortDate(e.starts_at)} • {e.location||"local a confirmar"}</p><p className="product-price">{e.price_cents?brl(e.price_cents):"Gratuito"}</p></div>)}{pilgrimages.slice(0,1).map((p)=><div className="card" key={p.id}><span className="tag">Peregrinação</span><h2 style={{marginTop:14}}>{p.destination}</h2><p className="muted">{shortDate(p.starts_at)} • saída de {p.origin_city||"a confirmar"}</p><p className="product-price">{brl(p.price_cents)}</p><Link className="cta" href="/peregrinacoes">Ver peregrinações</Link></div>)}</section>
    <div className="section-head"><h2>Faça parte de algo maior</h2><Link href="/campanhas" className="muted">Ver campanhas →</Link></div>
    {campaigns.slice(0,1).map((c)=>{const pct=Math.min(100,Math.round(c.raised_cents/Math.max(1,c.goal_cents||1)*100));return <div className="card" key={c.id}><span className="tag">Campanha verificada</span><h2 style={{marginTop:14}}>{c.title}</h2><p className="muted">{c.description}</p><div className="progress"><span style={{width:`${pct}%`}}/></div><p><b>{pct}% alcançado</b></p><Link href="/campanhas" className="cta">Conhecer campanha</Link></div>})}
  </AppShell>;
}

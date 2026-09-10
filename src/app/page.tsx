import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {BookOpen,Heart,Bus,CalendarDays,ShoppingBag} from "lucide-react";
import {brl,getCampaigns,getEvents,getParish,getPilgrimages,getProducts,getTodayDevotional,shortDate} from "@/lib/data";

export default async function HomePage(){
  const [devotional,parish,events,campaigns,pilgrimages,products]=await Promise.all([getTodayDevotional(),getParish(),getEvents(),getCampaigns(),getPilgrimages(),getProducts()]);
  const campaign=campaigns[0]; const pilgrimage=pilgrimages[0]; const event=events[0];
  return <AppShell>
    <section className="hero">
      <div className="card hero-card"><div><div className="eyebrow">Seu encontro diário</div><h1 style={{marginTop:10}}>{devotional?.title||"Comece o dia com Deus."}</h1><p className="quote">{devotional?.reflection||"Evangelho, reflexão, oração e um propósito simples para levar a fé para a vida."}</p></div><div><span className="tag">Momento Diário • 4 min</span><p className="muted">Uma experiência curta para criar constância.</p><Link className="cta" href="/momento"><BookOpen size={17}/> Começar meu momento</Link></div></div>
      <div className="card"><div className="eyebrow">Minha igreja</div><h2 style={{marginTop:8}}>{parish?.name||"Escolha sua paróquia"}</h2><p className="muted">{parish?`${parish.city} • ${parish.state}`:"Vincule sua comunidade para ver horários e avisos."}</p><Link href="/igreja" className="cta secondary" style={{marginTop:18}}>Ver minha paróquia</Link></div>
    </section>
    <div className="section-head"><div><div className="eyebrow">Para você</div><h2>O que está acontecendo</h2></div><Link href="/explorar" className="muted">Explorar tudo →</Link></div>
    <section className="grid">
      {campaign&&<Link href="/campanhas" className="card"><div className="iconbox"><Heart size={20}/></div><span className="tag">Campanha verificada</span><h3 style={{marginTop:12}}>{campaign.title}</h3><p className="muted">{campaign.description}</p></Link>}
      {pilgrimage&&<Link href="/peregrinacoes" className="card"><div className="iconbox"><Bus size={20}/></div><span className="tag">Peregrinação</span><h3 style={{marginTop:12}}>{pilgrimage.destination}</h3><p className="muted">{shortDate(pilgrimage.starts_at)} • saída de {pilgrimage.origin_city||"a confirmar"}</p><p className="product-price">{brl(pilgrimage.price_cents)}</p></Link>}
      {event&&<Link href="/explorar" className="card"><div className="iconbox"><CalendarDays size={20}/></div><span className="tag">Evento</span><h3 style={{marginTop:12}}>{event.title}</h3><p className="muted">{shortDate(event.starts_at)} • {event.location||"local a confirmar"}</p><b>{event.price_cents?brl(event.price_cents):"Gratuito"}</b></Link>}
    </section>
    <div className="section-head"><div><div className="eyebrow">Livraria</div><h2>Continue se aprofundando</h2></div><Link href="/loja" className="muted">Ver tudo →</Link></div>
    <section className="grid">{products.slice(0,3).map((p)=><Link href="/loja" className="card" key={p.id}><div className="iconbox"><ShoppingBag size={20}/></div><span className="pill">{p.category}</span><h3 style={{marginTop:14}}>{p.name}</h3><p className="product-price">{brl(p.price_cents)}</p></Link>)}</section>
  </AppShell>;
}

import {AppShell} from "@/components/AppShell";
import {brl,getCampaigns} from "@/lib/data";
import {Heart,ShieldCheck,ReceiptText,Share2} from "lucide-react";
import {ShareButton} from "@/components/ShareButton";

const fallback="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=82";

export default async function Campanhas(){
 const campaigns=await getCampaigns();
 return <AppShell><div className="product-page">
  <section className="product-hero light"><span className="product-kicker">CAMPANHAS VERIFICADAS</span><h1>Ajude com confiança e transparência.</h1><p>Conheça iniciativas de paróquias, comunidades e projetos sociais e acompanhe o progresso de cada causa.</p></section>
  <div className="trust-strip"><ShieldCheck/><div><strong>Instituições verificadas.</strong><p>Campanhas exibem responsável, meta, atualizações e histórico. A contribuição financeira permanece bloqueada até a integração segura de pagamentos e repasses.</p></div></div>
  <section className="product-section"><div className="product-section-head"><h2>Campanhas ativas</h2><span>{campaigns.length} publicada{campaigns.length===1?"":"s"}</span></div>{campaigns.length?<div className="editorial-grid">{campaigns.map(c=>{const pct=Math.min(100,Math.round(Number(c.raised_cents||0)/Math.max(1,Number(c.goal_cents||1))*100));return <article className="editorial-card campaign-card" key={c.id}><div className="editorial-image" style={{backgroundImage:`url(${c.image_url||fallback})`}}>{c.verified&&<span className="editorial-badge"><ShieldCheck size={11}/> VERIFICADA</span>}</div><div className="editorial-body"><h3>{c.title}</h3>{c.institution_name&&<p><strong>{c.institution_name}</strong></p>}<p>{c.description}</p><div className="campaign-progress"><span style={{width:`${pct}%`}}/></div><div className="campaign-numbers"><span><strong>{pct}%</strong> alcançado</span><span>{brl(Number(c.raised_cents||0))} de {brl(Number(c.goal_cents||0))}</span></div>{c.deadline&&<div className="editorial-meta"><span>Prazo: {new Date(c.deadline).toLocaleDateString("pt-BR")}</span></div>}{Array.isArray(c.updates)&&c.updates.length>0&&<div className="trust-strip" style={{marginTop:8}}><ReceiptText size={18}/><div><strong>Última atualização</strong><p>{typeof c.updates[0]==="string"?c.updates[0]:c.updates[0]?.text||c.updates[0]?.title}</p></div></div>}<div className="actions"><button className="cta" disabled>Contribuições em breve</button><ShareButton title={c.title}/></div></div></article>})}</div>:<div className="empty-state"><Heart size={28}/><h3>Nenhuma campanha ativa.</h3><p>Quando uma instituição publicar uma nova causa, ela aparecerá aqui.</p></div>}</section>
  <div className="trust-strip"><Share2/><div><strong>Compartilhar também ajuda.</strong><p>Mesmo antes do checkout, cada campanha pode circular por WhatsApp e redes, ampliando o alcance da instituição responsável.</p></div></div>
 </div></AppShell>;
}

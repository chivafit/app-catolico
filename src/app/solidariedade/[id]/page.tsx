import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {ShareButton} from "@/components/ShareButton";
import {getSupabase} from "@/lib/supabase";
import {isServerFetchTimeout,withServerTimeout} from "@/lib/server-fetch";
import {ShieldCheck,MapPin,Phone,MessageCircle,Globe2,Mail,ExternalLink,HandHeart,AlertCircle,ArrowRight} from "lucide-react";
import "../solidarity-reference.css";

function ErrorState({title,description}:{title:string;description:string}){
 return <AppShell><div className="solidarity-detail"><div className="solidarity-empty"><span className="solidarity-empty-icon"><AlertCircle size={22}/></span><div><strong>{title}</strong><p>{description}</p></div><Link className="cta secondary" href="/solidariedade">Voltar para Solidariedade <ArrowRight size={16}/></Link></div></div></AppShell>
}

export default async function SolidarityDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const s=getSupabase();
 let item:any=null;
 try{
  const result:any=await withServerTimeout(
   s.from("charity_institutions").select("*").eq("id",id).eq("active",true).maybeSingle(),
   "charity institution by id"
  );
  if(result.error){
   console.error("[solidariedade/detail] institution query failed",{id,error:result.error});
   return <ErrorState title="Não foi possível carregar esta instituição" description="Houve um problema ao consultar os dados da instituição. Tente novamente em instantes."/>;
  }
  item=result.data||null;
  if(!item){
   return <ErrorState title="Instituição não encontrada" description="Este perfil pode ter sido removido, atualizado ou ainda não está ativo no Vinde."/>;
  }
 }catch(error){
  console.error("[solidariedade/detail] unexpected fetch failure",{id,error});
  return <ErrorState title={isServerFetchTimeout(error)?"A instituição demorou demais para carregar":"Não foi possível carregar esta instituição"} description={isServerFetchTimeout(error)?"Interrompemos o carregamento para evitar que a tela fique presa. Tente novamente ou volte para a lista de instituições.":"Ocorreu um erro inesperado ao carregar este perfil. Tente novamente em instantes."}/>;
 }

 return <AppShell><div className="solidarity-detail"><section className="solidarity-detail-head">{item.verified&&<span className="badge"><ShieldCheck size={13}/> Instituição verificada</span>}<h1>{item.name}</h1><p>{item.cause}</p><p>{item.description}</p></section><section className="solidarity-detail-section"><h2>Como você pode ajudar</h2><div style={{display:"flex",gap:9,alignItems:"flex-start"}}><HandHeart size={20} style={{color:"#536159",flex:"0 0 auto"}}/><p style={{margin:0}}>{item.donation_note||"Entre em contato diretamente com a instituição para conhecer as necessidades atuais, campanhas e oportunidades de voluntariado."}</p></div></section>{item.address&&<section className="solidarity-detail-section"><h2>Onde fica</h2><p style={{display:"flex",gap:7,alignItems:"flex-start"}}><MapPin size={16}/>{item.address}</p></section>}<section className="solidarity-detail-section"><h2>Fale com a instituição</h2><div className="solidarity-contact-grid">{item.phone&&<a href={`tel:${item.phone}`}><Phone/>Ligar</a>}{item.whatsapp&&<a href={`https://wa.me/55${String(item.whatsapp).replace(/\D/g,"")}`} target="_blank" rel="noreferrer"><MessageCircle/>WhatsApp</a>}{item.email&&<a href={`mailto:${item.email}`}><Mail/>E-mail</a>}{item.website&&<a href={item.website} target="_blank" rel="noreferrer"><Globe2/>Site</a>}</div>{!item.phone&&!item.whatsapp&&!item.email&&!item.website&&<p>Os canais diretos ainda não foram cadastrados. Consulte a fonte pública abaixo para informações atualizadas.</p>}</section><section className="solidarity-detail-section"><h2>Transparência</h2><p>O Vinde não altera dados bancários de instituições nem intermedeia doações financeiras nesta etapa. Confirme qualquer chave PIX, conta ou campanha diretamente com a entidade antes de contribuir.</p>{item.source_url&&<a href={item.source_url} target="_blank" rel="noreferrer" className="solidarity-source">Ver fonte de verificação <ExternalLink size={12}/></a>}</section><div style={{marginTop:14}}><ShareButton title={`${item.name} — Solidariedade no Vinde`}/></div></div></AppShell>
}

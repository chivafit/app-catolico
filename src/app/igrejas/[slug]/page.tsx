import Link from "next/link";
import {notFound} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {ParishFollowButton} from "@/components/ParishFollowButton";
import {getSupabase} from "@/lib/supabase";
import {isServerFetchTimeout,withServerTimeout} from "@/lib/server-fetch";
const week=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const serviceNames:Record<string,string>={confession:"Confissão",adoration:"Adoração",celebration:"Celebração especial",secretary:"Secretaria"};

function LoadError({timeout=false}:{timeout?:boolean}){
 return <AppShell><div className="card"><h2>{timeout?"A igreja demorou demais para carregar":"Não foi possível carregar esta igreja"}</h2><p className="muted">{timeout?"Interrompemos o carregamento para evitar que a tela fique presa.":"Houve um problema ao consultar os dados desta comunidade."}</p><Link href="/explorar" className="cta secondary">← Voltar para Explorar</Link></div></AppShell>
}

export default async function IgrejaPublica({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const s=getSupabase();
 try{
  const parishResult:any=await withServerTimeout(s.from("parishes").select("*,dioceses(name)").eq("slug",slug).maybeSingle(),"parish by slug");
  if(parishResult.error){
   console.error("[igrejas/detail] parish query failed",{slug,error:parishResult.error});
   return <LoadError/>;
  }
  const p=parishResult.data;
  if(!p)notFound();
  const [massResult,serviceResult,postResult,eventResult]:any[]=await Promise.all([
   withServerTimeout(s.from("mass_schedules").select("*").eq("parish_id",p.id).eq("active",true).order("weekday").order("starts_at"),"parish mass schedules"),
   withServerTimeout(s.from("parish_service_schedules").select("*").eq("parish_id",p.id).eq("active",true).order("service_type").order("weekday"),"parish service schedules"),
   withServerTimeout(s.from("parish_posts").select("*").eq("parish_id",p.id).not("published_at","is",null).order("published_at",{ascending:false}).limit(4),"parish posts"),
   withServerTimeout(s.from("events").select("*").eq("parish_id",p.id).eq("status","published").order("starts_at").limit(4),"parish events")
  ]);
  const secondaryError=[massResult,serviceResult,postResult,eventResult].find(x=>x?.error)?.error;
  if(secondaryError)console.error("[igrejas/detail] secondary query failed",{slug,parishId:p.id,error:secondaryError});
  const m=massResult?.data||[],svc=serviceResult?.data||[],posts=postResult?.data||[],events=eventResult?.data||[];
  return <AppShell><div className="store-banner"><div className="eyebrow">Igreja</div><h1 style={{color:"white",marginTop:6}}>{p.name}</h1><p className="tiny">{p.city} • {p.state}{p.dioceses?.name?` • ${p.dioceses.name}`:""}</p>{p.description&&<p>{p.description}</p>}<ParishFollowButton parishId={p.id}/></div><div className="section-head"><h2>Horários de Missa</h2></div><div className="card list">{m.length?m.map((x:any)=><div className="row" key={x.id}><span>{week[x.weekday]}{x.label?` • ${x.label}`:""}</span><b>{String(x.starts_at).slice(0,5)}</b></div>):<p className="muted">Nenhum horário publicado.</p>}</div>{svc.length?<><div className="section-head"><h2>Confissão e celebrações</h2></div><div className="card list">{svc.map((x:any)=><div className="row" key={x.id}><span>{serviceNames[x.service_type]||x.service_type}<small>{week[x.weekday]}{x.label?` • ${x.label}`:""}</small></span><b>{x.starts_at?String(x.starts_at).slice(0,5):"—"}</b></div>)}</div></>:null}<div className="section-head"><h2>Contato</h2></div><div className="card list">{p.address&&<div className="row"><span>{p.address}</span>{p.maps_url&&<a className="cta secondary" href={p.maps_url} target="_blank" rel="noreferrer">Como chegar</a>}</div>}{p.phone&&<div className="row"><span>{p.phone}</span><a className="cta secondary" href={`tel:${p.phone}`}>Ligar</a></div>}{p.whatsapp&&<div className="row"><span>WhatsApp</span><a className="cta secondary" href={`https://wa.me/${String(p.whatsapp).replace(/\D/g,"")}`} target="_blank" rel="noreferrer">Abrir</a></div>}{p.website&&<div className="row"><span>Site oficial</span><a className="cta secondary" href={p.website} target="_blank" rel="noreferrer">Visitar</a></div>}</div>{posts.length?<><div className="section-head"><h2>Avisos</h2></div><div className="card list">{posts.map((x:any)=><div className="row" key={x.id}><span><b>{x.title}</b><small>{x.body}</small></span></div>)}</div></>:null}{events.length?<><div className="section-head"><h2>Próximos eventos</h2></div><div className="card list">{events.map((x:any)=><div className="row" key={x.id}><span><b>{x.title}</b><small>{x.location}</small></span><b>{new Date(x.starts_at).toLocaleDateString("pt-BR")}</b></div>)}</div></>:null}<div style={{marginTop:18}}><Link href="/explorar" className="cta secondary">← Voltar para Explorar</Link></div></AppShell>;
 }catch(error){
  console.error("[igrejas/detail] unexpected fetch failure",{slug,error});
  return <LoadError timeout={isServerFetchTimeout(error)}/>;
 }
}

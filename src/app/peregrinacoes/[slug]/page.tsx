// @ts-nocheck
import "./destination.css";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {PilgrimageCheckout} from "@/components/PilgrimageCheckout";
import {EntityFavorite} from "@/components/EntityFavorite";
import {ShareButton} from "@/components/ShareButton";
import {getSupabase} from "@/lib/supabase";
import {BookOpen,Bus,CalendarDays,Check,Church,Clock3,CreditCard,Heart,MapPin,Plane,ShieldCheck,Sparkles,X,AlertCircle,ArrowRight} from "lucide-react";

const brl=(c:number|null)=>c==null?"Sob consulta":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);
const fallback="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1500&q=85";
const FETCH_TIMEOUT_MS=9000;

async function withTimeout<T>(promise:PromiseLike<T>,label:string):Promise<T>{
 let timer:any;
 try{
  return await Promise.race([
   Promise.resolve(promise),
   new Promise<T>((_,reject)=>{timer=setTimeout(()=>reject(new Error(`${label}: timeout`)),FETCH_TIMEOUT_MS)})
  ]);
 }finally{clearTimeout(timer)}
}

function ErrorState({title,description}:{title:string;description:string}){
 return <AppShell><div className="dest-error-state"><span><AlertCircle size={22}/></span><h1>{title}</h1><p>{description}</p><Link href="/peregrinacoes">Ver outras peregrinações <ArrowRight size={16}/></Link></div></AppShell>
}

export default async function DestinationPage({params,searchParams}:{params:Promise<{slug:string}>,searchParams:Promise<{trip?:string}>}){
 const {slug}=await params;
 const {trip:selectedTripId}=await searchParams;
 const s=getSupabase();
 let destination:any=null;
 let trips:any[]=[];
 let requestedTrip:any=null;

 try{
  if(selectedTripId){
   const tripResult:any=await withTimeout(
    s.from("pilgrimages").select("*,travel_organizers(name,verified)").eq("id",selectedTripId).eq("status","published").maybeSingle(),
    "pilgrimage by id"
   );
   if(tripResult.error){
    console.error("[peregrinacoes/detail] trip query failed",{trip:selectedTripId,error:tripResult.error});
    return <ErrorState title="Não foi possível carregar esta viagem" description="Houve um problema ao consultar os dados da peregrinação. Tente novamente ou veja outras saídas disponíveis."/>;
   }
   requestedTrip=tripResult.data||null;
   if(!requestedTrip){
    return <ErrorState title="Viagem não encontrada" description="Esta saída pode ter sido removida, expirado ou ainda não está publicada."/>;
   }
  }

  const destinationResult:any=requestedTrip?.destination_id
   ? await withTimeout(s.from("pilgrimage_destinations").select("*").eq("id",requestedTrip.destination_id).maybeSingle(),"destination by id")
   : await withTimeout(s.from("pilgrimage_destinations").select("*").eq("slug",slug).maybeSingle(),"destination by slug");

  if(destinationResult.error){
   console.error("[peregrinacoes/detail] destination query failed",{slug,trip:selectedTripId,error:destinationResult.error});
   return <ErrorState title="Não foi possível carregar o destino" description="A conexão com os dados da peregrinação falhou. Tente novamente em instantes."/>;
  }
  destination=destinationResult.data||null;
  if(!destination){
   return <ErrorState title="Destino não encontrado" description="Este destino não está disponível no momento."/>;
  }

  const tripsResult:any=await withTimeout(
   s.from("pilgrimages").select("*,travel_organizers(name,verified)").eq("destination_id",destination.id).eq("status","published").order("starts_at"),
   "destination trips"
  );
  if(tripsResult.error){
   console.error("[peregrinacoes/detail] trips query failed",{destinationId:destination.id,error:tripsResult.error});
   return <ErrorState title="Não foi possível carregar as saídas" description="O destino foi encontrado, mas as viagens não puderam ser consultadas agora."/>;
  }
  trips=tripsResult.data||[];
  if(requestedTrip&&!trips.some(t=>t.id===requestedTrip.id))trips=[requestedTrip,...trips];
 }catch(error){
  console.error("[peregrinacoes/detail] unexpected fetch failure",{slug,trip:selectedTripId,error});
  return <ErrorState title="A viagem demorou demais para carregar" description="Interrompemos o carregamento para evitar que a tela fique presa. Tente novamente ou veja outras peregrinações."/>;
 }

 const selected=requestedTrip||trips[0]||null;
 const practical=destination.practical_info||{};
 const highlights=Array.isArray(destination.highlights)?destination.highlights:[];
 const spiritual=Array.isArray(destination.spiritual_experience)?destination.spiritual_experience:[];

 return <AppShell><div className="dest-page"><section className="dest-hero" style={{backgroundImage:`url(${destination.hero_image_url||fallback})`}}><div className="dest-hero-overlay"/><div className="dest-hero-content"><span className="dest-chip">{destination.category==="international"?"PEREGRINAÇÃO INTERNACIONAL":"PEREGRINAÇÃO NO BRASIL"}</span><h1>{destination.name}</h1><p><MapPin size={14}/>{destination.region?`${destination.region} • `:""}{destination.country}</p></div></section><section className="dest-intro"><div className="dest-intro-top"><div><span className="dest-eyebrow">DESTINO DE FÉ</span><h2>Conheça antes de partir</h2></div><div className="dest-actions"><EntityFavorite type="pilgrimage_destination" id={destination.id}/><ShareButton title={destination.name}/></div></div><p>{destination.summary}</p></section><section className="dest-dark-card"><Church/><div><span>POR QUE PEREGRINAR AQUI</span><h2>Um lugar com significado para a fé católica</h2><p>{destination.catholic_significance}</p></div></section><section className="dest-section"><div className="dest-section-title"><Sparkles/><div><span>EXPERIÊNCIA ESPIRITUAL</span><h2>O que viver durante a peregrinação</h2></div></div><div className="dest-list">{spiritual.map((x:string)=><div key={x}><Check/>{x}</div>)}</div></section><section className="dest-section dest-sand"><div className="dest-section-title"><MapPin/><div><span>LUGARES ESSENCIAIS</span><h2>O que conhecer</h2></div></div><div className="dest-highlight-grid">{highlights.map((x:string,i:number)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div></section><section className="dest-section"><div className="dest-section-title"><BookOpen/><div><span>ANTES DE VIAJAR</span><h2>Informações práticas</h2></div></div><div className="dest-practical"><div><small>Duração ideal</small><strong>{practical.ideal_days||"Conforme o roteiro"}</strong></div><div><small>Perfil</small><strong>{practical.profile||"Peregrinos e grupos de fé"}</strong></div><div><small>Idioma</small><strong>{practical.language||"Conforme o destino"}</strong></div></div></section><section className="dest-trip-section"><div className="dest-trip-heading"><div><span>VIAGENS NO VINDE</span><h2>{trips.length?"Escolha sua próxima saída":"Próximas saídas em preparação"}</h2></div><ShieldCheck/></div>{trips.length?trips.map(t=>{const organizer=Array.isArray(t.travel_organizers)?t.travel_organizers[0]:t.travel_organizers;return <article className={`dest-trip-card ${selected?.id===t.id?"selected":""}`} key={t.id}><div className="dest-trip-top"><div><span className="dest-trip-status">{organizer?.verified?"ORGANIZADOR VERIFICADO":"PRÉ-LANÇAMENTO VINDE"}</span><h3>{t.title}</h3></div><div className="dest-trip-price"><small>a partir de</small><strong>{brl(t.price_cents)}</strong><small>por pessoa</small></div></div><div className="dest-trip-facts"><span><CalendarDays/>{new Date(t.starts_at).toLocaleDateString("pt-BR")}</span><span><Clock3/>{t.duration_days||"—"} dias</span><span>{t.transport_type==="air"?<Plane/>:<Bus/>}{t.transport_type==="air"?"Aéreo":"Ônibus"}</span><span><MapPin/>Saída de {t.origin_city}</span></div>{t.spiritual_guide&&<div className="dest-spiritual-guide"><Church/><p><strong>Experiência espiritual</strong>{t.spiritual_guide}</p></div>}<div className="dest-info-grid"><div><small>Hospedagem</small><p>{t.accommodation||"Conforme roteiro"}</p></div><div><small>Alimentação</small><p>{t.meals||"Conforme roteiro"}</p></div><div><small>Embarque</small><p>{t.departure_details||"Informações após a reserva"}</p></div><div><small>Vagas</small><p>{t.available_spots==null?"A confirmar":`${t.available_spots} disponíveis`}</p></div></div>{t.itinerary&&<div className="dest-itinerary"><span>ROTEIRO</span><p>{t.itinerary}</p></div>}<div className="dest-inc-grid"><div><h4><Check/> Inclui</h4>{(t.includes||[]).map((x:string)=><p key={x}>{x}</p>)}</div><div><h4><X/> Não inclui</h4>{(t.excludes||[]).map((x:string)=><p key={x}>{x}</p>)}</div></div><section className="dest-payment-summary"><CreditCard/><div><span>PAGAMENTO 100% PELO VINDE</span><h4>Pix e cartão dentro do app</h4><p>{t.payment_notes||"Você escolhe a forma de pagamento e acompanha comprovantes e reserva pelo aplicativo."}</p>{t.installments_max>1&&<small>Cartão em até {t.installments_max}x {t.pix_discount_percent?`• Pix com ${t.pix_discount_percent}% de desconto`:""}</small>}</div></section>{t.cancellation_policy&&<p className="dest-policy">{t.cancellation_policy}</p>}{selected?.id===t.id&&<PilgrimageCheckout trip={t}/>}</article>}) : <div className="dest-empty-trip"><Heart/><h3>Este destino já está no Vinde.</h3><p>Estamos preparando saídas, valores e condições. Assim que uma viagem for publicada, reserva e pagamento aparecerão aqui dentro do app.</p></div>}</section></div></AppShell>
}

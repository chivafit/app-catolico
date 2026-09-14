"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {getSupabase} from "@/lib/supabase";
import {HeartHandshake,ShieldCheck,MapPin,Search,ArrowRight,HandHeart,Package,Users,Church,Heart,PlusCircle} from "lucide-react";
import "./solidarity-reference.css";

const norm=(v:string)=>(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const filters=["Todas","Crianças","Idosos","Saúde","Famílias","Igreja"];
function matchesFilter(x:any,f:string){const s=norm(`${x.name} ${x.cause||""} ${x.description||""}`);if(f==="Todas")return true;if(f==="Crianças")return /crianca|adolesc/.test(s);if(f==="Idosos")return /idos|velhin/.test(s);if(f==="Saúde")return /cancer|oncolog|reabilit|deficien/.test(s);if(f==="Famílias")return /famil|acolhimento|assistencia social/.test(s);if(f==="Igreja")return /paroquia|catolic|igreja|obras sociais/.test(s);return true}
export default function Solidariedade(){
 const [items,setItems]=useState<any[]>([]),[q,setQ]=useState(""),[filter,setFilter]=useState("Todas"),[loading,setLoading]=useState(true),[error,setError]=useState(""),[showSuggest,setShowSuggest]=useState(false);
 useEffect(()=>{getSupabase().from("charity_institutions").select("*").eq("active",true).order("name").then(({data,error})=>{if(error)setError(error.message);setItems(data||[]);setLoading(false)})},[]);
 const list=useMemo(()=>items.filter(x=>matchesFilter(x,filter)&&(!q||norm(`${x.name} ${x.cause||""} ${x.description||""}`).includes(norm(q)))),[items,q,filter]);
 const featured=items.find(x=>norm(x.name).includes("obras sociais da paroquia"))||items.find(x=>x.verified)||items[0];
 const hasInstitutions=items.length>0;
 return <AppShell><div className="solidarity-ref">
  <section className="solidarity-hero"><div><span>SOLIDARIEDADE NO VINDE</span><h1>Um jeito simples de ajudar quem já cuida de Piumhi.</h1><p>Encontre instituições locais verificadas, entenda a causa de cada uma e veja formas seguras de colaborar.</p></div><HeartHandshake/></section>
  <section className="solidarity-trust"><ShieldCheck/><div><b>Transparência em primeiro lugar</b><span>Perfis cadastrados a partir de fontes públicas e canais institucionais. Para doações em dinheiro, confirme sempre os dados diretamente com a entidade.</span></div></section>
  <div className="solidarity-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar instituição ou causa..." disabled={!loading&&!hasInstitutions}/></div>
  {!loading&&hasInstitutions&&<div className="solidarity-chips">{filters.map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div>}
  {featured&&<section className="solidarity-featured"><div className="solidarity-feature-icon"><Church/></div><div><span>DESTAQUE DA COMUNIDADE</span><h2>{featured.name}</h2><p>{featured.description}</p><Link href={`/solidariedade/${featured.id}`}>Conhecer instituição <ArrowRight size={15}/></Link></div></section>}
  <section className="solidarity-ways"><div className="solidarity-section-title"><span>COMO AJUDAR</span><h2>Ajuda vai muito além de dinheiro</h2></div><div className="solidarity-way-grid"><div><Package/><b>Doar itens</b><span>Alimentos, roupas, higiene e materiais.</span></div><div><Users/><b>Ser voluntário</b><span>Tempo, serviço e presença também transformam.</span></div><div><HandHeart/><b>Apoiar uma causa</b><span>Conheça campanhas e necessidades atuais.</span></div><div><Heart/><b>Compartilhar</b><span>Ajude a ampliar a rede de apoio.</span></div></div></section>
  <div className="solidarity-section-title list-title"><span>INSTITUIÇÕES EM PIUMHI</span>{!loading&&!error&&hasInstitutions&&<h2>{list.length} {list.length===1?"instituição":"instituições"} para conhecer e apoiar</h2>}</div>
  {loading?<div className="solidarity-loading">Carregando instituições…</div>:error?<div className="solidarity-error">Não foi possível carregar as instituições agora.</div>:!hasInstitutions?<div className="solidarity-empty"><span className="solidarity-empty-icon"><HeartHandshake size={22}/></span><div><strong>Estamos mapeando instituições locais</strong><p>Novos perfis verificados aparecerão aqui assim que forem cadastrados.</p></div><button type="button" onClick={()=>setShowSuggest(v=>!v)}><PlusCircle size={15}/>Indicar uma instituição</button>{showSuggest&&<small>Envie o nome e os dados públicos da instituição pelo canal de contato oficial do Vinde.</small>}</div>:<div className="solidarity-list">{list.map(x=><Link href={`/solidariedade/${x.id}`} className="solidarity-card" key={x.id}><div className="solidarity-card-top"><div className="solidarity-card-icon"><HeartHandshake/></div>{x.verified&&<span className="solidarity-verified"><ShieldCheck size={12}/> Verificada</span>}</div><h3>{x.name}</h3>{x.cause&&<p className="solidarity-cause">{x.cause}</p>}<p className="solidarity-desc">{x.description}</p>{x.address&&<p className="solidarity-address"><MapPin size={14}/>{x.address}</p>}<div className="solidarity-card-bottom"><span>Ver formas de ajudar</span><ArrowRight size={16}/></div></Link>)}{!list.length&&<div className="solidarity-empty compact"><span className="solidarity-empty-icon"><Search size={20}/></span><div><strong>Nenhuma instituição encontrada</strong><p>Tente outro termo ou escolha uma causa diferente.</p></div><button type="button" onClick={()=>{setQ("");setFilter("Todas")}}>Limpar busca</button></div>}</div>}
 </div></AppShell>
}

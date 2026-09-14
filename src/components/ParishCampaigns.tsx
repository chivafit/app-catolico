"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {useAuth} from "@/components/AuthProvider";
import {getSupabase} from "@/lib/supabase";
import {Apple,Shirt,Gift,TreePine,Backpack,HeartHandshake,MapPin,ChevronDown,ShieldCheck,CalendarDays,Heart,ArrowRight} from "lucide-react";
import styles from "@/app/campanhas/campanhas.module.css";

const brl=(c:number|null|undefined)=>c==null?"":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c/100);

const baseCampaigns=[
 {key:"quilo",title:"Campanha do Quilo",subtitle:"Cestas básicas e alimentos",icon:Apple,tag:"Ação permanente",description:"Arrecadação de alimentos não perecíveis para montagem de cestas básicas destinadas a famílias acompanhadas pela comunidade.",items:["Arroz, feijão e macarrão","Óleo, açúcar e café","Leite, farinha e enlatados","Itens dentro do prazo de validade"]},
 {key:"agasalho",title:"Campanha do Agasalho",subtitle:"Roupas, cobertores e calçados",icon:Shirt,tag:"Inverno solidário",description:"Mobilização para receber peças em bom estado e proteger famílias, idosos e pessoas em situação de vulnerabilidade nos meses mais frios.",items:["Agasalhos e moletons","Cobertores e mantas","Calçados em bom estado","Roupas infantis e adultas"]},
 {key:"criancas",title:"Dia das Crianças",subtitle:"Brinquedos e kits infantis",icon:Gift,tag:"Ação sazonal",description:"Arrecadação de brinquedos e itens para preparar um dia especial para crianças atendidas pelas ações sociais da paróquia.",items:["Brinquedos novos ou bem conservados","Livros e materiais de desenho","Doces e itens para kits","Embalagens para presentes"]},
 {key:"natal",title:"Natal Solidário",subtitle:"Ceia, cestas e presentes",icon:TreePine,tag:"Fim de ano",description:"Uma corrente de cuidado para que famílias da comunidade possam celebrar o Natal com dignidade, alimento e afeto.",items:["Cestas de alimentos","Itens para ceia de Natal","Panetones e doces","Presentes para crianças"]},
 {key:"escolar",title:"Material Escolar",subtitle:"Volta às aulas com dignidade",icon:Backpack,tag:"Volta às aulas",description:"Campanha para montar kits escolares e apoiar crianças e adolescentes no início do ano letivo.",items:["Cadernos e lápis","Canetas, borrachas e apontadores","Mochilas e estojos","Lápis de cor e materiais de arte"]},
 {key:"higiene",title:"Higiene e Dignidade",subtitle:"Cuidados essenciais",icon:HeartHandshake,tag:"Ação permanente",description:"Arrecadação de produtos básicos de higiene pessoal e limpeza para famílias e instituições acompanhadas pela comunidade.",items:["Sabonete, shampoo e creme dental","Absorventes e fraldas","Papel higiênico","Sabão e produtos de limpeza"]}
];

type Parish={id:string;name:string;city?:string|null;state?:string|null};

export function ParishCampaigns(){
 const {profile,loading:authLoading}=useAuth();
 const [parishes,setParishes]=useState<Parish[]>([]),[selectedId,setSelectedId]=useState(""),[campaigns,setCampaigns]=useState<any[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;(async()=>{const s=getSupabase();const {data}=await s.from("parishes").select("id,name,city,state").order("name");if(!active)return;const rows=(data||[]) as Parish[];setParishes(rows);const stored=typeof window!=="undefined"?localStorage.getItem("vinde-parish-id")||"":"";const preferred=profile?.primary_parish_id||stored||rows[0]?.id||"";setSelectedId(preferred)})();return()=>{active=false}},[profile?.primary_parish_id]);
 useEffect(()=>{if(authLoading||!selectedId)return;let active=true;(async()=>{setLoading(true);const {data,error}=await getSupabase().from("campaigns").select("*").eq("parish_id",selectedId).eq("status","published").order("created_at",{ascending:false});if(active){setCampaigns(error?[]:(data||[]));setLoading(false);if(typeof window!=="undefined")localStorage.setItem("vinde-parish-id",selectedId)}})();return()=>{active=false}},[selectedId,authLoading]);
 const selected=parishes.find(p=>p.id===selectedId)||null;
 const location=selected?[selected.city,selected.state].filter(Boolean).join("/"):"";
 const realCampaigns=useMemo(()=>campaigns.filter(Boolean),[campaigns]);
 return <AppShell><div className={styles.page}>
  <section className={styles.hero}><span>VIDA EM COMUNIDADE</span><h1>Campanhas que transformam cuidado em ação.</h1><p>Arrecadações e mobilizações organizadas pelas paróquias para atender necessidades reais da comunidade.</p></section>

  {parishes.length>0&&<label className={styles.parishPicker}><div><small>PARÓQUIA</small><strong>{selected?.name||"Escolha uma comunidade"}</strong>{location&&<span><MapPin size={12}/>{location}</span>}</div><ChevronDown size={18}/><select value={selectedId} onChange={e=>setSelectedId(e.target.value)} aria-label="Escolher paróquia">{parishes.map(p=><option key={p.id} value={p.id}>{p.name}{p.city?` — ${p.city}`:""}</option>)}</select></label>}

  {!loading&&realCampaigns.length>0&&<section className={styles.section}><div className={styles.sectionHead}><div><small>AGORA NA COMUNIDADE</small><h2>Campanhas em andamento</h2></div><span>{realCampaigns.length}</span></div><div className={styles.liveGrid}>{realCampaigns.map(c=>{const pct=Math.min(100,Math.round(Number(c.raised_cents||0)/Math.max(1,Number(c.goal_cents||1))*100));return <article className={styles.liveCard} key={c.id}>{c.image_url&&<img src={c.image_url} alt=""/>}<div className={styles.liveBody}>{c.verified&&<span className={styles.verified}><ShieldCheck size={13}/>Verificada</span>}<h3>{c.title}</h3><p>{c.description}</p>{c.goal_cents!=null&&<><div className={styles.progress}><i style={{width:`${pct}%`}}/></div><div className={styles.progressMeta}><strong>{pct}%</strong><span>{brl(c.raised_cents)} de {brl(c.goal_cents)}</span></div></>}{c.deadline&&<small className={styles.deadline}><CalendarDays size={13}/>Até {new Date(c.deadline).toLocaleDateString("pt-BR")}</small>}</div></article>})}</div></section>}

  <section className={styles.section}><div className={styles.sectionHead}><div><small>CAMPANHAS DA PARÓQUIA</small><h2>Ações que podem acontecer o ano inteiro</h2></div></div><p className={styles.sectionIntro}>Cada paróquia pode ativar estas campanhas conforme a necessidade local. Veja o que pode ser arrecadado e como participar.</p><div className={styles.templateGrid}>{baseCampaigns.map(({key,title,subtitle,icon:Icon,tag,description,items})=><details className={styles.templateCard} key={key}><summary><span className={styles.templateIcon}><Icon size={21}/></span><div><small>{tag}</small><strong>{title}</strong><p>{subtitle}</p></div><ChevronDown size={18}/></summary><div className={styles.templateDetail}><p>{description}</p><strong>O que doar</strong><div className={styles.itemList}>{items.map(item=><span key={item}>• {item}</span>)}</div><div className={styles.templateFooter}><span><Heart size={14}/>Entrega e datas são definidas pela paróquia.</span></div></div></details>)}</div></section>

  <Link href="/doacoes" className={styles.donationCta}><span><HeartHandshake size={20}/></span><div><small>PREFERE CONTRIBUIR FINANCEIRAMENTE?</small><strong>Acesse a área de Doações do Vinde.</strong></div><ArrowRight size={18}/></Link>
 </div></AppShell>
}

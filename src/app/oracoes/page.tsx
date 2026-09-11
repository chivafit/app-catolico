"use client";

import "./oracoes.css";
import {useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {BookHeart,ChevronDown,ChevronUp,Church,Heart,Search,Shield,Sparkles} from "lucide-react";

type Prayer={id:string;title:string;category:string;moment:string;icon:"heart"|"shield"|"church"|"sparkles";text:string};

const prayers:Prayer[]=[
{id:"pai-nosso",title:"Pai-Nosso",category:"Essenciais",moment:"Para todos os momentos",icon:"church",text:"Pai nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso Reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém."},
{id:"ave-maria",title:"Ave-Maria",category:"Marianas",moment:"Confiança e intercessão",icon:"heart",text:"Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém."},
{id:"gloria",title:"Glória ao Pai",category:"Essenciais",moment:"Louvor breve",icon:"sparkles",text:"Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre. Amém."},
{id:"santo-anjo",title:"Santo Anjo",category:"Proteção",moment:"Ao começar ou terminar o dia",icon:"shield",text:"Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém."},
{id:"salve-rainha",title:"Salve Rainha",category:"Marianas",moment:"Amparo de Nossa Senhora",icon:"heart",text:"Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E, depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém."},
{id:"sao-miguel",title:"São Miguel Arcanjo",category:"Proteção",moment:"Força nas dificuldades",icon:"shield",text:"São Miguel Arcanjo, defendei-nos no combate. Sede nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos; e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a Satanás e aos outros espíritos malignos que andam pelo mundo para perder as almas. Amém."},
{id:"ato-contricao",title:"Ato de Contrição",category:"Reconciliação",moment:"Exame de consciência",icon:"church",text:"Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois tão bom e amável. Prometo, com a vossa graça, esforçar-me para não mais pecar e evitar as ocasiões de pecado. Senhor, tende piedade de mim. Amém."}
];

const categories=["Todas","Essenciais","Marianas","Proteção","Reconciliação"];

function PrayerIcon({kind}:{kind:Prayer["icon"]}){if(kind==="heart")return <Heart/>;if(kind==="shield")return <Shield/>;if(kind==="sparkles")return <Sparkles/>;return <Church/>}

export default function OracoesPage(){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("Todas");
  const [open,setOpen]=useState<string>("pai-nosso");
  const visible=useMemo(()=>prayers.filter(p=>(category==="Todas"||p.category===category)&&(`${p.title} ${p.category} ${p.moment}`.toLowerCase().includes(query.trim().toLowerCase()))),[query,category]);
  return <AppShell><div className="prayers-page">
    <section className="prayers-hero">
      <div className="prayers-hero-icon"><BookHeart/></div>
      <span>ORAÇÃO NO VINDE</span>
      <h1>Um lugar para recolher o coração.</h1>
      <p>Orações católicas para acompanhar seu dia, sua devoção e seus momentos de silêncio.</p>
    </section>

    <section className="prayers-tools">
      <label className="prayers-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar uma oração" aria-label="Buscar uma oração"/></label>
      <div className="prayers-categories" role="tablist" aria-label="Categorias de oração">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    </section>

    <section className="prayers-featured">
      <span>PARA COMEÇAR</span>
      <div><Sparkles/><p>Não precisa encontrar palavras perfeitas. Escolha uma oração, leia devagar e permaneça alguns instantes em silêncio.</p></div>
    </section>

    <section className="prayers-list" aria-live="polite">
      <div className="prayers-heading"><div><span>BIBLIOTECA DE ORAÇÕES</span><h2>{category==="Todas"?"Orações para diferentes momentos":category}</h2></div><small>{visible.length} {visible.length===1?"oração":"orações"}</small></div>
      {visible.length===0?<div className="prayers-empty"><Search/><strong>Nenhuma oração encontrada</strong><p>Tente outro termo ou escolha uma categoria diferente.</p></div>:visible.map(p=>{const expanded=open===p.id;return <article className={`prayer-card ${expanded?"open":""}`} key={p.id}>
        <button className="prayer-card-head" onClick={()=>setOpen(expanded?"":p.id)} aria-expanded={expanded}>
          <span className="prayer-card-icon"><PrayerIcon kind={p.icon}/></span>
          <span className="prayer-card-copy"><small>{p.category}</small><strong>{p.title}</strong><em>{p.moment}</em></span>
          <span className="prayer-card-toggle">{expanded?<ChevronUp/>:<ChevronDown/>}</span>
        </button>
        {expanded&&<div className="prayer-card-body"><p>{p.text}</p><div className="prayer-amen">Amém.</div></div>}
      </article>})}
    </section>
  </div></AppShell>
}

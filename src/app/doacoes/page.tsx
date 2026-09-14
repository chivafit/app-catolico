"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {Heart,LockKeyhole,ArrowRight} from "lucide-react";
import {AppShell} from "@/components/AppShell";
import styles from "@/app/vindeReference.module.css";
import flow from "./doacoes.module.css";

const banner="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=84";
export default function Doacoes(){
 const [mode,setMode]=useState<"once"|"monthly">("once"),[value,setValue]=useState(50),[custom,setCustom]=useState("");
 const values=[20,50,100,200];
 const customValue=Number(custom.replace(",","."));
 const amount=useMemo(()=>custom&&Number.isFinite(customValue)&&customValue>0?customValue:value,[custom,customValue,value]);
 const customActive=!!custom&&Number.isFinite(customValue)&&customValue>0;
 function chooseFixed(v:number){setValue(v);setCustom("")}
 return <AppShell><div className={styles.page}>
  <div className={`${styles.title} ${styles.center}`}><h1>Doação</h1><p>Ajude quem precisa e fortaleça iniciativas da comunidade.</p></div>
  <section className={styles.donateHero} style={{backgroundImage:`url(${banner})`}}><div><h2>Juntos, fazemos mais.</h2><p>Seu apoio transforma campanhas, projetos e comunidades.</p></div></section>
  <section className={styles.donateCard}>
   <div className={flow.flowMeta}><span className={flow.step}>Passo 1 de 2</span><span className={flow.modeHint}>Escolha frequência e valor</span></div>
   <div className={flow.segmented} role="group" aria-label="Frequência da doação"><button className={mode==="once"?flow.active:""} aria-pressed={mode==="once"} onClick={()=>setMode("once")}>Única</button><button className={mode==="monthly"?flow.active:""} aria-pressed={mode==="monthly"} onClick={()=>setMode("monthly")}>Mensal</button></div>
   <div className={flow.amounts}>{values.map(v=><button key={v} className={!customActive&&value===v?flow.active:""} aria-pressed={!customActive&&value===v} onClick={()=>chooseFixed(v)}>R$ {v}</button>)}</div>
   <div className={flow.customWrap}><label className={flow.customLabel} htmlFor="donation-custom">Outro valor</label><label className={`${flow.customInput} ${customActive?flow.active:""}`}><span>R$</span><input id="donation-custom" inputMode="decimal" type="number" min="1" step="1" placeholder="Digite o valor" value={custom} onChange={e=>setCustom(e.target.value)}/></label></div>
   <div className={flow.impact}><span><Heart size={14} fill="currentColor"/></span><p>Com R$ {amount.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:2})}, você escolhe uma campanha do Vinde para apoiar. O pagamento só será solicitado dentro de uma campanha habilitada.</p></div>
   <Link className={flow.cta} href={`/campanhas?tipo=${mode}&valor=${encodeURIComponent(amount)}`}>Escolher campanha <ArrowRight size={17}/></Link>
   <div className={flow.safe}><LockKeyhole size={14}/><span><strong>Ambiente seguro</strong> e transparente</span></div>
  </section>
 </div></AppShell>
}

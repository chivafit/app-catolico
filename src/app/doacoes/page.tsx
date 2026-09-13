"use client";
import Link from "next/link";
import {useState} from "react";
import {Heart,ShieldCheck,ArrowRight} from "lucide-react";
import {AppShell} from "@/components/AppShell";
import styles from "@/app/vindeReference.module.css";

const banner="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=84";
export default function Doacoes(){
 const [mode,setMode]=useState<"once"|"monthly">("once"),[value,setValue]=useState(50);
 const values=[20,50,100,200];
 return <AppShell><div className={styles.page}>
  <div className={`${styles.title} ${styles.center}`}><h1>Doação</h1><p>Ajude quem precisa e fortaleça iniciativas da comunidade.</p></div>
  <section className={styles.donateHero} style={{backgroundImage:`url(${banner})`}}><div><h2>Juntos, fazemos mais.</h2><p>Seu apoio transforma campanhas, projetos e comunidades.</p></div></section>
  <section className={styles.donateCard}>
   <div className={styles.toggle}><button className={mode==="once"?styles.active:""} onClick={()=>setMode("once")}>Única</button><button className={mode==="monthly"?styles.active:""} onClick={()=>setMode("monthly")}>Mensal</button></div>
   <div className={styles.values}>{values.map(v=><button key={v} className={value===v?styles.active:""} onClick={()=>setValue(v)}>R$ {v}</button>)}</div>
   <div className={styles.impact}><span><Heart size={14} fill="currentColor"/></span><p>Com R$ {value}, você escolhe uma campanha do Vinde para apoiar. O pagamento só será solicitado dentro de uma campanha habilitada.</p></div>
   <Link className={styles.donateCta} href={`/campanhas?tipo=${mode}&valor=${value}`}>Escolher campanha <ArrowRight size={17}/></Link>
   <div className={styles.safe}><ShieldCheck size={14}/> Ambiente seguro e transparente</div>
  </section>
 </div></AppShell>
}

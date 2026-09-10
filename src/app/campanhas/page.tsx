import {AppShell} from "@/components/AppShell";
import {Heart,ShieldCheck} from "lucide-react";
const campaigns=[
 {title:"Restauração da Igreja Matriz",parish:"Paróquia São Sebastião",raised:57420,goal:80000},
 {title:"Novo telhado da capela",parish:"Comunidade Santa Rita",raised:12840,goal:30000},
 {title:"Cestas para famílias",parish:"Pastoral Social",raised:7650,goal:10000}
];
export default function Campanhas(){return <AppShell><div className="page-title"><div className="eyebrow">Campanhas verificadas</div><h1>Ajude com confiança.</h1><p className="muted">Campanhas vinculadas a instituições e comunidades verificadas.</p></div><section className="grid">{campaigns.map(c=>{const pct=Math.min(100,Math.round(c.raised/c.goal*100));return <article className="card" key={c.title}><div className="iconbox"><Heart/></div><span className="tag"><ShieldCheck size={12}/> Verificada</span><h2 style={{marginTop:14}}>{c.title}</h2><p className="muted">{c.parish}</p><div className="progress"><span style={{width:`${pct}%`}}/></div><p><b>{pct}%</b> <span className="muted">• R$ {c.raised.toLocaleString('pt-BR')} de R$ {c.goal.toLocaleString('pt-BR')}</span></p><button className="cta">Contribuir</button></article>})}</section></AppShell>}

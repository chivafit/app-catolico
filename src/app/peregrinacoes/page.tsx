import {AppShell} from "@/components/AppShell";
import {Bus, MapPin, CalendarDays, ShieldCheck} from "lucide-react";
const trips=[
 {title:"Aparecida",origin:"Belo Horizonte",date:"24–26 out",price:"R$ 749",spots:"12 vagas",verified:true},
 {title:"Canção Nova",origin:"Piumhi",date:"14–15 nov",price:"R$ 389",spots:"8 vagas",verified:true},
 {title:"Fátima + Roma",origin:"São Paulo",date:"08–18 mai 2027",price:"sob consulta",spots:"pré-inscrição",verified:true}
];
export default function Peregrinacoes(){return <AppShell>
 <div className="page-title"><div className="eyebrow">Peregrinações</div><h1>Viaje com propósito.</h1><p className="muted">Descubra roteiros religiosos publicados por organizadores verificados.</p></div>
 <section className="grid">{trips.map(t=><article className="card" key={t.title}><div className="iconbox"><Bus/></div>{t.verified&&<span className="tag"><ShieldCheck size={12}/> Organizador verificado</span>}<h2 style={{marginTop:14}}>{t.title}</h2><p className="muted"><MapPin size={14}/> Saída: {t.origin}<br/><CalendarDays size={14}/> {t.date}</p><p className="product-price">{t.price}</p><p className="muted">{t.spots}</p><button className="cta">Ver roteiro</button></article>)}</section>
 <div className="card notice"><b>Modelo seguro de operação</b><p className="muted">A plataforma conecta o fiel a excursões e peregrinações de parceiros regularizados. A operação turística, quando exigida, fica com o organizador responsável.</p></div>
 </AppShell>}

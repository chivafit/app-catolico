import {AppShell} from "@/components/AppShell";
import {brl,getPilgrimages,shortDate} from "@/lib/data";
import {Bus,MapPin,CalendarDays,ShieldCheck} from "lucide-react";

export default async function Peregrinacoes(){
 const trips=await getPilgrimages();
 return <AppShell>
  <div className="page-title"><div className="eyebrow">Peregrinações</div><h1>Viaje com propósito.</h1><p className="muted">Descubra roteiros religiosos publicados por organizadores verificados.</p></div>
  <section className="grid">{trips.map((t)=>{const organizer=Array.isArray(t.travel_organizers)?t.travel_organizers[0]:t.travel_organizers;return <article className="card" key={t.id}><div className="iconbox"><Bus/></div>{organizer?.verified&&<span className="tag"><ShieldCheck size={12}/> Organizador verificado</span>}<h2 style={{marginTop:14}}>{t.destination}</h2><p className="muted"><MapPin size={14}/> Saída: {t.origin_city||"a confirmar"}<br/><CalendarDays size={14}/> {shortDate(t.starts_at)}</p><p className="product-price">{brl(t.price_cents)}</p><p className="muted">{t.available_spots==null?"vagas a confirmar":`${t.available_spots} vagas restantes`}</p></article>})}</section>
  <div className="card notice"><b>Modelo seguro de operação</b><p className="muted">A plataforma conecta o fiel a excursões e peregrinações de parceiros regularizados. A operação turística, quando exigida, fica com o organizador responsável.</p></div>
 </AppShell>;
}

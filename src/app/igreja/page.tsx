import {AppShell} from "@/components/AppShell";
import {getMassSchedules,getParish} from "@/lib/data";

const weekday=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
export default async function Igreja(){
 const parish=await getParish();
 const schedules=await getMassSchedules(parish?.id);
 return <AppShell><div className="page-title"><div className="eyebrow">Minha igreja</div><h1>{parish?.name||"Sua paróquia"}</h1><p className="muted">{parish?`${parish.city} • ${parish.state}`:"Escolha uma paróquia no onboarding"}</p></div><section className="grid two"><div className="card"><h2>Horários</h2><div className="list">{schedules.map((m)=><div className="row" key={m.id}><span>{weekday[m.weekday]}{m.label?` • ${m.label}`:""}</span><b>{String(m.starts_at).slice(0,5)}</b></div>)}</div></div><div className="card"><h2>Secretaria</h2><p className="muted">{parish?.address||"Contato e atendimento da paróquia."}</p>{parish?.phone&&<p><b>{parish.phone}</b></p>}</div><div className="card"><h2>Pastorais e movimentos</h2><p className="muted">Catequese • EJC • Terço dos Homens • Liturgia • Música • RCC</p><button className="cta secondary">Quero participar</button></div><div className="card"><h2>Intenção de Missa</h2><p className="muted">Envie uma intenção e acompanhe a confirmação.</p><button className="cta secondary">Nova intenção</button></div></section></AppShell>;
}

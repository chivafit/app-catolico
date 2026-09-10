import {AppShell} from "@/components/AppShell";
import {getTodayDevotional} from "@/lib/data";

export default async function Momento(){
  const d=await getTodayDevotional();
  const steps=[
    ["Evangelho do dia",d?.scripture_reference||"Liturgia do dia"],
    ["Para refletir",d?.reflection||"Reserve alguns minutos para silêncio e presença."],
    ["Oração",d?.prayer||"Senhor, orienta minhas escolhas e meu dia. Amém."],
    ["Propósito",d?.purpose||"Faça hoje um gesto concreto de escuta e cuidado."]
  ];
  return <AppShell><div className="page-title"><div className="eyebrow">Momento diário</div><h1>{d?.title||"Comece o dia com presença."}</h1><p className="muted">Uma experiência curta e guiada para oração e reflexão.</p></div><div className="card">{steps.map((s,i)=><div className="daily-step" key={s[0]}><div className="stepnum">{i+1}</div><div><h3>{s[0]}</h3><p className="muted">{s[1]}</p></div></div>)}<div style={{paddingTop:20}}><button className="cta">Concluir momento ✓</button></div></div></AppShell>;
}

"use client";
import {useState} from "react";
import Link from "next/link";

export default function Onboarding(){
 const [step,setStep]=useState(1);
 return <main className="shell narrow">
  <div className="brand"><small>PLATAFORMA CATÓLICA</small>Ágora Fide</div>
  <div className="card onboarding">
   <div className="eyebrow">Passo {step} de 3</div>
   {step===1&&<><h1>Vamos começar pela sua comunidade.</h1><p className="muted">Escolha a cidade onde você participa da vida paroquial.</p><label className="field"><span>Cidade</span><input defaultValue="Piumhi"/></label><label className="field"><span>Estado</span><input defaultValue="MG"/></label></>}
   {step===2&&<><h1>Qual é a sua paróquia?</h1><div className="choice active-choice">Paróquia São Sebastião <span>✓</span></div><div className="choice">Paróquia Nossa Senhora do Livramento</div><div className="choice">Ainda não encontrei minha paróquia</div></>}
   {step===3&&<><h1>O que você quer acompanhar?</h1><div className="chips"><span className="pill">✓ Momento Diário</span><span className="pill">✓ Minha Paróquia</span><span className="pill">✓ Eventos</span><span className="pill">Peregrinações</span><span className="pill">Livros</span><span className="pill">Campanhas</span></div><p className="muted">Você poderá mudar essas preferências depois.</p></>}
   <div className="actions">{step>1&&<button className="cta secondary" onClick={()=>setStep(step-1)}>Voltar</button>}{step<3?<button className="cta" onClick={()=>setStep(step+1)}>Continuar</button>:<Link href="/" className="cta">Entrar no app</Link>}</div>
  </div>
 </main>
}
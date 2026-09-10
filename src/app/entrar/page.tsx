"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function Entrar() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "signup", []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage("");
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/onboarding";
    const { error } = await getSupabase().auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${next}` } });
    setMessage(error ? error.message : signup ? "Pronto. Enviamos seu link de acesso por e-mail." : "Pronto. Enviamos um novo link de acesso por e-mail.");
    setBusy(false);
  }

  return <main style={{minHeight:"100dvh",background:"#f4f1ea",display:"grid",placeItems:"center",padding:16,fontFamily:"Arial, sans-serif"}}>
    <section style={{width:"min(100%,430px)",minHeight:"min(860px,calc(100dvh - 24px))",background:"#fffdf8",borderRadius:32,boxShadow:"0 18px 60px rgba(18,45,37,.14)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{height:230,position:"relative",background:"linear-gradient(155deg,#173d34 0%,#285c4e 58%,#b78643 150%)",padding:"38px 30px",color:"white"}}>
        <Link href="/" style={{color:"white",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:10}}><span style={{fontSize:30,color:"#d7ae68"}}>✣</span><span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:24}}>Ágora Fide</span></Link>
        <div style={{position:"absolute",left:30,bottom:32,right:30}}><div style={{fontSize:13,letterSpacing:1.5,textTransform:"uppercase",color:"#e3c68e",fontWeight:700}}>Fé · Comunidade · Vida</div><h1 style={{fontFamily:"Georgia,serif",fontSize:34,lineHeight:1.08,margin:"10px 0 0",maxWidth:330}}>{signup?"Sua jornada começa aqui.":"Que bom ter você de volta."}</h1></div>
      </div>
      <div style={{padding:"34px 30px 28px",flex:1,display:"flex",flexDirection:"column"}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:27,color:"#17382f",margin:"0 0 8px"}}>{signup?"Criar minha conta":"Entrar no Ágora Fide"}</h2>
        <p style={{color:"#6c716d",fontSize:15,lineHeight:1.55,margin:"0 0 27px"}}>{signup?"Use seu e-mail para criar sua conta e começar a viver tudo o que preparamos para sua fé.":"Informe seu e-mail. Você receberá um link seguro para entrar, sem precisar lembrar de senha."}</p>
        <form onSubmit={submit}>
          <label style={{display:"block",fontSize:14,fontWeight:700,color:"#203a32",marginBottom:8}}>Seu e-mail</label>
          <div style={{display:"flex",alignItems:"center",gap:10,border:"1px solid #ddd8ce",borderRadius:16,background:"#fff",padding:"0 16px",height:56,boxShadow:"0 3px 12px rgba(28,50,43,.04)"}}><span style={{fontSize:18,color:"#587068"}}>✉</span><input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required style={{border:0,outline:0,width:"100%",fontSize:16,background:"transparent",color:"#172b25"}}/></div>
          <button disabled={busy} type="submit" style={{marginTop:16,width:"100%",height:56,border:0,borderRadius:28,background:"#155744",color:"white",fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 20px rgba(21,87,68,.18)"}}>{busy?"Enviando…":signup?"Continuar":"Receber link de acesso"} <span style={{marginLeft:7}}>→</span></button>
        </form>
        {message && <div style={{marginTop:18,padding:"13px 15px",borderRadius:13,background:"#eef5f1",color:"#285347",fontSize:14,lineHeight:1.45}}>{message}</div>}
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"28px 0 22px",color:"#aaa59d",fontSize:12}}><span style={{height:1,background:"#e7e2d9",flex:1}}/><span>ACESSO SEGURO</span><span style={{height:1,background:"#e7e2d9",flex:1}}/></div>
        <p style={{textAlign:"center",color:"#7b7d78",fontSize:13,lineHeight:1.5,margin:"auto 0 0"}}>Ao continuar, você concorda com os <Link href="/termos" style={{color:"#315f52"}}>Termos de Uso</Link> e a <Link href="/privacidade" style={{color:"#315f52"}}>Política de Privacidade</Link>.</p>
      </div>
    </section>
  </main>;
}

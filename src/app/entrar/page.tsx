"use client";
import {FormEvent,useState} from "react";
import Link from "next/link";
import {getSupabase} from "@/lib/supabase";

export default function Entrar(){
 const [message,setMessage]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const form=new FormData(e.currentTarget);
  const email=String(form.get("email")||"");
  const {error}=await getSupabase().auth.signInWithOtp({email});
  setMessage(error?error.message:"Enviamos um link de acesso para o seu e-mail.");
 }
 return <main className="shell narrow"><div className="topbar"><Link href="/" className="brand"><small>PLATAFORMA CATÓLICA</small>Ágora Fide</Link></div><div className="card onboarding"><div className="eyebrow">Sua conta</div><h1>Entrar no app</h1><p className="muted">Receba um link seguro por e-mail para acessar sua caminhada, favoritos e reservas.</p><form onSubmit={submit}><label className="field"><span>E-mail</span><input name="email" type="email" required/></label><button className="cta" type="submit">Enviar link de acesso</button></form>{message&&<p className="muted">{message}</p>}</div></main>
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export function AuthUrlHandler() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorCode = hash.get("error_code");
    const errorDescription = hash.get("error_description");
    const hasSession = !!hash.get("access_token") && !!hash.get("refresh_token");

    if (errorCode || errorDescription) {
      setError(errorCode === "otp_expired" ? "Este link expirou ou já foi usado. Solicite um novo acesso." : decodeURIComponent((errorDescription || "Não foi possível concluir seu acesso.").replace(/\+/g, " ")));
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    if (hasSession) {
      // Supabase JS persiste automaticamente a sessão do fragmento; damos um instante para concluir.
      setTimeout(async () => {
        const { data } = await getSupabase().auth.getSession();
        history.replaceState(null, "", window.location.pathname + window.location.search);
        if (data.session) router.replace("/onboarding");
      }, 250);
    }
  }, [router]);

  if (!error) return null;
  return <div style={{position:"fixed",inset:0,zIndex:9999,background:"#f4f1ea",display:"grid",placeItems:"center",padding:18}}>
    <div style={{width:"min(100%,420px)",background:"#fffdf8",borderRadius:28,padding:"34px 28px",boxShadow:"0 20px 60px rgba(18,45,37,.16)",textAlign:"center"}}>
      <div style={{fontSize:32,color:"#b78a45",marginBottom:10}}>✣</div>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:28,color:"#17382f",margin:"0 0 10px"}}>Seu link precisa ser renovado</h1>
      <p style={{color:"#6c716d",lineHeight:1.55,margin:"0 0 22px"}}>{error}</p>
      <Link href="/entrar" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"100%",height:54,borderRadius:27,background:"#155744",color:"#fff",textDecoration:"none",fontWeight:700}}>Solicitar novo link</Link>
    </div>
  </div>;
}

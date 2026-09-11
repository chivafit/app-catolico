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
    let cancelled = false;

    async function completeAuth(){
      const supabase = getSupabase();
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);
      const errorCode = hash.get("error_code") || query.get("error_code");
      const errorDescription = hash.get("error_description") || query.get("error_description");
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = query.get("code");

      if (errorCode || errorDescription) {
        if(cancelled) return;
        setError(errorCode === "otp_expired" ? "Este link expirou ou já foi usado. Solicite um novo acesso." : decodeURIComponent((errorDescription || "Não foi possível concluir seu acesso.").replace(/\+/g, " ")));
        history.replaceState(null, "", window.location.pathname);
        return;
      }

      try{
        let sessionEstablished = false;
        if(accessToken && refreshToken){
          const {error:setErrorResult} = await supabase.auth.setSession({access_token:accessToken,refresh_token:refreshToken});
          if(setErrorResult) throw setErrorResult;
          sessionEstablished = true;
        } else if(code){
          const {error:exchangeError} = await supabase.auth.exchangeCodeForSession(code);
          if(exchangeError) throw exchangeError;
          sessionEstablished = true;
        }

        if(sessionEstablished){
          history.replaceState(null, "", window.location.pathname);
          if(!cancelled) router.replace("/onboarding");
        }
      }catch(e:any){
        if(cancelled) return;
        setError(e?.message || "Não foi possível concluir seu acesso. Solicite um novo link.");
        history.replaceState(null, "", window.location.pathname);
      }
    }

    void completeAuth();
    return ()=>{cancelled=true};
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

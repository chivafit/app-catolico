"use client";
import Link from "next/link";import {ReactNode,useEffect,useState} from "react";import {useAuth} from "@/components/AuthProvider";import {getSupabase} from "@/lib/supabase";
type Mode="parish"|"seller"|"organizer";
export function AuthGuard({mode,children}:{mode:Mode;children:ReactNode}){const {user,loading}=useAuth();const [allowed,setAllowed]=useState<boolean|null>(null);
 useEffect(()=>{if(loading)return;if(!user){setAllowed(false);return}const s=getSupabase();(async()=>{if(mode==="parish"){const {data}=await s.from("parish_members").select("parish_id").eq("user_id",user.id).in("role",["admin","editor"]).limit(1);setAllowed(!!data?.length)}else if(mode==="seller"){const {data}=await s.from("sellers").select("id").eq("owner_user_id",user.id).limit(1);setAllowed(!!data?.length)}else{const {data}=await s.from("travel_organizers").select("id").eq("owner_user_id",user.id).limit(1);setAllowed(!!data?.length)}})()},[user,loading,mode]);
 if(loading||allowed===null)return <main className="shell"><div className="card">Verificando acesso…</div></main>;
 if(!user)return <main className="shell narrow"><div className="card onboarding"><h1>Entre para continuar.</h1><p className="muted">Este painel exige uma conta autenticada.</p><Link className="cta" href="/entrar">Entrar</Link></div></main>;
 if(!allowed)return <main className="shell narrow"><div className="card onboarding"><h1>Acesso restrito.</h1><p className="muted">Sua conta ainda não possui permissão para este painel.</p><Link className="cta secondary" href="/">Voltar ao app</Link></div></main>;
 return <>{children}</>}

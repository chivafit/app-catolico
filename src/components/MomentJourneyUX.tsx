"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {Flame,Heart,Sparkles,LogIn} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";
import {getSupabase} from "@/lib/supabase";

export function MomentStreakBadge(){
 const {user}=useAuth();
 const [dates,setDates]=useState<string[]>([]);
 useEffect(()=>{if(!user){setDates([]);return}getSupabase().from("devotional_completions").select("completed_at,daily_devotionals(devotional_date)").eq("user_id",user.id).order("completed_at",{ascending:false}).limit(60).then(({data})=>setDates(((data||[]) as any[]).map(x=>x.daily_devotionals?.devotional_date).filter(Boolean)))},[user?.id]);
 const streak=useMemo(()=>{const unique=new Set(dates);let n=0;const d=new Date();for(let i=0;i<60;i++){const key=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);if(unique.has(key))n++;else if(i>0)break;d.setDate(d.getDate()-1)}return n},[dates]);
 if(!user||streak<1)return null;
 return <span className="moment-streak"><Flame size={14}/>{streak} {streak===1?"dia":"dias"}</span>
}

export function MomentSteps(){
 const [active,setActive]=useState<"reflexao"|"oracao">("reflexao");
 useEffect(()=>{const nodes=["reflexao","oracao"].map(id=>document.getElementById(id)).filter(Boolean) as HTMLElement[];if(!nodes.length)return;const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible&&(visible.target.id==="reflexao"||visible.target.id==="oracao"))setActive(visible.target.id as "reflexao"|"oracao")},{rootMargin:"-28% 0px -48% 0px",threshold:[.2,.45,.7]});nodes.forEach(n=>observer.observe(n));return()=>observer.disconnect()},[]);
 return <div className="moment-step-grid" aria-label="Etapas do Momento Diário"><a href="#reflexao" className={active==="reflexao"?"active":""}><Sparkles size={18}/><span>Refletir</span></a><a href="#oracao" className={active==="oracao"?"active":""}><Heart size={18}/><span>Orar</span></a></div>
}

export function MomentLoginPrompt(){
 const {user,loading}=useAuth();
 if(loading||user)return null;
 return <section className="moment-login-prompt"><span className="moment-login-icon"><LogIn size={19}/></span><div><strong>Seu progresso ainda não está sendo salvo</strong><p>Entre no Vinde para registrar sua sequência, favoritos e conclusão do Momento Diário.</p></div><Link href="/entrar">Entrar</Link></section>
}

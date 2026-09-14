"use client";
import {useEffect,useState} from "react";
import {Heart,Share2,Check,BarChart3} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";
import {getSupabase} from "@/lib/supabase";
import {track} from "@/lib/analytics";
import styles from "./JourneyFinish.module.css";

export function DailyActions({devotionalId,title}:{devotionalId?:string;title:string}){
 const {user,profile}=useAuth();const [done,setDone]=useState(false);const [fav,setFav]=useState(false);const [busy,setBusy]=useState(false);
 useEffect(()=>{if(!user||!devotionalId)return;const userId=user.id;const s=getSupabase();Promise.all([s.from("devotional_completions").select("devotional_id").eq("user_id",userId).eq("devotional_id",devotionalId).maybeSingle(),s.from("favorites").select("entity_id").eq("user_id",userId).eq("entity_type","devotional").eq("entity_id",devotionalId).maybeSingle()]).then(([a,b])=>{setDone(!!a.data);setFav(!!b.data)});track("daily_moment_open",{entity_type:"devotional",entity_id:devotionalId,parish_id:profile?.primary_parish_id||undefined,path:"/momento"})},[user?.id,devotionalId,profile?.primary_parish_id]);
 if(!devotionalId||!user)return null;
 const userId=user.id;
 async function complete(){setBusy(true);const s=getSupabase();const {error}=await s.from("devotional_completions").upsert({user_id:userId,devotional_id:devotionalId},{onConflict:"user_id,devotional_id"});if(!error){setDone(true);track("daily_moment_complete",{entity_type:"devotional",entity_id:devotionalId,parish_id:profile?.primary_parish_id||undefined,path:"/momento"})}setBusy(false)}
 async function favorite(){const s=getSupabase();if(fav)await s.from("favorites").delete().eq("user_id",userId).eq("entity_type","devotional").eq("entity_id",devotionalId);else await s.from("favorites").insert({user_id:userId,entity_type:"devotional",entity_id:devotionalId});setFav(!fav);track(fav?"favorite_remove":"favorite_add",{entity_type:"devotional",entity_id:devotionalId,parish_id:profile?.primary_parish_id||undefined})}
 async function share(){track("share",{entity_type:"devotional",entity_id:devotionalId,parish_id:profile?.primary_parish_id||undefined,path:"/momento"});const text=`${title} — meu Momento Diário no Vinde`;if(navigator.share)await navigator.share({title,text,url:location.href});else await navigator.clipboard.writeText(`${text} ${location.href}`)}
 return <div className={styles.actionsArea}><div className={styles.statusRow}><span className={`${styles.statusPill} ${done?styles.done:""}`}><BarChart3 size={15}/>{done?"Momento concluído":"Sua jornada de hoje"}</span></div><div className={styles.buttonGrid}><button className={styles.primary} disabled={busy||done} onClick={complete}><Check size={18}/>{done?"Concluído hoje":busy?"Salvando…":"Concluir momento"}</button><button className={styles.secondary} onClick={favorite}><Heart size={18} fill={fav?"currentColor":"none"}/>{fav?"Salvo":"Favoritar"}</button><button className={styles.share} onClick={share}><Share2 size={18}/>Compartilhar</button></div><div className={styles.quote}>“Tudo tem o seu tempo, e há tempo para todo propósito debaixo do céu.”<small>EC 3,1</small></div></div>
}

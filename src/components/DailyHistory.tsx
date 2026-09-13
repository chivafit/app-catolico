"use client";
import {useEffect,useState} from "react";
import {Heart} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";
import {getSupabase} from "@/lib/supabase";
import styles from "./JourneyFinish.module.css";

export function DailyHistory(){
 const {user}=useAuth();const [rows,setRows]=useState<any[]>([]);
 useEffect(()=>{if(!user)return;getSupabase().from("devotional_completions").select("completed_at,daily_devotionals(title,devotional_date)").eq("user_id",user.id).order("completed_at",{ascending:false}).limit(5).then(({data})=>setRows(data||[]))},[user?.id]);
 if(!user)return null;
 if(!rows.length)return <div className={styles.emptyHistory}>Seu histórico aparecerá aqui conforme você concluir seus momentos.</div>;
 return <div><div className={styles.historyTitle}>Seu histórico</div><div className={styles.historyList}>{rows.map((r:any,i)=><div className={styles.historyItem} key={i}><span className={styles.historyIcon}><Heart size={18}/></span><div><strong>{r.daily_devotionals?.title||"Momento Diário"}</strong><small>{r.daily_devotionals?.devotional_date?new Date(r.daily_devotionals.devotional_date+"T12:00:00").toLocaleDateString("pt-BR"):""}</small></div><span className={styles.historyCheck}>✓</span></div>)}</div></div>
}

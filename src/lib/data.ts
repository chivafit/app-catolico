import { getSupabase } from "@/lib/supabase";

export const brl=(cents:number|null|undefined)=>cents==null?"Sob consulta":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(cents/100);
export const shortDate=(iso:string)=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",timeZone:"America/Sao_Paulo"}).format(new Date(iso));

async function rows(table:string, select="*", order?:[string,boolean], limit=20){
 const s=getSupabase(); if(!s) return [] as any[];
 let q:any=s.from(table as any).select(select);
 if(order) q=q.order(order[0],{ascending:order[1]});
 const {data,error}=await q.limit(limit);
 if(error){console.error(`[data:${table}]`,error.message);return [] as any[]}
 return (data||[]) as any[];
}

export async function getParish(){
 const s=getSupabase(); if(!s) return null;
 const {data}=await s.from("parishes").select("*").eq("slug","sao-sebastiao-demo").maybeSingle();
 return data as any;
}
export async function getMassSchedules(parishId?:string){
 const s=getSupabase(); if(!s||!parishId) return [] as any[];
 const {data}=await s.from("mass_schedules").select("*").eq("parish_id",parishId).eq("active",true).order("weekday").order("starts_at");
 return (data||[]) as any[];
}
export async function getTodayDevotional(){
 const s=getSupabase(); if(!s) return null;
 const today=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const {data}=await s.from("daily_devotionals").select("*").eq("devotional_date",today).eq("published",true).maybeSingle();
 if(data) return data as any;
 const {data:fallback}=await s.from("daily_devotionals").select("*").eq("published",true).order("devotional_date",{ascending:false}).limit(1).maybeSingle();
 return fallback as any;
}
export async function getEvents(){return rows("events","*",["starts_at",true],12)}
export async function getCampaigns(){return rows("campaigns","*",["created_at",false],12)}
export async function getProducts(){return rows("products","*",["created_at",false],24)}
export async function getPilgrimages(){return rows("pilgrimages","*, travel_organizers(name,verified)",["starts_at",true],12)}

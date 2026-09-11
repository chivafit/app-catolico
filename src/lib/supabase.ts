import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const fallbackUrl = "https://gbwifjjkysgrbcuuyraq.supabase.co";
const fallbackPublishableKey = "sb_publishable_kQLUJpONXZ-3id2LpufW3w_Q_ZKTzZz";

let client: SupabaseClient | null = null;

export function getSupabase(){
  if(client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey;
  client = createClient(url,key,{
    auth:{
      persistSession:true,
      autoRefreshToken:true,
      detectSessionInUrl:false
    }
  });
  return client;
}

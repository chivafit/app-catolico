import { createClient } from "@supabase/supabase-js";

const fallbackUrl = "https://gbwifjjkysgrbcuuyraq.supabase.co";
const fallbackPublishableKey = "sb_publishable_kQLUJpONXZ-3id2LpufW3w_Q_ZKTzZz";

export function getSupabase(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey;
  return createClient(url,key);
}

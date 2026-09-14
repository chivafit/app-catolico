import {AppShell} from "@/components/AppShell";
import {StoreCatalog} from "@/components/StoreCatalog";
import {getSupabase} from "@/lib/supabase";

export const dynamic="force-dynamic";

export default async function Loja(){
 const {data,error}=await getSupabase().from("products").select("id,name,slug,description,category,price_cents,stock,image_url,active,created_at").eq("active",true).order("created_at",{ascending:false});
 return <AppShell><StoreCatalog initialProducts={data||[]} loadError={error?.message||null}/></AppShell>
}

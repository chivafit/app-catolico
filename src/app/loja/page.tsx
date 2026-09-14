import {AppShell} from "@/components/AppShell";
import {StoreCatalog} from "@/components/StoreCatalog";
import {getSupabase} from "@/lib/supabase";
import {STORE_PRODUCT_SELECT} from "@/lib/store-products";
import {isServerFetchTimeout,withServerTimeout} from "@/lib/server-fetch";

export const dynamic="force-dynamic";

export default async function Loja(){
 try{
  const result:any=await withServerTimeout(
   getSupabase().from("products").select(STORE_PRODUCT_SELECT).eq("active",true),
   "store catalog"
  );
  if(result.error){
   console.error("[loja/list] product query failed",{error:result.error});
   return <AppShell><StoreCatalog initialProducts={[]} loadError="query_failed"/></AppShell>;
  }
  const products=result.data||[];
  console.info("[loja/list] catalog loaded",{count:products.length});
  return <AppShell><StoreCatalog initialProducts={products} loadError={null}/></AppShell>;
 }catch(error){
  console.error("[loja/list] unexpected fetch failure",{error});
  return <AppShell><StoreCatalog initialProducts={[]} loadError={isServerFetchTimeout(error)?"timeout":"unexpected_error"}/></AppShell>;
 }
}

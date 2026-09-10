"use client";
import {createContext,useContext,useEffect,useState,ReactNode} from "react";
import type {User} from "@supabase/supabase-js";
import {getSupabase} from "@/lib/supabase";
type Profile={id:string;full_name?:string|null;city?:string|null;state?:string|null;primary_parish_id?:string|null;onboarding_completed?:boolean;preferences?:Record<string,boolean>};
type AuthState={user:User|null;profile:Profile|null;loading:boolean;refreshProfile:()=>Promise<void>;signOut:()=>Promise<void>};
const AuthContext=createContext<AuthState>({user:null,profile:null,loading:true,refreshProfile:async()=>{},signOut:async()=>{}});
export function AuthProvider({children}:{children:ReactNode}){const [user,setUser]=useState<User|null>(null);const [profile,setProfile]=useState<Profile|null>(null);const [loading,setLoading]=useState(true);async function loadProfile(nextUser:User|null){setUser(nextUser);if(!nextUser){setProfile(null);setLoading(false);return}const s=getSupabase();await s.from("profiles").upsert({id:nextUser.id},{onConflict:"id",ignoreDuplicates:true});const {data}=await s.from("profiles").select("*").eq("id",nextUser.id).maybeSingle();setProfile((data as Profile)||null);setLoading(false)}async function refreshProfile(){if(user)await loadProfile(user)}async function signOut(){await getSupabase().auth.signOut();setUser(null);setProfile(null)}useEffect(()=>{const s=getSupabase();s.auth.getUser().then(({data})=>loadProfile(data.user));const {data:listener}=s.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>void loadProfile(session?.user||null),0)});return()=>listener.subscription.unsubscribe()},[]);return <AuthContext.Provider value={{user,profile,loading,refreshProfile,signOut}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);

"use client";
import Link from "next/link";
import type {ReactNode,CSSProperties} from "react";
import {useEffect,useState} from "react";
import {Compass} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";

const styles:Record<string,CSSProperties>={
wrap:{minHeight:"100dvh",width:"100%",background:"#ECEAE3",display:"flex",justifyContent:"center"},
phone:{width:"100%",maxWidth:520,minHeight:"100dvh",background:"#F7F5EF",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"},
hero:{flex:1,minHeight:0,padding:"34px 26px 26px",color:"#20231F",position:"relative",display:"flex",flexDirection:"column",backgroundImage:"linear-gradient(180deg,rgba(247,245,239,.18) 0%,rgba(247,245,239,.10) 38%,rgba(247,245,239,.82) 76%,#F7F5EF 100%),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=82&w=1600')",backgroundSize:"cover",backgroundPosition:"center center",backgroundRepeat:"no-repeat"},
brand:{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:2,color:"#20231F"},
mark:{width:42,height:42,borderRadius:14,display:"grid",placeItems:"center",background:"rgba(252,251,247,.94)",boxShadow:"0 6px 22px rgba(32,35,31,.08)",border:"1px solid rgba(227,225,217,.9)"},
markImg:{width:30,height:30,display:"block",filter:"grayscale(.18) saturate(.7)"},
brandName:{fontFamily:'Georgia,"Times New Roman",serif',fontSize:24,fontWeight:500,letterSpacing:"-.03em"},
copy:{marginTop:"auto",paddingBottom:8,position:"relative",zIndex:2},
eyebrow:{fontSize:9,letterSpacing:".18em",fontWeight:850,color:"#6E746C",textTransform:"uppercase"},
title:{fontFamily:'Georgia,"Times New Roman",serif',fontSize:"clamp(39px,10vw,52px)",lineHeight:1.01,fontWeight:500,letterSpacing:"-.035em",margin:"13px 0 15px",maxWidth:430,color:"#20231F"},
subtitle:{fontSize:14,lineHeight:1.55,color:"#626860",margin:0,maxWidth:375},
panel:{background:"#F7F5EF",padding:"14px 26px max(25px,env(safe-area-inset-bottom))",display:"flex",flexDirection:"column",gap:10,borderTop:"1px solid #E3E1D9"},
primary:{height:54,borderRadius:999,background:"#26312C",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,letterSpacing:".1em",boxShadow:"0 7px 18px rgba(38,49,44,.12)"},
secondary:{height:49,borderRadius:999,background:"#EEEDE6",border:"1px solid #DEDDD5",color:"#26312C",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:850},
preview:{height:40,border:0,background:"transparent",color:"#59645E",fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6},
footer:{margin:"1px 0 0",textAlign:"center",fontSize:9,color:"#8A8D86",letterSpacing:".08em",textTransform:"uppercase"}
};

export function WelcomeGate({children}:{children:ReactNode}){const {user,loading}=useAuth();const [preview,setPreview]=useState(false);useEffect(()=>{setPreview(sessionStorage.getItem("vinde-preview")==="1")},[]);if(loading)return <div style={{minHeight:"100dvh",background:"#F7F5EF"}}/>;if(user||preview)return <>{children}</>;function enterPreview(){sessionStorage.setItem("vinde-preview","1");setPreview(true)}return <main style={styles.wrap}><section style={styles.phone}><div style={styles.hero}><div style={styles.brand}><span style={styles.mark}><img src="/vinde-mark.svg" alt="" style={styles.markImg}/></span><span style={styles.brandName}>Vinde</span></div><div style={styles.copy}><div style={styles.eyebrow}>Fé, com você em todos os caminhos</div><h1 style={styles.title}>Um lugar para viver o essencial.</h1><p style={styles.subtitle}>Palavra, comunidade, peregrinações, encontros e escolhas com propósito em uma experiência só.</p></div></div><div style={styles.panel}><Link href="/entrar" style={styles.primary}>ENTRAR</Link><Link href="/entrar?mode=signup" style={styles.secondary}>CRIAR MINHA CONTA</Link><button onClick={enterPreview} style={styles.preview}><Compass size={14}/> Explorar o Vinde</button><p style={styles.footer}>Mais perto do essencial.</p></div></section></main>}

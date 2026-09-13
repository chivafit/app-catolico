"use client";
import Link from "next/link";
import type {ReactNode,CSSProperties} from "react";
import {useEffect,useState} from "react";
import {Compass} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";

const styles:Record<string,CSSProperties>={
wrap:{minHeight:"100dvh",width:"100%",background:"#F3EFE6",display:"flex",justifyContent:"center"},
phone:{width:"100%",maxWidth:520,minHeight:"100dvh",background:"#FCF9F3",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"},
hero:{flex:1,minHeight:0,padding:"42px 26px 28px",color:"#FCF9F3",position:"relative",display:"flex",flexDirection:"column",backgroundImage:"linear-gradient(180deg,rgba(39,33,29,.20) 0%,rgba(48,55,42,.48) 42%,rgba(39,33,29,.88) 100%),url('https://images.unsplash.com/photo-1616615699523-024d76e1c9c5?auto=format&fit=crop&fm=jpg&q=86&w=1600')",backgroundSize:"cover",backgroundPosition:"center center",backgroundRepeat:"no-repeat"},
brand:{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:2},
mark:{width:42,height:42,borderRadius:13,display:"grid",placeItems:"center",background:"rgba(252,249,243,.94)",boxShadow:"0 6px 20px rgba(39,33,29,.12)"},
markImg:{width:30,height:30,display:"block"},
brandName:{fontFamily:'Georgia,"Times New Roman",serif',fontSize:24,fontWeight:500,letterSpacing:"-.03em"},
copy:{marginTop:"auto",paddingBottom:16,position:"relative",zIndex:2,textShadow:"0 1px 18px rgba(39,33,29,.2)"},
eyebrow:{fontSize:9,letterSpacing:".18em",fontWeight:850,color:"#EAD7BD",textTransform:"uppercase"},
title:{fontFamily:'Georgia,"Times New Roman",serif',fontSize:"clamp(39px,10vw,54px)",lineHeight:1.01,fontWeight:500,letterSpacing:"-.035em",margin:"13px 0 17px",maxWidth:430},
subtitle:{fontSize:14,lineHeight:1.55,color:"rgba(252,249,243,.91)",margin:0,maxWidth:375},
panel:{background:"#FCF9F3",padding:"21px 26px max(25px,env(safe-area-inset-bottom))",display:"flex",flexDirection:"column",gap:10,borderTop:"1px solid #E2D9CC"},
primary:{height:54,borderRadius:999,background:"#92482E",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,letterSpacing:".1em",boxShadow:"0 7px 18px rgba(146,72,46,.16)"},
secondary:{height:49,borderRadius:999,background:"#EFE3D2",border:"1px solid #DECDB7",color:"#743824",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:850},
preview:{height:40,border:0,background:"transparent",color:"#3F4633",fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6},
footer:{margin:"1px 0 0",textAlign:"center",fontSize:9,color:"#756D64",letterSpacing:".08em",textTransform:"uppercase"}
};

export function WelcomeGate({children}:{children:ReactNode}){const {user,loading}=useAuth();const [preview,setPreview]=useState(false);useEffect(()=>{setPreview(sessionStorage.getItem("vinde-preview")==="1")},[]);if(loading)return <div style={{minHeight:"100dvh",background:"#FCF9F3"}}/>;if(user||preview)return <>{children}</>;function enterPreview(){sessionStorage.setItem("vinde-preview","1");setPreview(true)}return <main style={styles.wrap}><section style={styles.phone}><div style={styles.hero}><div style={styles.brand}><span style={styles.mark}><img src="/vinde-mark.svg" alt="" style={styles.markImg}/></span><span style={styles.brandName}>Vinde</span></div><div style={styles.copy}><div style={styles.eyebrow}>Fé, com você em todos os caminhos</div><h1 style={styles.title}>Um lugar para viver o essencial.</h1><p style={styles.subtitle}>Palavra, comunidade, peregrinações, encontros e escolhas com propósito em uma experiência só.</p></div></div><div style={styles.panel}><Link href="/entrar" style={styles.primary}>ENTRAR</Link><Link href="/entrar?mode=signup" style={styles.secondary}>CRIAR MINHA CONTA</Link><button onClick={enterPreview} style={styles.preview}><Compass size={14}/> Explorar o Vinde</button><p style={styles.footer}>Mais perto do essencial.</p></div></section></main>}

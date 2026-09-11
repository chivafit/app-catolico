"use client";
import Link from "next/link";
import type {ReactNode,CSSProperties} from "react";
import {useEffect,useState} from "react";
import {Compass} from "lucide-react";
import {useAuth} from "@/components/AuthProvider";

const styles:Record<string,CSSProperties>={
wrap:{minHeight:"100dvh",width:"100%",background:"#ece8e1",display:"flex",justifyContent:"center"},
phone:{width:"100%",maxWidth:520,minHeight:"100dvh",background:"#fffdf9",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"},
hero:{flex:1,minHeight:0,padding:"48px 26px 30px",color:"#fffdf9",background:"linear-gradient(155deg,#13233A 0%,#1F3653 66%,#365A83 125%)",position:"relative",display:"flex",flexDirection:"column"},
brand:{display:"flex",alignItems:"center",gap:10,fontSize:18,fontWeight:850,position:"relative",zIndex:2},
mark:{width:31,height:31,borderRadius:9,display:"grid",placeItems:"center",border:"1px solid rgba(255,253,249,.34)",color:"#D1B07D",fontWeight:900},
copy:{marginTop:"auto",paddingBottom:18,position:"relative",zIndex:2},
eyebrow:{fontSize:10,letterSpacing:".16em",fontWeight:800,color:"#DCC09B",textTransform:"uppercase"},
title:{fontSize:"clamp(40px,10.5vw,55px)",lineHeight:.98,fontWeight:900,letterSpacing:"-.05em",margin:"14px 0 18px",maxWidth:430},
subtitle:{fontSize:15,lineHeight:1.5,color:"#E8EDF2",margin:0,maxWidth:370},
panel:{background:"#FFFDF9",padding:"22px 26px max(26px,env(safe-area-inset-bottom))",display:"flex",flexDirection:"column",gap:10,borderTop:"1px solid #E6DED2"},
primary:{height:54,borderRadius:10,background:"#1F3653",color:"#FFFDF9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,letterSpacing:".12em"},
secondary:{height:48,borderRadius:10,background:"transparent",border:"1px solid #DCC09B",color:"#1F3653",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800},
preview:{height:40,border:0,background:"transparent",color:"#365A83",fontSize:11,fontWeight:750,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6},
footer:{margin:"1px 0 0",textAlign:"center",fontSize:9,color:"#8B8580"}
};

export function WelcomeGate({children}:{children:ReactNode}){const {user,loading}=useAuth();const [preview,setPreview]=useState(false);useEffect(()=>{setPreview(sessionStorage.getItem("vinde-preview")==="1")},[]);if(loading)return <div style={{minHeight:"100dvh",background:"#fffdf9"}}/>;if(user||preview)return <>{children}</>;function enterPreview(){sessionStorage.setItem("vinde-preview","1");setPreview(true)}return <main style={styles.wrap}><section style={styles.phone}><div style={styles.hero}><div style={styles.brand}><span style={styles.mark}>✣</span><span>Vinde</span></div><div style={styles.copy}><div style={styles.eyebrow}>Sua fé, todos os dias</div><h1 style={styles.title}>Uma vida de fé que cabe no seu ritmo.</h1><p style={styles.subtitle}>Jornada diária, sua paróquia, peregrinações, eventos e conteúdos em uma experiência só.</p></div></div><div style={styles.panel}><Link href="/entrar" style={styles.primary}>ENTRAR</Link><Link href="/entrar?mode=signup" style={styles.secondary}>CRIAR MINHA CONTA</Link><button onClick={enterPreview} style={styles.preview}><Compass size={14}/> Explorar demonstração</button><p style={styles.footer}>Fé que acompanha você.</p></div></section></main>}

"use client";
import Link from "next/link";
import type {ReactNode,CSSProperties} from "react";
import {useAuth} from "@/components/AuthProvider";

const bg="https://images.unsplash.com/photo-1751980965356-26eb62d4efaf?auto=format&fit=crop&fm=jpg&q=88&w=1800";

const styles:Record<string,CSSProperties>={
 wrap:{minHeight:"100dvh",width:"100%",background:"#efeee9",display:"flex",justifyContent:"center",alignItems:"stretch"},
 phone:{width:"100%",maxWidth:520,minHeight:"100dvh",background:"#f8f6f1",position:"relative",overflow:"hidden"},
 image:{height:"71.5dvh",minHeight:520,backgroundImage:`linear-gradient(180deg,rgba(15,25,29,.18) 0%,rgba(21,26,28,.03) 38%,rgba(8,20,18,.28) 100%),url(${bg})`,backgroundSize:"cover",backgroundPosition:"center 54%",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"},
 brand:{position:"absolute",top:"30%",left:24,right:24,textAlign:"center",color:"#fff",textShadow:"0 2px 14px rgba(15,20,18,.38)"},
 cross:{fontFamily:"Georgia,serif",fontSize:48,lineHeight:1,color:"#d7a95f",marginBottom:18,textShadow:"0 2px 8px rgba(0,0,0,.24)"},
 title:{fontFamily:"Georgia, 'Times New Roman', serif",fontSize:"clamp(39px,10.5vw,54px)",fontWeight:400,lineHeight:1.02,letterSpacing:"-.025em",margin:0},
 subtitle:{fontFamily:"Georgia, 'Times New Roman', serif",fontSize:"clamp(22px,5.6vw,29px)",fontWeight:400,lineHeight:1.18,margin:"26px auto 0",maxWidth:310},
 panel:{height:"28.5dvh",minHeight:245,background:"#fbfaf6",borderRadius:"4px 4px 0 0",boxShadow:"0 -2px 10px rgba(18,34,28,.09)",padding:"31px 24px max(24px,env(safe-area-inset-bottom))",display:"flex",flexDirection:"column",gap:16,justifyContent:"flex-start"},
 primary:{height:62,borderRadius:999,background:"#174f40",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,boxShadow:"inset 0 1px 0 rgba(255,255,255,.17)"},
 secondary:{height:62,borderRadius:999,background:"#e8e7e2",color:"#163c32",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800},
 footer:{margin:"4px 0 0",textAlign:"center",fontSize:16,color:"#4f5a55",fontWeight:500}
};

export function WelcomeGate({children}:{children:ReactNode}){const {user,loading}=useAuth();if(loading)return <div style={{minHeight:"100dvh",background:"#fbfaf6"}}/>;if(user)return <>{children}</>;return <main style={styles.wrap}><section style={styles.phone}><div style={styles.image}><div style={styles.brand}><div style={styles.cross}>✣</div><h1 style={styles.title}>Ágora Fide</h1><p style={styles.subtitle}>Tudo da sua fé.<br/>Em um só lugar.</p></div></div><div style={styles.panel}><Link href="/entrar" style={styles.primary}>Entrar</Link><Link href="/entrar?mode=signup" style={styles.secondary}>Criar conta</Link><p style={styles.footer}>A fé aproxima.</p></div></section></main>}

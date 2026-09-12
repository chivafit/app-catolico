import "./globals.css";
import "./discovery.css";
import "./recommendations.css";
import "./premium.css";
import "./inner-nav.css";
import "./momento-premium.css";
import "./vinde-theme.css";
import "./contrast-guardrails.css";
import "./phase2a.css";
import "./interactions.css";
import type {Metadata} from "next";
import {AuthProvider} from "@/components/AuthProvider";
import {AuthUrlHandler} from "@/components/AuthUrlHandler";

export const metadata:Metadata={
  title:"Vinde — Plataforma Católica",
  description:"Fé, comunidade e experiências em um só lugar.",
  themeColor:"#1F3653"
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body><AuthProvider><AuthUrlHandler/>{children}</AuthProvider></body></html>;
}

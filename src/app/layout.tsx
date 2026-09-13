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
import "./brand-identity.css";
import "./brand-identity-v2.css";
import "./brand-identity-secondary.css";
import type {Metadata} from "next";
import {AuthProvider} from "@/components/AuthProvider";
import {AuthUrlHandler} from "@/components/AuthUrlHandler";

export const metadata:Metadata={
  title:"Vinde — Mais perto do essencial",
  description:"Fé, comunidade, encontros e caminhos para viver o essencial todos os dias.",
  themeColor:"#92482E",
  icons:{icon:"/vinde-app-icon.svg",apple:"/vinde-app-icon.svg"}
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body><AuthProvider><AuthUrlHandler/>{children}</AuthProvider></body></html>;
}

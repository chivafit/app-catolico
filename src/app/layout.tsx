// Sistema antigo: estrutura de componentes usada pelas telas ainda não migradas.
import "./globals.css";
import "./interactions.css";
// Redesign (2026-09): base mínima + tokens. Carregado por último para prevalecer.
import "./globals-base.css";
import "./vinde-tokens.css";
import type {Metadata} from "next";
import {AuthProvider} from "@/components/AuthProvider";
import {AuthUrlHandler} from "@/components/AuthUrlHandler";

export const metadata:Metadata={
  title:"Vinde — Mais perto do essencial",
  description:"Fé, comunidade, encontros e caminhos para viver o essencial todos os dias.",
  themeColor:"#FBF7F0",
  icons:{icon:"/vinde-app-icon.svg",apple:"/vinde-app-icon.svg"}
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body><AuthProvider><AuthUrlHandler/>{children}</AuthProvider></body></html>;
}

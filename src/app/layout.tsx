import "./globals.css";import "./discovery.css";import "./recommendations.css";import "./premium.css";import type {Metadata} from "next";import {AuthProvider} from "@/components/AuthProvider";import {AuthUrlHandler} from "@/components/AuthUrlHandler";
export const metadata:Metadata={title:"Ágora Fide — Plataforma Católica",description:"Fé, comunidade e experiências em um só lugar.",themeColor:"#123f33"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><AuthProvider><AuthUrlHandler/>{children}</AuthProvider></body></html>}

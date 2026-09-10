import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata={title:"Ágora Fide — Plataforma Católica",description:"Fé, comunidade e experiências em um só lugar."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}

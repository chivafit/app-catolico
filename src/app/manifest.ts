import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vinde — Mais perto do essencial",
    short_name: "Vinde",
    description: "Fé, comunidade, encontros e caminhos para viver o essencial todos os dias.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCF9F3",
    theme_color: "#92482E",
    lang: "pt-BR",
    categories: ["lifestyle", "social"],
    icons: [
      { src: "/vinde-app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/vinde-app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ],
  };
}

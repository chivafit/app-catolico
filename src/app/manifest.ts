import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vinde",
    short_name: "Vinde",
    description: "Mais perto do essencial — fé, comunidade, encontros e caminhos.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCF9F3",
    theme_color: "#92482E",
    lang: "pt-BR",
    categories: ["lifestyle", "social"],
    icons: [{ src: "/vinde-mark.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }],
  };
}

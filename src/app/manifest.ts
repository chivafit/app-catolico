import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vinde",
    short_name: "Vinde",
    description: "Fé, comunidade e experiências em um só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ed",
    theme_color: "#8d7457",
    lang: "pt-BR",
    categories: ["lifestyle", "social"],
  };
}

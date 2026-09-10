import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ágora Fide",
    short_name: "Ágora Fide",
    description: "Fé, comunidade e experiências em um só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ed",
    theme_color: "#305245",
    lang: "pt-BR",
    categories: ["lifestyle", "social"],
  };
}

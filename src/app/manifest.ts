import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nome} - ${site.claim}`,
    short_name: site.nome,
    description: site.descrizione,
    lang: site.lingua,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    // Il blu del marchio, lo stesso della barra superiore e del footer.
    theme_color: "#00051a",
    icons: [
      { src: "/img/logo/icona-192.png", sizes: "192x192", type: "image/png" },
      { src: "/img/logo/icona-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

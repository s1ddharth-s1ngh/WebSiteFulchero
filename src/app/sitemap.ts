import type { MetadataRoute } from "next";
import { routes, SERVIZIO_SLUGS, TUTTE_LE_ROUTE } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Il progetto ASP.NET non aveva sitemap: i motori dovevano scoprire le
 * quattordici pagine seguendo i link, e con il canonical fisso sulla home
 * avevano anche un motivo per ignorarle.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const generata = new Date();
  const servizi = new Set<string>(SERVIZIO_SLUGS.map(routes.servizio));

  return TUTTE_LE_ROUTE.map((percorso) => ({
    url: new URL(percorso, site.url).toString(),
    lastModified: generata,
    changeFrequency: "monthly" as const,
    // La home per prima, poi le sezioni, infine il dettaglio dei servizi.
    priority: percorso === routes.home ? 1 : servizi.has(percorso) ? 0.7 : 0.8,
  }));
}

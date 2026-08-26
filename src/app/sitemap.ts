import type { MetadataRoute } from "next";
import { AZIENDA } from "@/data/company";
import { HOME } from "@/data/home";
import { PAGINA_CONTATTI, PAGINA_SERVIZI } from "@/data/pages";
import { VOCI_PORTFOLIO } from "@/data/portfolio";
import { SERVIZI_CONTENUTO } from "@/data/services";
import { routes, SERVIZI, SERVIZIO_SLUGS, TUTTE_LE_ROUTE } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Il progetto ASP.NET non aveva sitemap: i motori dovevano scoprire le
 * quattordici pagine seguendo i link, e con il canonical fisso sulla home
 * avevano anche un motivo per ignorarle.
 *
 * Ogni voce dichiara anche le fotografie della pagina. Per uno studio che
 * vende progetti realizzati la ricerca immagini e' un canale a se': senza
 * questa dichiarazione i motori devono indovinare quali immagini appartengano
 * a quale pagina.
 */

const assoluto = (percorso: string) => new URL(percorso, site.url).toString();

/** Le fotografie che vale la pena far indicizzare, pagina per pagina. */
function immaginiDi(percorso: string): string[] {
  if (percorso === routes.home) {
    return [HOME.banner.immagine.src, HOME.servizi.illustrazione.src];
  }
  if (percorso === routes.azienda) {
    return [AZIENDA.chiSiamo.illustrazione.src, AZIENDA.numeri.immagine.src];
  }
  if (percorso === routes.servizi) {
    return [PAGINA_SERVIZI.illustrazione.src];
  }
  if (percorso === routes.portfolio) {
    // I sedici lavori realizzati: sono il contenuto per cui questa pagina
    // esiste, e l'unico posto del sito dove compaiono.
    return VOCI_PORTFOLIO.filter((voce) => voce.tipo === "progetto").map(
      (progetto) => progetto.immagine.src,
    );
  }
  if (percorso === routes.contatti) {
    return [PAGINA_CONTATTI.introduzione.illustrazione.src];
  }

  const servizio = SERVIZIO_SLUGS.find((slug) => routes.servizio(slug) === percorso);
  return servizio ? [SERVIZI_CONTENUTO[servizio].illustrazione.src] : [];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const generata = new Date();
  const servizi = new Set<string>(SERVIZI.map(({ slug }) => routes.servizio(slug)));

  return TUTTE_LE_ROUTE.map((percorso) => ({
    url: assoluto(percorso),
    lastModified: generata,
    changeFrequency: "monthly" as const,
    // La home per prima, poi le sezioni, infine il dettaglio dei servizi.
    priority: percorso === routes.home ? 1 : servizi.has(percorso) ? 0.7 : 0.8,
    images: immaginiDi(percorso).map(assoluto),
  }));
}

import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Lunghezza oltre la quale i motori di ricerca troncano la descrizione. */
const MAX_DESCRIZIONE = 155;

/**
 * Accorcia un testo all'ultima parola intera che sta nel limite.
 *
 * Le descrizioni sono ricavate dai testi reali delle pagine: sono gia' scritte
 * per essere lette, e restano allineate al contenuto se il contenuto cambia.
 */
export function riassunto(testo: string, limite = MAX_DESCRIZIONE): string {
  const pulito = testo.replace(/\s+/g, " ").trim();
  if (pulito.length <= limite) return pulito;
  const taglio = pulito.slice(0, limite - 1);
  const ultimoSpazio = taglio.lastIndexOf(" ");
  return `${(ultimoSpazio > limite * 0.6 ? taglio.slice(0, ultimoSpazio) : taglio).trimEnd()}…`;
}

type Opzioni = {
  /** Va nel titolo prima del nome dello studio. */
  titolo: string;
  descrizione: string;
  /** Percorso della pagina, per il canonical. */
  percorso: string;
  /**
   * Nome del file in /img/og, senza estensione: e' l'immagine mostrata da chi
   * condivide il link. Senza, la pagina eredita l'anteprima con il marchio
   * dichiarata dal layout, uguale per tutto il sito.
   */
  anteprima: string;
};

/**
 * Metadati di una pagina interna.
 *
 * Il layout Razor dichiarava la stessa description su tutte e quattordici le
 * pagine e un canonical fisso sulla home: per i motori di ricerca tredici
 * pagine dichiaravano di essere una copia della home.
 */
export function metadataPagina({ titolo, descrizione, percorso, anteprima }: Opzioni): Metadata {
  const testo = riassunto(descrizione);
  const immagine = {
    url: `/img/og/${anteprima}.jpg`,
    width: 1200,
    height: 630,
    alt: `${titolo} | ${site.nome}`,
  };

  return {
    title: titolo,
    description: testo,
    alternates: { canonical: percorso },
    openGraph: {
      title: `${titolo} | ${site.nome}`,
      description: testo,
      url: percorso,
      type: "website",
      images: [immagine],
    },
    twitter: {
      title: `${titolo} | ${site.nome}`,
      description: testo,
      images: [immagine.url],
    },
  };
}

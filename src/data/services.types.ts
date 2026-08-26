import type { ServizioSlug } from "@/lib/routes";

/**
 * Porzione di titolo. Il tema evidenzia una parte del titolo con uno span
 * (`.mil-accent` negli h1, `.mil-marker` negli h2). Gli a capo sono `\n`: il
 * dato resta testo e la resa in HTML e' compito del componente.
 */
export type FrammentoTitolo = {
  testo: string;
  evidenziato: boolean;
};

export type TitoloRicco = readonly FrammentoTitolo[];

export type Immagine = {
  src: string;
  alt: string;
  /** `object-position`, quando il ritaglio di default taglia male il soggetto. */
  posizione?: string;
};

/** Valori di partenza e arrivo di un'animazione legata allo scorrimento. */
export type Escursione = {
  da: string;
  a: string;
};

export type ContenutoServizio = {
  slug: ServizioSlug;
  /** Titolo della pagina, dal ViewData["Title"] della view originale. */
  titoloPagina: string;
  /** Nome con cui gli altri servizi citano questo nei link avanti e indietro. */
  nomeEsteso: string;

  banner: {
    immagine: Immagine;
    scala: Escursione;
    suptitolo: string;
    titolo: TitoloRicco;
  };

  descrizione: {
    suptitolo: string;
    titolo: TitoloRicco;
    paragrafi: readonly string[];
  };

  caratteristiche: {
    titolo: string;
    colonne: readonly {
      titolo: string;
      voci: readonly string[];
    }[];
  };

  /** Fotografia a piena larghezza tra le caratteristiche e i principi. */
  illustrazione: Immagine;

  principi: {
    suptitolo: string;
    titolo: string;
    testo: string;
    card: readonly {
      icona: Immagine;
      titolo: string;
      testo: string;
    }[];
  };

  conclusioni: {
    titolo: string;
    paragrafi: readonly string[];
    citazione: {
      testo: string;
      autore: string;
    };
  };
};

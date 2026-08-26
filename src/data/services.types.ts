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
  /**
   * Dimensioni reali del file. Servono dove l'immagine non riempie un
   * contenitore ma si dimensiona da se': next/image le usa per riservare lo
   * spazio giusto ed evitare che la pagina salti quando l'immagine arriva.
   */
  dimensioni?: { larghezza: number; altezza: number };
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

  /**
   * Testo breve della card servizio, mostrata nella griglia della pagina
   * Servizi e nelle tre card in evidenza sulla Home. Nel progetto originale
   * era scritta due volte, in Servizi.cshtml e in Index.cshtml.
   */
  cardTesto: string;

  /**
   * Riga orizzontale tra le caratteristiche e l'illustrazione. Presente in
   * otto pagine su nove: Progettazione Architettonica non ce l'ha.
   */
  divisorePrimaIllustrazione: boolean;

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

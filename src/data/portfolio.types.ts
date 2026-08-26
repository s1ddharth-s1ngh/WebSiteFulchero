import type { Immagine } from "@/data/services.types";

/** Voce della barra dei filtri sopra la griglia. */
export type FiltroPortfolio = {
  /** Tag selezionato, oppure `null` per "Tutti". */
  tag: string | null;
  etichetta: string;
};

/**
 * Proporzioni della cella nella griglia masonry: le anteprime alternano un
 * riquadro quadrato e uno piu basso e largo.
 */
export type FormaProgetto = "quadrato" | "lungo";

export type ProgettoPortfolio = {
  tipo: "progetto";
  immagine: Immagine;
  /** Gli a capo del titolo sono `\n`. */
  titolo: string;
  descrizione: string;
  /**
   * Etichetta obliqua sull'angolo dell'anteprima. Nel markup originale e'
   * scritta in modo incoerente (Architecture, architecture, STRUCTURAL): il
   * tema la rende comunque tutta maiuscola.
   */
  categoria: string;
  forma: FormaProgetto;
  /** Classi su cui agiscono i filtri. */
  tag: readonly string[];
};

/**
 * Cella vuota che allinea le colonne della griglia masonry. Nel markup
 * originale era un `.mil-grid-item.custom-spacing` senza contenuto.
 */
export type DistanziatorePortfolio = {
  tipo: "distanziatore";
};

export type VocePortfolio = ProgettoPortfolio | DistanziatorePortfolio;

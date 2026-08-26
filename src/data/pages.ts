import type { Immagine, TitoloRicco } from "@/data/services.types";

/**
 * Testata e testi introduttivi delle pagine Servizi, Portfolio e Contatti,
 * dalle rispettive view Razor.
 *
 * Le tre pagine condividono la stessa fotografia di banner con lo stesso
 * ritaglio, ma con testi alternativi diversi: sono tenuti distinti perche'
 * descrivono la pagina, non l'immagine.
 */

/** Zoom in scroll usato da tutti i banner interni. */
const SCALA_BANNER = { da: ".4", a: "1.4" } as const;

const IMMAGINE_BANNER = "/img/arch/safety.jpg";

export const PAGINA_SERVIZI = {
  banner: {
    immagine: {
      src: IMMAGINE_BANNER,
      alt: "Servizi tecnici di ingegneria e architettura a Verzuolo e Saluzzo",
      posizione: "top",
    } satisfies Immagine,
    scala: SCALA_BANNER,
    titolo: "Servizi",
  },
  elenco: {
    suptitolo: "I nostri servizi",
    titolo: "Soluzioni tecniche per\nogni esigenza",
  },
  illustrazione: {
    src: "/img/arch/servizi.jpg",
    alt: "Servizi offerti da Studio Fulchero: progettazione, ingegneria e sicurezza a Verzuolo e Saluzzo",
  } satisfies Immagine,
} as const;

export const PAGINA_PORTFOLIO = {
  banner: {
    immagine: {
      src: IMMAGINE_BANNER,
      alt: "Progetti di ingegneria e architettura a Verzuolo e Saluzzo - Studio Fulchero",
      posizione: "top",
    } satisfies Immagine,
    scala: SCALA_BANNER,
    titolo: "Portfolio",
  },
  introduzione: {
    titolo: "I nostri progetti",
    testo:
      "Scopri una selezione dei nostri lavori: progetti che raccontano la nostra passione,\nesperienza e attenzione ai dettagli, realizzati per soddisfare ogni esigenza.",
  },
} as const;

export const PAGINA_CONTATTI = {
  banner: {
    immagine: {
      src: IMMAGINE_BANNER,
      alt: "Team di ingegneri e architetti a Saluzzo - Studio Fulchero",
      posizione: "top",
    } satisfies Immagine,
    scala: SCALA_BANNER,
    titolo: "Contatti",
  },
  introduzione: {
    suptitolo: "Parliamo del Tuo Progetto",
    titolo: "Hai un’idea?",
    sottotitolo: [
      { testo: "Siamo qui per ", evidenziato: false },
      { testo: "realizzarla", evidenziato: true },
    ] satisfies TitoloRicco,
    testo:
      "Che tu abbia bisogno di una consulenza, un preventivo o semplicemente maggiori informazioni, il nostro team è a tua disposizione. Contattaci e scopri come possiamo supportarti nel tuo progetto.",
    illustrazione: {
      src: "/img/arch/civil-eng-1.png",
      alt: "Team di ingegneri e architetti a Saluzzo - Studio Fulchero",
    } satisfies Immagine,
    icona: {
      src: "/img/icons/11.svg",
      alt: "Team di ingegneri e architetti a Saluzzo - Studio Fulchero",
    } satisfies Immagine,
    vantaggi: [
      "Assistenza rapida e personalizzata",
      "Soluzioni su misura per te",
      "Richiedi una consulenza mirata",
    ],
  },
  /** Etichette dei tre recapiti; i valori arrivano da lib/site. */
  recapiti: {
    email: "Indirizzo Email",
    telefono: "Numero di Telefono",
    indirizzo: "Indirizzo Ufficio",
  },
} as const;

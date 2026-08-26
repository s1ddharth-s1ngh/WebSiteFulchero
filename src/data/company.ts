import type { Immagine, TitoloRicco } from "@/data/services.types";

/** Contenuti della pagina Azienda, da Views/Home/Azienda.cshtml. */

export type ValoreStudio = {
  titolo: string;
  testo: string;
};

export type NumeroStudio = {
  /** Etichetta sotto la cifra. */
  etichetta: string;
  /** Valore da raggiungere durante il conteggio animato. */
  valore: number;
  /** Segno "+" davanti alla cifra. */
  conPiu: boolean;
  /**
   * Se vero, il valore viene ricalcolato come anno corrente meno anno di
   * fondazione. Nel progetto originale due script inline riscrivevano il DOM
   * dopo il render per fare lo stesso calcolo lato client.
   */
  daAnnoFondazione?: boolean;
};

export const AZIENDA = {
  banner: {
    immagine: {
      src: "/img/arch/safety.jpg",
      alt: "Team di ingegneri e architetti a Saluzzo - Studio Fulchero",
      posizione: "top",
    } satisfies Immagine,
    scala: { da: ".4", a: "1.4" },
    titolo: "AZIENDA",
  },

  chiSiamo: {
    suptitolo: "Chi Siamo",
    titolo: "UNA Realtà CONSOLIDATA",
    paragrafi: [
      "Lo Studio Fulchero è una realtà consolidata nel campo dell’ingegneria civile, fondata sull’esperienza e la dedizione dell’Ing. Silvano Fulchero, che da oltre 40 anni si occupa di progettazione e direzione lavori nei cantieri.",
      "Nel 2015 lo studio si è arricchito della visione innovativa dell’Ing. Lorenzo Fulchero, che ha portato nuove competenze e un approccio moderno alla gestione dei progetti. A partire dal 2025 il team è cresciuto ulteriormente con l’ingresso dell’Ing. Elisabetta Fulchero, ingegnere civile, e dell’Ing. Stefano Fulchero, ingegnere elettrico. Questo ampliamento ha consentito allo studio di offrire una gamma di servizi ancora più completa e integrata.",
    ],
    illustrazione: {
      src: "/img/arch/fulchero-1.jpg",
      alt: "Team di ingegneri e architetti a Saluzzo - Studio Fulchero",
    } satisfies Immagine,
  },

  valori: {
    titolo: "Perché\nscegliere noi",
    testo:
      "I valori che fanno la differenza: competenza, affidabilità\ne innovazione, per garantirti sempre un servizio eccellente.",
    icona: { src: "/img/icons/11.svg", alt: "" } satisfies Immagine,
    voci: [
      {
        titolo: "Affidabilità",
        testo:
          "Ci impegniamo a garantire soluzioni sicure, puntuali e su misura per ogni cliente, costruendo relazioni basate sulla fiducia reciproca.",
      },
      {
        titolo: "Innovazione",
        testo:
          "Un approccio moderno e dinamico per integrare nuove tecnologie e competenze, sempre al passo con le esigenze del mercato.",
      },
      {
        titolo: "Professionalità",
        testo:
          "Lavoriamo con precisione e dedizione, mantenendo sempre al centro l’eccellenza tecnica e la soddisfazione del cliente.",
      },
    ] satisfies readonly ValoreStudio[],
  },

  numeri: {
    immagine: {
      src: "/img/arch/chi-siamo.jpg",
      alt: "Architetto Fulchero al lavoro su progetto a Saluzzo",
    } satisfies Immagine,
    scala: { da: "1", a: "1.4" },
    titolo: [
      { testo: "I numeri dello ", evidenziato: false },
      { testo: "Studio", evidenziato: true },
    ] satisfies TitoloRicco,
    testo:
      "Ogni numero racconta la nostra storia: anni di esperienza, progetti completati, clienti soddisfatti. Siamo cresciuti con dedizione e guardiamo al futuro con entusiasmo.",
    voci: [
      { etichetta: "anni di attività", valore: 40, conPiu: false, daAnnoFondazione: true },
      { etichetta: "progetti", valore: 3000, conPiu: true },
      { etichetta: "collaborazioni", valore: 40, conPiu: true },
    ] satisfies readonly NumeroStudio[],
  },
} as const;

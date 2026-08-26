import type { Immagine, TitoloRicco } from "@/data/services.types";
import type { ServizioSlug } from "@/lib/routes";

/**
 * Contenuti della home page, da Views/Home/Index.cshtml.
 *
 * I testi delle tre card servizio in evidenza non stanno qui: nel progetto
 * originale erano ricopiati identici in Index.cshtml e in Servizi.cshtml, e
 * ora vivono una volta sola in `services.ts`. Qui restano solo i tre slug.
 */

export type SlideBanner = {
  suptitolo: string;
  titolo: TitoloRicco;
};

export type ProgettoInEvidenza = {
  titolo: string;
  immagine: Immagine;
  testo: string;
};

export const HOME = {
  banner: {
    /** Le cinque slide condividono la stessa fotografia di sfondo. */
    immagine: {
      src: "/img/arch/city-2.jpg",
      alt: "Studio Fulchero - Geometra e Ingegnere a Verzuolo e Saluzzo",
    },
    etichettaLink: "VAI ALLA PAGINA SERVIZI",
    slide: [
      {
        suptitolo: "Visione Sartoriale",
        titolo: [
          { testo: "pratiche per\nRistrutturazioni\n", evidenziato: false },
          { testo: "su misura", evidenziato: true },
        ],
      },
      {
        suptitolo: "Visione Responsabile",
        titolo: [
          { testo: "progettazione\ndi nuovi edifici\n", evidenziato: false },
          { testo: "sostenibili", evidenziato: true },
        ],
      },
      {
        suptitolo: "Visione Protettiva",
        titolo: [
          { testo: "progettazione\ndella sicurezza\n", evidenziato: false },
          { testo: "del cantiere", evidenziato: true },
        ],
      },
      {
        suptitolo: "Visione Affidabile",
        titolo: [
          { testo: "rinnovi C.P.I.\ne pratiche\n", evidenziato: false },
          // "anticendio" e' un refuso presente nel sito in produzione:
          // riportato tale e quale, vedi MIGRATION.md.
          { testo: "anticendio", evidenziato: true },
        ],
      },
      {
        suptitolo: "Visione Futura",
        titolo: [
          { testo: "CONSULENZA\nTECNICA EDILIZIA\n", evidenziato: false },
          { testo: "PER INDUSTRIE", evidenziato: true },
        ],
      },
    ] satisfies readonly SlideBanner[],
  },

  chiSiamo: {
    suptitolo: "CHI SIAMO",
    titolo: "ESPERIENZA E INNOVAZIONE",
    paragrafi: [
      "Dal 1986, il nostro studio offre servizi di progettazione architettonica e strutturale, sicurezza nei cantieri e progettazione antincendio, offrendo consulenze tecniche mirate. Grazie alla nostra esperienza, garantiamo soluzioni su misura per ogni esigenza.",
      "Combiniamo competenze tecniche e approccio multidisciplinare per offrire soluzioni personalizzate, sicure e sostenibili. Ogni progetto è realizzato con precisione e attenzione al cliente.",
    ],
    etichettaLink: "SCOPRI DI PIÙ",
    illustrazione: {
      src: "/img/arch/civil-eng-1.png",
      alt: "Studio Fulchero - Geometra e Ingegnere a Verzuolo e Saluzzo",
    } satisfies Immagine,
    /** Etichetta accanto al numero di anni di attivita. */
    contatore: { evidenziato: "Anni", righe: ["Lavoro di", "Successo"] },
  },

  servizi: {
    suptitolo: "Servizi",
    titolo: "Cosa Facciamo",
    etichettaLink: "SCOPRI DI PIÙ",
    inEvidenza: [
      "progettazione-architettonica",
      "progettazione-strutturale",
      "progettazione-sicurezza-cantieri",
    ] satisfies readonly ServizioSlug[],
    illustrazione: {
      src: "/img/arch/servizi.jpg",
      alt: "Studio Fulchero - Geometra e Ingegnere a Verzuolo e Saluzzo",
    } satisfies Immagine,
  },

  progetti: {
    titolo: "Progetti in Evidenza",
    testo:
      "Scopri i nostri lavori realizzati, frutto di esperienza e innovazione dal 1986. Offriamo soluzioni su misura per progettazione architettonica, strutturale e sicurezza nei cantieri, con un approccio multidisciplinare che garantisce qualità e sostenibilità.",
    etichettaLink: "Esplora il Portfolio",
    voci: [
      {
        titolo: "Progettazione Industriale",
        immagine: {
          src: "/img/arch/structural.jpg",
          alt: "Progettazione Industriale",
          dimensioni: { larghezza: 2304, altezza: 1531 },
        },
        testo:
          "Abbiamo progettato le fondazioni strutturali dei nuovi silos e tralicci, assicurando deformazioni compatibili con i macchinari installati per garantirne il corretto funzionamento.",
      },
      {
        titolo: "Infrastrutture Pubbliche",
        immagine: {
          src: "/img/arch/architecture.jpg",
          alt: "Infrastrutture Pubbliche",
          dimensioni: { larghezza: 2592, altezza: 1944 },
        },
        testo:
          "Con una associazione temporanea di professionisti abbiamo redatto il progetto esecutivo della tangenziale di Saluzzo.",
      },
      {
        titolo: "Restauri e Riqualificazioni",
        immagine: {
          src: "/img/arch/restauri.png",
          alt: "Restauri e Riqualificazioni",
          dimensioni: { larghezza: 678, altezza: 683 },
        },
        testo:
          "In questo lavoro abbiamo progettato il risanamento conservativo del Palazzo Giriodi edificato in centro a Verzuolo nel 1668 da una famiglia di venditori di spezie provenienti da Venasca.",
      },
      {
        titolo: "Residenze Sostenibili",
        immagine: {
          src: "/img/arch/portfolio-18.jpeg",
          alt: "Residenze Sostenibili",
          dimensioni: { larghezza: 2000, altezza: 1500 },
        },
        testo:
          "Abbiamo progettato la ristrutturazione completa di un edificio unifamiliare, curando ogni dettaglio architettonico, strutturale e di sicurezza, per garantire funzionalità, estetica e risparmio.",
      },
    ] satisfies readonly ProgettoInEvidenza[],
  },
} as const;

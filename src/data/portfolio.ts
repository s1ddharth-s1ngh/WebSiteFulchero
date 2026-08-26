// GENERATO DA scripts/extract-portfolio.mjs - non modificare a mano.
//
// Progetti del portfolio, estratti da Views/Home/Portfolio.cshtml.

import type { FiltroPortfolio, VocePortfolio } from "@/data/portfolio.types";

export const FILTRI_PORTFOLIO: readonly FiltroPortfolio[] = [
  {
    tag: null,
    etichetta: "Tutti",
  },
  {
    tag: "architecture",
    etichetta: "Architettura",
  },
  {
    tag: "structural",
    etichetta: "Strutturale",
  },
  {
    tag: "sicurezza",
    etichetta: "Sicurezza nei cantieri",
  },
  {
    tag: "antincendio",
    etichetta: "Progettazione antincendio",
  },
  {
    tag: "sustainable",
    etichetta: "Sostenibile",
  },
];

/**
 * Le voci sono nell'ordine in cui compaiono nella griglia. I distanziatori
 * sono celle vuote che allineano le colonne della disposizione masonry.
 */
export const VOCI_PORTFOLIO: readonly VocePortfolio[] = [
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-16.jpg",
      alt: "Ottimizzazione investimenti edilizi azienda - Architetto Fulchero Saluzzo",
    },
    titolo: "OTTIMIZZAZIONE DEGLI\nINVESTIMENTI",
    descrizione:
      "Da anni ottimizziamo gli investimenti edilizi della ditta per favorirne la crescita, curando la progettazione architettonica dei nuovi capannoni e la modifica di quelli esistenti.",
    categoria: "Architecture",
    forma: "quadrato",
    tag: ["architecture", "structural", "sicurezza", "antincendio", "sustainable"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/structural.jpg",
      alt: "Progettazione fondazioni per silos industriali a Saluzzo - Ingegnere Fulchero",
    },
    titolo: "FONDAZIONI\nNUOVI SILOS",
    descrizione:
      "Abbiamo progettato le fondazioni strutturali dei nuovi silos e tralicci, assicurando deformazioni compatibili con i macchinari installati per garantirne il corretto funzionamento.",
    categoria: "structural",
    forma: "lungo",
    tag: ["structural"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-14.jpg",
      alt: "Impianto fotovoltaico agricolo progettato a Verzuolo - Studio Fulchero",
    },
    titolo: "IMPIANTO FOTOVOLTAICO\nAGRICOLO",
    descrizione:
      "Abbiamo progettato e ottimizzato un impianto fotovoltaico a terra da 0,99 MW di potenza di picco, con l’obiettivo di massimizzare sia il rendimento energetico che quello economico.",
    categoria: "SUSTAINABLE",
    forma: "quadrato",
    tag: ["architecture", "sicurezza", "sustainable"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-11.jpg",
      alt: "Rifacimento tetto condominio con linea vita a Saluzzo - Fulchero",
    },
    titolo: "RIFACIMENTO TETTO",
    descrizione:
      "Abbiamo progettato il rifacimento architettonico e strutturale del tetto di un edificio condominiale, garantendo il rispetto delle normative di sicurezza e progettando la linea vita.",
    categoria: "safety",
    forma: "lungo",
    tag: ["architecture", "structural", "sicurezza"],
  },
  {
    tipo: "distanziatore",
  },
  {
    tipo: "distanziatore",
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-18.jpeg",
      alt: "Ristrutturazione edilizia ed energetica a Verzuolo - Studio Fulchero",
    },
    titolo: "RISTRUTTURAZIONE EDILIZIA\nED ENERGETICA",
    descrizione:
      "Abbiamo progettato la ristrutturazione completa di un edificio unifamiliare, curando ogni dettaglio architettonico, strutturale e di sicurezza, per garantire funzionalità, estetica e risparmio.",
    categoria: "architecture",
    forma: "quadrato",
    tag: ["architecture", "structural", "sicurezza", "sustainable"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/architecture.jpg",
      alt: "Progetto tangenziale Saluzzo - Studio Fulchero ingegneria stradale",
    },
    titolo: "NUOVA TANGENZIALE\nDI SALUZZO",
    descrizione:
      "Con una associazione temporanea di professionisti abbiamo redatto il progetto esecutivo della tangenziale di Saluzzo.",
    categoria: "Architecture",
    forma: "lungo",
    tag: ["architecture"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-19.jpeg",
      alt: "Progettazione giardini e spazi esterni - Fulchero Verzuolo",
    },
    titolo: "PROGETTAZIONE DEI\nGIARDINI",
    descrizione:
      "Progettiamo giardini personalizzati, includendo la realizzazione di forni e pozzi, integrando soluzioni funzionali ed estetiche per valorizzare gli spazi esterni in modo unico e armonioso.",
    categoria: "architecture",
    forma: "quadrato",
    tag: ["architecture"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-21.jpg",
      alt: "Progetto centrale idroelettrica - Fulchero Verzuolo",
    },
    titolo: "CENTRALE\nIDROELETTRICA",
    descrizione:
      "Abbiamo progettato e realizzato una centrale idroelettrica da 1 MW, ottimizzando il rendimento economico e minimizzando l’impatto ambientale, per un’efficienza sostenibile.",
    categoria: "SUSTAINABLE",
    forma: "lungo",
    tag: ["architecture", "structural", "sicurezza", "sustainable"],
  },
  {
    tipo: "distanziatore",
  },
  {
    tipo: "distanziatore",
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/restauri.png",
      alt: "Risanamento conservativo Palazzo Giriodi Verzuolo - Fulchero",
    },
    titolo: "RISANAMENTO\nCONSERVATIVO",
    descrizione:
      "In questo lavoro abbiamo progettato il risanamento conservativo del Palazzo Giriodi edificato in centro a Verzuolo nel 1668 da una famiglia di venditori di spezie provenienti da Venasca.",
    categoria: "architecture",
    forma: "quadrato",
    tag: ["architecture"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-17.png",
      alt: "Progettazione strutturale villa residenziale - Fulchero ingegnere Saluzzo",
    },
    titolo: "PROGETTAZIONE DI\nUNA VILLA",
    descrizione:
      "Abbiamo curato la progettazione strutturale di una villa, garantendo stabilità, sicurezza e ottimizzazione delle soluzioni tecniche, in linea con le normative vigenti e le esigenze estetiche.",
    categoria: "structural",
    forma: "lungo",
    tag: ["structural"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-12.jpg",
      alt: "Rifacimento tetto centro storico Saluzzo - Progetto strutturale Studio Fulchero",
    },
    titolo: "RIFACIMENTO TETTO",
    descrizione:
      "Abbiamo progettato il rifacimento strutturale del tetto dell’edificio, garantendo il pieno rispetto dei vincoli del PRGC relativi al centro storico del comune di Saluzzo.",
    categoria: "structural",
    forma: "quadrato",
    tag: ["structural"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/portfolio-13.png",
      alt: "Sanatoria edilizia villetta residenziale - Fulchero Verzuolo",
    },
    titolo: "SANATORIA",
    descrizione:
      "Abbiamo progettato la sanatoria per una villetta, gestendo tutte le pratiche burocratiche e garantendo il rispetto delle normative urbanistiche e edilizie per regolarizzare l’immobile.",
    categoria: "architecture",
    forma: "lungo",
    tag: ["architecture"],
  },
  {
    tipo: "distanziatore",
  },
  {
    tipo: "distanziatore",
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/ponteggio_interno.png",
      alt: "Cantiere ponteggio interno - gestione sicurezza Fulchero",
    },
    titolo: "RISANAMENTO\nCONSERVATIVO",
    descrizione:
      "Abbiamo coordinato le imprese per assicurare un'esecuzione rapida e sicura dei lavori, ottimizzando tempi e sicurezza durante l'intervento.",
    categoria: "SAFETY",
    forma: "quadrato",
    tag: ["sicurezza"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/impianto_antincendio_collaudo.jpg",
      alt: "Impianto antincendio industriale - progettazione Fulchero Verzuolo",
    },
    titolo: "INSTALLAZIONE\nIMPIANTO SPRINKLER",
    descrizione:
      "Abbiamo progettato un impianto di spegnimento incendio per un deposito industriale di materie infiammabili, garantendo massima sicurezza e protezione contro i rischi di incendio.",
    categoria: "FIRE PREVENTION",
    forma: "lungo",
    tag: ["antincendio"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/edicola_funeraria.jpg",
      alt: "Progetto edicola funeraria - Studio Fulchero Saluzzo",
    },
    titolo: "Edicola funeraria",
    descrizione:
      "Abbiamo progettato con lo studio Quinta Dimensione una tomba di famiglia, unendo estetica e spiritualità per creare un luogo di memoria, pace e armonia senza tempo",
    categoria: "Architecture",
    forma: "quadrato",
    tag: ["architecture", "structural", "safety"],
  },
  {
    tipo: "progetto",
    immagine: {
      src: "/img/arch/lavoro_pubblico.png",
      alt: "Progetto scogliera e opere idrauliche Verzuolo - Fulchero ingegneria civile",
    },
    titolo: "NUOVA SCOGLIERA",
    descrizione:
      "Abbiamo progettato una nuova scogliera per ottimizzare il flusso delle acque, migliorando la stabilità delle sponde e riducendo l'erosione in modo sostenibile ed efficace.",
    categoria: "STRUCTURAL",
    forma: "lungo",
    tag: ["architecture", "structural"],
  },
];

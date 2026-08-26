import type { ServizioSlug } from "@/lib/routes";

/**
 * Titoli e descrizioni per i risultati di ricerca.
 *
 * ATTENZIONE: questi testi non compaiono da nessuna parte nella pagina. Vivono
 * solo dentro `<title>` e `<meta name="description">`, cioe' nella riga blu e
 * nelle due righe grigie di un risultato Google. Per questo, a differenza di
 * tutto il resto di `src/data/`, non sono verificati da `npm run check:content`
 * contro le view del vecchio sito: sono testi nuovi, scritti per la ricerca.
 *
 * Due vincoli, imposti da `npm run check:seo`:
 * - titolo entro 60 caratteri, compreso il suffisso " | Studio Fulchero" che
 *   il layout aggiunge da se': oltre, Google tronca;
 * - descrizione tra 110 e 160 caratteri.
 *
 * I titoli portano il nome del servizio e la localita, perche' le ricerche
 * sono nella forma "progettazione strutturale saluzzo". Verzuolo e Saluzzo si
 * alternano in base allo spazio disponibile: cinque pagine li nominano
 * entrambi, le altre solo Saluzzo, che e' il centro maggiore.
 */

export type TestoRicerca = {
  /** Senza il suffisso del brand, che aggiunge il layout. */
  titolo: string;
  descrizione: string;
};

/** La home usa il titolo per intero, senza suffisso. */
export const RICERCA_HOME: TestoRicerca = {
  titolo: "Studio Fulchero | Ingegneri Civili a Verzuolo e Saluzzo",
  descrizione:
    "Studio di ingegneria civile a Verzuolo (CN) dal 1986: progettazione architettonica e strutturale, sicurezza nei cantieri e antincendio a Saluzzo e dintorni.",
};

export const RICERCA_PAGINE = {
  azienda: {
    titolo: "Chi Siamo: Ingegneri Civili dal 1986",
    descrizione:
      "Quattro ingegneri, oltre 3000 progetti e quarant'anni di cantieri tra Verzuolo e Saluzzo. Esperienza consolidata e nuove competenze in un unico studio.",
  },
  servizi: {
    titolo: "Servizi di Ingegneria a Verzuolo e Saluzzo",
    descrizione:
      "Nove servizi tecnici da un unico referente: architettura, strutture, sicurezza cantieri, antincendio, impianti, linee vita, energia e lavori pubblici.",
  },
  portfolio: {
    titolo: "Progetti Realizzati a Verzuolo e Saluzzo",
    descrizione:
      "Capannoni, tetti, centrali idroelettriche, impianti fotovoltaici e restauri storici: i lavori seguiti dallo Studio Fulchero nel Saluzzese, con le immagini.",
  },
  contatti: {
    titolo: "Contatti a Verzuolo (CN)",
    descrizione:
      "Studio Fulchero, Corso Re Umberto 1° 138 a Verzuolo (CN). Telefono 0175 275.203, aperti dal lunedì al venerdì. Scrivici per un preventivo o una consulenza.",
  },
} as const satisfies Record<string, TestoRicerca>;

export const RICERCA_SERVIZI = {
  "progettazione-architettonica": {
    titolo: "Progettazione Architettonica a Saluzzo",
    descrizione:
      "Un solo referente per l'intera progettazione edilizia, dal permesso al cantiere: appalti pubblici e privati, residenziale e industriale nel Saluzzese.",
  },
  "progettazione-strutturale": {
    titolo: "Progettazione Strutturale a Saluzzo",
    descrizione:
      "Calcolo strutturale di edifici nuovi ed esistenti in cemento armato, acciaio, muratura e legno, con verifiche sismiche a norma. Verzuolo e Saluzzo.",
  },
  "progettazione-sicurezza-cantieri": {
    titolo: "Sicurezza Cantieri a Verzuolo e Saluzzo",
    descrizione:
      "Coordinamento della sicurezza in progettazione ed esecuzione: piani, sopralluoghi e gestione delle imprese per cantieri a norma nel Saluzzese.",
  },
  "progettazione-antincendio": {
    titolo: "Progettazione Antincendio a Saluzzo",
    descrizione:
      "Pratiche antincendio, rinnovi C.P.I. e impianti di spegnimento per attivita produttive e civili, dallo studio di fattibilita al collaudo. Verzuolo (CN).",
  },
  "assistenza-tecnica-industria": {
    titolo: "Assistenza Tecnica Industria a Saluzzo",
    descrizione:
      "Referente tecnico unico per le aziende del Saluzzese: nuovi capannoni, ampliamenti e ottimizzazione degli investimenti edilizi, seguiti negli anni.",
  },
  "progettazione-impianti-elettrici": {
    titolo: "Progettazione Impianti Elettrici a Saluzzo",
    descrizione:
      "Impianti elettrici sicuri e conformi alle norme CEI per abitazioni, industria e spazi commerciali, dal progetto al collaudo. Verzuolo e Saluzzo (CN).",
  },
  "progettazione-linee-vita": {
    titolo: "Progettazione Linee Vita a Saluzzo",
    descrizione:
      "Elaborato tecnico della copertura e progettazione delle linee vita, per lavorare sui tetti in sicurezza e a norma di legge. Verzuolo, Saluzzo e provincia.",
  },
  "pratiche-risparmio-energetico": {
    titolo: "Risparmio Energetico a Verzuolo e Saluzzo",
    descrizione:
      "Progettazione energetica integrata con quella architettonica e strutturale, per ridurre i consumi dell'edificio senza rinunciare al comfort abitativo.",
  },
  "gestione-lavori-pubblici": {
    titolo: "Gestione Lavori Pubblici a Saluzzo",
    descrizione:
      "Un unico referente per progettazione e direzione dei lavori negli appalti pubblici, che coordina tutte le figure coinvolte fino alla consegna dell'opera.",
  },
} as const satisfies Record<ServizioSlug, TestoRicerca>;

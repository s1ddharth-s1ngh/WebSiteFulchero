/**
 * Dati anagrafici e recapiti dello studio.
 *
 * Nel progetto ASP.NET erano copiati a mano dentro le view: l'indirizzo compare
 * in _Footer, in Contatti e nel JSON-LD di _Layout, il telefono in cinque punti
 * con tre formattazioni diverse. Qui esiste una sola fonte.
 */

/** Giorni di apertura, nella forma richiesta da schema.org. */
const GIORNI_FERIALI = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export const site = {
  nome: "Studio Fulchero",
  claim: "Ingegneria Civile, Architettura e Geometra a Verzuolo e Saluzzo",
  descrizione:
    "Studio Fulchero offre servizi di ingegneria civile, architettura e geometra a Verzuolo e Saluzzo. Specializzati in progettazione e sicurezza nei cantieri.",
  payoff: "I tuoi problemi, le nostre soluzioni.",

  /** URL canonico del sito in produzione. */
  url: "https://www.studiofulchero.it",
  lingua: "it",

  /** Anno di fondazione: gli anni di attivita si calcolano da qui. */
  annoFondazione: 1986,

  contatti: {
    email: "fulchero@gmail.com",
    /** Formato E.164, l'unico valido in un href tel:. */
    telefono: "+390175275203",
    /** Come va mostrato a schermo. */
    telefonoVisualizzato: "0175 275.203",
  },

  indirizzo: {
    via: "Corso Re Umberto 1, 138",
    /** Come compare nel footer, con l'ordinale. */
    viaVisualizzata: "Corso Re Umberto 1°, 138",
    cap: "12039",
    citta: "Verzuolo",
    provincia: "CN",
    paese: "IT",
  },

  /** Coordinate della sede, usate nei dati strutturati. */
  geo: { latitudine: 44.596478, longitudine: 7.480671 },

  orari: {
    giorni: GIORNI_FERIALI,
    giorniVisualizzati: "Dal Lunedì al Venerdì",
    fasce: [
      { apre: "08:30", chiude: "12:30" },
      { apre: "14:30", chiude: "19:30" },
    ],
  },

  /** Le due posizioni fiscali dello studio, come esposte nel footer. */
  partiteIva: [
    { titolare: "Silvano Fulchero", numero: "01979760046" },
    { titolare: "Lorenzo Fulchero", numero: "03627170040" },
  ],

  /** Informative gestite su Iubenda. */
  iubenda: {
    privacyPolicy: "https://www.iubenda.com/privacy-policy/17015228",
    cookiePolicy: "https://www.iubenda.com/privacy-policy/17015228/cookie-policy",
    /** Widget di gestione del consenso caricato nel layout. */
    widgetId: "7e79d994-bdfe-47e3-8295-d53b00b5bf0e",
  },

  /** Mappa incorporata nella pagina Contatti. */
  mappaEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.4854123511254!2d7.480670034220023!3d44.59647755969896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12cd462d66256fd3%3A0xd41ae4d2b0d4552d!2sCorso%20Re%20Umberto%2C%20138%2C%2012039%20Verzuolo%20CN!5e1!3m2!1sen!2sit!4v1734896150651!5m2!1sen!2sit",

  autore: { nome: "Growe Srl", url: "https://growe.dev" },

  /** Logo bianco, per i fondi scuri di header e footer. */
  logoChiaro: "/img/logo/StudioFulchero.svg",
  /** Marchio quadrato blu su fondo chiaro, citato come og:image assoluto. */
  logoQuadrato: "/img/logo/StudioFulchero.png",
} as const;

/** Anni di attivita alla data odierna. Il sito ne mostra il conteggio. */
export function anniDiAttivita(oggi: Date = new Date()): number {
  return oggi.getFullYear() - site.annoFondazione;
}

/** Indirizzo su una riga, per i testi correnti. */
export function indirizzoCompleto(): string {
  const { via, cap, citta, provincia } = site.indirizzo;
  return `${via}, ${cap} ${citta} (${provincia})`;
}

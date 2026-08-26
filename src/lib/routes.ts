/**
 * Mappa delle route pubbliche.
 *
 * Gli URL sono identici a quelli del progetto ASP.NET, dove erano dichiarati
 * con attributi [Route] su HomeController: il dominio e' indicizzato e
 * cambiarli significherebbe perdere il posizionamento acquisito.
 *
 * Non viene riprodotta la route MVC di default {controller}/{action}/{id?}.
 * Non serve: verificato sul sito in produzione che /Home/Azienda e simili
 * rispondano 404, perche' in ASP.NET Core un'azione con un attributo [Route]
 * esce dal routing convenzionale, e tutte le azioni di HomeController ne hanno
 * uno. Non c'erano URL duplicati da preservare.
 */

/**
 * I nove servizi, nell'ordine in cui compaiono nel sottomenu.
 *
 * L'ordine e' significativo: nel progetto originale ogni pagina servizio
 * dichiarava a mano il proprio precedente e successivo, formando una catena
 * circolare che coincide esattamente con questo elenco. Qui la catena viene
 * derivata dall'array, cosi' inserire un servizio non richiede di correggere
 * i collegamenti delle due pagine adiacenti.
 */
export const SERVIZI = [
  { slug: "progettazione-architettonica", voceMenu: "Architettura" },
  { slug: "progettazione-strutturale", voceMenu: "Strutture" },
  { slug: "progettazione-sicurezza-cantieri", voceMenu: "Sicurezza Cantieri" },
  { slug: "progettazione-antincendio", voceMenu: "Antincendio" },
  { slug: "assistenza-tecnica-industria", voceMenu: "Industria" },
  { slug: "progettazione-impianti-elettrici", voceMenu: "Impianti Elettrici" },
  { slug: "progettazione-linee-vita", voceMenu: "Linee Vita" },
  { slug: "pratiche-risparmio-energetico", voceMenu: "Risparmio Energetico" },
  { slug: "gestione-lavori-pubblici", voceMenu: "Lavori Pubblici" },
] as const;

export type Servizio = (typeof SERVIZI)[number];
export type ServizioSlug = Servizio["slug"];

export const SERVIZIO_SLUGS: readonly ServizioSlug[] = SERVIZI.map((s) => s.slug);

export const routes = {
  home: "/",
  azienda: "/azienda",
  servizi: "/servizi",
  portfolio: "/portfolio",
  contatti: "/contatti",
  servizio: (slug: ServizioSlug) => `/${slug}` as const,
} as const;

/** Voci della navigazione principale, condivise da header e footer. */
export const NAVIGAZIONE = [
  { href: routes.home, etichetta: "Home" },
  { href: routes.azienda, etichetta: "Azienda" },
  { href: routes.servizi, etichetta: "Servizi", sottomenu: SERVIZI },
  { href: routes.portfolio, etichetta: "Portfolio" },
  { href: routes.contatti, etichetta: "Contatti" },
] as const;

/** Tutti gli URL pubblici, in ordine di importanza. Base per la sitemap. */
export const TUTTE_LE_ROUTE: readonly string[] = [
  routes.home,
  routes.azienda,
  routes.servizi,
  routes.portfolio,
  routes.contatti,
  ...SERVIZIO_SLUGS.map(routes.servizio),
];

function vicino(slug: ServizioSlug, scarto: 1 | -1): Servizio {
  const posizione = SERVIZI.findIndex((s) => s.slug === slug);
  if (posizione === -1) throw new Error(`Slug servizio sconosciuto: ${slug}`);
  const trovato = SERVIZI[(posizione + scarto + SERVIZI.length) % SERVIZI.length];
  if (!trovato) throw new Error("SERVIZI non puo essere vuoto");
  return trovato;
}

/** Servizio precedente nella catena circolare. */
export const servizioPrecedente = (slug: ServizioSlug): Servizio => vicino(slug, -1);

/** Servizio successivo nella catena circolare. */
export const servizioSuccessivo = (slug: ServizioSlug): Servizio => vicino(slug, 1);

/** Vero se `percorso` e' la pagina corrente o una sua discendente. */
export function eAttiva(percorso: string, corrente: string): boolean {
  if (percorso === routes.home) return corrente === routes.home;
  return corrente === percorso || corrente.startsWith(`${percorso}/`);
}

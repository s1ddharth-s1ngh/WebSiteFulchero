import type { ProgettoPortfolio } from "@/data/portfolio.types";
import { RICERCA_SERVIZI } from "@/data/seo";
import { SERVIZI_CONTENUTO } from "@/data/services";
import { routes, SERVIZI } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Dati strutturati schema.org, un unico grafo per pagina.
 *
 * Il layout Razor dichiarava un solo blocco, un LocalBusiness scritto a mano
 * nell'HTML, con l'indirizzo privo di "@type": "PostalAddress" e quindi non
 * riconosciuto come indirizzo, e senza orari, coordinate ne anno di fondazione.
 *
 * Le entita stanno in un solo `@graph` e si citano per `@id`. Emetterle in
 * blocchi separati, come faceva la prima versione di questo file, costringe i
 * motori a indovinare che la scheda dell'attivita, la pagina e il percorso di
 * navigazione parlano della stessa cosa.
 */

const assoluto = (percorso: string) => new URL(percorso, site.url).toString();

/** Identificativi stabili a cui le entita si agganciano tra loro. */
export const ID_ATTIVITA = `${site.url}/#studio`;
const ID_SITO = `${site.url}/#sito`;
const idPagina = (percorso: string) => `${assoluto(percorso)}#pagina`;
const idBriciole = (percorso: string) => `${assoluto(percorso)}#briciole`;
const idPersona = (nome: string) => `${site.url}/#${nome.toLowerCase().replace(/\s+/g, "-")}`;

export type Briciola = { href: string; etichetta: string };

type DescrittorePagina = {
  percorso: string;
  titolo: string;
  descrizione: string;
  /** Immagine di apertura della pagina, come URL assoluto o percorso. */
  immagine?: string;
  briciole?: readonly Briciola[];
  /** Slug del servizio, sulle nove pagine di dettaglio. */
  servizio?: keyof typeof RICERCA_SERVIZI;
  /** Progetti da elencare, sulla pagina Portfolio. */
  progetti?: readonly ProgettoPortfolio[];
};

/** Le persone dello studio, citate come founder e come employee. */
function persone() {
  return site.persone.map((persona) => {
    const fiscale = site.partiteIva.find((posizione) => posizione.titolare === persona.nome);
    return {
      "@type": "Person",
      "@id": idPersona(persona.nome),
      name: persona.nome,
      jobTitle: persona.ruolo,
      worksFor: { "@id": ID_ATTIVITA },
      ...(fiscale ? { vatID: fiscale.numero } : {}),
    };
  });
}

/** Zone in cui lo studio dichiara di operare. */
function areaServita() {
  const { citta, provincia, regione } = site.areaServita;
  return [
    ...citta.map((nome) => ({ "@type": "City", name: nome })),
    { "@type": "AdministrativeArea", name: provincia },
    { "@type": "AdministrativeArea", name: regione },
  ];
}

/** I nove servizi come catalogo dell'offerta. */
function catalogoServizi() {
  return {
    "@type": "OfferCatalog",
    name: "Servizi di ingegneria, architettura e sicurezza",
    itemListElement: SERVIZI.map(({ slug }) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: SERVIZI_CONTENUTO[slug].nomeEsteso,
        url: assoluto(routes.servizio(slug)),
      },
    })),
  };
}

function attivita() {
  const { indirizzo, contatti, orari, geo } = site;

  return {
    // Sottotipo di LocalBusiness: descrive uno studio professionale meglio di
    // quanto faccia la categoria generica.
    "@type": "ProfessionalService",
    "@id": ID_ATTIVITA,
    name: site.nome,
    alternateName: `${site.nome} Ingegneri Civili`,
    description: site.descrizione,
    url: site.url,
    telephone: contatti.telefono,
    email: contatti.email,
    image: assoluto(site.logoQuadrato),
    logo: assoluto(site.logoQuadrato),
    foundingDate: String(site.annoFondazione),
    sameAs: [...site.profili],
    knowsAbout: [...site.discipline],
    address: {
      // Mancava nell'originale: senza, i motori non leggono l'oggetto come un
      // indirizzo postale e la scheda dell'attivita resta senza sede.
      "@type": "PostalAddress",
      streetAddress: indirizzo.via,
      postalCode: indirizzo.cap,
      addressLocality: indirizzo.citta,
      addressRegion: indirizzo.provincia,
      addressCountry: indirizzo.paese,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitudine,
      longitude: geo.longitudine,
    },
    openingHoursSpecification: orari.fasce.map((fascia) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...orari.giorni],
      opens: fascia.apre,
      closes: fascia.chiude,
    })),
    areaServed: areaServita(),
    hasOfferCatalog: catalogoServizi(),
    founder: site.persone
      .filter((persona) => persona.fondatore)
      .map((persona) => ({ "@id": idPersona(persona.nome) })),
    employee: site.persone.map((persona) => ({ "@id": idPersona(persona.nome) })),
  };
}

function sito() {
  return {
    "@type": "WebSite",
    "@id": ID_SITO,
    url: site.url,
    name: site.nome,
    inLanguage: "it-IT",
    publisher: { "@id": ID_ATTIVITA },
  };
}

function pagina({ percorso, titolo, descrizione, immagine, briciole }: DescrittorePagina) {
  return {
    "@type": "WebPage",
    "@id": idPagina(percorso),
    url: assoluto(percorso),
    name: titolo,
    description: descrizione,
    inLanguage: "it-IT",
    isPartOf: { "@id": ID_SITO },
    about: { "@id": ID_ATTIVITA },
    ...(immagine ? { primaryImageOfPage: assoluto(immagine) } : {}),
    ...(briciole ? { breadcrumb: { "@id": idBriciole(percorso) } } : {}),
  };
}

function percorsoNavigazione(percorso: string, voci: readonly Briciola[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": idBriciole(percorso),
    itemListElement: voci.map((voce, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: voce.etichetta,
      item: assoluto(voce.href),
    })),
  };
}

function servizioOfferto(slug: keyof typeof RICERCA_SERVIZI) {
  const contenuto = SERVIZI_CONTENUTO[slug];
  return {
    "@type": "Service",
    "@id": `${assoluto(routes.servizio(slug))}#servizio`,
    name: contenuto.nomeEsteso,
    description: RICERCA_SERVIZI[slug].descrizione,
    url: assoluto(routes.servizio(slug)),
    serviceType: contenuto.nomeEsteso,
    provider: { "@id": ID_ATTIVITA },
    areaServed: areaServita(),
  };
}

/** I progetti del portfolio, che finora nessun motore poteva leggere. */
function elencoProgetti(percorso: string, progetti: readonly ProgettoPortfolio[]) {
  return {
    "@type": "ItemList",
    "@id": `${assoluto(percorso)}#progetti`,
    name: "Progetti realizzati",
    numberOfItems: progetti.length,
    itemListElement: progetti.map((progetto, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      item: {
        "@type": "CreativeWork",
        name: progetto.titolo.replace(/\n/g, " "),
        description: progetto.descrizione,
        image: assoluto(progetto.immagine.src),
        creator: { "@id": ID_ATTIVITA },
      },
    })),
  };
}

/** Grafo completo di una pagina, pronto per essere serializzato. */
export function grafo(descrittore: DescrittorePagina) {
  const entita: object[] = [attivita(), ...persone(), sito(), pagina(descrittore)];

  if (descrittore.briciole) {
    entita.push(percorsoNavigazione(descrittore.percorso, descrittore.briciole));
  }
  if (descrittore.servizio) {
    entita.push(servizioOfferto(descrittore.servizio));
  }
  if (descrittore.progetti) {
    entita.push(elencoProgetti(descrittore.percorso, descrittore.progetti));
  }

  return { "@context": "https://schema.org", "@graph": entita };
}

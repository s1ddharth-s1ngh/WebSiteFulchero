import { site } from "@/lib/site";

/**
 * Dati strutturati schema.org.
 *
 * Il layout Razor ne dichiarava uno solo, un LocalBusiness scritto a mano
 * nell'HTML, con l'indirizzo privo di "@type": "PostalAddress" e quindi non
 * riconosciuto come indirizzo, e senza orari, coordinate ne anno di
 * fondazione.
 */

const assoluto = (percorso: string) => new URL(percorso, site.url).toString();

/** Identificativo stabile a cui le altre entita' si agganciano. */
export const ID_ATTIVITA = `${site.url}/#studio`;

export function attivita() {
  const { indirizzo, contatti, orari, geo } = site;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ID_ATTIVITA,
    name: site.nome,
    description: site.descrizione,
    url: site.url,
    telephone: contatti.telefono,
    email: contatti.email,
    image: assoluto(site.logoQuadrato),
    logo: assoluto(site.logoQuadrato),
    foundingDate: String(site.annoFondazione),
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
    areaServed: [
      { "@type": "City", name: "Verzuolo" },
      { "@type": "City", name: "Saluzzo" },
      { "@type": "AdministrativeArea", name: "Provincia di Cuneo" },
    ],
  };
}

export function briciole(voci: readonly { href: string; etichetta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: voci.map((voce, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: voce.etichetta,
      item: assoluto(voce.href),
    })),
  };
}

export function servizio({
  nome,
  descrizione,
  percorso,
}: {
  nome: string;
  descrizione: string;
  percorso: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nome,
    description: descrizione,
    url: assoluto(percorso),
    serviceType: nome,
    provider: { "@id": ID_ATTIVITA },
    areaServed: [
      { "@type": "City", name: "Verzuolo" },
      { "@type": "City", name: "Saluzzo" },
    ],
  };
}

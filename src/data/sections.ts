import type { ValoreStudio } from "@/data/company";
import type { Immagine, TitoloRicco } from "@/data/services.types";

/**
 * Contenuti delle sezioni condivise tra piu pagine, da Views/Shared.
 */

/** Chiamata all'azione in fondo a Home, Azienda e Servizi (_SezContatti). */
export const CTA_CONTATTI = {
  immagine: {
    src: "/img/arch/contact.jpg",
    alt: "Studio Fulchero - Geometra e Ingegnere a Verzuolo e Saluzzo",
    posizione: "top",
  } satisfies Immagine,
  scala: { da: "1", a: "1.2" },
  suptitolo: "Inizia ora il tuo progetto",
  titolo: [
    { testo: "I TUOI PROBLEMI\nLE NOSTRE SOLUZIONI", evidenziato: false },
  ] satisfies TitoloRicco,
  etichettaPulsante: "Contattaci",
  etichettaTelefono: "Per maggiori informazioni",
} as const;

/**
 * Sezione "Esperienza e innovazione al tuo servizio", in fondo alle pagine
 * Azienda e Servizi. Nel progetto originale era ricopiata identica nelle due
 * view, con lo stesso markup e gli stessi testi.
 */
export const COME_LAVORIAMO = {
  suptitolo: "soluzioni che contano",
  titolo: [
    { testo: "Esperienza e innovazione\n", evidenziato: false },
    { testo: "al tuo servizio", evidenziato: true },
  ] satisfies TitoloRicco,
  voci: [
    {
      titolo: "Servizi integrati e personalizzati",
      testo:
        "Un unico team per tutte le tue\nesigenze tecniche, dalla progettazione\nalla realizzazione",
    },
    {
      titolo: "Esperienza e\ninnovazione",
      testo: "Oltre 40 anni di esperienza combinati\ncon la visione delle nuove generazioni",
    },
    {
      titolo: "Soluzioni\nsostenibili e affidabili",
      testo: "Progetti pensati per durare nel tempo,\nrispettando l'ambiente e le normative",
    },
  ] satisfies readonly ValoreStudio[],
} as const;

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

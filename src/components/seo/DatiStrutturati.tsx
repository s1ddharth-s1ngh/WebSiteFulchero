import { JsonLd } from "@/components/seo/JsonLd";
import { grafo } from "@/lib/structured-data";

type Props = Parameters<typeof grafo>[0];

/**
 * Dati strutturati della pagina, in un unico grafo.
 *
 * Va richiamato da ogni pagina e non dal layout: il layout non conosce
 * percorso, titolo e immagine della pagina che sta avvolgendo, e senza quelli
 * la scheda WebPage non si puo' costruire.
 */
export function DatiStrutturati(props: Props) {
  return <JsonLd dati={grafo(props)} />;
}

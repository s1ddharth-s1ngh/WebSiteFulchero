import { Testo } from "@/components/ui/Testo";
import type { TitoloRicco } from "@/data/services.types";

type Props = {
  /** Piccola etichetta sopra il titolo. */
  suptitolo?: string;
  titolo: string | TitoloRicco;
  /** Su fondo scuro. */
  chiaro?: boolean;
  /**
   * Classe con cui evidenziare la parte marcata del titolo. Negli h2 il tema
   * usa `mil-marker`, l'evidenziatore dietro al testo.
   */
  classeEvidenza?: string;
  /** Margine sotto il titolo, dalla scala del tema. */
  margineTitolo?: string;
};

/** Coppia etichetta + titolo che apre quasi tutte le sezioni del sito. */
export function SectionHeading({
  suptitolo,
  titolo,
  chiaro = false,
  classeEvidenza = "mil-marker",
  margineTitolo,
}: Props) {
  const classiTitolo = ["mil-upper", chiaro && "mil-light", "mil-up", margineTitolo]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {suptitolo && (
        <span className={`mil-suptitle mil-upper${chiaro ? " mil-light" : ""} mil-up mil-mb-30`}>
          {suptitolo}
        </span>
      )}
      <h2 className={classiTitolo}>
        <Testo valore={titolo} classeEvidenza={classeEvidenza} />
      </h2>
    </>
  );
}

import { Fragment } from "react";
import type { TitoloRicco } from "@/data/services.types";

type Props = {
  /** Testo semplice, oppure titolo con una parte evidenziata. */
  valore: string | TitoloRicco;
  /**
   * Classe con cui evidenziare: il tema usa `mil-accent` negli h1 (colore
   * dell'accento) e `mil-marker` negli h2 (evidenziatore dietro al testo).
   */
  classeEvidenza?: string;
};

/** Spezza sugli a capo e li ricostruisce come <br />. */
function righe(testo: string) {
  return testo.split("\n").map((riga, indice) => (
    <Fragment key={indice}>
      {indice > 0 && <br />}
      {riga}
    </Fragment>
  ));
}

/**
 * Rende un testo che puo' contenere a capo e una parte evidenziata.
 *
 * Nei dati gli a capo sono `\n` e l'evidenziazione e' un flag: cosi' i
 * contenuti restano testo, ricercabili e confrontabili con le view originali,
 * invece di essere frammenti di HTML incollati nel markup.
 */
export function Testo({ valore, classeEvidenza = "mil-accent" }: Props) {
  const parti = typeof valore === "string" ? [{ testo: valore, evidenziato: false }] : valore;

  return (
    <>
      {parti.map((parte, indice) =>
        parte.evidenziato ? (
          <span key={indice} className={classeEvidenza}>
            {righe(parte.testo)}
          </span>
        ) : (
          <Fragment key={indice}>{righe(parte.testo)}</Fragment>
        ),
      )}
    </>
  );
}

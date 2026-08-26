import Image from "next/image";
import { altDi } from "@/data/alt";

/**
 * Coppia di valori letta dal motore di animazione (data-value-1 e data-value-2).
 * Il tema li usa per lo zoom in scroll (`mil-scale`, valori di scala) e per il
 * parallasse (`mil-parallax`, spostamenti verticali).
 */
export type Escursione = { da: string | number; a: string | number };

type Props = {
  src: string;
  alt: string;
  /** Zoom progressivo durante lo scorrimento. */
  scala?: Escursione;
  /** Spostamento verticale durante lo scorrimento. */
  parallasse?: Escursione;
  /** `object-position` dell'immagine, es. "top". */
  posizione?: string;
  /** Da attivare sull'immagine di apertura: e' l'LCP della pagina. */
  priorita?: boolean;
};

/**
 * Immagine di sfondo a piena area, per gli elementi `.mil-bg-img` del tema.
 *
 * Il progetto originale usava tag <img> grezzi: la stessa fotografia da 1 MB
 * veniva servita identica al telefono e al desktop. Qui passa
 * dall'ottimizzatore di Next, che genera AVIF e WebP alle risoluzioni dei
 * breakpoint dichiarati in next.config.ts.
 */
export function BgImage({ src, alt, scala, parallasse, posizione, priorita = false }: Props) {
  const escursione = scala ?? parallasse;
  const classi = ["mil-bg-img", scala && "mil-scale", parallasse && "mil-parallax"]
    .filter(Boolean)
    .join(" ");

  // Un SVG non ha nulla da ottimizzare, e l'ottimizzatore di Next lo rifiuta
  // a meno di abilitare dangerouslyAllowSVG.
  const vettoriale = src.endsWith(".svg");

  return (
    <Image
      src={src}
      // Il registro dei testi alternativi ha la precedenza su quello che
      // arriva dai dati: vedi src/data/alt.ts.
      alt={altDi(src, alt)}
      fill
      unoptimized={vettoriale}
      // Immagini a tutta larghezza: il browser sceglie in base al viewport.
      sizes="100vw"
      priority={priorita}
      className={classi}
      // `fill` scrive position e inset inline, e Next rifiuta qualunque
      // altra proprieta di geometria nello style. Le eccezioni di ingombro
      // stanno quindi nel CSS (vedi `footer .mil-bg-img` in _overrides.scss).
      {...(posizione ? { style: { objectPosition: posizione } } : {})}
      {...(escursione
        ? { "data-value-1": String(escursione.da), "data-value-2": String(escursione.a) }
        : {})}
    />
  );
}

import Image from "next/image";
import { altDi } from "@/data/alt";
import type { ReactNode } from "react";
import type { Escursione, Immagine } from "@/data/services.types";

type Props = {
  immagine: Immagine;
  /**
   * Riquadro a piena larghezza, piu basso che largo. Senza, il riquadro e'
   * quadrato: e' il caso delle illustrazioni dentro una colonna.
   */
  pienaLarghezza?: boolean;
  /** Zoom durante lo scorrimento. */
  scala?: Escursione;
  /**
   * Comparsa animata all'ingresso nel viewport. Va lasciata spenta quando il
   * riquadro sta dentro un IllustrationFrame, che la porta gia' lui: era la
   * ripartizione del markup originale.
   */
  reveal?: boolean;
  /** Classi di margine dalla scala del tema. */
  margine?: string;
  /** Contenuto sovrapposto, come il riquadro con il contatore degli anni. */
  children?: ReactNode;
};

/**
 * Riquadro con una fotografia ritagliata.
 *
 * Nel markup originale meta' di queste illustrazioni erano avvolte in un
 * carosello Swiper con una sola slide: `.mil-illustration-slider-frame` con
 * dentro `.swiper-wrapper` e `.swiper-slide`. Con una sola slide Swiper non
 * scorre e il parallasse resta fermo a progresso zero, quindi quei tre livelli
 * di div non producevano nulla. Sono stati tolti: il riquadro e' identico,
 * senza inizializzare un carosello su dodici pagine.
 */
export function Illustration({
  immagine,
  pienaLarghezza = false,
  scala,
  reveal = false,
  margine,
  children,
}: Props) {
  const classi = ["mil-illustration", pienaLarghezza && "mil-fw-item", reveal && "mil-up", margine]
    .filter(Boolean)
    .join(" ");

  const classiImmagine = scala ? "mil-scale" : undefined;

  return (
    <div className={classi}>
      <div className="mil-image-frame">
        <Image
          src={immagine.src}
          alt={altDi(immagine.src, immagine.alt)}
          fill
          sizes={pienaLarghezza ? "100vw" : "(max-width: 992px) 100vw, 50vw"}
          {...(classiImmagine ? { className: classiImmagine } : {})}
          {...(immagine.posizione ? { style: { objectPosition: immagine.posizione } } : {})}
          {...(scala ? { "data-value-1": String(scala.da), "data-value-2": String(scala.a) } : {})}
        />
      </div>
      {children}
    </div>
  );
}

/**
 * Contenitore delle illustrazioni a piena larghezza fuori dalla griglia, con
 * il ritaglio che nasconde quello che eccede.
 */
export function IllustrationFrame({
  reveal = true,
  margine,
  children,
}: {
  reveal?: boolean;
  margine?: string;
  children: ReactNode;
}) {
  const classi = ["mil-illustration-slider-frame", reveal && "mil-up", margine]
    .filter(Boolean)
    .join(" ");
  return <div className={classi}>{children}</div>;
}

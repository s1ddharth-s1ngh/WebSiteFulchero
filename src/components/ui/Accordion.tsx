"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { altDi } from "@/data/alt";
import type { ProgettoInEvidenza } from "@/data/home";
import { gsap } from "@/lib/gsap";

type Props = {
  voci: readonly ProgettoInEvidenza[];
};

/**
 * Elenco a fisarmonica dei progetti in evidenza sulla home.
 *
 * Nel tema la riga cliccabile era un `<div>`: si apriva solo col mouse e non
 * comunicava a nessuno se fosse aperta o chiusa. Qui e' un elemento con
 * `role="button"`, raggiungibile da tastiera, che dichiara il proprio stato
 * con `aria-expanded` e il pannello che comanda con `aria-controls`.
 *
 * Resta un `<div>` e non un `<button>` perche' contiene un `<h6>`, che dentro
 * un pulsante sarebbe HTML non valido: il contenuto di `<button>` puo' essere
 * solo testo o elementi di frase.
 */
export function Accordion({ voci }: Props) {
  const [aperto, setAperto] = useState<number | null>(null);
  const pannelli = useRef<(HTMLDivElement | null)[]>([]);
  const idBase = useId();

  useEffect(() => {
    const animazioni = pannelli.current.map((pannello, indice) => {
      if (!pannello) return null;
      return gsap.to(pannello, {
        height: indice === aperto ? "auto" : 0,
        duration: 0.5,
        ease: "sine",
      });
    });
    return () => {
      for (const animazione of animazioni) animazione?.kill();
    };
  }, [aperto]);

  const alternaVoce = (indice: number) =>
    setAperto((corrente) => (corrente === indice ? null : indice));

  const daTastiera = (evento: KeyboardEvent<HTMLDivElement>, indice: number) => {
    if (evento.key !== "Enter" && evento.key !== " ") return;
    // Lo spazio farebbe scorrere la pagina.
    evento.preventDefault();
    alternaVoce(indice);
  };

  return (
    <>
      {voci.map((voce, indice) => {
        const idPannello = `${idBase}-pannello-${indice}`;
        const espanso = indice === aperto;

        return (
          <div key={voce.titolo} className="mil-accordion-group mil-up">
            <div
              className="mil-accordion-menu"
              role="button"
              tabIndex={0}
              aria-expanded={espanso}
              aria-controls={idPannello}
              onClick={() => alternaVoce(indice)}
              onKeyDown={(evento) => daTastiera(evento, indice)}
            >
              <div className="mil-symbol mil-thin mil-h3">
                <div className="mil-plus">+</div>
                <div className="mil-minus">-</div>
              </div>
              <h6 className="mil-upper">{voce.titolo}</h6>
            </div>

            <div
              id={idPannello}
              className="mil-accordion-content"
              ref={(nodo) => {
                pannelli.current[indice] = nodo;
              }}
            >
              <Image
                src={voce.immagine.src}
                alt={altDi(voce.immagine.src, voce.immagine.alt)}
                width={voce.immagine.dimensioni?.larghezza ?? 0}
                height={voce.immagine.dimensioni?.altezza ?? 0}
                sizes="320px"
              />
              <p>{voce.testo}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}

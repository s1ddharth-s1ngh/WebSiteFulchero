"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type Isotope from "isotope-layout";
import type { FiltroPortfolio, VocePortfolio } from "@/data/portfolio.types";
import { ScrollTrigger } from "@/lib/gsap";

type Props = {
  filtri: readonly FiltroPortfolio[];
  voci: readonly VocePortfolio[];
};

/**
 * Griglia masonry dei progetti con i filtri per categoria.
 *
 * Porta l'impianto di main.js su isotope-layout in versione vanilla: la stessa
 * libreria di prima, senza il passaggio da jQuery.
 */
export function PortfolioGrid({ filtri, voci }: Props) {
  const [filtroAttivo, setFiltroAttivo] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);
  const griglia = useRef<HTMLDivElement>(null);
  const isotope = useRef<Isotope | null>(null);

  useEffect(() => {
    const nodo = griglia.current;
    if (!nodo) return;

    let smontato = false;
    let istanza: Isotope | null = null;
    let stacca: (() => void) | undefined;

    // isotope-layout e imagesloaded leggono window gia' al caricamento del
    // modulo: importarli in cima al file farebbe fallire il prerendering.
    void (async () => {
      const [{ default: Isotope }, { default: imagesLoaded }] = await Promise.all([
        import("isotope-layout"),
        import("imagesloaded"),
      ]);
      if (smontato) return;

      istanza = new Isotope(nodo, {
        itemSelector: ".mil-grid-item",
        transitionDuration: "0.5s",
        masonry: { columnWidth: ".grid-sizer" },
      });
      isotope.current = istanza;

      // Le anteprime arrivano dopo il primo disegno: finche' non hanno una
      // dimensione, isotope impila le celle nel posto sbagliato.
      const caricamento = imagesLoaded(nodo);
      const riallinea = () => {
        istanza?.layout();
        ScrollTrigger.refresh();
      };
      caricamento.on("progress", riallinea);
      caricamento.on("always", riallinea);
      stacca = () => {
        caricamento.off("progress", riallinea);
        caricamento.off("always", riallinea);
      };

      // Sblocca l'effetto del filtro, che altrimenti non avrebbe modo di
      // sapere che l'istanza e' arrivata: un filtro scelto durante il
      // caricamento resterebbe senza effetto.
      setPronto(true);
    })();

    return () => {
      smontato = true;
      stacca?.();
      istanza?.destroy();
      isotope.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pronto || !isotope.current) return;
    isotope.current.arrange({ filter: filtroAttivo ? `.${filtroAttivo}` : "*" });
    // Cambiando filtro cambia l'altezza della griglia, e con lei la posizione
    // di tutto quello che segue.
    ScrollTrigger.refresh();
  }, [filtroAttivo, pronto]);

  return (
    <>
      <div className="mil-filter mil-up mil-mb-90">
        <div className="mil-filter-links">
          {filtri.map((filtro) => (
            // Resta un <a> e non un <button> per non cambiare l'impaginazione:
            // il tema non dichiara display, quindi un <a> e' inline e il suo
            // padding verticale non allarga la riga, mentre un <button> e'
            // inline-block e la allarga. Sotto i 992px i sei filtri vanno a
            // capo e la differenza diventava di 60px sull'altezza della
            // pagina. Il ruolo e il comportamento da tastiera sono dichiarati.
            <a
              key={filtro.etichetta}
              role="button"
              tabIndex={0}
              className={filtro.tag === filtroAttivo ? "mil-current" : ""}
              aria-pressed={filtro.tag === filtroAttivo}
              onClick={() => setFiltroAttivo(filtro.tag)}
              onKeyDown={(evento) => {
                if (evento.key !== "Enter" && evento.key !== " ") return;
                evento.preventDefault();
                setFiltroAttivo(filtro.tag);
              }}
            >
              {filtro.etichetta}
            </a>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="mil-portfolio-grid mil-up" ref={griglia}>
            {/* Cella di riferimento: isotope ne misura la larghezza per
                decidere il passo delle colonne. Non e' un elemento della
                griglia, non avendo la classe mil-grid-item. */}
            <div className="grid-sizer" />

            {voci.map((voce, indice) =>
              voce.tipo === "distanziatore" ? (
                <div key={`spazio-${indice}`} className="mil-grid-item custom-spacing" />
              ) : (
                <div
                  key={voce.immagine.src + indice}
                  className={`mil-grid-item ${voce.tag.join(" ")}`}
                >
                  {/* Nel markup era un <a href="javascript:void(0);">: un link
                      senza destinazione, che entrava nell'ordine di tabulazione
                      e nell'elenco dei link degli screen reader. I progetti non
                      hanno una pagina di dettaglio. */}
                  <div
                    className={`mil-portfolio-item-2 mil-mb-30 ${
                      voce.forma === "lungo" ? "mil-long-item" : "mil-square-item"
                    }`}
                  >
                    <Image
                      src={voce.immagine.src}
                      alt={voce.immagine.alt}
                      fill
                      sizes="(max-width: 992px) 100vw, 50vw"
                    />
                    <div className="mil-project-descr">
                      <h3 className="mil-upper mil-mb-30 d-none d-md-block">
                        {voce.titolo.split("\n").map((riga, i) => (
                          <span key={riga}>
                            {i > 0 && <br />}
                            {riga}
                          </span>
                        ))}
                      </h3>
                      <div className="mil-link desc-portfolio">{voce.descrizione}</div>
                    </div>
                    <div className="mil-category">{voce.categoria}</div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}

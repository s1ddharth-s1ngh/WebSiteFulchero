"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, valoreAnimazione } from "@/lib/gsap";

type Valore = number | string;

/**
 * Anima gli elementi che corrispondono a `selettore` dallo stato descritto da
 * data-value-1 a quello descritto da data-value-2, agganciato allo scorrimento.
 *
 * Nell'originale i due data attribute e la classe erano indipendenti: scrivere
 * la classe senza i valori produceva un'animazione da undefined a undefined,
 * che GSAP risolve azzerando la proprieta. Qui gli elementi incompleti vengono
 * saltati.
 */
function animaConEscursione(
  selettore: string,
  daStato: (valore: Valore) => gsap.TweenVars,
  aStato: (valore: Valore) => gsap.TweenVars,
) {
  for (const elemento of document.querySelectorAll(selettore)) {
    const da = valoreAnimazione(elemento, "value-1");
    const a = valoreAnimazione(elemento, "value-2");
    if (da === undefined || a === undefined) continue;
    gsap.fromTo(
      elemento,
      { ...daStato(da), ease: "sine" },
      {
        ...aStato(a),
        scrollTrigger: { trigger: elemento, scrub: true, toggleActions: "play none none reverse" },
      },
    );
  }
}

/**
 * Ospita le animazioni in scroll che nel progetto originale stavano in
 * wwwroot/js/main.js, dentro un unico $(function(){...}) eseguito una volta
 * sola al caricamento della pagina.
 *
 * Con l'App Router il layout resta montato durante la navigazione: le
 * animazioni vanno ricostruite a ogni cambio di route, altrimenti dalla
 * seconda pagina in poi i contenuti resterebbero fermi allo stato iniziale.
 *
 * Rispetto all'originale le animazioni vengono saltate quando il sistema
 * dichiara prefers-reduced-motion. Il tema non prevedeva nulla del genere.
 */
export function AnimationProvider() {
  const percorso = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Comparsa dal basso all'ingresso nel viewport: e' l'animazione piu
      // diffusa del tema, oltre 600 occorrenze nel markup originale.
      for (const elemento of document.querySelectorAll(".mil-up")) {
        gsap.fromTo(
          elemento,
          { opacity: 0, y: 50, scale: 0.98, ease: "sine" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scrollTrigger: { trigger: elemento, toggleActions: "play none none reverse" },
          },
        );
      }

      // Zoom e parallasse legati allo scorrimento, con i valori di partenza e
      // arrivo letti dai data attribute dell'elemento.
      animaConEscursione(
        ".mil-scale",
        (da) => ({ scale: da }),
        (a) => ({ scale: a }),
      );
      animaConEscursione(
        ".mil-parallax",
        (da) => ({ y: da }),
        (a) => ({ y: a }),
      );
    });

    // Immagini e font arrivano dopo il primo disegno e spostano tutto quello
    // che sta sotto: senza un ricalcolo i punti di innesco resterebbero fermi
    // alle posizioni misurate a pagina ancora vuota.
    let smontato = false;
    const ricalcola = () => {
      if (!smontato) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(ricalcola);
    window.addEventListener("load", ricalcola);

    return () => {
      smontato = true;
      window.removeEventListener("load", ricalcola);
      // revert() rimuove sia le animazioni sia i loro ScrollTrigger.
      mm.revert();
    };
  }, [percorso]);

  return null;
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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
      // Le singole animazioni vengono aggiunte qui dai commit successivi.
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

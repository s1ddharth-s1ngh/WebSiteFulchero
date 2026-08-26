"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Barra verticale sul bordo destro che segue l'avanzamento nella pagina.
 *
 * Nel progetto originale stava dentro _Header.cshtml ed era animata da una
 * riga di main.js. Il tween non dichiara un trigger: ScrollTrigger interpreta
 * l'assenza come "l'intera area scorrevole", da 0 a max, che e' esattamente
 * il comportamento voluto per un indicatore di avanzamento.
 *
 * Va ricostruita a ogni cambio di route perche' l'altezza della pagina, e
 * quindi la corsa dello scroll, cambia da una pagina all'altra.
 */
export function ScrollProgress() {
  const percorso = usePathname();
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = barra.current;
    if (!elemento) return;

    const tween = gsap.to(elemento, {
      height: "100%",
      ease: "sine",
      scrollTrigger: { scrub: 0.3 },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      // Il tween lascia l'altezza all'ultimo valore raggiunto: senza questo,
      // la barra della pagina precedente resterebbe disegnata su quella nuova.
      gsap.set(elemento, { clearProps: "height" });
    };
  }, [percorso]);

  return (
    <div className="mil-progress-track" aria-hidden="true">
      <div className="mil-progress" ref={barra} />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  /** Valore da raggiungere. Viene anche reso nell'HTML iniziale. */
  valore: number;
  /**
   * Se presente, il valore viene ricalcolato nel browser come anno corrente
   * meno questo anno.
   *
   * Serve perche' il sito e' generato staticamente: senza, "anni di attivita"
   * resterebbe fermo al valore calcolato al momento della build finche'
   * qualcuno non la rifa'. L'HTML porta comunque il numero giusto alla data di
   * generazione, quindi e' corretto anche per i motori di ricerca e senza
   * JavaScript.
   */
  annoBase?: number;
  className?: string;
};

/** Conteggio animato da zero al valore, all'ingresso nel viewport. */
export function Counter({ valore, annoBase, className }: Props) {
  const elemento = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nodo = elemento.current;
    if (!nodo) return;

    const traguardo = annoBase ? new Date().getFullYear() - annoBase : valore;
    const decimali = (String(traguardo).split(".")[1] ?? "").length;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const stato = { valore: 0 };
      gsap.to(stato, {
        valore: traguardo,
        duration: 2,
        scrollTrigger: { trigger: nodo, toggleActions: "play none none reverse" },
        onUpdate: () => {
          nodo.textContent = stato.valore.toFixed(decimali);
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      nodo.textContent = traguardo.toFixed(decimali);
    });

    return () => {
      mm.revert();
      nodo.textContent = traguardo.toFixed(decimali);
    };
  }, [valore, annoBase]);

  return (
    <span ref={elemento} className={className}>
      {valore}
    </span>
  );
}

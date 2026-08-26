import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/** Freccia del tema, in coda al testo del link. */
export const ICONA_FRECCIA = "/img/icons/1.svg";

type Props = {
  href: string;
  children: ReactNode;
  /** Su fondo scuro. */
  chiaro?: boolean;
  /**
   * "indietro" ribalta l'ordine e ruota la freccia: e' la variante usata dal
   * collegamento al servizio precedente.
   */
  verso?: "avanti" | "indietro";
  /** Comparsa animata all'ingresso nel viewport. */
  reveal?: boolean;
};

/**
 * Link con la freccia, il richiamo ricorrente del tema: nel markup originale
 * compariva una quarantina di volte, ogni volta riscritto per esteso con il
 * suo span e la sua immagine.
 */
export function ArrowLink({
  href,
  children,
  chiaro = false,
  verso = "avanti",
  reveal = true,
}: Props) {
  const classi = [
    "mil-link",
    "mil-upper",
    chiaro && "mil-light",
    verso === "indietro" && "mil-left-link",
    reveal && "mil-up",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={classi}>
      {children}
      <span className="mil-arrow">
        <Icon src={ICONA_FRECCIA} />
      </span>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { altDi } from "@/data/alt";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

/** Proporzioni del file SVG: 3061x1047. */
const RAPPORTO = 1047 / 3061;

type Props = {
  /** Larghezza in pixel. Header 150, footer 180, come nel progetto originale. */
  larghezza: number;
  /** Distingue il logo dell'header da quello del footer per gli screen reader. */
  id?: string;
};

/**
 * Marchio in versione chiara, su fondo scuro. `unoptimized` perche' un SVG non
 * ha nulla da ottimizzare e cosi' non passa dall'ottimizzatore di immagini,
 * che per gli SVG richiederebbe dangerouslyAllowSVG.
 */
export function Logo({ larghezza, id }: Props) {
  return (
    <Link href={routes.home} className="mil-logo">
      <Image
        src={site.logoChiaro}
        alt={altDi(site.logoChiaro)}
        width={larghezza}
        height={Math.round(larghezza * RAPPORTO)}
        priority
        unoptimized
        {...(id ? { id } : {})}
      />
    </Link>
  );
}

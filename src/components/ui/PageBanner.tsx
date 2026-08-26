import { JsonLd } from "@/components/seo/JsonLd";
import { BgImage } from "@/components/ui/BgImage";
import { Breadcrumbs, type Briciola } from "@/components/ui/Breadcrumbs";
import { Testo } from "@/components/ui/Testo";
import type { Escursione, Immagine, TitoloRicco } from "@/data/services.types";
import { briciole as briciolePerMotori } from "@/lib/structured-data";

type Props = {
  immagine: Immagine;
  /** Zoom durante lo scorrimento. Nel tema tutti i banner interni usano .4 -> 1.4. */
  scala?: Escursione;
  suptitolo?: string;
  titolo: string | TitoloRicco;
  briciole?: readonly Briciola[];
  /** Contenuto centrato, come nelle pagine Azienda, Servizi, Portfolio e Contatti. */
  centrato?: boolean;
};

/** Zoom usato da tutti i banner interni del tema. */
export const SCALA_BANNER: Escursione = { da: ".4", a: "1.4" };

/**
 * Testata delle pagine interne: fotografia a piena larghezza, velo scuro e
 * titolo. Compare identica in tredici delle quattordici pagine del sito.
 */
export function PageBanner({
  immagine,
  scala = SCALA_BANNER,
  suptitolo,
  titolo,
  briciole,
  centrato = false,
}: Props) {
  return (
    <section className="mil-banner mil-banner-sm">
      <BgImage
        src={immagine.src}
        alt={immagine.alt}
        {...(immagine.posizione ? { posizione: immagine.posizione } : {})}
        scala={scala}
        priorita
      />
      <div className="mil-overlay" />
      <div className="container">
        <div className="mil-background-grid mil-top-space" />
        <div className={`mil-banner-content${centrato ? " mil-center" : ""}`}>
          <div className="mil-mb-90">
            {suptitolo && (
              <span className="mil-suptitle mil-upper mil-light mil-up mil-mb-30">{suptitolo}</span>
            )}
            <h1 className="mil-light mil-upper mil-up mil-mb-30">
              <Testo valore={titolo} />
            </h1>
            {briciole && (
              <>
                <Breadcrumbs voci={briciole} centrato={centrato} />
                <JsonLd dati={briciolePerMotori(briciole)} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

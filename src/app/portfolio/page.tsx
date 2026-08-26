import type { Metadata } from "next";
import { DatiStrutturati } from "@/components/seo/DatiStrutturati";
import { metadataPagina } from "@/lib/seo";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PageBanner } from "@/components/ui/PageBanner";
import { Testo } from "@/components/ui/Testo";
import { PAGINA_PORTFOLIO } from "@/data/pages";
import { RICERCA_PAGINE } from "@/data/seo";
import { FILTRI_PORTFOLIO, VOCI_PORTFOLIO } from "@/data/portfolio";
import { routes } from "@/lib/routes";

export const metadata: Metadata = metadataPagina({
  ...RICERCA_PAGINE.portfolio,
  percorso: routes.portfolio,
  anteprima: "portfolio",
});

/** Solo i progetti: i distanziatori sono celle vuote della griglia. */
const PROGETTI = VOCI_PORTFOLIO.filter((voce) => voce.tipo === "progetto");

const BRICIOLE = [
  { href: routes.home, etichetta: "Home" },
  // Nel markup questa voce puntava a un'azione "Portfoglio", che sul
  // controller non esiste: il link finiva su /Home/Portfoglio.
  { href: routes.portfolio, etichetta: "Portfolio" },
];

export default function Portfolio() {
  const { banner, introduzione } = PAGINA_PORTFOLIO;

  return (
    <>
      <DatiStrutturati
        percorso={routes.portfolio}
        titolo={RICERCA_PAGINE.portfolio.titolo}
        descrizione={RICERCA_PAGINE.portfolio.descrizione}
        immagine="/img/og/portfolio.jpg"
        briciole={BRICIOLE}
        progetti={PROGETTI}
      />

      <PageBanner
        immagine={banner.immagine}
        scala={banner.scala}
        titolo={banner.titolo}
        briciole={BRICIOLE}
        centrato
      />

      <section>
        <div className="container mil-p-120-60">
          <div className="mil-background-grid mil-softened" />
          <div className="row">
            <div className="col-12">
              <div className="mil-center">
                <h2 className="mil-upper mil-up mil-mb-30">{introduzione.titolo}</h2>
                <p className="mil-up">
                  <Testo valore={introduzione.testo} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container mil-p-0-120">
          <div className="mil-background-grid mil-softened" />
          <PortfolioGrid filtri={FILTRI_PORTFOLIO} voci={VOCI_PORTFOLIO} />
        </div>
      </section>
    </>
  );
}

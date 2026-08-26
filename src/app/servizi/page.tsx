import type { Metadata } from "next";
import { metadataPagina } from "@/lib/seo";
import { ComeLavoriamo } from "@/components/sections/ComeLavoriamo";
import { CtaContatti } from "@/components/sections/CtaContatti";
import { Illustration, IllustrationFrame } from "@/components/ui/Illustration";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { PAGINA_SERVIZI } from "@/data/pages";
import { RICERCA_PAGINE } from "@/data/seo";
import { SERVIZI_CONTENUTO } from "@/data/services";
import { routes, SERVIZI } from "@/lib/routes";

export const metadata: Metadata = metadataPagina({
  ...RICERCA_PAGINE.servizi,
  percorso: routes.servizi,
  anteprima: "servizi",
});

export default function Servizi() {
  const { banner, elenco, illustrazione } = PAGINA_SERVIZI;

  return (
    <>
      <PageBanner
        immagine={banner.immagine}
        scala={banner.scala}
        titolo={banner.titolo}
        briciole={[
          { href: routes.home, etichetta: "Home" },
          { href: routes.servizi, etichetta: "Servizi" },
        ]}
        centrato
      />

      <section>
        <div className="container mil-p-120-90">
          <div className="mil-background-grid mil-softened" />
          <div className="mil-center mil-mb-90">
            <SectionHeading suptitolo={elenco.suptitolo} titolo={elenco.titolo} />
          </div>

          <div className="row">
            {SERVIZI.map(({ slug }) => (
              <div key={slug} className="col-lg-4 mil-up">
                <ServiceCard
                  href={routes.servizio(slug)}
                  titolo={SERVIZI_CONTENUTO[slug].nomeEsteso}
                  testo={SERVIZI_CONTENUTO[slug].cardTesto}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <IllustrationFrame>
        <Illustration immagine={illustrazione} pienaLarghezza />
      </IllustrationFrame>

      <ComeLavoriamo />

      <CtaContatti />
    </>
  );
}

import { ComeLavoriamo } from "@/components/sections/ComeLavoriamo";
import { CtaContatti } from "@/components/sections/CtaContatti";
import { BgImage } from "@/components/ui/BgImage";
import { Counter } from "@/components/ui/Counter";
import { IconBox } from "@/components/ui/IconBox";
import { Illustration, IllustrationFrame } from "@/components/ui/Illustration";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testo } from "@/components/ui/Testo";
import { AZIENDA } from "@/data/company";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export default function Azienda() {
  const { banner, chiSiamo, valori, numeri } = AZIENDA;

  return (
    <>
      <PageBanner
        immagine={banner.immagine}
        scala={banner.scala}
        titolo={banner.titolo}
        briciole={[
          { href: routes.home, etichetta: "Home" },
          { href: routes.azienda, etichetta: "Azienda" },
        ]}
        centrato
      />

      {/* Chi siamo */}
      <section>
        <div className="container mil-p-0-30 pt-5 mt-5">
          <div className="mil-background-grid mil-softened" />
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-5">
              <div className="mil-mb-60">
                <SectionHeading
                  suptitolo={chiSiamo.suptitolo}
                  titolo={chiSiamo.titolo}
                  margineTitolo="mil-mb-30"
                />
                {chiSiamo.paragrafi.map((paragrafo) => (
                  <p key={paragrafo.slice(0, 40)} className="mil-up mil-mb-40">
                    {paragrafo}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <IllustrationFrame margine="mil-mb-90">
                <Illustration immagine={chiSiamo.illustrazione} />
              </IllustrationFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Perche sceglierci */}
      <section className="mil-relative">
        <div className="container mil-p-0-60">
          <div className="mil-background-grid mil-softened" />
          <div className="row align-items-end">
            <div className="col-lg-6">
              <div className="mil-mb-90">
                <h2 className="mil-upper mil-up">
                  <Testo valore={valori.titolo} />
                </h2>
                <p className="mil-up pt-4">
                  <Testo valore={valori.testo} />
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {valori.voci.map((valore) => (
              <div key={valore.titolo} className="col-lg-4">
                <IconBox icona={valori.icona} titolo={valore.titolo} testo={valore.testo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I numeri dello studio */}
      <section className="mil-dark-bg mil-relative mil-o-hidden">
        <BgImage src={numeri.immagine.src} alt={numeri.immagine.alt} scala={numeri.scala} />
        <div className="mil-overlay" />
        <div className="container mil-p-120-0">
          <div className="mil-background-grid" />
          <div className="row justify-content-between align-items-end">
            <div className="col-lg-4">
              <div className="mil-mb-90">
                <SectionHeading
                  titolo={numeri.titolo}
                  chiaro
                  classeEvidenza="mil-accent"
                  margineTitolo="mil-mb-30"
                />
                <p className="mil-light-soft mil-up mil-mb-40">{numeri.testo}</p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row mil-mb-60">
                {numeri.voci.map((voce) => (
                  <div key={voce.etichetta} className="col-lg-4">
                    <div className="mil-mb-30">
                      {/* Nel markup era un <h2>: tre titoli di secondo livello
                          che contenevano solo una cifra. */}
                      <p className="mil-h2 mil-light mil-up mil-mb-15">
                        {voce.conPiu && "+"}
                        <Counter
                          valore={voce.valore}
                          {...(voce.daAnnoFondazione ? { annoBase: site.annoFondazione } : {})}
                        />
                      </p>
                      <p className="mil-bold mil-upper mil-up mil-accent">{voce.etichetta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComeLavoriamo />

      <CtaContatti />
    </>
  );
}

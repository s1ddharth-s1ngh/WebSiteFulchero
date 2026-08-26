import { CtaContatti } from "@/components/sections/CtaContatti";
import { DatiStrutturati } from "@/components/seo/DatiStrutturati";
import { BannerSlider } from "@/components/sliders/BannerSlider";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { BgImage } from "@/components/ui/BgImage";
import { Counter } from "@/components/ui/Counter";
import { Illustration, IllustrationFrame } from "@/components/ui/Illustration";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { HOME } from "@/data/home";
import { RICERCA_HOME } from "@/data/seo";
import { SERVIZI_CONTENUTO } from "@/data/services";
import { routes } from "@/lib/routes";
import { anniDiAttivita, site } from "@/lib/site";

/** Trama decorativa che il tema usa come sfondo di sezione. */
const SFONDO_TRAMA = "/img/arch/bg.svg";

export default function Home() {
  const { chiSiamo, servizi, progetti } = HOME;

  return (
    <>
      <DatiStrutturati
        percorso={routes.home}
        titolo={RICERCA_HOME.titolo}
        descrizione={RICERCA_HOME.descrizione}
        immagine={HOME.banner.immagine.src}
      />

      <BannerSlider />

      {/* Chi siamo */}
      <section>
        <div className="container mil-p-120-30">
          <div className="mil-background-grid mil-softened" />
          <div className="row justify-content-between align-items-center flex-sm-row-reverse">
            <div className="col-lg-5">
              <div className="mil-mb-90">
                <SectionHeading
                  suptitolo={chiSiamo.suptitolo}
                  titolo={chiSiamo.titolo}
                  margineTitolo="mil-mb-30"
                />
                <p className="mil-up mil-mb-20">{chiSiamo.paragrafi[0]}</p>
                <p className="mil-up mil-mb-40">{chiSiamo.paragrafi[1]}</p>
                <ArrowLink href={routes.azienda}>{chiSiamo.etichettaLink}</ArrowLink>
              </div>
            </div>

            <div className="col-lg-6">
              <Illustration
                immagine={chiSiamo.illustrazione}
                scala={{ da: "1", a: "1.3" }}
                reveal
                margine="mil-mb-90"
              >
                <div className="mil-about-counter">
                  {/* Nel markup erano un <h1> e un <h5>: la home arrivava cosi'
                      ad avere sei <h1> e un titolo di quinto livello per
                      un'etichetta. Le utility del tema danno lo stesso aspetto
                      senza entrare nella struttura del documento. */}
                  <p className="mil-h1 mil-right mil-mb-10">
                    <Counter valore={anniDiAttivita()} annoBase={site.annoFondazione} />
                  </p>
                  <p className="mil-h5 mil-upper mil-right">
                    <span className="mil-marker">{chiSiamo.contatore.evidenziato}</span>
                    <br />
                    {chiSiamo.contatore.righe[0]} <br />
                    {chiSiamo.contatore.righe[1]}
                  </p>
                </div>
              </Illustration>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="mil-soft-bg mil-relative">
        <BgImage src={SFONDO_TRAMA} alt="" />
        <div className="container mil-p-120-90">
          <div className="mil-background-grid mil-softened" />
          <div className="row">
            <div className="col-12">
              <div className="mil-center mil-mb-90">
                <SectionHeading suptitolo={servizi.suptitolo} titolo={servizi.titolo} />
                <br />
                <ArrowLink href={routes.servizi}>{servizi.etichettaLink}</ArrowLink>
              </div>
            </div>

            {servizi.inEvidenza.map((slug) => (
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
        <Illustration immagine={servizi.illustrazione} pienaLarghezza />
      </IllustrationFrame>

      {/* Progetti in evidenza */}
      <section className="mil-relative mil-o-hidden">
        <BgImage src={SFONDO_TRAMA} alt="" posizione="top" scala={{ da: "1", a: "1.2" }} />
        <div className="container mil-p-120-90">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="mil-mb-90">
                <SectionHeading titolo={progetti.titolo} margineTitolo="mil-mb-30" />
                <p className="mil-up mil-mb-40">{progetti.testo}</p>
                <ArrowLink href={routes.portfolio}>{progetti.etichettaLink}</ArrowLink>
              </div>
            </div>

            <div className="col-lg-6 mil-mt-suptitle-offset">
              <Accordion voci={progetti.voci} />
            </div>
          </div>
        </div>
      </section>

      <CtaContatti />
    </>
  );
}

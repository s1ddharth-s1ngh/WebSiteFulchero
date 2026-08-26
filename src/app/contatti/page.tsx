import type { Metadata } from "next";
import { metadataPagina } from "@/lib/seo";
import { Icon } from "@/components/ui/Icon";
import { Illustration } from "@/components/ui/Illustration";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testo } from "@/components/ui/Testo";
import { PAGINA_CONTATTI } from "@/data/pages";
import { RICERCA_PAGINE } from "@/data/seo";
import { routes } from "@/lib/routes";
import { indirizzoCompleto, site } from "@/lib/site";

export const metadata: Metadata = metadataPagina({
  ...RICERCA_PAGINE.contatti,
  percorso: routes.contatti,
});

export default function Contatti() {
  const { banner, introduzione, recapiti } = PAGINA_CONTATTI;
  const { contatti, indirizzo } = site;

  return (
    <>
      <PageBanner
        immagine={banner.immagine}
        scala={banner.scala}
        titolo={banner.titolo}
        briciole={[
          { href: routes.home, etichetta: "Home" },
          { href: routes.contatti, etichetta: "Contatti" },
        ]}
        centrato
      />

      <section>
        <div className="container mil-p-120-30">
          <div className="mil-background-grid mil-softened" />
          <div className="row justify-content-between align-items-center flex-sm-row-reverse">
            <div className="col-lg-6">
              <Illustration
                immagine={introduzione.illustrazione}
                scala={{ da: "1", a: "1.3" }}
                reveal
                margine="mil-mb-90"
              />
            </div>

            <div className="col-lg-5">
              <div className="mil-mb-90">
                <SectionHeading
                  suptitolo={introduzione.suptitolo}
                  titolo={introduzione.titolo}
                  margineTitolo="mil-mb-15"
                />
                <h3 className="mil-upper mil-up mil-mb-30">
                  <Testo valore={introduzione.sottotitolo} classeEvidenza="mil-marker" />
                </h3>
                <p className="mil-up mil-mb-40">{introduzione.testo}</p>

                <ul className="mil-icon-list mil-mb-60">
                  {introduzione.vantaggi.map((vantaggio) => (
                    // Nel markup ogni voce era avvolta in un
                    // <a href="javascript:void(0);">: un link senza
                    // destinazione, che finiva nell'ordine di tabulazione.
                    // L'effetto al passaggio del mouse e' gia' sulla voce.
                    <li key={vantaggio} className="mil-hover mil-up">
                      <Icon src={introduzione.icona.src} />
                      {vantaggio}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container mil-p-0-120">
          <div className="mil-background-grid mil-softened" />
          <div className="mil-contact-frame mil-up">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-4 mil-mb-30">
                <a href={`mailto:${contatti.email}`}>
                  <p className="mil-dark mil-up mil-mb-10">{recapiti.email}</p>
                  {/* Nel markup erano <h4>: titoli di quarto livello che
                      contenevano un recapito. */}
                  <p className="mil-h4 mil-thin mil-up">{contatti.email}</p>
                </a>
              </div>

              <div className="col-lg-4 mil-mb-30">
                <a href={`tel:${contatti.telefono}`}>
                  <p className="mil-dark mil-up mil-mb-10">{recapiti.telefono}</p>
                  <p className="mil-h4 mil-thin mil-up">{contatti.telefonoVisualizzato}</p>
                </a>
              </div>

              <div className="col-lg-4 mil-mb-30">
                <p className="mil-dark mil-up mil-mb-10">{recapiti.indirizzo}</p>
                <p className="mil-h4 mil-thin mil-up">
                  {indirizzo.via} {indirizzo.citta} ({indirizzo.provincia})
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mil-map-frame mil-up">
        <div className="mil-map">
          {/* Il tema non dava un titolo all'iframe: chi naviga con uno screen
              reader trovava un riquadro senza nome. */}
          <iframe
            src={site.mappaEmbedUrl}
            title={`Mappa: ${indirizzoCompleto()}`}
            width={600}
            height={450}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}

import { BgImage } from "@/components/ui/BgImage";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTA_CONTATTI } from "@/data/sections";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Chiamata all'azione in fondo a Home, Azienda e Servizi.
 * Porta Views/Shared/_SezContatti.cshtml.
 */
export function CtaContatti() {
  const { immagine, scala, suptitolo, titolo, etichettaPulsante, etichettaTelefono } = CTA_CONTATTI;

  return (
    <section className="mil-dark-bg mil-relative mil-o-hidden">
      <BgImage src={immagine.src} alt={immagine.alt} posizione={immagine.posizione} scala={scala} />
      <div className="mil-overlay" />
      <div className="container mil-p-120-120">
        <div className="mil-background-grid" />
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="mil-center">
              <SectionHeading
                suptitolo={suptitolo}
                titolo={titolo}
                chiaro
                margineTitolo="mil-mb-60"
              />
              <div className="mil-complex-actions">
                <Button href={routes.contatti} reveal>
                  {etichettaPulsante}
                </Button>
                <div className="mil-phone-box">
                  <p className="mil-accent mil-mb-5">{etichettaTelefono}</p>
                  <a href={`tel:${site.contatti.telefono}`}>
                    {/* Nel markup era un <h4>: un titolo di quarto livello per
                        un numero di telefono, che entrava nella struttura del
                        documento. Stesso aspetto con la utility .mil-h4. */}
                    <p className="mil-h4 mil-light mil-thin">
                      {site.contatti.telefonoVisualizzato}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

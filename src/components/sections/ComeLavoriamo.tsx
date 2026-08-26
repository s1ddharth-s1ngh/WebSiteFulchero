import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testo } from "@/components/ui/Testo";
import { COME_LAVORIAMO } from "@/data/sections";

/**
 * Sezione "Esperienza e innovazione al tuo servizio", in fondo alle pagine
 * Azienda e Servizi. Nel progetto originale era ricopiata identica nelle due
 * view: stesso markup, stessi testi, in due file diversi.
 */
export function ComeLavoriamo() {
  return (
    <section>
      <div className="container mil-p-90-60">
        <div className="mil-background-grid mil-softened" />
        <div className="row">
          <div className="col-12">
            <div className="mil-center mil-mb-90">
              <SectionHeading
                suptitolo={COME_LAVORIAMO.suptitolo}
                titolo={COME_LAVORIAMO.titolo}
                margineTitolo="mil-mb-30"
              />
            </div>
          </div>

          {COME_LAVORIAMO.voci.map((voce) => (
            <div key={voce.titolo} className="col-lg-4">
              <div className="mil-center mil-up mil-mb-60">
                <h4 className="mil-upper mil-mb-20">
                  <Testo valore={voce.titolo} />
                </h4>
                <p>
                  <Testo valore={voce.testo} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

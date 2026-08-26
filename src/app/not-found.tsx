import type { Metadata } from "next";
import Link from "next/link";
import { BgImage } from "@/components/ui/BgImage";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pagina non trovata",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="mil-banner mil-banner-sm">
        <BgImage
          src="/img/arch/safety.jpg"
          alt=""
          posizione="top"
          scala={{ da: 0.4, a: 1.4 }}
          priorita
        />
        <div className="mil-overlay" />
        <div className="container">
          <div className="mil-banner-content mil-center">
            <div className="mil-mb-90">
              <span className="mil-suptitle mil-upper mil-light mil-mb-30">Errore 404</span>
              <h1 className="mil-light mil-upper mil-mb-30">Pagina non trovata</h1>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container mil-p-120-120">
          <div className="row justify-content-center">
            <div className="col-lg-6 mil-center">
              <p className="mil-mb-40">
                L&apos;indirizzo che hai aperto non corrisponde a nessuna pagina del sito. Puo darsi
                che il collegamento sia vecchio o che ci sia un errore di battitura.
              </p>
              <div className="mil-mb-30">
                <Link href={routes.home} className="mil-button">
                  Torna alla home
                </Link>
              </div>
              <p>
                Oppure scrivici a{" "}
                <a href={`mailto:${site.contatti.email}`}>{site.contatti.email}</a> o chiamaci allo{" "}
                <a href={`tel:${site.contatti.telefono}`}>{site.contatti.telefonoVisualizzato}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

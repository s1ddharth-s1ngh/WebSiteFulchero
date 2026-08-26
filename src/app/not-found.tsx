import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/ui/PageBanner";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pagina non trovata",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PageBanner
        immagine={{ src: "/img/arch/safety.jpg", alt: "", posizione: "top" }}
        suptitolo="Errore 404"
        titolo="Pagina non trovata"
        centrato
      />

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

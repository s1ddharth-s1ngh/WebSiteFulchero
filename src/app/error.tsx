"use client";

import Link from "next/link";
import { useEffect } from "react";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Sostituisce Views/Shared/Error.cshtml, che mostrava all'utente finale un
 * testo in inglese con l'identificativo della richiesta e tre paragrafi su come
 * abilitare l'ambiente di sviluppo di ASP.NET.
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Il dettaglio resta nella console e nei log del server, non a schermo.
    console.error(error);
  }, [error]);

  return (
    <section>
      <div className="container mil-p-120-120">
        <div className="row justify-content-center">
          <div className="col-lg-6 mil-center">
            <span className="mil-suptitle mil-upper mil-mb-30">Errore imprevisto</span>
            <h1 className="mil-upper mil-mb-30">Qualcosa non ha funzionato</h1>
            <p className="mil-mb-40">
              Si e verificato un problema nel caricamento della pagina. Puoi riprovare subito: se
              l&apos;errore si ripete, scrivici e ce ne occupiamo noi.
            </p>
            <div className="mil-mb-30">
              <button type="button" className="mil-button" onClick={reset}>
                Riprova
              </button>
            </div>
            <p>
              <Link href={routes.home}>Torna alla home</Link> oppure scrivici a{" "}
              <a href={`mailto:${site.contatti.email}`}>{site.contatti.email}</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

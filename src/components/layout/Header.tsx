"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { NAVIGAZIONE, routes, SERVIZIO_SLUGS } from "@/lib/routes";
import { site } from "@/lib/site";

/** Oltre questa distanza dal bordo superiore la barra prende il fondo scuro. */
const SOGLIA_SCROLL = 10;

/**
 * Una voce e' attiva sulla propria pagina; "Servizi" lo e' anche su ognuna
 * delle nove pagine di dettaglio, che vivono alla radice e non sotto /servizi.
 * Il progetto originale confrontava controller e action, quindi su una pagina
 * di dettaglio nessuna voce risultava evidenziata.
 */
function eAttiva(href: string, percorso: string): boolean {
  if (href === routes.servizi) {
    return (
      percorso === routes.servizi || SERVIZIO_SLUGS.some((s) => percorso === routes.servizio(s))
    );
  }
  return percorso === href;
}

export function Header() {
  const percorso = usePathname();
  const [scorso, setScorso] = useState(false);
  const [menuAperto, setMenuAperto] = useState(false);

  useEffect(() => {
    const aggiorna = () => setScorso(window.scrollY > SOGLIA_SCROLL);
    aggiorna();
    window.addEventListener("scroll", aggiorna, { passive: true });
    return () => window.removeEventListener("scroll", aggiorna);
  }, []);

  // Con la navigazione client-side la pagina non si ricarica: senza questo il
  // menu resterebbe aperto sopra la pagina appena aperta. L'aggiustamento
  // avviene in render, non in un effetto, cosi' il menu risulta gia' chiuso al
  // primo disegno della nuova pagina invece di chiudersi un fotogramma dopo.
  const [percorsoPrecedente, setPercorsoPrecedente] = useState(percorso);
  if (percorso !== percorsoPrecedente) {
    setPercorsoPrecedente(percorso);
    setMenuAperto(false);
  }

  return (
    <div className={`mil-top-panel${scorso ? " mil-active" : ""}`}>
      <div className="container-fluid">
        <div className="mil-top-panel-content">
          <Logo larghezza={150} />

          <div className={`mil-navigation${menuAperto ? " mil-active" : ""}`}>
            <nav aria-label="Navigazione principale">
              <ul>
                {NAVIGAZIONE.map((voce) => (
                  <li
                    key={voce.href}
                    className={`mil-has-children${eAttiva(voce.href, percorso) ? " mil-active" : ""}`}
                  >
                    <Link
                      href={voce.href}
                      aria-current={percorso === voce.href ? "page" : undefined}
                    >
                      {voce.etichetta}
                    </Link>

                    {"sottomenu" in voce && (
                      <ul className="d-none d-lg-block">
                        {voce.sottomenu.map((servizio) => (
                          <li key={servizio.slug}>
                            <Link href={routes.servizio(servizio.slug)}>{servizio.voceMenu}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mil-top-panel-buttons">
            <Button href={`tel:${site.contatti.telefono}`} piccolo title={`Chiama ${site.nome}`}>
              Chiama Ora
            </Button>
            <button
              type="button"
              className={`mil-menu-btn${menuAperto ? " mil-active" : ""}`}
              aria-expanded={menuAperto}
              aria-label={menuAperto ? "Chiudi il menu" : "Apri il menu"}
              onClick={() => setMenuAperto((aperto) => !aperto)}
            >
              <span />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

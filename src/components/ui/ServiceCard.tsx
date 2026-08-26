import Link from "next/link";
import { ICONA_FRECCIA } from "@/components/ui/ArrowLink";
import { Icon } from "@/components/ui/Icon";
import type { Immagine } from "@/data/services.types";

type PropsComuni = {
  titolo: string;
  testo: string;
};

/**
 * Card di un servizio nella griglia della pagina Servizi e nelle tre in
 * evidenza sulla Home: cliccabile, con la freccia che sale dal basso al passaggio
 * del mouse.
 */
export function ServiceCard({ titolo, testo, href }: PropsComuni & { href: string }) {
  return (
    <Link href={href} className="mil-service-card mil-mb-30 fixed-height">
      <div className="mil-center">
        <h4 className="mil-upper mil-mb-20">{titolo}</h4>
        <div className="mil-divider-sm mil-mb-20" />
        <p className="mil-service-text">{testo}</p>
        <div className="mil-go-buton mil-icon mil-icon-lg mil-icon-accent-bg">
          <Icon src={ICONA_FRECCIA} />
        </div>
      </div>
    </Link>
  );
}

/**
 * Stessa card, ma nella sezione "Principi della Progettazione" delle pagine
 * servizio, dove serve solo a presentare un concetto e non porta da nessuna
 * parte.
 *
 * Nel markup originale era comunque un <a href="javascript:void(0);">
 * disattivato con pointer-events inline: un link finto, che finiva
 * nell'ordine di tabulazione e nell'elenco dei link di uno screen reader
 * senza avere una destinazione. Qui e' un <div>.
 */
export function ServiceCardStatica({ titolo, testo, icona }: PropsComuni & { icona: Immagine }) {
  return (
    <div
      className="mil-service-card mil-up mil-mb-30 fixed-height"
      // Serve ancora: senza, il passaggio del mouse innescherebbe lo stato
      // :hover della card, che nel tema era disattivato proprio da qui.
      style={{ pointerEvents: "none" }}
    >
      <div className="mil-center">
        <div className="mil-icon mil-icon-lg mil-mb-30">
          {/* Le quattro card mostrano tutte la stessa icona generica, e il
              titolo sotto dice gia' di cosa si tratta: e' decorativa. Nel
              markup portava alt come "Icona innovazione nella progettazione
              strutturale - Studio Fulchero". */}
          <Icon src={icona.src} />
        </div>
        <h4 className="mil-upper mil-mb-20">{titolo}</h4>
        <div className="mil-divider-sm mil-mb-20" />
        <p>{testo}</p>
      </div>
    </div>
  );
}

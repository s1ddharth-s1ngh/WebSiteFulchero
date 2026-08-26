import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Illustration, IllustrationFrame } from "@/components/ui/Illustration";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCardStatica } from "@/components/ui/ServiceCard";
import { SERVIZI_CONTENUTO } from "@/data/services";
import {
  routes,
  servizioPrecedente,
  servizioSuccessivo,
  SERVIZI,
  type ServizioSlug,
} from "@/lib/routes";
import { metadataPagina, riassunto } from "@/lib/seo";
import { servizio as servizioPerMotori } from "@/lib/structured-data";

/**
 * Le nove pagine servizio, generate da un unico modello.
 *
 * Nel progetto ASP.NET erano nove view Razor con la stessa identica struttura,
 * per circa 2.200 righe di markup quasi uguale: cambiare la disposizione di
 * una sezione voleva dire ripetere la modifica nove volte.
 *
 * Il segmento dinamico sta alla radice, come gli URL originali. Le route
 * statiche hanno la precedenza, quindi /azienda o /servizi non finiscono qui;
 * `dynamicParams = false` fa rispondere 404 a qualunque altro indirizzo.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVIZI.map(({ slug }) => ({ servizio: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servizio: string }>;
}): Promise<Metadata> {
  const { servizio } = await params;
  const contenuto = SERVIZI_CONTENUTO[servizio as ServizioSlug];
  if (!contenuto) return {};

  return metadataPagina({
    titolo: contenuto.titoloPagina,
    // Il primo paragrafo della presentazione e' gia' scritto per spiegare il
    // servizio a chi arriva sulla pagina: e' la descrizione migliore che
    // esista, ed e' allineata al contenuto per costruzione.
    descrizione: contenuto.descrizione.paragrafi[0] ?? "",
    percorso: routes.servizio(contenuto.slug),
  });
}

/** Le sezioni del modello sono separate da una riga orizzontale. */
function Divisore() {
  return (
    <div className="container">
      <div className="mil-divider-lg" />
    </div>
  );
}

export default async function PaginaServizio({
  params,
}: {
  params: Promise<{ servizio: string }>;
}) {
  const { servizio } = await params;
  const contenuto = SERVIZI_CONTENUTO[servizio as ServizioSlug];
  if (!contenuto) notFound();

  const slug = contenuto.slug;
  const precedente = servizioPrecedente(slug);
  const successivo = servizioSuccessivo(slug);
  const { banner, descrizione, caratteristiche, illustrazione, principi, conclusioni } = contenuto;

  return (
    <>
      <JsonLd
        dati={servizioPerMotori({
          nome: contenuto.nomeEsteso,
          descrizione: riassunto(descrizione.paragrafi[0] ?? "", 300),
          percorso: routes.servizio(slug),
        })}
      />

      <PageBanner
        immagine={banner.immagine}
        scala={banner.scala}
        suptitolo={banner.suptitolo}
        titolo={banner.titolo}
      />

      {/* Presentazione */}
      <section>
        <div className="container mil-p-120-90">
          <div className="mil-background-grid mil-softened" />
          <div className="row justify-content-between">
            <div className="col-lg-4">
              <div className="mil-mb-60">
                <SectionHeading
                  suptitolo={descrizione.suptitolo}
                  titolo={descrizione.titolo}
                  margineTitolo="mil-mb-30"
                />
              </div>
            </div>
            <div className="col-lg-7 mil-mt-suptitle-offset">
              {descrizione.paragrafi.map((paragrafo) => (
                <p key={paragrafo.slice(0, 40)} className="mil-up mil-mb-30">
                  {paragrafo}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divisore />

      {/* Caratteristiche del servizio */}
      <section>
        <div className="container mil-p-120-60">
          <div className="mil-background-grid mil-softened" />
          <div className="mil-mb-90">
            <h2 className="mil-upper mil-up">{caratteristiche.titolo}</h2>
          </div>
          <div className="row mil-mb-30">
            {caratteristiche.colonne.map((colonna, indice) => (
              <div key={colonna.titolo} className="col-lg-3">
                <h6 className="mil-upper mil-up mil-mb-30">{colonna.titolo}</h6>
                <ul
                  className={`mil-list mil-dark mil-up ${
                    indice === caratteristiche.colonne.length - 1 ? "mil-mb-30" : "mil-mb-60"
                  }`}
                >
                  {colonna.voci.map((voce) => (
                    <li key={voce}>{voce}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progettazione Architettonica e' l'unica delle nove senza questa riga. */}
      {contenuto.divisorePrimaIllustrazione && <Divisore />}

      <IllustrationFrame>
        <Illustration immagine={illustrazione} pienaLarghezza />
      </IllustrationFrame>

      {/* Principi della progettazione */}
      <section>
        <div className="container mil-p-120-90">
          <div className="mil-background-grid mil-softened" />
          <div className="row justify-content-between align-items-center">
            <div className="col-xl-4">
              <div className="mil-mb-90">
                <SectionHeading
                  suptitolo={principi.suptitolo}
                  titolo={principi.titolo}
                  margineTitolo="mil-mb-30"
                />
                <p className="mil-up">{principi.testo}</p>
              </div>
            </div>

            <div className="col-xl-7">
              <div className="row">
                {principi.card.map((card) => (
                  <div key={card.titolo} className="col-md-6 col-lg-6">
                    <ServiceCardStatica
                      icona={card.icona}
                      titolo={card.titolo}
                      testo={card.testo}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divisore />

      {/* Conclusioni */}
      <section>
        <div className="container mil-p-120-90">
          <div className="row justify-content-between">
            <div className="col-lg-6">
              <h2 className="mil-upper mil-up mil-mb-30">{conclusioni.titolo}</h2>
              {conclusioni.paragrafi.map((paragrafo, indice) => (
                <p
                  key={paragrafo.slice(0, 40)}
                  // Il margine piu ampio chiude il blocco solo quando i
                  // paragrafi sono piu d'uno: e' cosi' nell'unica pagina che
                  // ne ha due.
                  className={`mil-up ${
                    conclusioni.paragrafi.length > 1 && indice === conclusioni.paragrafi.length - 1
                      ? "mil-mb-60"
                      : "mil-mb-30"
                  }`}
                >
                  {paragrafo}
                </p>
              ))}
            </div>
            <div className="col-lg-5 mil-mt-suptitle-offset">
              <div className="mil-review-frame mil-mb-30">
                <div className="mil-up">
                  <div className="mil-review-text">
                    {/* Nel markup era un <h3>: un titolo di terzo livello che
                        conteneva una citazione. La utility .mil-h3 ha lo stesso
                        aspetto. Non si usa <blockquote> perche' il tema lo
                        ridefinisce come display: flex, per la citazione con
                        l'icona virgolette, e cambierebbe l'impaginazione. */}
                    <p className="mil-h3 mil-font-2 mil-mb-30">{conclusioni.citazione.testo}</p>
                    <p className="mil-text-sm">{conclusioni.citazione.autore}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divisore />

      {/* Servizio precedente e successivo */}
      <section>
        <div className="container mil-p-120-60">
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <div className="mil-prev-project mil-mb-60">
                <h4 className="mil-upper mil-up mil-mb-30">Servizio Precedente</h4>
                <ArrowLink href={routes.servizio(precedente.slug)} verso="indietro">
                  {SERVIZI_CONTENUTO[precedente.slug].nomeEsteso}
                </ArrowLink>
              </div>
            </div>
            <div className="col-md-6 col-lg-6">
              <div className="mil-next-project mil-mb-60">
                <h4 className="mil-upper mil-up mil-mb-30">Servizio Successivo</h4>
                <ArrowLink href={routes.servizio(successivo.slug)}>
                  {SERVIZI_CONTENUTO[successivo.slug].nomeEsteso}
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

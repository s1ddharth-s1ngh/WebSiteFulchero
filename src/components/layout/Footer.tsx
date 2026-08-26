import Link from "next/link";
import { BgImage } from "@/components/ui/BgImage";
import { Logo } from "@/components/ui/Logo";
import { NAVIGAZIONE } from "@/lib/routes";
import { site } from "@/lib/site";

export function Footer() {
  const { contatti, indirizzo, orari, partiteIva, iubenda, autore } = site;

  return (
    <footer className="mil-relative">
      <BgImage
        src="/img/arch/footer.jpg"
        alt={`${site.nome} - ${site.claim}`}
        posizione="top"
        parallasse={{ da: "-25%", a: "23%" }}
        // `fill` scrive height e top inline, che superano in specificita la
        // regola `footer .mil-bg-img` del tema: va ripetuta qui.
        style={{ height: "150%", top: "-25%" }}
      />
      <div className="mil-overlay" />

      <div className="container mil-p-0-0" style={{ paddingTop: "70px" }}>
        <div className="mil-background-grid mil-softened" />
        <div className="row">
          {/* Recapiti */}
          <div className="col-md-4 align-content-bottom custom-center mb-5">
            <Logo larghezza={180} />
            <div className="text-white t-pad">
              <p className="mil-footer-riga">
                {indirizzo.cap} {indirizzo.citta} ({indirizzo.provincia})
              </p>
              <p className="mil-footer-riga">{indirizzo.viaVisualizzata}</p>
              <p className="mil-footer-riga">
                <a href={`mailto:${contatti.email}`}>Email: {contatti.email}</a>
              </p>
              <p className="mil-footer-riga">
                <a href={`tel:${contatti.telefono}`}>Tel: {contatti.telefonoVisualizzato}</a>
              </p>
              <a
                href={iubenda.privacyPolicy}
                className="iubenda-white iubenda-noiframe iubenda-embed"
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a
                href={iubenda.cookiePolicy}
                className="iubenda-white iubenda-noiframe iubenda-embed"
                title="Cookie Policy"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Orari e posizioni fiscali */}
          <div
            className="mil-center col-md-4 text-white align-content-center"
            style={{ marginBottom: "29px" }}
          >
            <h3 className="text-white">Orari di apertura</h3>
            <div className="text-white text-fpadding">
              <h6 className="text-white mil-footer-riga">{orari.giorniVisualizzati}</h6>
              {orari.fasce.map((fascia) => (
                <p key={fascia.apre} className="mil-footer-riga">
                  {fascia.apre} - {fascia.chiude}
                </p>
              ))}
            </div>
            <div className="text-white mil-footer-blocco-fiscale">
              {partiteIva.map((posizione) => (
                <p key={posizione.numero} className="mil-footer-fiscale">
                  {posizione.titolare} CF / PI: {posizione.numero}
                </p>
              ))}
            </div>
          </div>

          {/* Mappa del sito */}
          <div className="mil-center col-md-4 align-content-center mb-5">
            <h3 className="text-white">Mappatura del sito</h3>
            <nav className="text-white text-fpadding" aria-label="Mappa del sito">
              {NAVIGAZIONE.map((voce, indice) => (
                <Link key={voce.href} href={voce.href}>
                  <p className={indice === 0 ? undefined : "mil-footer-riga"}>{voce.etichetta}</p>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div
          className="mil-footer-bottom d-flex justify-content-center align-items-center"
          style={{ height: "100px" }}
        >
          <p className="mil-light-soft mil-footer-credits mil-mb-15">
            &copy; Copyright Fulchero - by{" "}
            <a href={autore.url} target="_blank" rel="noopener noreferrer">
              {autore.nome}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

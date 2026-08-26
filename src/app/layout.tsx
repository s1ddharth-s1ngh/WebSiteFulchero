import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import "@/styles/style.scss";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} - ${site.claim}`,
    // Il layout Razor appendeva a ogni titolo l'intera stringa
    // "Studio Fulchero - Ingegneria Civile, Architettura e Geometra a Verzuolo
    // e Saluzzo": 70 caratteri di coda uguale su tutte le pagine, che nei
    // risultati di ricerca venivano troncati. Le parole chiave di localita
    // stanno nei titoli e nelle descrizioni delle singole pagine.
    template: `%s | ${site.nome}`,
  },
  description: site.descrizione,
  applicationName: site.nome,
  authors: [{ name: site.autore.nome, url: site.autore.url }],
  // Il layout originale dichiarava due meta keywords in conflitto tra loro.
  keywords: [
    "studio fulchero",
    "ingegneria civile",
    "architettura",
    "geometra",
    "progettazione edilizia",
    "sicurezza cantieri",
    "Verzuolo",
    "Saluzzo",
    "Cuneo",
    "Piemonte",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: site.nome,
    title: `${site.nome} - ${site.claim}`,
    description: `${site.payoff} ${site.nome} offre soluzioni in ingegneria e architettura a Verzuolo e Saluzzo.`,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nome} - ${site.claim}`,
    description: `${site.payoff} ${site.nome} offre soluzioni in ingegneria e architettura a Verzuolo e Saluzzo.`,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lingua} className={fontVariables}>
      <body>
        <div className="mil-wrapper">
          <div id="content">{children}</div>
        </div>

        {/* Banner di gestione del consenso. Va caricato presto per essere
            mostrato prima che l'utente interagisca con la pagina. */}
        <Script
          id="iubenda-consent"
          src={`https://embeds.iubenda.com/widgets/${site.iubenda.widgetId}.js`}
          strategy="afterInteractive"
        />
        {/* Trasforma i link .iubenda-embed del footer in finestre modali.
            Il footer Razor ne caricava due copie identiche, una per link. */}
        <Script id="iubenda-embed" src="https://cdn.iubenda.com/iubenda.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

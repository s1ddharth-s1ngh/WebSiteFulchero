import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AnimationProvider } from "@/components/animation/AnimationProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { RICERCA_HOME } from "@/data/seo";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
// La griglia va caricata prima del tema, come nel layout Razor: alcune regole
// del tema contano di poter sovrascrivere quelle dei container.
import "@/styles/vendor/bootstrap-grid.css";
import "@/styles/style.scss";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: RICERCA_HOME.titolo,
    // Il layout Razor appendeva a ogni titolo l'intera stringa
    // "Studio Fulchero - Ingegneria Civile, Architettura e Geometra a Verzuolo
    // e Saluzzo": 70 caratteri di coda uguale su tutte le pagine, che nei
    // risultati di ricerca venivano troncati. Le parole chiave di localita
    // stanno nei titoli e nelle descrizioni delle singole pagine.
    template: `%s | ${site.nome}`,
  },
  description: RICERCA_HOME.descrizione,
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
    title: RICERCA_HOME.titolo,
    description: RICERCA_HOME.descrizione,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: RICERCA_HOME.titolo,
    description: RICERCA_HOME.descrizione,
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Abilita l'anteprima grande nei risultati di ricerca. Per uno studio di
      // progettazione la fotografia di un lavoro realizzato e' il contenuto
      // piu' convincente che possa comparire accanto al titolo, e senza questa
      // direttiva Google si limita alla miniatura.
      "max-image-preview": "large",
      // Nessun limite alla lunghezza dell'estratto e all'anteprima video.
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lingua} className={fontVariables}>
      <head>
        {/* I due script Iubenda vengono scoperti solo quando il browser ha
            gia' analizzato la pagina: aprire prima la connessione verso i loro
            domini toglie handshake dal percorso critico. */}
        <link rel="preconnect" href="https://embeds.iubenda.com" />
        <link rel="preconnect" href="https://cdn.iubenda.com" />
        <link rel="dns-prefetch" href="https://cdn.iubenda.com" />
      </head>
      <body>
        <div className="mil-wrapper">
          <ScrollProgress />
          <Header />
          <div id="content">{children}</div>
          <Footer />
        </div>

        <AnimationProvider />

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

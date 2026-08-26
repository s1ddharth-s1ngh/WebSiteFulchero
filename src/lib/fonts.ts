import { Caveat, Sora } from "next/font/google";

/**
 * Il tema caricava i font con un `@import url(fonts.googleapis.com)` dentro il
 * CSS: una richiesta bloccante verso un terzo dominio, scoperta solo dopo aver
 * scaricato e analizzato il foglio di stile.
 *
 * next/font scarica i file in fase di build e li serve dal dominio del sito,
 * generando anche una fallback face con le metriche corrette per evitare lo
 * scostamento del testo quando il font vero arriva.
 */

/** Font di testo del tema. Variabile: un solo file copre i pesi 100-800. */
export const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

/** Corsivo usato per le citazioni e la classe .mil-font-2. */
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

/** Da applicare all'elemento radice: espone $font-1 e $font-2 allo SCSS. */
export const fontVariables = `${sora.variable} ${caveat.variable}`;

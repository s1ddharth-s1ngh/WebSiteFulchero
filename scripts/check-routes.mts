/**
 * Interroga un'istanza in esecuzione e verifica che ogni route risponda, che
 * nessuna risorsa citata nell'HTML manchi e che gli indirizzi sconosciuti
 * rispondano 404.
 *
 * Uso: npm run build && npm start, poi in un'altra shell
 *      npx tsx scripts/check-routes.mts [http://localhost:3000]
 */
import { TUTTE_LE_ROUTE } from "@/lib/routes";
import { site } from "@/lib/site";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

/** File generati dalle convenzioni di Next, non raggiungibili dai link. */
const RISORSE_DI_SERVIZIO = ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/icon.png"];

/**
 * Indirizzi che devono rispondere 404, non renderizzare qualcosa.
 * /Home/Azienda rispondeva 404 anche sul vecchio sito: qui si verifica che
 * continui a farlo e che il segmento dinamico alla radice non se lo prenda.
 */
const INDIRIZZI_INESISTENTI = [
  "/pagina-che-non-esiste",
  "/Home/Azienda",
  "/progettazione-inesistente",
];

const problemi: string[] = [];
const risorseViste = new Set<string>();

async function stato(url: string, metodo: "GET" | "HEAD" = "GET") {
  try {
    const risposta = await fetch(url, { method: metodo, redirect: "manual" });
    return risposta;
  } catch (errore) {
    problemi.push(`${url}: richiesta fallita (${(errore as Error).message})`);
    return null;
  }
}

/** Riferimenti locali dentro l'HTML: src, href, content e srcset. */
function risorseCitate(html: string): string[] {
  const trovate = new Set<string>();

  // `content` copre og:image e twitter:image, che non stanno ne in src ne in
  // href. Next li scrive come URL assoluti sul dominio di produzione: per
  // interrogarli sull'istanza locale va tolta l'origine.
  const locale = (valore: string): string | null => {
    if (valore.startsWith(site.url)) return valore.slice(site.url.length) || "/";
    if (valore.startsWith("//") || /^https?:/.test(valore)) return null;
    return valore.startsWith("/") ? valore : null;
  };

  for (const [, valore] of html.matchAll(/(?:src|href|content)="([^"]*)"/g)) {
    const percorso = locale(valore.replace(/&amp;/g, "&"));
    if (percorso) trovate.add(percorso);
  }
  for (const [, srcset] of html.matchAll(/srcset="([^"]*)"/g)) {
    for (const voce of srcset.split(",")) {
      const url = voce.trim().split(/\s+/)[0];
      if (url?.startsWith("/")) trovate.add(url.replace(/&amp;/g, "&"));
    }
  }
  return [...trovate];
}

console.log(`check-routes: ${BASE}\n`);

for (const percorso of [...TUTTE_LE_ROUTE, ...RISORSE_DI_SERVIZIO]) {
  const risposta = await stato(BASE + percorso);
  if (!risposta) continue;

  if (risposta.status !== 200) {
    problemi.push(`${percorso}: HTTP ${risposta.status}`);
    console.log(`  ${percorso.padEnd(36)} HTTP ${risposta.status}`);
    continue;
  }

  const tipo = risposta.headers.get("content-type") ?? "";
  if (!tipo.includes("text/html")) {
    console.log(`  ${percorso.padEnd(36)} ok  (${tipo.split(";")[0]})`);
    continue;
  }

  const html = await risposta.text();
  const risorse = risorseCitate(html);
  let mancanti = 0;

  for (const risorsa of risorse) {
    if (risorseViste.has(risorsa)) continue;
    risorseViste.add(risorsa);
    const esito = await stato(BASE + risorsa, "HEAD");
    if (esito && esito.status !== 200) {
      mancanti += 1;
      problemi.push(`${percorso}: risorsa ${risorsa} risponde ${esito.status}`);
    }
  }

  console.log(
    `  ${percorso.padEnd(36)} ok  ${String(risorse.length).padStart(3)} risorse` +
      (mancanti ? `, ${mancanti} mancanti` : ""),
  );
}

console.log("");
for (const percorso of INDIRIZZI_INESISTENTI) {
  const risposta = await stato(BASE + percorso);
  const codice = risposta?.status ?? 0;
  console.log(`  ${percorso.padEnd(36)} HTTP ${codice}${codice === 404 ? " (atteso)" : ""}`);
  if (codice !== 404) problemi.push(`${percorso}: doveva rispondere 404, ha risposto ${codice}`);
}

console.log("");
if (problemi.length > 0) {
  for (const problema of problemi) console.error(`check-routes: ${problema}`);
  console.error(`\ncheck-routes: ${problemi.length} problemi`);
  process.exit(1);
}
console.log(
  `check-routes: OK - ${TUTTE_LE_ROUTE.length} route, ${RISORSE_DI_SERVIZIO.length} risorse di servizio, ` +
    `${risorseViste.size} riferimenti verificati, nessun 404 inatteso`,
);

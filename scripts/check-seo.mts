/**
 * Controlla i segnali SEO sulle pagine gia' generate.
 *
 * Legge l'HTML prodotto da `npm run build`, non i sorgenti: verifica quindi
 * cio' che i motori di ricerca vedono davvero, comprese le parti che Next
 * compone da metadata sparsi in piu' file.
 *
 * Uso: npm run build && npx tsx scripts/check-seo.mts
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const CARTELLA = process.argv[2] ?? ".next/server/app";

/** Limiti oltre i quali i motori troncano, in caratteri. */
const TITOLO_MIN = 15;
const TITOLO_MAX = 60;
const DESCRIZIONE_MIN = 110;
const DESCRIZIONE_MAX = 160;

/** Pagine che non compaiono nei risultati e non vanno valutate. */
const NON_INDICIZZATE = ["_not-found.html", "_global-error.html"];

type Pagina = {
  file: string;
  titolo: string;
  descrizione: string;
  canonical: string;
  robots: string;
  ogTitolo: string;
  ogImmagine: string;
  h1: number;
  immagini: { src: string; alt: string }[];
  schema: Record<string, unknown>[];
};

function decodifica(valore: string): string {
  return valore
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const estrai = (html: string, re: RegExp) => decodifica((html.match(re) ?? [])[1] ?? "");

function leggi(file: string): Pagina {
  const html = readFileSync(file, "utf8");

  const immagini = [...html.matchAll(/<img\b[^>]*>/g)].map((tag) => ({
    src: decodifica((tag[0].match(/\bsrc="([^"]*)"/) ?? [])[1] ?? ""),
    alt: decodifica((tag[0].match(/\balt="([^"]*)"/) ?? [])[1] ?? ""),
  }));

  const schema = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((blocco) => {
    try {
      return JSON.parse(blocco[1]!.replace(/\\u003c/g, "<")) as Record<string, unknown>;
    } catch {
      return { "@type": "JSON NON VALIDO" };
    }
  });

  return {
    file: relative(CARTELLA, file).split(sep).join("/"),
    titolo: estrai(html, /<title>([^<]*)<\/title>/),
    descrizione: estrai(html, /<meta name="description" content="([^"]*)"/),
    canonical: estrai(html, /<link rel="canonical" href="([^"]*)"/),
    robots: estrai(html, /<meta name="robots" content="([^"]*)"/),
    ogTitolo: estrai(html, /<meta property="og:title" content="([^"]*)"/),
    ogImmagine: estrai(html, /<meta property="og:image" content="([^"]*)"/),
    h1: (html.match(/<h1\b/g) ?? []).length,
    immagini,
    schema,
  };
}

function trova(cartella: string): string[] {
  return readdirSync(cartella, { withFileTypes: true }).flatMap((voce) =>
    voce.isDirectory()
      ? trova(join(cartella, voce.name))
      : voce.name.endsWith(".html")
        ? [join(cartella, voce.name)]
        : [],
  );
}

if (!existsSync(CARTELLA)) {
  console.error(`check-seo: ${CARTELLA} non trovata. Serve un npm run build.`);
  process.exit(1);
}

const pagine = trova(CARTELLA).sort().map(leggi);
const indicizzabili = pagine.filter((p) => !NON_INDICIZZATE.includes(p.file));
const problemi: string[] = [];

// --- titoli e descrizioni -------------------------------------------------
const perTitolo = new Map<string, string[]>();
const perDescrizione = new Map<string, string[]>();

for (const pagina of indicizzabili) {
  if (!pagina.titolo) problemi.push(`${pagina.file}: titolo assente`);
  else if (pagina.titolo.length > TITOLO_MAX)
    problemi.push(
      `${pagina.file}: titolo di ${pagina.titolo.length} caratteri, oltre ${TITOLO_MAX}`,
    );
  else if (pagina.titolo.length < TITOLO_MIN)
    problemi.push(`${pagina.file}: titolo di soli ${pagina.titolo.length} caratteri`);

  if (!pagina.descrizione) problemi.push(`${pagina.file}: descrizione assente`);
  else if (pagina.descrizione.length > DESCRIZIONE_MAX)
    problemi.push(
      `${pagina.file}: descrizione di ${pagina.descrizione.length} caratteri, oltre ${DESCRIZIONE_MAX}`,
    );
  else if (pagina.descrizione.length < DESCRIZIONE_MIN)
    problemi.push(
      `${pagina.file}: descrizione di soli ${pagina.descrizione.length} caratteri, sotto ${DESCRIZIONE_MIN}`,
    );

  if (!pagina.canonical) problemi.push(`${pagina.file}: canonical assente`);
  if (pagina.h1 !== 1)
    problemi.push(`${pagina.file}: ${pagina.h1} elementi h1, ne serve esattamente 1`);
  if (!pagina.ogImmagine) problemi.push(`${pagina.file}: og:image assente`);
  if (pagina.schema.length === 0) problemi.push(`${pagina.file}: nessun dato strutturato`);

  for (const [valore, mappa] of [
    [pagina.titolo, perTitolo],
    [pagina.descrizione, perDescrizione],
  ] as const) {
    if (!valore) continue;
    if (!mappa.has(valore)) mappa.set(valore, []);
    mappa.get(valore)!.push(pagina.file);
  }
}

for (const [nome, mappa] of [
  ["titolo", perTitolo],
  ["descrizione", perDescrizione],
] as const) {
  for (const [valore, file] of mappa) {
    if (file.length > 1) {
      problemi.push(
        `${nome} ripetuto su ${file.length} pagine (${file.join(", ")}): "${valore.slice(0, 60)}…"`,
      );
    }
  }
}

// --- canonical distinti ---------------------------------------------------
const canonici = new Map<string, string[]>();
for (const pagina of indicizzabili) {
  if (!pagina.canonical) continue;
  if (!canonici.has(pagina.canonical)) canonici.set(pagina.canonical, []);
  canonici.get(pagina.canonical)!.push(pagina.file);
}
for (const [url, file] of canonici) {
  if (file.length > 1)
    problemi.push(`canonical ${url} dichiarato da ${file.length} pagine: ${file.join(", ")}`);
}

// --- immagini -------------------------------------------------------------
const altPerTesto = new Map<string, Set<string>>();
let immaginiTotali = 0;
let senzaAlt = 0;
let decorative = 0;

for (const pagina of pagine) {
  for (const immagine of pagina.immagini) {
    immaginiTotali += 1;
    if (immagine.alt === "") {
      decorative += 1;
      continue;
    }
    if (!immagine.alt) senzaAlt += 1;
    if (!altPerTesto.has(immagine.alt)) altPerTesto.set(immagine.alt, new Set());
    altPerTesto.get(immagine.alt)!.add(immagine.src);
  }
}

/** Un alt usato su fotografie diverse non descrive nessuna delle due. */
const altAmbigui = [...altPerTesto.entries()]
  .filter(([, sorgenti]) => sorgenti.size > 1)
  .sort((a, b) => b[1].size - a[1].size);

for (const [testo, sorgenti] of altAmbigui) {
  problemi.push(
    `testo alternativo usato su ${sorgenti.size} immagini diverse: "${testo.slice(0, 70)}"`,
  );
}

// --- dati strutturati -----------------------------------------------------
const tipiSchema = new Map<string, number>();
for (const pagina of pagine) {
  for (const blocco of pagina.schema) {
    const contenuto = (blocco["@graph"] as Record<string, unknown>[] | undefined) ?? [blocco];
    for (const entita of contenuto) {
      const tipo = String(entita["@type"] ?? "senza @type");
      tipiSchema.set(tipo, (tipiSchema.get(tipo) ?? 0) + 1);
      if (tipo === "JSON NON VALIDO")
        problemi.push(`${pagina.file}: blocco JSON-LD non analizzabile`);
    }
  }
}

// --- resoconto ------------------------------------------------------------
console.log(`check-seo: ${indicizzabili.length} pagine indicizzabili in ${CARTELLA}\n`);
console.log("pagina".padEnd(38) + "tit  descr  h1  img  schema");
console.log("-".repeat(72));
for (const pagina of indicizzabili) {
  console.log(
    pagina.file.replace(".html", "").padEnd(38) +
      String(pagina.titolo.length).padStart(3) +
      String(pagina.descrizione.length).padStart(7) +
      String(pagina.h1).padStart(4) +
      String(pagina.immagini.length).padStart(5) +
      String(pagina.schema.length).padStart(8),
  );
}

console.log(
  `\nimmagini: ${immaginiTotali} totali, ${decorative} decorative con alt vuoto, ` +
    `${altPerTesto.size} testi alternativi distinti` +
    (senzaAlt ? `, ${senzaAlt} senza attributo alt` : ""),
);
console.log(`entita schema.org: ${[...tipiSchema].map(([t, n]) => `${t} x${n}`).join(", ")}`);

console.log("");
if (problemi.length > 0) {
  for (const problema of problemi) console.error(`check-seo: ${problema}`);
  console.error(`\ncheck-seo: ${problemi.length} problemi`);
  process.exit(1);
}
console.log("check-seo: OK - nessun problema");

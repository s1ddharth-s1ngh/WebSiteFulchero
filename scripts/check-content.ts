/**
 * Verifica che ogni testo presente in src/data compaia davvero nelle view
 * Razor del progetto ASP.NET.
 *
 * I contenuti sono stati estratti automaticamente, ma home.ts e company.ts
 * sono stati scritti a mano: questo controllo e' la prova che nel passaggio
 * non e' stata cambiata una parola. Senza, un refuso introdotto qui sarebbe
 * indistinguibile dal testo originale.
 *
 * Uso: npx tsx scripts/check-content.ts [cartella/Views]
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { AZIENDA } from "@/data/company";
import { HOME } from "@/data/home";
import { VOCI_PORTFOLIO, FILTRI_PORTFOLIO } from "@/data/portfolio";
import { SERVIZI_CONTENUTO } from "@/data/services";

const VIEWS_DIR =
  process.argv[2] ?? "C:/Users/Samar/source/repos/WebSiteFulchero/WebSiteFulchero/Views";

/**
 * Testi che nel porting sono stati cambiati di proposito: ognuno va con la
 * sua motivazione, come per le eccezioni della parita CSS.
 */
const DEVIAZIONI: { testo: string; motivo: string }[] = [
  {
    testo: "SCOPRI DI PIÙ",
    motivo:
      'nel markup e\' "SCOPRI DI PIù", con la u minuscola dentro un titolo maiuscolo. ' +
      "Il tema applica text-transform: uppercase, quindi a schermo non cambia nulla",
  },
];

const ENTITA: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#8217;": "\u2019",
  "&rsquo;": "\u2019",
  "&copy;": "\u00a9",
};

/**
 * Le view non sono uniformi nella codifica delle lettere accentate: la maggior
 * parte usa la forma precomposta (U+00E8 per "è"), ma almeno un punto di
 * Azienda.cshtml usa quella scomposta ("e" seguita dall'accento combinante
 * U+0300). Le due sequenze si disegnano identiche ma sono stringhe diverse.
 * NFC le riporta entrambe alla forma precomposta.
 */
function decodifica(valore: string): string {
  return valore.replace(/&#?\w+;/g, (entita) => ENTITA[entita] ?? entita).normalize("NFC");
}

/**
 * Riduce un testo alla forma su cui ha senso confrontare: entita decodificate,
 * tag sostituiti da uno spazio (cosi' due parole separate da <br> non si
 * incollano) e spazi collassati.
 */
function normalizza(valore: string): string {
  return decodifica(valore)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Come normalizza, ma tenendo i tag: serve perche' meta' dei testi da
 * verificare sono valori di attributo (alt, title) e sparirebbero insieme al
 * tag che li contiene.
 */
function normalizzaConAttributi(valore: string): string {
  return decodifica(valore).replace(/\s+/g, " ").trim();
}

function raccogliView(cartella: string): string {
  const parti: string[] = [];
  for (const voce of readdirSync(cartella, { withFileTypes: true })) {
    const percorso = join(cartella, voce.name);
    if (voce.isDirectory()) parti.push(raccogliView(percorso));
    else if (voce.name.endsWith(".cshtml")) parti.push(readFileSync(percorso, "utf8"));
  }
  return parti.join("\n");
}

/** Ogni stringa contenuta in un oggetto, con il percorso in cui si trova. */
function* stringhe(valore: unknown, percorso = ""): Generator<[string, string]> {
  if (typeof valore === "string") {
    yield [percorso, valore];
  } else if (Array.isArray(valore)) {
    for (const [indice, elemento] of valore.entries()) {
      yield* stringhe(elemento, `${percorso}[${indice}]`);
    }
  } else if (valore && typeof valore === "object") {
    for (const [chiave, contenuto] of Object.entries(valore)) {
      yield* stringhe(contenuto, percorso ? `${percorso}.${chiave}` : chiave);
    }
  }
}

/**
 * Chiavi che non contengono testo redazionale: percorsi di file, slug e
 * discriminanti di tipo non compaiono nelle view come testo visibile.
 */
const CHIAVI_TECNICHE = /(^|\.)(src|slug|tipo|forma|posizione|tag|inEvidenza|scala)(\[|\.|$)/;

if (!existsSync(VIEWS_DIR)) {
  console.log(`check-content: saltato, ${VIEWS_DIR} non trovato`);
  process.exit(0);
}

const sorgenteView = raccogliView(VIEWS_DIR);
// Due passate: una senza tag, per i testi che attraversano un <br>, e una con,
// per i valori degli attributi.
const pagliaio = [normalizza(sorgenteView), normalizzaConAttributi(sorgenteView)].join("\n");

const fonti: Record<string, unknown> = {
  home: HOME,
  azienda: AZIENDA,
  portfolio: { filtri: FILTRI_PORTFOLIO, voci: VOCI_PORTFOLIO },
  servizi: SERVIZI_CONTENUTO,
};

const mancanti: string[] = [];
const spiegate: string[] = [];
let verificate = 0;

for (const [nome, dati] of Object.entries(fonti)) {
  for (const [percorso, valore] of stringhe(dati, nome)) {
    if (CHIAVI_TECNICHE.test(percorso)) continue;
    const ago = normalizza(valore);
    if (ago === "") continue;
    verificate += 1;
    if (pagliaio.includes(ago)) continue;

    const deviazione = DEVIAZIONI.find((d) => normalizza(d.testo) === ago);
    if (deviazione) spiegate.push(`${percorso}: ${deviazione.motivo}`);
    else mancanti.push(`${percorso}\n  "${ago}"`);
  }
}

console.log(`check-content: ${verificate} testi confrontati con le view in ${VIEWS_DIR}`);
for (const nota of [...new Set(spiegate)]) console.log(`  deviazione voluta: ${nota}`);

if (mancanti.length > 0) {
  console.error("");
  for (const voce of mancanti) console.error(`check-content: testo assente dalle view -> ${voce}`);
  console.error(`\ncheck-content: ${mancanti.length} testi non trovati`);
  process.exit(1);
}
console.log("check-content: OK - ogni testo dei dati compare nelle view originali");

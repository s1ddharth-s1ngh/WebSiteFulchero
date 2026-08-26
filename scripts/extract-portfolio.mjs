/**
 * Estrae i progetti del portfolio da Views/Home/Portfolio.cshtml e genera
 * src/data/portfolio.ts.
 *
 * Uso: node scripts/extract-portfolio.mjs [cartella/Views/Home]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const VIEWS_DIR =
  process.argv[2] ?? "C:/Users/Samar/source/repos/WebSiteFulchero/WebSiteFulchero/Views/Home";
const USCITA = "src/data/portfolio.ts";

const ENTITA = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&#8217;": "\u2019",
  "&rsquo;": "\u2019",
};

const decodifica = (grezzo) => grezzo.replace(/&#?\w+;/g, (e) => ENTITA[e] ?? e);

/** Testo con gli spazi normalizzati. */
function testo(nodo) {
  if (!nodo) return "";
  return decodifica(nodo.text).replace(/\s+/g, " ").trim();
}

/** Testo che conserva gli a capo espressi con <br>, convertiti in \n. */
function testoConACapo(nodo) {
  if (!nodo) return "";
  let risultato = "";
  for (const figlio of nodo.childNodes) {
    if (figlio.nodeType === 3) risultato += decodifica(figlio.rawText);
    else if (figlio.rawTagName === "br") risultato += "\n";
    else risultato += testoConACapo(figlio);
  }
  return risultato
    .split("\n")
    .map((riga) => riga.replace(/\s+/g, " ").trim())
    .join("\n")
    .trim();
}

const sorgente = readFileSync(join(VIEWS_DIR, "Portfolio.cshtml"), "utf8");
const documento = parse(sorgente);

// --- filtri ---------------------------------------------------------------
const filtri = documento.querySelectorAll(".mil-filter-links a").map((link) => ({
  // data-filter e' un selettore CSS: "*" per tutti, ".classe" per gli altri.
  tag: link.getAttribute("data-filter") === "*" ? null : link.getAttribute("data-filter").slice(1),
  etichetta: testo(link),
}));

// --- voci della griglia ---------------------------------------------------
const CLASSI_STRUTTURALI = new Set(["mil-grid-item", "custom-spacing"]);

const voci = documento.querySelectorAll(".mil-portfolio-grid > .mil-grid-item").map((voce) => {
  const classi = voce.classNames.split(/\s+/).filter(Boolean);

  // I distanziatori sono .mil-grid-item vuoti che servono solo ad allineare
  // le colonne della griglia masonry.
  if (classi.includes("custom-spacing")) return { tipo: "distanziatore" };

  const scheda = voce.querySelector("a");
  const img = scheda.querySelector("img");
  const classiScheda = scheda.classNames.split(/\s+/);

  return {
    tipo: "progetto",
    immagine: {
      src:
        "/" +
        img
          .getAttribute("src")
          .trim()
          .replace(/^\.?\//, ""),
      alt: decodifica(img.getAttribute("alt") ?? "").trim(),
    },
    titolo: testoConACapo(scheda.querySelector(".mil-project-descr h3")),
    descrizione: testo(scheda.querySelector(".desc-portfolio")),
    // L'etichetta obliqua sull'anteprima. Nel markup e' scritta ora in
    // minuscolo ora in maiuscolo: il CSS la rende comunque tutta maiuscola.
    categoria: testo(scheda.querySelector(".mil-category")),
    forma: classiScheda.includes("mil-long-item") ? "lungo" : "quadrato",
    tag: classi.filter((classe) => !CLASSI_STRUTTURALI.has(classe)),
  };
});

// --- controlli ------------------------------------------------------------
const progetti = voci.filter((voce) => voce.tipo === "progetto");
const tagUsati = new Set(progetti.flatMap((progetto) => progetto.tag));
const tagFiltrabili = new Set(filtri.map((filtro) => filtro.tag).filter(Boolean));

for (const tag of tagUsati) {
  if (!tagFiltrabili.has(tag)) {
    const interessati = progetti.filter((p) => p.tag.includes(tag)).map((p) => p.titolo);
    console.warn(
      '  ATTENZIONE tag "' +
        tag +
        '" non ha un filtro corrispondente, usato da: ' +
        JSON.stringify(interessati),
    );
  }
}
for (const tag of tagFiltrabili) {
  if (!tagUsati.has(tag)) {
    console.warn('  ATTENZIONE filtro "' + tag + '" non seleziona nessun progetto');
  }
}

const INTESTAZIONE = [
  "// GENERATO DA scripts/extract-portfolio.mjs - non modificare a mano.",
  "//",
  "// Progetti del portfolio, estratti da Views/Home/Portfolio.cshtml.",
  "",
  'import type { FiltroPortfolio, VocePortfolio } from "@/data/portfolio.types";',
  "",
  "export const FILTRI_PORTFOLIO: readonly FiltroPortfolio[] = ",
].join("\n");

const CORPO = [
  ";",
  "",
  "/**",
  " * Le voci sono nell'ordine in cui compaiono nella griglia. I distanziatori",
  " * sono celle vuote che allineano le colonne della disposizione masonry.",
  " */",
  "export const VOCI_PORTFOLIO: readonly VocePortfolio[] = ",
].join("\n");

writeFileSync(
  USCITA,
  INTESTAZIONE + JSON.stringify(filtri, null, 2) + CORPO + JSON.stringify(voci, null, 2) + ";\n",
  "utf8",
);

console.log(
  "estratti " +
    progetti.length +
    " progetti e " +
    (voci.length - progetti.length) +
    " distanziatori in " +
    USCITA,
);
console.log("filtri: " + filtri.map((f) => f.etichetta).join(", "));
for (const progetto of progetti) {
  console.log(
    "  " +
      progetto.forma.padEnd(9) +
      " [" +
      progetto.tag.join(" ") +
      "] " +
      progetto.titolo.replace(/\n/g, " "),
  );
}

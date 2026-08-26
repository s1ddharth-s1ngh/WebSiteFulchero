/**
 * Confronta il CSS compilato da src/styles/style.scss con il wwwroot/css/style.css
 * del progetto ASP.NET, regola per regola.
 *
 * I sorgenti SCSS del tema erano rimasti indietro rispetto al CSS servito, che
 * era stato modificato a mano. Questo script e' la prova che il porting non ha
 * perso ne alterato nessuna regola: ogni differenza residua deve comparire in
 * INTENZIONALI con la sua motivazione.
 *
 * Uso: node scripts/check-css-parity.mjs [percorso/style.css]
 */
import { existsSync, readFileSync } from "node:fs";
import * as sass from "sass";

const LEGACY_CSS =
  process.argv[2] ??
  "C:/Users/Samar/source/repos/WebSiteFulchero/WebSiteFulchero/wwwroot/css/style.css";

/** Regole presenti solo da una parte, con la ragione per cui va bene cosi'. */
const INTENZIONALI = [
  {
    match: (selector) => selector.includes(".mil-svg-icon"),
    lato: "legacy",
    motivo: "classe mai usata nel markup: 4 regole morte non portate",
  },
  {
    match: (selector) => selector.includes(".heading-padding"),
    lato: "legacy",
    motivo: "classe mai usata nel markup: 3 regole morte non portate",
  },
  {
    match: (selector, context) =>
      selector === ".custom-spacing" && context === "@media (max-width: 767px)",
    lato: "legacy",
    motivo: "ripete height: 20px, cioe' il valore di default: regola senza effetto",
  },
  {
    match: (selector) =>
      selector.startsWith("@import") && selector.includes("fonts.googleapis.com"),
    lato: "legacy",
    motivo: "i font passano da next/font, self-hosted, invece che da un @import bloccante",
  },
  {
    match: (selector) =>
      selector === "button.mil-menu-btn" || selector === "button.mil-slider-button",
    lato: "porting",
    motivo:
      "hamburger e frecce del carosello sono <button> invece di <div>: reset degli stili nativi",
  },
  {
    match: (selector) => /^\.mil-footer-(riga|fiscale|blocco-fiscale|credits)$/.test(selector),
    lato: "porting",
    motivo: "spaziature del footer ripetute inline su 11 elementi, raccolte in classi",
  },
  {
    match: (selector) => /^\.mil-accordion-(content|menu)/.test(selector),
    lato: "porting",
    motivo:
      "regole della fisarmonica che stavano in un <style> dentro Index.cshtml, " +
      "piu lo stato iniziale dei segni + e -, prima lasciato a GSAP",
  },
  {
    match: (selector) => selector.startsWith("h1, .mil-h1, h2,"),
    lato: "legacy",
    motivo:
      "il tema scriveva .mil-h12 al posto di .mil-h2 nel blocco comune dei titoli: " +
      "refuso corretto, la classe non era usata da nessuna parte",
  },
  {
    match: (selector) => selector.startsWith("h1, .mil-h1, h2,"),
    lato: "porting",
    motivo:
      "il tema scriveva .mil-h12 al posto di .mil-h2 nel blocco comune dei titoli: " +
      "refuso corretto, la classe non era usata da nessuna parte",
  },
  {
    match: (selector) => selector === "footer .mil-bg-img",
    lato: "porting",
    motivo:
      "stessi valori del tema ripetuti con !important: next/image con fill scrive " +
      "height e inset inline e non accetta quelle proprieta nello style",
  },
];

/**
 * Riduce una dichiarazione alla sua forma canonica, cosi' che differenze di
 * sola scrittura non vengano segnalate come regressioni:
 * commenti inline, spaziatura attorno a ":" e "!important", e le parole chiave
 * di colore che Sass emette invece in forma rgb().
 */
/** Nomi di famiglia esposti da next/font come CSS variable. */
const FONT_VARIABLES = {
  "var(--font-sora)": "Sora",
  "var(--font-caveat)": "Caveat",
};

const COLOR_KEYWORDS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  transparent: "rgba(0, 0, 0, 0)",
};

function normalizeDecl(raw) {
  let decl = raw
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!decl) return "";
  decl = decl.replace(/\s*!\s*important$/i, " !important");
  const colon = decl.indexOf(":");
  if (colon === -1) return decl;
  const prop = decl.slice(0, colon).trim().toLowerCase();
  let value = decl.slice(colon + 1).trim();
  const important = / !important$/i.test(value);
  if (important) value = value.replace(/ !important$/i, "");
  const keyword = COLOR_KEYWORDS[value.toLowerCase()];
  if (keyword) value = keyword;
  if (prop === "font-family") {
    value = value.replace(/["']/g, "");
    for (const [cssVar, family] of Object.entries(FONT_VARIABLES)) {
      value = value.replace(cssVar, family);
    }
  }
  return `${prop}: ${value}${important ? " !important" : ""}`;
}

/** Divide un blocco CSS in regole, tenendo conto del contesto delle at-rule. */
function parse(css) {
  const rules = [];
  const stack = [];
  let buffer = "";
  let i = 0;

  while (i < css.length) {
    const char = css[i];

    if (char === "/" && css[i + 1] === "*") {
      i = css.indexOf("*/", i + 2);
      i = i === -1 ? css.length : i + 2;
      continue;
    }
    if (char === '"' || char === "'") {
      const end = css.indexOf(char, i + 1);
      const stop = end === -1 ? css.length : end + 1;
      buffer += css.slice(i, stop);
      i = stop;
      continue;
    }
    if (char === "{") {
      const prelude = buffer.trim().replace(/\s+/g, " ");
      buffer = "";
      if (prelude.startsWith("@") && !prelude.startsWith("@font-face")) {
        stack.push(prelude);
      } else {
        // Blocco di dichiarazioni: consuma fino alla graffa di chiusura.
        const end = css.indexOf("}", i);
        const body = css.slice(i + 1, end === -1 ? css.length : end);
        rules.push({
          context: stack.join(" | "),
          selector: prelude,
          decls: body.split(";").map(normalizeDecl).filter(Boolean),
        });
        i = (end === -1 ? css.length : end) + 1;
        continue;
      }
      i += 1;
      continue;
    }
    if (char === "}") {
      stack.pop();
      buffer = "";
      i += 1;
      continue;
    }
    if (char === ";" && buffer.trim().startsWith("@")) {
      // At-rule senza blocco, es. @import: e' una regola a se' stante.
      rules.push({
        context: stack.join(" | "),
        selector: buffer.trim().replace(/\s+/g, " "),
        decls: [],
      });
      buffer = "";
      i += 1;
      continue;
    }
    buffer += char;
    i += 1;
  }
  return rules;
}

const { css: compiled } = sass.compile("src/styles/style.scss", {
  style: "expanded",
  loadPaths: ["src/styles"],
});

if (!existsSync(LEGACY_CSS)) {
  // Il confronto ha senso solo su una macchina che ha ancora il progetto
  // ASP.NET accanto. Altrove non e' un errore: non c'e' nulla da confrontare.
  console.log(`check-css-parity: saltato, ${LEGACY_CSS} non trovato`);
  process.exit(0);
}

const mine = parse(compiled);
const legacy = parse(readFileSync(LEGACY_CSS, "utf8"));

const key = (r) => `${r.context}||${r.selector}`;
const index = (rules) => {
  const map = new Map();
  for (const rule of rules) {
    const k = key(rule);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(rule.decls.join("; "));
  }
  return map;
};

const mineIndex = index(mine);
const legacyIndex = index(legacy);
const problems = [];

const spiegato = (selector, context, lato) =>
  INTENZIONALI.some((e) => e.lato === lato && e.match(selector, context));

for (const [k, decls] of legacyIndex) {
  const [context, selector] = k.split("||");
  if (!mineIndex.has(k)) {
    if (!spiegato(selector, context, "legacy")) {
      problems.push(`mancante nel porting: ${context ? context + " " : ""}${selector}`);
    }
    continue;
  }
  const ours = mineIndex.get(k).join(" && ");
  const theirs = decls.join(" && ");
  if (ours !== theirs && !spiegato(selector, context, "porting")) {
    problems.push(
      `dichiarazioni diverse: ${context ? context + " " : ""}${selector}\n  porting: ${ours}\n  legacy:  ${theirs}`,
    );
  }
}

for (const [k] of mineIndex) {
  const [context, selector] = k.split("||");
  if (!legacyIndex.has(k) && !spiegato(selector, context, "porting")) {
    problems.push(`aggiunta non prevista: ${context ? context + " " : ""}${selector}`);
  }
}

console.log(
  `check-css-parity: ${mine.length} regole compilate confrontate con ${legacy.length} regole di ${LEGACY_CSS}`,
);
for (const e of INTENZIONALI) console.log(`  differenza intenzionale: ${e.motivo}`);

if (problems.length > 0) {
  console.error("");
  for (const problem of problems) console.error(`check-css-parity: ${problem}`);
  console.error(`\ncheck-css-parity: ${problems.length} differenze non spiegate`);
  process.exit(1);
}
console.log("check-css-parity: OK - nessuna differenza oltre a quelle intenzionali");

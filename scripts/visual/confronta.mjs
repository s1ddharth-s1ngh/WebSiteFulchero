/**
 * Cattura ogni route dal sito nuovo e da quello in produzione e le confronta.
 *
 * Uso: node confronta.mjs <base-nuovo> <base-originale> <larghezza> [route...]
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import sharp from "sharp";

const [baseNuovo, baseOriginale, larghezzaArg, ...soloQueste] = process.argv.slice(2);
const larghezza = Number(larghezzaArg || 1440);

const ROUTE = [
  "/",
  "/azienda",
  "/servizi",
  "/portfolio",
  "/contatti",
  "/progettazione-architettonica",
  "/progettazione-strutturale",
  "/progettazione-sicurezza-cantieri",
  "/progettazione-antincendio",
  "/assistenza-tecnica-industria",
  "/progettazione-impianti-elettrici",
  "/progettazione-linee-vita",
  "/pratiche-risparmio-energetico",
  "/gestione-lavori-pubblici",
];

const daConfrontare = soloQueste.length > 0 ? soloQueste : ROUTE;
const CARTELLA = `shots-${larghezza}`;
mkdirSync(CARTELLA, { recursive: true });

const nome = (route) => (route === "/" ? "home" : route.replace(/\//g, ""));

const browser = await chromium.launch();

async function cattura(url, file) {
  const page = await browser.newPage({ viewport: { width: larghezza, height: 900 } });
  const problemi = [];
  page.on("pageerror", (e) => problemi.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    // I 404 su ?_rsc= sono i prefetch di Next verso pagine non ancora esistenti.
    if (r.status() >= 400 && !r.url().includes("_rsc="))
      problemi.push(`HTTP ${r.status()} ${r.url()}`);
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("load", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1200);

  // Le immagini con loading="lazy" non partono se non entrano nel viewport, e
  // la cattura a pagina intera di Playwright non e' uno scorrimento vero.
  //  inoltre vale true anche per una lazy mai avviata, quindi non
  // basta come attesa: serve naturalWidth.
  await page.evaluate(() => {
    for (const immagine of document.images) immagine.loading = "eager";
  });

  await page.evaluate(async () => {
    const passo = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  // next/image trasforma le fotografie alla prima richiesta: la conversione di
  // un JPEG da qualche MB in AVIF richiede tempo, e senza questa attesa la
  // schermata ritrarrebbe riquadri ancora vuoti.
  await page
    .waitForFunction(
      () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
      null,
      { timeout: 120000 },
    )
    .catch(async () => {
      const mancanti = await page.evaluate(
        () => [...document.images].filter((i) => !i.naturalWidth).length,
      );
      console.log("      " + mancanti + " immagini non hanno finito di caricare");
    });
  await page.waitForTimeout(600);

  // Comparse in scroll forzate visibili, e banner dei cookie nascosto: cambia
  // a ogni caricamento e sporcherebbe ogni confronto.
  await page.addStyleTag({
    content: `
      .mil-up { opacity: 1 !important; transform: none !important; visibility: visible !important; }
      #iubenda-cs-banner, .iubenda-cs-container, [class*="iubenda-cs"] { display: none !important; }
    `,
  });
  await page.waitForTimeout(400);

  // La cattura a pagina intera di Playwright non disegna le immagini fuori dal
  // viewport quando gli elementi sono posizionati in assoluto, come nella
  // griglia masonry del portfolio: al loro posto restano riquadri vuoti. La
  // pagina viene quindi ripresa a fasce alte quanto il viewport e ricucita.
  const altezza = await page.evaluate(() => document.body.scrollHeight);
  const fasce = [];
  const altezzaFascia = 900;

  for (let cima = 0; cima < altezza; cima += altezzaFascia) {
    await page.evaluate((y) => window.scrollTo(0, y), cima);
    await page.waitForTimeout(180);

    // Gli elementi fissi accompagnano lo scorrimento: lasciati visibili si
    // ripeterebbero in ogni fascia. Restano solo nella prima. La proprieta'
    // va scritta sull'elemento: una regola aggiunta al foglio di stile perde
    // contro quelle del tema, che sono piu specifiche.
    if (cima > 0) {
      await page.evaluate(() => {
        for (const fisso of document.querySelectorAll(".mil-top-panel, .mil-progress-track")) {
          fisso.style.setProperty("visibility", "hidden", "important");
        }
      });
    }

    const ritaglio = Math.min(altezzaFascia, altezza - cima);
    fasce.push({
      immagine: await page.screenshot({
        clip: { x: 0, y: 0, width: larghezza, height: ritaglio },
      }),
      cima,
      altezza: ritaglio,
    });
  }

  await sharp({
    create: {
      width: larghezza,
      height: altezza,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(fasce.map((f) => ({ input: f.immagine, top: f.cima, left: 0 })))
    .png()
    .toFile(file);

  await page.close();
  return { altezza, problemi: [...new Set(problemi)] };
}

async function confronta(fileA, fileB) {
  const leggi = async (f) => {
    const img = sharp(f);
    const meta = await img.metadata();
    return { dati: await img.ensureAlpha().raw().toBuffer(), w: meta.width, h: meta.height };
  };
  const a = await leggi(fileA);
  const b = await leggi(fileB);
  const w = Math.min(a.w, b.w);
  const h = Math.min(a.h, b.h);
  let diversi = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ia = (y * a.w + x) * 4;
      const ib = (y * b.w + x) * 4;
      const scarto = Math.max(
        Math.abs(a.dati[ia] - b.dati[ib]),
        Math.abs(a.dati[ia + 1] - b.dati[ib + 1]),
        Math.abs(a.dati[ia + 2] - b.dati[ib + 2]),
      );
      if (scarto > 24) diversi++;
    }
  }
  return { percentuale: (diversi / (w * h)) * 100, altezzaA: a.h, altezzaB: b.h };
}

console.log(`larghezza ${larghezza}px\n`);
console.log("route".padEnd(36) + "altezza orig  altezza nuovo  scarto   diversi");
console.log("-".repeat(84));

for (const route of daConfrontare) {
  const base = `${CARTELLA}/${nome(route)}`;
  const originale = await cattura(baseOriginale + route, `${base}-orig.png`);
  const nuovo = await cattura(baseNuovo + route, `${base}-nuovo.png`);
  const esito = await confronta(`${base}-orig.png`, `${base}-nuovo.png`);
  const scarto = esito.altezzaB - esito.altezzaA;

  console.log(
    route.padEnd(36) +
      String(esito.altezzaA).padStart(8) +
      String(esito.altezzaB).padStart(15) +
      String(scarto > 0 ? "+" + scarto : scarto).padStart(9) +
      (esito.percentuale.toFixed(2) + "%").padStart(10),
  );
  for (const p of nuovo.problemi) console.log(`      NUOVO: ${p}`);
  for (const p of originale.problemi) console.log(`      ORIG:  ${p}`);
}

await browser.close();

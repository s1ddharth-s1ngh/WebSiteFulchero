/**
 * Genera le anteprime social, una per pagina, ritagliando la fotografia gia'
 * presente su quella pagina a 1200x630.
 *
 * Senza, tutte le pagine condividono l'unica anteprima con il logo: chi
 * condivide il link a un servizio mostra il logo invece del servizio.
 *
 * Le pagine servizio usano la propria illustrazione e non la fotografia del
 * banner, che e' la stessa su tutte e nove.
 *
 * La home resta fuori: tiene l'anteprima con il marchio generata da
 * scripts/generate-icons.mjs, perche' per una condivisione del sito nel suo
 * insieme il logo dice piu' di una fotografia.
 *
 * Uso: npx tsx scripts/generate-og-images.mts
 */
import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";
import { AZIENDA } from "@/data/company";
import { PAGINA_CONTATTI, PAGINA_SERVIZI } from "@/data/pages";
import { VOCI_PORTFOLIO } from "@/data/portfolio";
import { SERVIZI_CONTENUTO } from "@/data/services";
import { SERVIZI } from "@/lib/routes";

/** Proporzioni attese dalle anteprime social: 1.91:1. */
const LARGHEZZA = 1200;
const ALTEZZA = 630;
const CARTELLA = "public/img/og";

const primoProgetto = VOCI_PORTFOLIO.find((voce) => voce.tipo === "progetto");
if (!primoProgetto) throw new Error("nessun progetto nel portfolio");

const SORGENTI: { nome: string; da: string }[] = [
  { nome: "azienda", da: AZIENDA.chiSiamo.illustrazione.src },
  { nome: "servizi", da: PAGINA_SERVIZI.illustrazione.src },
  { nome: "portfolio", da: primoProgetto.immagine.src },
  { nome: "contatti", da: PAGINA_CONTATTI.introduzione.illustrazione.src },
  ...SERVIZI.map(({ slug }) => ({ nome: slug, da: SERVIZI_CONTENUTO[slug].illustrazione.src })),
];

mkdirSync(CARTELLA, { recursive: true });

const kb = (percorso: string) => `${(statSync(percorso).size / 1024).toFixed(0)} KB`;

for (const { nome, da } of SORGENTI) {
  const uscita = `${CARTELLA}/${nome}.jpg`;
  await sharp(`public${da}`)
    .resize(LARGHEZZA, ALTEZZA, { fit: "cover", position: "attention" })
    // JPEG e non AVIF: le anteprime vengono lette da crawler che non sempre
    // supportano i formati recenti.
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(uscita);
  console.log(`${uscita.padEnd(46)} ${kb(uscita).padStart(7)}  da ${da}`);
}

console.log(`\n${SORGENTI.length} anteprime generate in ${CARTELLA}`);

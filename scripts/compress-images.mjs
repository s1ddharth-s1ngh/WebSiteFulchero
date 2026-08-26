/**
 * Ricomprime le fotografie in public/img e ne limita le dimensioni.
 *
 * next/image converte comunque tutto in AVIF o WebP prima di servirlo, quindi
 * il peso del file sorgente non arriva al browser. Conta pero' per due cose:
 * il tempo della prima conversione, che si paga su ogni immagine mai richiesta
 * prima, e la dimensione della cache sul server.
 *
 * I file originali restano nel progetto ASP.NET di partenza, quindi questa
 * operazione non distrugge nulla di irrecuperabile.
 *
 * Le due verifiche di sicurezza:
 * - JPEG a qualita 82 con mozjpeg, che a questa qualita non produce
 *   differenze percepibili su fotografie;
 * - PNG ricompressi senza perdita: i pixel restano identici;
 * - per ogni file viene misurato lo scarto medio per canale rispetto
 *   all'originale, e chi supera la soglia viene lasciato com'era.
 *
 * Uso: node scripts/compress-images.mjs [--prova]
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import sharp from "sharp";

const CARTELLA = "public/img";
/** Le anteprime social sono gia' generate alla misura giusta. */
const ESCLUSE = ["public/img/og"];
/** Oltre questa misura sul lato lungo nessun viewport chiede di piu'. */
const LATO_MASSIMO = 2560;
/**
 * Scarto medio per canale oltre il quale la ricompressione viene rifiutata.
 *
 * Il valore non e' una misura di qualita percepita: cresce con la densita di
 * dettaglio della fotografia, perche' su trame fitte come ponteggi, armature e
 * fogliame il codificatore sposta molti pixel di poco. Le due immagini con lo
 * scarto piu alto, portfolio-4 e portfolio-6, sono state confrontate a
 * ingrandimento pieno con l'originale: indistinguibili. La soglia serve quindi
 * solo a intercettare un degrado grossolano, non a valutare la resa.
 */
const SOGLIA_SCARTO = 8;

const soloProva = process.argv.includes("--prova");

function elenca(cartella) {
  return readdirSync(cartella, { withFileTypes: true }).flatMap((voce) => {
    const percorso = join(cartella, voce.name).split("\\").join("/");
    if (ESCLUSE.some((esclusa) => percorso.startsWith(esclusa))) return [];
    if (voce.isDirectory()) return elenca(percorso);
    return [".jpg", ".jpeg", ".png"].includes(extname(voce.name).toLowerCase()) ? [percorso] : [];
  });
}

/**
 * Scarto medio per canale tra due immagini, riportate alla stessa misura.
 *
 * Il riferimento non e' il file originale ma l'originale ridotto alle stesse
 * dimensioni dell'uscita: ridurre una fotografia da 5472 a 2560 pixel cambia i
 * pixel per definizione, e mescolare quella differenza con la perdita del
 * codificatore faceva scartare proprio le immagini che avevano piu' da
 * guadagnare. Quello che si vuole misurare qui e' solo quanto costa la
 * ricompressione.
 */
async function scarto(primaBuffer, dopoBuffer) {
  const misura = { width: 320, height: 320, fit: "fill" };
  const [a, b] = await Promise.all(
    [primaBuffer, dopoBuffer].map((buf) =>
      sharp(buf).resize(misura).removeAlpha().raw().toBuffer(),
    ),
  );
  let somma = 0;
  for (let i = 0; i < a.length; i++) somma += Math.abs(a[i] - b[i]);
  return somma / a.length;
}

const file = elenca(CARTELLA).sort();
let primaTotale = 0;
let dopoTotale = 0;
let saltati = 0;

console.log(`${file.length} immagini in ${CARTELLA}${soloProva ? " (prova, nessuna scrittura)" : ""}\n`);
console.log("file".padEnd(44) + "prima    dopo   risp.  scarto");
console.log("-".repeat(78));

for (const percorso of file) {
  // I byte del file cosi' come sta su disco. Passare da sharp lo
  // ri-codificherebbe, falsando sia la dimensione di partenza sia il confronto.
  const originale = readFileSync(percorso);
  const meta = await sharp(originale).metadata();
  const ridimensiona = Math.max(meta.width ?? 0, meta.height ?? 0) > LATO_MASSIMO;

  let trasformazione = sharp(originale);
  if (ridimensiona) {
    trasformazione = trasformazione.resize(LATO_MASSIMO, LATO_MASSIMO, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const compresso =
    meta.format === "png"
      ? // Senza perdita: i pixel restano identici, cambia solo la codifica.
        await trasformazione.png({ compressionLevel: 9, effort: 10 }).toBuffer()
      : await trasformazione.jpeg({ quality: 82, mozjpeg: true }).toBuffer();

  // Riferimento: l'originale portato alle stesse dimensioni dell'uscita, senza
  // ricomprimere.
  const riferimento = ridimensiona
    ? await sharp(originale)
        .resize(LATO_MASSIMO, LATO_MASSIMO, { fit: "inside", withoutEnlargement: true })
        .png()
        .toBuffer()
    : originale;

  const differenza = await scarto(riferimento, compresso);
  const prima = originale.length;
  const dopo = compresso.length;
  primaTotale += prima;

  // Non ha senso riscrivere un file per guadagnare quattro byte, ne' peggiorare
  // la resa per risparmiare spazio.
  const conviene = dopo < prima * 0.95 && differenza <= SOGLIA_SCARTO;
  if (conviene && !soloProva) writeFileSync(percorso, compresso);
  if (!conviene) saltati += 1;
  dopoTotale += conviene ? dopo : prima;

  const kb = (n) => `${(n / 1024).toFixed(0)}K`;
  console.log(
    percorso.replace("public/img/", "").padEnd(44) +
      kb(prima).padStart(7) +
      kb(conviene ? dopo : prima).padStart(8) +
      `${conviene ? (100 - (dopo / prima) * 100).toFixed(0) : 0}%`.padStart(7) +
      differenza.toFixed(2).padStart(8) +
      (conviene ? "" : "   invariata"),
  );
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(
  `\ntotale: ${mb(primaTotale)} MB -> ${mb(dopoTotale)} MB ` +
    `(${(100 - (dopoTotale / primaTotale) * 100).toFixed(0)}% in meno), ${saltati} lasciate invariate`,
);

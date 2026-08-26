/**
 * Genera favicon, apple touch icon e immagine OpenGraph a partire dai logo
 * in public/img/logo, e ricomprime il PNG del logo quadrato.
 *
 * Il progetto ASP.NET usava un unico file da 1,2 MB (1024x1024, PNG truecolor
 * praticamente non compresso) come favicon, apple-touch-icon, TileImage e
 * og:image insieme. Rieseguibile: `node scripts/generate-icons.mjs`.
 */
import { statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

/** Marchio quadrato, blu su fondo chiaro. */
const SQUARE_LOGO = "public/img/logo/StudioFulchero.png";
/** Lockup orizzontale in bianco, pensato per fondi scuri. */
const WIDE_LOGO_LIGHT = "public/img/logo/StudioFulchero.svg";

/** Fondo del marchio quadrato. */
const LIGHT_BG = { r: 240, g: 240, b: 240, alpha: 1 };
/** Blu del marchio, campionato dal pixel piu scuro del PNG. */
const BRAND_NAVY = { r: 0, g: 5, b: 26, alpha: 1 };

/** 64 colori bastano: il marchio e piatto, due tinte piu l'antialiasing. */
const PNG_OPTIONS = { compressionLevel: 9, palette: true, colours: 64, effort: 10 };

const kb = (path) => `${(statSync(path).size / 1024).toFixed(0)} KB`;

async function main() {
  const sizeBefore = kb(SQUARE_LOGO);

  // Ricompressione senza toccare i pixel ne le dimensioni: l'URL assoluto di
  // questo file e citato come og:image ed e gia indicizzato all'esterno.
  await writeFile(
    SQUARE_LOGO,
    await sharp(SQUARE_LOGO).png({ compressionLevel: 9, effort: 10 }).toBuffer(),
  );
  console.log(`${SQUARE_LOGO}: ${sizeBefore} -> ${kb(SQUARE_LOGO)}`);

  // Favicon. Next genera da solo il <link rel="icon"> da src/app/icon.png.
  // 256px copre anche l'icona da 192px della home screen Android.
  await sharp(SQUARE_LOGO).resize(256, 256, { fit: "cover" }).png(PNG_OPTIONS).toFile("src/app/icon.png");
  console.log(`src/app/icon.png: ${kb("src/app/icon.png")}`);

  // Apple touch icon: iOS ignora la trasparenza, meglio un fondo esplicito.
  await sharp(SQUARE_LOGO)
    .resize(180, 180, { fit: "cover" })
    .flatten({ background: LIGHT_BG })
    .png(PNG_OPTIONS)
    .toFile("src/app/apple-icon.png");
  console.log(`src/app/apple-icon.png: ${kb("src/app/apple-icon.png")}`);

  // OpenGraph 1200x630. Il marchio quadrato usato oggi viene ritagliato male
  // dalle anteprime social, che assumono 1.91:1. Il lockup orizzontale e
  // bianco, quindi va su fondo blu.
  const wideLogo = await sharp(WIDE_LOGO_LIGHT, { density: 300 })
    .resize(760, null, { fit: "inside" })
    .png()
    .toBuffer();

  await sharp({ create: { width: 1200, height: 630, channels: 4, background: BRAND_NAVY } })
    .composite([{ input: wideLogo, gravity: "center" }])
    .png(PNG_OPTIONS)
    .toFile("src/app/opengraph-image.png");
  console.log(`src/app/opengraph-image.png: ${kb("src/app/opengraph-image.png")}`);
}

await main();

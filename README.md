# Studio Fulchero

Sito istituzionale di Studio Fulchero, ingegneria civile, architettura e
geometra a Verzuolo e Saluzzo. [www.studiofulchero.it](https://www.studiofulchero.it)

Next.js 16 con App Router, TypeScript e SCSS. Tutte le pagine sono generate
staticamente in fase di build.

Riscrittura del precedente sito in ASP.NET Core MVC: la mappa della
conversione, i difetti trovati nel progetto di partenza e le decisioni prese
sono in [MIGRATION.md](MIGRATION.md). Il lavoro sul posizionamento nei motori
di ricerca e cosa resta da fare fuori dal sito sono in [SEO.md](SEO.md). Le
convenzioni di lavoro sono in [CONTRIBUTING.md](CONTRIBUTING.md).

## Avvio

```bash
npm install
npm run dev          # http://localhost:3000
```

Richiede Node 20.9 o superiore. La prima build scarica i font Sora e Caveat da
Google e li salva nel progetto: serve una connessione.

## Comandi

| Comando                 | Cosa fa                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | server di sviluppo                                           |
| `npm run build`         | build di produzione                                          |
| `npm start`             | serve la build                                               |
| `npm run check`         | lint, tipi, asset, parita CSS, contenuti e formattazione     |
| `npm run lint`          | ESLint                                                       |
| `npm run typecheck`     | TypeScript in modalita strict                                |
| `npm run check:assets`  | ogni `/img/...` citato nel codice esiste, con lo stesso case |
| `npm run check:css`     | il CSS compilato coincide con quello del sito precedente     |
| `npm run check:content` | ogni testo in `src/data/` compare nelle view originali       |
| `npm run check:seo`     | titoli, descrizioni, `h1`, `alt` e dati strutturati          |
| `npm run check:routes`  | route e risorse su un'istanza avviata (serve `npm start`)    |
| `npm run format`        | Prettier                                                     |

`check:css` e `check:content` confrontano con il progetto ASP.NET originale:
se non e' presente sulla macchina escono con successo senza fare nulla.

## Struttura

```
src/
  app/            una cartella per route, piu le nove pagine servizio
                  generate da src/app/[servizio]
  components/
    layout/       intestazione, footer, barra di avanzamento
    sections/     sezioni condivise tra piu pagine
    sliders/      carosello di apertura
    portfolio/    griglia masonry con i filtri
    ui/           mattoni del tema (banner, card, illustrazioni, ...)
    animation/    animazioni in scroll
    seo/          dati strutturati
  data/           tutti i testi del sito
  lib/            configurazione, route, font, SEO
  styles/         SCSS del tema
scripts/          estrazione dei contenuti e verifiche
```

I testi non stanno nel JSX: vivono in `src/data/` e sono verificabili contro le
view originali con `npm run check:content`. I dati anagrafici dello studio
stanno una volta sola in `src/lib/site.ts`.

Le classi del design system sono quelle del tema (`mil-*`) e non vanno
rinominate: il CSS portato da `style.css` ci si appoggia, e `npm run check:css`
verifica che resti identico.

## Aggiornare i contenuti

| Cosa                                    | Dove                    |
| --------------------------------------- | ----------------------- |
| Recapiti, orari, indirizzo, partite IVA | `src/lib/site.ts`       |
| Testi delle nove pagine servizio        | `src/data/services.ts`  |
| Progetti del portfolio e filtri         | `src/data/portfolio.ts` |
| Home                                    | `src/data/home.ts`      |
| Azienda                                 | `src/data/company.ts`   |
| Servizi, Portfolio, Contatti            | `src/data/pages.ts`     |
| Sezioni condivise                       | `src/data/sections.ts`  |
| Titoli e descrizioni per Google         | `src/data/seo.ts`       |
| Testi alternativi delle immagini        | `src/data/alt.ts`       |
| Elenco e ordine dei servizi             | `src/lib/routes.ts`     |

`services.ts` e `portfolio.ts` sono generati dagli script di estrazione: se
vanno modificati a mano, va tolta l'intestazione che li dichiara generati.

L'ordine dell'array in `src/lib/routes.ts` determina il sottomenu, la griglia
della pagina Servizi e i collegamenti avanti e indietro tra le pagine
servizio: inserire un servizio in mezzo aggiorna tutto e tre.

## Immagini

Vanno in `public/img/`, con nomi in minuscolo. Passano da `next/image`, che le
serve in AVIF o WebP alla risoluzione richiesta dal viewport: non serve
prepararne piu versioni.

Dopo averne aggiunte, `node scripts/compress-images.mjs` le ricomprime e limita
il lato lungo a 2560 pixel, che e' il massimo che il sito serva. Ogni file
viene confrontato con il proprio originale e lasciato invariato se il guadagno
non giustifica la riscrittura; `--prova` mostra cosa farebbe senza scrivere.

Il testo alternativo di ogni immagine sta in `src/data/alt.ts`, uno per file.

Se il logo cambia, `node scripts/generate-icons.mjs` rigenera favicon, apple
touch icon, immagine OpenGraph e le icone del manifest.
`npx tsx scripts/generate-og-images.mts` rigenera le anteprime social delle
singole pagine.

## Deploy

La build produce un sito statico servito da Node. Su Vercel non serve
configurare nulla. Altrove:

```bash
npm ci && npm run build && npm start
```

`site.url` in `src/lib/site.ts` deve corrispondere al dominio pubblicato:
canonical, sitemap e dati strutturati partono da li'.

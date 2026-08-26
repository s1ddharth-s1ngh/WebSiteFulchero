# Confronto visivo con il sito in produzione

`confronta.mjs` riprende ogni route dal sito nuovo e da quello pubblicato,
mette le due schermate a confronto pixel per pixel e stampa una tabella con
l'altezza di entrambe e la percentuale di pixel diversi.

E' lo strumento con cui la conversione e' stata verificata: ha trovato la
griglia Bootstrap mancante, il divisore aggiunto per errore a una pagina
servizio e il margine sbagliato sull'ultimo paragrafo delle conclusioni.

## Uso

Playwright non e' una dipendenza del progetto: scarica un browser da circa
150 MB e serve solo per questa verifica.

```bash
npm run build && npm start          # in una shell
```

```bash
npm i --no-save playwright          # in un'altra
npx playwright install chromium
node scripts/visual/confronta.mjs http://localhost:3000 https://www.studiofulchero.it 1440
```

Il quarto argomento e i successivi limitano il confronto ad alcune route:

```bash
node scripts/visual/confronta.mjs http://localhost:3000 https://www.studiofulchero.it 390 /portfolio
```

Le schermate finiscono in `shots-<larghezza>/`, una coppia per route.

## Come leggere i numeri

Una differenza sotto l'1% e' rumore di compressione: le fotografie vengono ora
servite in AVIF invece che come JPEG originali, e i pixel non coincidono mai
esattamente. Il portfolio sta sopra il 9% solo perche' mostra sedici fotografie
molto dettagliate.

Quello che conta davvero e' la colonna dell'altezza: uno scarto di piu' di
qualche pixel significa che un margine, un padding o un elemento non
corrispondono.

Per rendere confrontabili le due pagine lo script:

- forza visibili gli elementi con la classe `mil-up`, che altrimenti restano a
  opacita' zero dopo essere stati superati con lo scorrimento;
- nasconde il banner dei cookie di Iubenda, che cambia a ogni caricamento;
- riprende la pagina a fasce alte quanto il viewport invece di usare la
  cattura a pagina intera di Playwright, che non disegna le immagini fuori dal
  viewport quando gli elementi sono posizionati in assoluto, come nella
  griglia masonry del portfolio;
- nasconde la barra superiore dalla seconda fascia in poi, perche' e' fissa e
  si ripeterebbe in ognuna.

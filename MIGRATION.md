# Conversione da ASP.NET Core MVC a Next.js

Documento vivo: raccoglie la mappa della conversione, i difetti trovati nel
progetto di partenza e la decisione presa per ognuno.

**Progetto di partenza:** `C:\Users\Samar\source\repos\WebSiteFulchero`
(ASP.NET Core 8 MVC, 1 controller, 15 route, 24 view Razor, tema Ruizarch).

---

## Mappa delle route

Gli URL pubblici sono identici a quelli dichiarati dagli attributi `[Route]`
su `HomeController`: il dominio e' indicizzato e cambiarli farebbe perdere il
posizionamento acquisito.

| URL            | Prima                         | Ora                                  |
| -------------- | ----------------------------- | ------------------------------------ |
| `/`            | `Views/Home/Index.cshtml`     | `app/page.tsx`                       |
| `/azienda`     | `Views/Home/Azienda.cshtml`   | `app/azienda/page.tsx`               |
| `/servizi`     | `Views/Home/Servizi.cshtml`   | `app/servizi/page.tsx`               |
| `/portfolio`   | `Views/Home/Portfolio.cshtml` | `app/portfolio/page.tsx`             |
| `/contatti`    | `Views/Home/Contatti.cshtml`  | `app/contatti/page.tsx`              |
| i nove servizi | nove view quasi identiche     | `app/[servizio]/page.tsx`            |
| 404 e 500      | `Views/Shared/Error.cshtml`   | `app/not-found.tsx`, `app/error.tsx` |

Non viene riprodotta la route MVC di default `{controller}/{action}/{id?}`,
che esponeva ogni pagina anche su `/Home/Azienda`, `/Home/Servizi` e cosi'
via: erano URL duplicati raggiungibili dai crawler, senza un canonical che li
disambiguasse. Ora rispondono 404.

---

## Asset mancanti nel progetto originale

Cinque riferimenti a immagini nel markup Razor puntano a file che non esistono
in `wwwroot/img`. Producono altrettante 404 in produzione.

| Riferimento              | Dove                      | Decisione                                 |
| ------------------------ | ------------------------- | ----------------------------------------- |
| `img/faces/1.jpg`        | `Views/Shared/_Dedizione` | Non migrato: la partial e codice morto    |
| `img/faces/2.jpg`        | `Views/Shared/_Dedizione` | Non migrato: la partial e codice morto    |
| `img/faces/3.jpg`        | `Views/Shared/_Dedizione` | Non migrato: la partial e codice morto    |
| `img/other/bg.svg`       | `Views/Shared/_Dedizione` | Non migrato: la partial e codice morto    |
| `img/photo/project2.jpg` | `Views/Home/Index.cshtml` | Sostituito con `/img/arch/structural.jpg` |

### `_Dedizione.cshtml`

La partial contiene uno slider di tre recensioni (Mario Bianchi, Emma Rossi,
Paolo Verdi) con foto e ruoli. Non e referenziata da nessuna view: le uniche
partial effettivamente incluse sono `_Header`, `_Footer` e `_SezContatti`.

Non viene portata. Le tre recensioni sono contenuti segnaposto del tema, le foto
non esistono e il testo non e riferibile a clienti reali dello studio. Se lo
studio vorra una sezione recensioni, va ricostruita con contenuti veri.

### `img/photo/project2.jpg`

E' il `src` iniziale di `.mil-img-wrapper img` nella Home, l'immagine che segue
il cursore sopra la lista dei progetti in evidenza. Il wrapper parte con
`autoAlpha: 0` e il `src` viene sostituito al primo `mouseenter`, quindi
l'immagine non e mai visibile: il 404 e comunque una richiesta di rete sprecata
a ogni caricamento della Home.

Inizializzato con `/img/arch/structural.jpg`, la prima immagine della lista:
nessuna 404 e il primo hover trova l'immagine gia in cache.

---

## Asset non migrati

| Origine                                     | Peso    | Motivo                                                   |
| ------------------------------------------- | ------- | -------------------------------------------------------- |
| `wwwroot/img/covers/` (11 file)             | 228 KB  | Foto demo del tema Ruizarch, zero riferimenti nelle view |
| `wwwroot/fonts/webfonts/` (15 file)         | ~1 MB   | Font Awesome: nessuna classe `fa-*` nel markup           |
| `wwwroot/css/plugins/font-awesome.min.css`  | 55 KB   | Idem                                                     |
| `wwwroot/css/plugins/magnific-popup.css`    | 8 KB    | `.has-popup-video` non compare in nessuna view           |
| `wwwroot/js/plugins/magnific-popup.js`      | 42 KB   | Idem                                                     |
| `wwwroot/js/plugins/jquery.min.js`          | 90 KB   | Sostituito da React                                      |
| `wwwroot/js/plugins/jquery.validate.min.js` | 25 KB   | Valida `#cform`, che non esiste in nessuna view          |
| `wwwroot/js/plugins/smooth-scroll.js`       | 23 KB   | Caricato ma mai inizializzato                            |
| `wwwroot/mailer/` (9 file PHP)              | ~500 KB | PHPMailer per un form di contatto che non esiste         |

Il tema carica in ogni pagina 9 script e 5 fogli di stile; di questi, 4 script e
2 fogli di stile non vengono mai usati dal markup.

### Bilancio del peso

Il layout Razor caricava in ogni pagina 9 script e 5 fogli di stile, per un
totale di 476 KB di JavaScript e 212 KB di CSS non minificato, indipendentemente
da cosa la pagina usasse davvero.

| Voce                        | ASP.NET | Next.js                                  |
| --------------------------- | ------- | ---------------------------------------- |
| JS caricato in ogni pagina  | 476 KB  | bundle per route, code splitting di Next |
| di cui mai usato dal markup | 87 KB   | 0                                        |
| CSS caricato in ogni pagina | 212 KB  | un solo foglio, compilato dallo SCSS     |
| di cui mai usato dal markup | 61 KB   | 0                                        |
| Asset statici totali        | 23,5 MB | 18,8 MB                                  |

I 4,7 MB in meno sugli asset statici vengono da `fonts/webfonts` (2,6 MB di
Font Awesome mai usato), `mailer/` (249 KB di PHPMailer), `covers/` (228 KB di
foto demo) e dalla ricompressione del logo (1,2 MB -> 270 KB).

Le immagini restanti non sono state ricompresse a mano: passano da
`next/image`, che le serve in AVIF o WebP alla risoluzione richiesta dal
viewport.

---

## Design system

I sorgenti SCSS del tema erano disallineati dal CSS effettivamente servito:
`wwwroot/css/style.css` e' stato modificato a mano ad aprile 2025, mentre
`wwwroot/scss/` e' fermo a dicembre 2024. Ricompilare quei sorgenti avrebbe
riportato il sito al verde lime del tema Ruizarch e perso tutte le
personalizzazioni.

`npm run check:css` compila `src/styles/style.scss` e lo confronta regola per
regola con lo `style.css` del progetto ASP.NET. Normalizza le differenze di
sola scrittura (commenti inline, spaziatura, parole chiave di colore, nomi di
famiglia esposti come CSS variable) e segnala tutto il resto.

Ogni differenza ammessa e' dichiarata nell'array `INTENZIONALI` con la sua
motivazione. Allo stato: 552 regole compilate contro 561 originali, differenza
pari alle 8 regole morte scartate piu l'`@import` verso Google Fonts.

Divergenze recuperate dal CSS di produzione e riportate nei sorgenti:

| Regola                                  | Tema           | Produzione                    |
| --------------------------------------- | -------------- | ----------------------------- |
| accento                                 | rgb(188,255,0) | #5ab7e0                       |
| accento dei `border-image` tratteggiati | uguale         | #83afc9, desaturato           |
| `.mil-light-soft`                       | bianco 50%     | bianco 84%                    |
| `.mil-overlay`                          | nero 80%       | nero 60%                      |
| `.mil-top-panel.mil-active`             | nero 90%       | nero 77%                      |
| `.mil-project-descr`                    | fondo pieno    | fondo 60% + `backdrop-filter` |
| soglia menu mobile                      | 1200px         | 1000px                        |

---

## Contenuti

I testi delle pagine non sono stati ricopiati a mano: due script li estraggono
dalle view Razor e generano i file in `src/data/`.

- `node scripts/extract-services.mjs` -> `src/data/services.ts`
- `node scripts/extract-portfolio.mjs` -> `src/data/portfolio.ts`

Gli script normalizzano i percorsi delle immagini, che nel markup originale
erano scritti a volte con lo slash iniziale e a volte senza. Senza slash il
percorso e' relativo alla route corrente: la stessa immagine risolveva su
alcune pagine e non su altre.

### Discordanze da far confermare allo studio

Cose che nel progetto originale non tornano e che sono state portate cosi'
com'erano, perche' correggerle cambierebbe il contenuto pubblicato.

**Il progetto "Edicola funeraria" ha il tag `safety`, che nessun filtro
seleziona.** I filtri del portfolio sono `architecture`, `structural`,
`sicurezza`, `antincendio` e `sustainable`. Quel progetto e' quindi visibile
solo sotto "Tutti", "Architettura" e "Strutturale". Se il tag voleva dire
`sicurezza`, va corretto in `src/data/portfolio.ts`.

**Le etichette obliqua sulle anteprime del portfolio sono in inglese**
(Architecture, STRUCTURAL, SAFETY, FIRE PREVENTION, SUSTAINABLE) su un sito
interamente in italiano, e scritte in modo incoerente tra maiuscolo e
minuscolo. Il tema le rende comunque tutte maiuscole, quindi la resa e'
uniforme, ma la lingua resta quella del tema di partenza.

**Il servizio "Progettazione strutturale" e' citato con due grafie diverse**
nei collegamenti avanti e indietro delle pagine adiacenti: "Progettazione
strutturale" e "Progettazione Strutturale". E' stata adottata la prima.

### Refusi presenti nel sito pubblicato

Riportati tali e quali per non alterare il contenuto: sono correzioni da una
parola che lo studio puo' fare quando vuole.

- **`anticendio`** invece di `antincendio`, nel titolo della quarta slide del
  banner in home (`src/data/home.ts`).
- **`SCOPRI DI PIù`** con la `ù` minuscola in mezzo a un titolo maiuscolo, in
  due punti della home. Corretto in `SCOPRI DI PIÙ`: la resa a schermo non
  cambia, perche' il tema applica `text-transform: uppercase`, ma il testo
  sottostante ora e' corretto anche per chi legge il sorgente o usa uno
  screen reader.

### Sezione nascosta non portata

La home aveva **due** sezioni "Progetti in Evidenza" con lo stesso testo: una
con la lista di titoli e l'immagine che segue il cursore, l'altra con
l'accordion. La prima e' dentro:

```html
<section class="d-none d-lg-block d-block d-lg-none"></section>
```

In `bootstrap-grid.css` `.d-none` e' definita dopo `.d-block`, e `.d-lg-none`
dopo `.d-lg-block`: vincono quindi `.d-none` sotto i 992px e `.d-lg-none`
sopra. **La sezione e' invisibile a ogni larghezza di schermo.**

Non e' stata portata, e con lei non serve nemmeno l'effetto "immagine che segue
il cursore" di `main.js`, che agiva solo su quel markup. E' anche il motivo per
cui la 404 su `img/photo/project2.jpg` non si era mai notata: l'immagine non
veniva disegnata.

### La griglia Bootstrap

Il layout Razor caricava `wwwroot/css/plugins/bootstrap-grid.css` come foglio
separato, non compreso in `style.css`. Senza, `.container` non ha ne' padding
ne' larghezza massima, `.row` e `.col-*` non impaginano e le utility `d-*` non
nascondono nulla: il sito si srotola tutto a filo dei bordi della finestra.

Quel file **non e'** il Bootstrap Grid 5.2.2 ufficiale: era stato modificato a
mano in otto dichiarazioni.

| Dichiarazione                     | Bootstrap 5.2.2  | Copia del tema       |
| --------------------------------- | ---------------- | -------------------- |
| `--bs-gutter-x` (container e row) | `1.5rem`         | `30px`               |
| padding dei container             | `calc(var * .5)` | `var(--bs-gutter-x)` |
| `max-width` a sm e md             | 540px / 720px    | `100%`               |
| `max-width` a lg e xl             | 960px / 1140px   | `1200px`             |
| `max-width` a xxl                 | 1320px           | `1300px`             |

Sono scelte di impaginazione del sito: prendere il file dal pacchetto npm
cambierebbe le proporzioni di ogni pagina. Per questo la copia del tema e'
vendorizzata in `src/styles/vendor/bootstrap-grid.css`, con l'elenco delle
modifiche in testa al file.

### Verifica dei contenuti

`npm run check:content` estrae ricorsivamente ogni stringa da `src/data/` e
verifica che compaia nelle view Razor originali. E' la prova che nel passaggio
non e' stata cambiata una parola: `home.ts` e `company.ts` sono stati scritti a
mano, e un refuso introdotto li' sarebbe indistinguibile dal testo autentico.

Le deviazioni volute stanno nell'array `DEVIAZIONI` con la loro motivazione.
Allo stato: 552 testi verificati, 2 deviazioni (la correzione di
`SCOPRI DI PIù`).

Il confronto normalizza in NFC. Le view non sono uniformi nella codifica delle
lettere accentate: quasi ovunque usano la forma precomposta (U+00E8 per `è`),
ma in un punto di `Azienda.cshtml` c'e' la forma scomposta, cioe' `e` seguita
dall'accento combinante U+0300. Le due sequenze si disegnano identiche ma sono
stringhe diverse, quindi rompono qualunque ricerca testuale. I file in
`src/data/` sono tutti in NFC.

---

## Esito della verifica

### Parita visiva

`scripts/visual/confronta.mjs` riprende ogni route dal sito nuovo e da
www.studiofulchero.it e le confronta pixel per pixel.

| Larghezza | Scarto di altezza | Pixel diversi                         |
| --------- | ----------------- | ------------------------------------- |
| 1440px    | da 0 a 1px        | da 0,09% a 2,63%; 5,42% sul portfolio |
| 390px     | da 0 a 1px        | da 0,97% a 2,38%; 3,97% sul portfolio |

Le differenze residue sono rumore di compressione: le fotografie sono ora
servite in AVIF invece che come JPEG originali, quindi i pixel non coincidono
mai esattamente. Il portfolio sta piu' in alto perche' mostra sedici fotografie
molto dettagliate.

Lo strumento ha trovato tre divergenze reali, tutte corrette:

- `bootstrap-grid.css` non era stato migrato, e senza la griglia il sito si
  srotolava a filo dei bordi della finestra;
- un divisore aggiunto per uniformita' a Progettazione Architettonica, che non
  ce l'ha mai avuto, spostava di 6px tutto il resto della pagina;
- i filtri del portfolio portati da `<a>` a `<button>` allungavano la pagina di
  60px sotto i 992px, perche' un `<button>` e' inline-block e il suo padding
  verticale allarga la riga.

### Verifiche automatiche

| Controllo               | Esito                                                |
| ----------------------- | ---------------------------------------------------- |
| `npm run lint`          | nessun errore                                        |
| `npm run typecheck`     | nessun errore, TypeScript strict                     |
| `npm run build`         | 14 route su 14 prerenderizzate                       |
| `npm run check:assets`  | 40 riferimenti verificati                            |
| `npm run check:css`     | 565 regole confrontate, differenze solo intenzionali |
| `npm run check:content` | 581 testi confrontati con le view originali          |
| `npm run check:routes`  | 14 route, 71 riferimenti, nessun 404 inatteso        |
| `npm audit`             | nessuna vulnerabilita                                |

### Difetti del progetto di partenza risolti

- `img/photo/project2.jpg` e quattro altre immagini davano 404 in produzione
- `portfolio-14.JPG` era citato come `.jpg`: funzionava su Windows, non altrove
- sotto i 1200px un handler annullava il click su ogni voce del menu mobile, e
  funzionava solo perche' uno script inline lo aggirava
- il breadcrumb del portfolio puntava a un'azione `Portfoglio` inesistente
- tredici pagine su quattordici dichiaravano come canonical la home
- tutte le pagine avevano la stessa description e la stessa anteprima social
- il `LocalBusiness` nei dati strutturati aveva l'indirizzo privo di
  `"@type": "PostalAddress"`, quindi non veniva letto come indirizzo
- la pagina di errore mostrava all'utente testo di debug in inglese
- 87 KB di JavaScript e 61 KB di CSS caricati in ogni pagina senza essere usati
- il tema caricava il proprio SCSS disallineato dal CSS servito: ricompilarlo
  avrebbe riportato il sito al verde lime del tema di partenza

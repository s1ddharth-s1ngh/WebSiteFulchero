# Conversione da ASP.NET Core MVC a Next.js

Documento vivo: raccoglie la mappa della conversione, i difetti trovati nel
progetto di partenza e la decisione presa per ognuno.

**Progetto di partenza:** `C:\Users\Samar\source\repos\WebSiteFulchero`
(ASP.NET Core 8 MVC, 1 controller, 15 route, 24 view Razor, tema Ruizarch).

---

## Asset mancanti nel progetto originale

Cinque riferimenti a immagini nel markup Razor puntano a file che non esistono
in `wwwroot/img`. Producono altrettante 404 in produzione.

| Riferimento              | Dove                       | Decisione                                                                       |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------- |
| `img/faces/1.jpg`        | `Views/Shared/_Dedizione`  | Non migrato: la partial e codice morto                                          |
| `img/faces/2.jpg`        | `Views/Shared/_Dedizione`  | Non migrato: la partial e codice morto                                          |
| `img/faces/3.jpg`        | `Views/Shared/_Dedizione`  | Non migrato: la partial e codice morto                                          |
| `img/other/bg.svg`       | `Views/Shared/_Dedizione`  | Non migrato: la partial e codice morto                                          |
| `img/photo/project2.jpg` | `Views/Home/Index.cshtml`  | Sostituito con `/img/arch/structural.jpg`                                       |

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

| Origine                             | Peso   | Motivo                                                            |
| ----------------------------------- | ------ | ----------------------------------------------------------------- |
| `wwwroot/img/covers/` (11 file)      | 228 KB | Foto demo del tema Ruizarch, zero riferimenti nelle view          |
| `wwwroot/fonts/webfonts/` (15 file)  | ~1 MB  | Font Awesome: nessuna classe `fa-*` nel markup                    |
| `wwwroot/css/plugins/font-awesome.min.css` | 55 KB | Idem                                                       |
| `wwwroot/css/plugins/magnific-popup.css`   | 8 KB  | `.has-popup-video` non compare in nessuna view                    |
| `wwwroot/js/plugins/magnific-popup.js`     | 42 KB | Idem                                                        |
| `wwwroot/js/plugins/jquery.min.js`         | 90 KB | Sostituito da React                                         |
| `wwwroot/js/plugins/jquery.validate.min.js`| 25 KB | Valida `#cform`, che non esiste in nessuna view             |
| `wwwroot/js/plugins/smooth-scroll.js`      | 23 KB | Caricato ma mai inizializzato                               |
| `wwwroot/mailer/` (9 file PHP)             | ~500 KB | PHPMailer per un form di contatto che non esiste          |

Il tema carica in ogni pagina 9 script e 5 fogli di stile; di questi, 4 script e
2 fogli di stile non vengono mai usati dal markup.

### Bilancio del peso

Il layout Razor caricava in ogni pagina 9 script e 5 fogli di stile, per un
totale di 476 KB di JavaScript e 212 KB di CSS non minificato, indipendentemente
da cosa la pagina usasse davvero.

| Voce                            | ASP.NET | Next.js                                   |
| ------------------------------- | ------- | ----------------------------------------- |
| JS caricato in ogni pagina       | 476 KB  | bundle per route, code splitting di Next  |
| di cui mai usato dal markup      | 87 KB   | 0                                         |
| CSS caricato in ogni pagina      | 212 KB  | un solo foglio, compilato dallo SCSS      |
| di cui mai usato dal markup      | 61 KB   | 0                                         |
| Asset statici totali             | 23,5 MB | 18,8 MB                                   |

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

| Regola                                | Tema           | Produzione                        |
| ------------------------------------- | -------------- | --------------------------------- |
| accento                               | rgb(188,255,0) | #5ab7e0                           |
| accento dei `border-image` tratteggiati | uguale        | #83afc9, desaturato               |
| `.mil-light-soft`                     | bianco 50%     | bianco 84%                        |
| `.mil-overlay`                        | nero 80%       | nero 60%                          |
| `.mil-top-panel.mil-active`           | nero 90%       | nero 77%                          |
| `.mil-project-descr`                  | fondo pieno    | fondo 60% + `backdrop-filter`     |
| soglia menu mobile                    | 1200px         | 1000px                            |

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

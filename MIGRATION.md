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

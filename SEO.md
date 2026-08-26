# SEO

Il sito punta su ricerche locali: _ingegnere civile Verzuolo_, _geometra
Saluzzo_, _progettazione antincendio Cuneo_. Tutto quello che segue e' stato
fatto senza toccare una virgola di quello che si vede a schermo: agisce su
`<head>`, dati strutturati, attributi `alt` e configurazione.

`npm run check:seo` misura lo stato leggendo l'HTML gia' generato, non i
sorgenti: verifica cio' che i motori vedono davvero.

## Com'era, com'e'

|                                               | Prima                                | Dopo     |
| --------------------------------------------- | ------------------------------------ | -------- |
| Problemi rilevati da `check:seo`              | 21                                   | 0        |
| Titolo della home                             | 81 caratteri, troncato nei risultati | 55       |
| Titoli con la localita                        | 0 su 14                              | 14 su 14 |
| Pagine con `og:image` proprio                 | 1                                    | 14       |
| Pagine con piu' di un `h1`                    | 1 (la home ne aveva 5)               | 0        |
| Testi alternativi riusati su immagini diverse | 6                                    | 0        |
| Entita schema.org sul sito                    | 28                                   | 112      |
| Immagini dichiarate nella sitemap             | 0                                    | 31       |
| Peso delle fotografie                         | 18,7 MB                              | 10,9 MB  |

Prima di questo lavoro il sito non aveva sitemap, non aveva `robots.txt` e
dichiarava su tredici pagine su quattordici lo stesso `canonical` della home:
per i motori erano copie della home e non avevano motivo di comparire.

## Cosa e' stato fatto

**Titoli e descrizioni** — `src/data/seo.ts`. Quattordici titoli con il nome
del servizio e la localita, perche' le ricerche sono nella forma
"progettazione strutturale saluzzo". Verzuolo e Saluzzo si alternano secondo lo
spazio: cinque pagine li nominano entrambi. Le descrizioni sono scritte per
convincere a cliccare da un elenco di risultati, non per chi e' gia' arrivato.

**Dati strutturati** — `src/lib/structured-data.ts`. Un solo `@graph` per
pagina, con le entita collegate per `@id`: `ProfessionalService`, le quattro
persone dello studio, `WebSite`, `WebPage`, piu' `BreadcrumbList`, `Service` o
`ItemList` secondo la pagina. La scheda dell'attivita porta orari, coordinate,
anno di fondazione, catalogo dei nove servizi, dodici competenze, area servita
e il collegamento al profilo Google Business.

**Immagini** — `src/data/alt.ts`. Un testo alternativo per file, scritto
guardando la fotografia. Anteprima social propria per pagina. Immagini
dichiarate nella sitemap.

**Tecnica** — `max-image-preview:large` per l'anteprima grande nei risultati,
`preconnect` verso i domini Iubenda, cache piu' lunga sulle conversioni delle
immagini.

## Cosa serve dallo studio

**Altri profili da collegare.** In `site.profili` c'e' il profilo Google
Business. Se lo studio ha anche pagine Facebook, Instagram o LinkedIn, vanno
aggiunte li': ogni profilo collegato conferma ai motori che si tratta della
stessa realta.

**Search Console.** Va verificata la proprieta' del dominio su
[Google Search Console](https://search.google.com/search-console) e inviata la
sitemap (`https://www.studiofulchero.it/sitemap.xml`). E' l'unico modo per
sapere su quali ricerche il sito compare davvero, e per accorgersi dei
problemi di indicizzazione.

**Il profilo Google Business va tenuto vivo.** Per una ricerca locale conta
piu' di molte modifiche al codice: fotografie aggiornate, orari corretti,
categoria giusta e soprattutto le recensioni dei clienti.

**Comuni serviti.** In `site.areaServita` ci sono Verzuolo, Saluzzo, la
provincia di Cuneo e il Piemonte, cioe' quello che il sito gia' dichiarava. Se
lo studio lavora abitualmente anche a Manta, Costigliole, Busca, Savigliano o
altrove, aggiungerli aiuta a comparire su quei nomi.

## Cosa non e' stato fatto, e perche'

Le voci qui sotto richiederebbero di cambiare quello che si vede in pagina.
Sono elencate perche' siano una decisione dello studio, non una svista.

**Localita nei titoli visibili.** Gli `h1` dicono "Progettazione Strutturale".
Scrivere "Progettazione Strutturale a Verzuolo e Saluzzo" nel titolo grande
della pagina, e non solo nel tag `<title>`, e' il singolo intervento con piu'
effetto sulle ricerche locali.

**Pagine dedicate ai comuni.** Una pagina per "Ingegnere civile a Saluzzo" e
una per "Geometra a Verzuolo", con contenuto proprio e non ricopiato,
intercettano ricerche che oggi il sito non presidia. Vanno scritte con
contenuti reali: pagine quasi identiche fra loro vengono penalizzate.

**Domande frequenti.** Una sezione con le domande che i clienti fanno davvero
("quanto costa una pratica antincendio", "quanto dura una sanatoria") abilita i
dati strutturati `FAQPage` e puo' far comparire le risposte direttamente nei
risultati.

**Recensioni.** Il tema aveva una sezione recensioni con tre nomi inventati,
che non e' stata portata. Con recensioni vere, riprese dal profilo Google, si
possono dichiarare come `Review` e ottenere le stelline nei risultati.
Inventarle sarebbe una violazione delle linee guida di Google, oltre che
scorretto.

**Due refusi nel testo pubblicato.** `anticendio` nella quarta slide della home
e il tag `safety` sul progetto "Edicola funeraria", che nessun filtro
seleziona. Sono descritti in `MIGRATION.md`.

## Mantenere lo stato

```bash
npm run build && npm run check:seo
```

Il controllo verifica lunghezza e unicita' di titoli e descrizioni, presenza
del canonical, un solo `h1` per pagina, presenza di `og:image` e dati
strutturati, testi alternativi non riusati su immagini diverse, e la coerenza
del grafo schema.org: `@type` presenti, campi obbligatori della scheda
attivita, nessun campo vuoto, riferimenti `@id` che puntano a entita esistenti.

Fa parte di `npm run check`, dove si salta da solo se non c'e' una build.

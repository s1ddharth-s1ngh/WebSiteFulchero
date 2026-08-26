/**
 * Estrae il contenuto delle nove pagine servizio dalle view Razor del progetto
 * ASP.NET e genera src/data/services.ts.
 *
 * Le nove view hanno struttura identica (banner, descrizione, caratteristiche,
 * illustrazione, principi, conclusioni, precedente/successivo) e differiscono
 * solo per i testi: circa 2.200 righe di markup quasi uguale. Trascriverle a
 * mano avrebbe significato ricopiare qualche migliaio di parole di italiano
 * tecnico, con la certezza di introdurre refusi. Questo script le legge dalla
 * fonte.
 *
 * Uso: node scripts/extract-services.mjs [cartella/Views/Home]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const VIEWS_DIR =
  process.argv[2] ?? "C:/Users/Samar/source/repos/WebSiteFulchero/WebSiteFulchero/Views/Home";
const USCITA = "src/data/services.ts";

/** Slug pubblico -> nome della view Razor, nell'ordine di lib/routes.ts. */
const PAGINE = [
  ["progettazione-architettonica", "ProgArchitettonica"],
  ["progettazione-strutturale", "ProgStrutturale"],
  ["progettazione-sicurezza-cantieri", "ProgSicurezzaCantieri"],
  ["progettazione-antincendio", "ProgAntincendio"],
  ["assistenza-tecnica-industria", "AssistenzaIndustria"],
  ["progettazione-impianti-elettrici", "ProgImpiantiElettrici"],
  ["progettazione-linee-vita", "ProgLineeVita"],
  ["pratiche-risparmio-energetico", "PraticheRisparmioEnergetico"],
  ["gestione-lavori-pubblici", "GestioneLavoriPubblici"],
];

const ENTITA = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#8217;": "\u2019",
  "&rsquo;": "\u2019",
  "&laquo;": "\u00ab",
  "&raquo;": "\u00bb",
  "&egrave;": "\u00e8",
  "&agrave;": "\u00e0",
  "&ugrave;": "\u00f9",
  "&igrave;": "\u00ec",
  "&ograve;": "\u00f2",
  "&copy;": "\u00a9",
};

function decodifica(testoGrezzo) {
  return testoGrezzo.replace(/&#?\w+;/g, (entita) => ENTITA[entita] ?? entita);
}

/** Testo di un nodo, con gli spazi normalizzati. */
function testo(nodo) {
  if (!nodo) return "";
  return decodifica(nodo.text).replace(/\s+/g, " ").trim();
}

/**
 * Titolo in cui una parte e' evidenziata da uno span: il tema usa .mil-accent
 * negli h1 e .mil-marker negli h2. I br diventano \n, cosi' il dato resta
 * testo e la resa in HTML e' compito del componente.
 */
function titoloRicco(nodo, classeEvidenza) {
  if (!nodo) return [];
  const parti = [];

  const aggiungi = (valore, evidenziato) => {
    if (!valore) return;
    const ultima = parti.at(-1);
    if (ultima && ultima.evidenziato === evidenziato) ultima.testo += valore;
    else parti.push({ testo: valore, evidenziato });
  };

  const visita = (elemento, evidenziato) => {
    for (const figlio of elemento.childNodes) {
      if (figlio.nodeType === 3) {
        aggiungi(decodifica(figlio.rawText).replace(/[\s]+/g, " "), evidenziato);
      } else if (figlio.rawTagName === "br") {
        aggiungi("\n", evidenziato);
      } else {
        const evidenziaQui = evidenziato || Boolean(figlio.classList?.contains(classeEvidenza));
        visita(figlio, evidenziaQui);
      }
    }
  };
  visita(nodo, false);

  // Gli spazi ai bordi del titolo vanno via; quelli tra una parte e l'altra no,
  // perche' separano parole.
  if (parti.length > 0) {
    parti[0].testo = parti[0].testo.replace(/^[ \t]+/, "");
    const ultima = parti[parti.length - 1];
    ultima.testo = ultima.testo.replace(/[ \t]+$/, "");
  }
  return parti.filter((parte) => parte.testo !== "");
}

/** Percorso di un asset, normalizzato con lo slash iniziale. */
function percorsoAsset(valore) {
  if (!valore) return "";
  // Il markup originale scriveva la stessa immagine ora con lo slash iniziale
  // ora senza: senza slash il percorso e' relativo alla route corrente.
  return "/" + valore.trim().replace(/^\.?\//, "");
}

/** Valore di una proprieta dentro un attributo style inline. */
function daStile(elemento, proprieta) {
  const stile = elemento?.getAttribute("style") ?? "";
  const trovato = stile.match(new RegExp(proprieta + "\\s*:\\s*([^;]+)", "i"));
  return trovato ? trovato[1].trim() : undefined;
}

function immagine(elemento) {
  if (!elemento) return undefined;
  const posizione = daStile(elemento, "object-position");
  return {
    src: percorsoAsset(elemento.getAttribute("src")),
    alt: decodifica(elemento.getAttribute("alt") ?? "").trim(),
    ...(posizione ? { posizione } : {}),
  };
}

/**
 * Ritaglia la porzione di file compresa tra due commenti di sezione: le view
 * usano marcatori come "description" e "description end".
 */
function sezione(sorgente, nome) {
  const apertura = sorgente.indexOf("<!-- " + nome + " -->");
  const chiusura = sorgente.indexOf("<!-- " + nome + " end -->");
  if (apertura === -1 || chiusura === -1) {
    throw new Error('sezione "' + nome + '" non trovata');
  }
  return parse(sorgente.slice(apertura, chiusura));
}

/**
 * Testo breve delle card servizio, che compaiono identiche nella griglia della
 * pagina Servizi e nella sezione "Cosa Facciamo" della Home. Vengono lette una
 * volta sola da Servizi.cshtml, dove ci sono tutte e nove.
 */
function cardServizio() {
  const leggi = (file) => {
    const documento = parse(readFileSync(join(VIEWS_DIR, file), "utf8"));
    return documento.querySelectorAll("a.mil-service-card").map((card) => ({
      view: card.getAttribute("asp-action"),
      titolo: testo(card.querySelector("h4")),
      testo: testo(card.querySelector("p")),
    }));
  };

  const daServizi = new Map(leggi("Servizi.cshtml").map((card) => [card.view, card]));

  // Le tre card in evidenza sulla Home devono essere le stesse: se divergono,
  // lo stesso servizio si presenta in due modi diversi nel sito.
  for (const cardHome of leggi("Index.cshtml")) {
    const cardServizi = daServizi.get(cardHome.view);
    if (!cardServizi) {
      console.warn("  ATTENZIONE la Home mostra " + cardHome.view + ", assente in Servizi.cshtml");
    } else if (cardServizi.testo !== cardHome.testo) {
      console.warn("  ATTENZIONE testo diverso tra Home e Servizi per " + cardHome.view);
    }
  }
  return daServizi;
}

const CARD = cardServizio();

function estraiPagina(slug, nomeView) {
  const sorgente = readFileSync(join(VIEWS_DIR, nomeView + ".cshtml"), "utf8");

  const titoloPagina = sorgente.match(/ViewData\["Title"\]\s*=\s*"([^"]+)"/)?.[1];
  if (!titoloPagina) throw new Error(nomeView + ': ViewData["Title"] non trovato');

  const banner = sezione(sorgente, "banner");
  const descrizione = sezione(sorgente, "description");
  const info = sezione(sorgente, "info");
  const illustrazione = sezione(sorgente, "portfolio");
  const principi = sezione(sorgente, "about");
  const conclusioni = sezione(sorgente, "resume");
  const navigazione = sezione(sorgente, "next/prev project");

  const bannerImg = banner.querySelector("img.mil-bg-img");

  return {
    slug,
    nomeView,
    titoloPagina: decodifica(titoloPagina),

    banner: {
      immagine: immagine(bannerImg),
      scala: {
        da: bannerImg?.getAttribute("data-value-1") ?? "",
        a: bannerImg?.getAttribute("data-value-2") ?? "",
      },
      suptitolo: testo(banner.querySelector(".mil-banner-content .mil-suptitle")),
      titolo: titoloRicco(banner.querySelector("h1"), "mil-accent"),
    },

    descrizione: {
      suptitolo: testo(descrizione.querySelector(".mil-suptitle")),
      titolo: titoloRicco(descrizione.querySelector("h2"), "mil-marker"),
      paragrafi: descrizione.querySelectorAll(".col-lg-7 p").map(testo),
    },

    caratteristiche: {
      titolo: testo(info.querySelector("h2")),
      colonne: info.querySelectorAll(".col-lg-3").map((colonna) => ({
        titolo: testo(colonna.querySelector("h6")),
        voci: colonna.querySelectorAll("ul.mil-list li").map(testo),
      })),
    },

    illustrazione: immagine(illustrazione.querySelector(".mil-image-frame img")),

    principi: {
      suptitolo: testo(principi.querySelector(".mil-suptitle")),
      titolo: testo(principi.querySelector("h2")),
      testo: testo(principi.querySelector(".mil-mb-90 p")),
      card: principi.querySelectorAll(".mil-service-card").map((card) => ({
        icona: immagine(card.querySelector(".mil-icon img")),
        titolo: testo(card.querySelector("h4")),
        testo: testo(card.querySelector(".mil-divider-sm + p")),
      })),
    },

    // Otto pagine su nove hanno una riga orizzontale tra le caratteristiche e
    // l'illustrazione; Progettazione Architettonica no. La presenza viene
    // registrata invece di essere uniformata, per non aggiungere una riga
    // visibile a una pagina che non l'ha mai avuta.
    divisorePrimaIllustrazione:
      /<!-- info end -->[\s\S]*?mil-divider-lg[\s\S]*?<!-- portfolio -->/.test(sorgente),

    // Testo breve mostrato nella griglia della pagina Servizi e nelle tre
    // card in evidenza sulla Home.
    cardTesto: CARD.get(nomeView)?.testo ?? "",

    conclusioni: {
      titolo: testo(conclusioni.querySelector("h2")),
      paragrafi: conclusioni.querySelectorAll(".col-lg-6 p").map(testo),
      citazione: {
        testo: testo(conclusioni.querySelector(".mil-review-text h3")),
        autore: testo(conclusioni.querySelector(".mil-review-text p")),
      },
    },

    // Etichette dei collegamenti al servizio precedente e successivo: servono
    // a ricostruire il nome con cui ogni servizio viene citato dagli altri.
    collegamenti: {
      precedente: {
        view: navigazione.querySelector(".mil-prev-project a")?.getAttribute("asp-action"),
        etichetta: testo(navigazione.querySelector(".mil-prev-project a")),
      },
      successivo: {
        view: navigazione.querySelector(".mil-next-project a")?.getAttribute("asp-action"),
        etichetta: testo(navigazione.querySelector(".mil-next-project a")),
      },
    },
  };
}

const pagine = PAGINE.map(([slug, view]) => estraiPagina(slug, view));

// Ogni servizio viene citato dai due adiacenti: le due etichette devono
// coincidere, altrimenti il nome del servizio non e' univoco nel sito.
const perView = new Map(pagine.map((pagina) => [pagina.nomeView, pagina]));
const nomiEstesi = new Map();
for (const pagina of pagine) {
  const daPrecedente = perView.get(pagina.collegamenti.precedente.view);
  const daSuccessivo = perView.get(pagina.collegamenti.successivo.view);
  const citazioni = [
    daSuccessivo?.collegamenti.precedente.etichetta,
    daPrecedente?.collegamenti.successivo.etichetta,
  ].filter(Boolean);
  const univoche = [...new Set(citazioni)];
  if (univoche.length !== 1) {
    console.warn(
      "  ATTENZIONE " +
        pagina.nomeView +
        ": citato con nomi diversi -> " +
        JSON.stringify(univoche),
    );
  }
  nomiEstesi.set(pagina.slug, univoche[0] ?? pagina.titoloPagina);
}

const dati = pagine.map((pagina) => {
  const { nomeView: _view, collegamenti: _collegamenti, ...resto } = pagina;
  return { ...resto, nomeEsteso: nomiEstesi.get(pagina.slug) };
});

const INTESTAZIONE = [
  "// GENERATO DA scripts/extract-services.mjs - non modificare a mano.",
  "//",
  "// Contenuto delle nove pagine servizio, estratto dalle view Razor del progetto",
  "// ASP.NET. Le nove view avevano struttura identica e differivano solo per i",
  "// testi: qui la struttura vive nel componente e questi restano solo dati.",
  "",
  'import type { ContenutoServizio } from "@/data/services.types";',
  'import type { ServizioSlug } from "@/lib/routes";',
  "",
  "export const SERVIZI_CONTENUTO: Record<ServizioSlug, ContenutoServizio> = ",
].join("\n");

const corpo = Object.fromEntries(dati.map((servizio) => [servizio.slug, servizio]));
writeFileSync(USCITA, INTESTAZIONE + JSON.stringify(corpo, null, 2) + ";\n", "utf8");

console.log("estratti " + dati.length + " servizi in " + USCITA);
for (const servizio of dati) {
  console.log(
    "  " +
      servizio.slug +
      ": " +
      servizio.descrizione.paragrafi.length +
      " par, " +
      servizio.caratteristiche.colonne.length +
      " col, " +
      servizio.principi.card.length +
      " card, " +
      servizio.conclusioni.paragrafi.length +
      " concl -> " +
      servizio.nomeEsteso,
  );
}

/**
 * Testi alternativi delle immagini, uno per file.
 *
 * Nel vecchio sito l'attributo alt veniva riempito con la stessa frase su
 * fotografie diverse: "Studio Fulchero - Geometra e Ingegnere a Verzuolo e
 * Saluzzo" compariva su sei immagini che non hanno niente in comune, dal
 * tavolo da disegno al cantiere ai tetti di una citta. Una descrizione che
 * vale per tutto non descrive niente: non aiuta chi usa uno screen reader e
 * non dice ai motori cosa c'e' nella fotografia.
 *
 * Questo registro e' la fonte unica: la chiave e' il percorso del file, quindi
 * la stessa immagine ha la stessa descrizione ovunque compaia, e due immagini
 * diverse non possono finire con lo stesso testo. Vince sugli alt ereditati
 * dalle view del vecchio sito, che restano nei dati estratti come traccia di
 * cosa diceva l'originale.
 *
 * Stringa vuota significa immagine decorativa: e' il modo corretto per dire a
 * uno screen reader di saltarla. Vale per gli sfondi e le icone, dove il testo
 * accanto dice gia' tutto.
 *
 * Le descrizioni sono neutre di proposito: le fotografie dei servizi ritraggono
 * situazioni di cantiere generiche, non lavori dello studio. Attribuirgliele
 * sarebbe scorretto. I sedici progetti del portfolio sono invece lavori reali e
 * tengono la descrizione specifica gia' presente nei dati.
 */

export const ALT_IMMAGINI: Record<string, string> = {
  // --- marchio ------------------------------------------------------------
  "/img/logo/StudioFulchero.svg": "Studio Fulchero, ingegneri civili a Verzuolo",

  // --- sfondi decorativi --------------------------------------------------
  // Trama grafica dietro alcune sezioni.
  "/img/arch/bg.svg": "",
  // Immagine quasi nera dietro al footer, coperta da un velo scuro.
  "/img/arch/footer.jpg": "",

  // --- fotografie ricorrenti ----------------------------------------------
  // Testata delle tredici pagine interne.
  "/img/arch/safety.jpg":
    "Progettista al tavolo di lavoro con elaborati architettonici e un modello di studio",
  // Apertura della home.
  "/img/arch/city-2.jpg": "Veduta dall'alto sui tetti di un centro storico",
  // Fondo della chiamata all'azione.
  "/img/arch/contact.jpg":
    "Modello tridimensionale di una struttura sullo schermo di un portatile in cantiere",
  // Home e pagina Contatti.
  "/img/arch/civil-eng-1.png": "Mani che prendono le misure su un disegno tecnico",
  // Home e pagina Servizi.
  "/img/arch/servizi.jpg":
    "Cantiere visto dall'alto con l'armatura di una platea di fondazione e le maestranze al lavoro",
  // Pagina Azienda.
  "/img/arch/fulchero-1.jpg":
    "Due tecnici dello studio in sopralluogo sulla copertura di un edificio storico",
  "/img/arch/chi-siamo.jpg":
    "Casco da cantiere e metro pieghevole appoggiati su un getto di calcestruzzo",

  // --- illustrazioni delle pagine servizio --------------------------------
  "/img/arch/portfolio-5.jpg":
    "Mano che annota una pianta architettonica sugli elaborati di progetto",
  "/img/arch/portfolio-6.jpg": "Cantiere di edilizia residenziale con gru a torre e ponteggi",
  "/img/arch/portfolio-4.jpg":
    "Maestranze con indumenti ad alta visibilità su un solaio in costruzione",
  "/img/arch/fire-safety-signs.jpg": "Segnale luminoso di uscita di emergenza",
  "/img/arch/portfolio-2.jpg": "Linea di produzione industriale con il quadro di comando",
  "/img/arch/portfolio-20.jpg": "Impianto fotovoltaico a terra con pannelli su struttura metallica",
  "/img/arch/portfolio-7.jpg": "Copertura in tegole con la linea vita ancorata lungo il colmo",
  "/img/arch/portfolio-8.jpg":
    "Facciata di un edificio storico con serramenti in legno e balconi in ferro battuto",
  "/img/arch/portfolio-9.jpg": "Strada di un centro storico con edifici pubblici affacciati",
};

/**
 * Testo alternativo di un'immagine.
 *
 * `ripiego` e' l'alt che accompagna il dato, usato per le immagini non
 * elencate qui: i sedici progetti del portfolio, che hanno gia' una
 * descrizione specifica e diversa una dall'altra.
 */
export function altDi(src: string, ripiego = ""): string {
  return ALT_IMMAGINI[src] ?? ripiego;
}

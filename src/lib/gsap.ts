import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrare il plugin piu volte e' innocuo, ma tenerlo in un unico modulo
// evita che un componente lo usi prima che qualcun altro lo abbia registrato.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Legge un data attribute usato dal tema per le animazioni in scroll.
 *
 * Il progetto originale li leggeva con $(el).data(), che converte da se' le
 * stringhe numeriche in numeri e lascia stringa tutto il resto ("-25%").
 * dataset restituisce sempre stringhe, quindi la conversione va rifatta:
 * senza, GSAP interpreterebbe "1.4" come incremento relativo invece che come
 * valore assoluto.
 */
export function valoreAnimazione(elemento: Element, nome: string): number | string | undefined {
  const grezzo = elemento.getAttribute(`data-${nome}`);
  if (grezzo === null || grezzo.trim() === "") return undefined;
  const numero = Number(grezzo);
  return Number.isNaN(numero) ? grezzo : numero;
}

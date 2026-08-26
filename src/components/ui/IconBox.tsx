import { Icon } from "@/components/ui/Icon";
import type { Immagine } from "@/data/services.types";

type Props = {
  icona: Immagine;
  titolo: string;
  testo: string;
};

/**
 * Riquadro con icona, titolo e testo dei valori dello studio, nella pagina
 * Azienda.
 *
 * Nel markup originale i tre riquadri erano dentro un carosello Swiper con una
 * sola slide, con addosso i data-swiper-parallax per l'entrata. Con una sola
 * slide il progresso resta a zero e il parallasse non si muove mai: i riquadri
 * erano gia' statici. Qui sono una riga della griglia, senza carosello.
 */
export function IconBox({ icona, titolo, testo }: Props) {
  return (
    <div className="mil-process-box mil-icon-box mil-up mil-mb-60">
      <div className="mil-icon mil-icon-border mil-mb-30">
        <Icon src={icona.src} alt={icona.alt} />
      </div>
      <h4 className="mil-upper mil-mb-30">{titolo}</h4>
      <p>{testo}</p>
    </div>
  );
}

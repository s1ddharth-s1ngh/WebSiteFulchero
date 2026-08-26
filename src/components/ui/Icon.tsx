import Image from "next/image";

/** Lato in pixel degli SVG in public/img/icons: sono tutti 24x24. */
const LATO = 24;

type Props = {
  src: string;
  /**
   * Vuoto per le icone decorative, che e' il caso di quasi tutte.
   *
   * Nel markup originale ogni icona portava come alt il nome dello studio:
   * "Studio Fulchero - Geometra e Ingegnere a Verzuolo e Saluzzo" veniva
   * annunciato dopo il testo di ogni link con la freccia, decine di volte per
   * pagina, senza aggiungere niente a chi ascolta.
   */
  alt?: string;
};

/** Icona del tema. `unoptimized` perche' un SVG non ha nulla da ottimizzare. */
export function Icon({ src, alt = "" }: Props) {
  return <Image src={src} alt={alt} width={LATO} height={LATO} unoptimized />;
}

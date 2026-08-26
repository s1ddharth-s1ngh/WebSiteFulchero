"use client";

import { Autoplay, EffectFade, Navigation, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as IstanzaSwiper } from "swiper/types";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { BgImage } from "@/components/ui/BgImage";
import { Testo } from "@/components/ui/Testo";
import { HOME } from "@/data/home";
import { routes } from "@/lib/routes";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/parallax";

const { banner } = HOME;

/**
 * Carosello di apertura della home: cinque titoli sulla stessa fotografia.
 *
 * E' l'unico slider vero del sito. Gli altri quattro che main.js inizializzava
 * hanno una sola slide a testa e si comportano come contenuto statico: vedi
 * StaticSlide.
 */
export function BannerSlider() {
  /**
   * L'avanzamento automatico e' un contenuto in movimento che parte da solo e
   * non si puo' fermare, cosa che il tema non prevedeva. Chi ha ridotto le
   * animazioni di sistema resta sulla prima slide e usa le frecce.
   */
  const rispettaPreferenze = (swiper: IstanzaSwiper) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swiper.autoplay?.stop();
    }
  };

  return (
    <section className="mil-banner">
      <Swiper
        className="mil-banner-slider-2"
        modules={[Autoplay, EffectFade, Navigation, Parallax]}
        slidesPerView={1}
        spaceBetween={30}
        speed={800}
        autoplay={{ delay: 5000 }}
        effect="fade"
        parallax
        loop
        navigation={{ prevEl: ".mil-banner-prev", nextEl: ".mil-banner-next" }}
        onSwiper={rispettaPreferenze}
      >
        {banner.slide.map((slide, indice) => (
          <SwiperSlide key={slide.suptitolo}>
            <BgImage src={banner.immagine.src} alt={banner.immagine.alt} priorita={indice === 0} />
            <div className="mil-overlay" />
            <div className="container">
              <div className="mil-background-grid mil-top-space" />
              <div
                className="mil-banner-content"
                data-swiper-parallax-x="300"
                data-swiper-parallax-opacity="0"
              >
                <div className="mil-mb-90">
                  <span className="mil-suptitle mil-light mil-upper mil-mb-60">
                    {slide.suptitolo}
                  </span>
                  {/* Solo la prima slide e' il titolo della pagina. Le altre
                      quattro usano la utility .mil-h1, che nel tema ha esattamente
                      le stesse regole dell'elemento h1: stessa famiglia, stesso
                      corpo, stesso peso, stessa interlinea. A schermo non cambia
                      niente, ma la pagina smette di dichiarare cinque titoli
                      principali diversi. */}
                  {indice === 0 ? (
                    <h1 className="mil-upper mil-light mil-mb-60">
                      <Testo valore={slide.titolo} />
                    </h1>
                  ) : (
                    <p className="mil-h1 mil-upper mil-light mil-mb-60">
                      <Testo valore={slide.titolo} />
                    </p>
                  )}
                  <ArrowLink href={routes.servizi} chiaro reveal={false}>
                    {banner.etichettaLink}
                  </ArrowLink>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mil-nav-position">
        <div className="container">
          <div className="mil-banner-slider-panel">
            <div className="mil-nav-buttons mil-light mil-mb-30">
              {/* Nel tema erano <div>: non raggiungibili da tastiera e senza
                  nome per chi non vede la scritta. Il testo resta quello del
                  tema, l'etichetta accessibile e' in italiano. */}
              <button
                type="button"
                className="mil-slider-button mil-banner-prev"
                aria-label="Slide precedente"
              >
                Prev
              </button>
              <button
                type="button"
                className="mil-slider-button mil-banner-next"
                aria-label="Slide successiva"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

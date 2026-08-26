import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  sassOptions: {
    // Permette `@use "variables"` invece dei percorsi relativi nei partial.
    includePaths: [path.join(process.cwd(), "src/styles")],
  },

  images: {
    // Il sito e composto quasi solo da fotografie a piena larghezza:
    // AVIF/WebP tagliano drasticamente i 21 MB di immagini originali.
    formats: ["image/avif", "image/webp"],
    // Breakpoint allineati a quelli del tema (bootstrap-grid).
    deviceSizes: [400, 640, 768, 992, 1200, 1440, 1920, 2560],
    // Le fotografie del sito cambiano raramente: tenere le conversioni in
    // cache per trenta giorni evita di ricalcolarle a ogni riavvio del server.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        // I file serviti direttamente da public: i loghi SVG, che
        // l'ottimizzatore non tocca, e le anteprime social lette dai crawler.
        // Un giorno di cache con rivalidazione differita, non un anno: i
        // percorsi non contengono un hash, quindi sostituire una fotografia
        // deve poter avere effetto in tempi ragionevoli.
        source: "/img/:percorso*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

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
  },
};

export default nextConfig;

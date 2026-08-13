import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // L'outil est servi depuis thatmuch.fr/audit-refonte/ (sous-dossier du site Gatsby).
  // next/link et next/image préfixent automatiquement ; les <a href> bruts, non —
  // ce qui est voulu pour les liens vers le site principal (ex: /politique-de-confidentialite).
  basePath: "/audit-refonte",
  images: { unoptimized: true },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "if-function"],
  },
};

export default nextConfig;

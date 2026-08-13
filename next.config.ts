import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // L'outil est servi depuis thatmuch.fr/audit-refonte/ (sous-dossier du site Gatsby).
  // next/link et next/image préfixent automatiquement ; les <a href> bruts, non —
  // ce qui est voulu pour les liens vers le site principal (ex: /politique-de-confidentialite).
  // Doit rester synchronise avec $base-path dans src/scss/_vars.scss, qui prefixe
  // les url() du SCSS - Next ne reecrit pas ces chemins-la.
  basePath: "/audit-refonte",
  // Apache ne resout pas les URL sans extension vers un .html (contrairement a
  // GitHub Pages) : sans cette option, /refonte-form pointe sur un dossier sans
  // index.html et Apache renvoie 403. Ici l'export ecrit refonte-form/index.html.
  trailingSlash: true,
  images: { unoptimized: true },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "if-function"],
  },
};

export default nextConfig;

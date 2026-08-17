import "bootstrap/dist/css/bootstrap.min.css";
import "../src/scss/style.scss";
import ConsentBanner from "@/components/ConsentBanner/ConsentBanner";
import PageViewTracker from "@/components/PageViewTracker/PageViewTracker";
import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * Sert de filet : chaque page declare son propre title/description, qui
 * prend le pas sur celui-ci (fusion Next par segment). N'est donc reellement
 * lu que si une future page oublie ses propres metadata.
 *
 * metadataBase reste l'origine SEULE, sans le basePath : les images Open
 * Graph statiques (convention opengraph-image.png) l'incluent deja dans leur
 * propre resolution, et le dupliqueraient si metadataBase le portait aussi.
 * Chaque page compense en prefixant BASE_PATH dans son propre canonical et
 * openGraph.url — voir docs/lecons-techniques.md.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "THATMUCH — audit gratuit de site WordPress",
  description: "Découvre si c'est le bon moment pour refaire ton site internet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <PageViewTracker />
        <ConsentBanner />
      </body>
    </html>
  );
}

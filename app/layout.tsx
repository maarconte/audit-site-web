import "bootstrap/dist/css/bootstrap.min.css";
import "../src/scss/style.scss";
import ConsentBanner from "@/components/ConsentBanner/ConsentBanner";
import PageViewTracker from "@/components/PageViewTracker/PageViewTracker";
import type { Metadata } from "next";

/**
 * Sert de filet : chaque page declare son propre title/description, qui
 * prend le pas sur celui-ci (fusion Next par segment). N'est donc reellement
 * lu que si une future page oublie ses propres metadata.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://thatmuch.fr/audit-refonte/"),
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

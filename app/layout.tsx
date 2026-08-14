import "bootstrap/dist/css/bootstrap.min.css";
import "../src/scss/style.scss";
import ConsentBanner from "@/components/ConsentBanner/ConsentBanner";
import PageViewTracker from "@/components/PageViewTracker/PageViewTracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyse de la refonte de site web | THATMUCH",
  description: "Découvres si c'est le bon moment pour refaire ton site internet.",
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

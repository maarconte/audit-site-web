import React from "react";
import RefonteForm from "./RefonteFormClient";
import type { Metadata } from "next";

const title = "Test de la refonte de site web | Thatmuch";
const description =
  "Faites le test et découvrez si c'est le bon moment pour refaire votre site internet.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/refonte-form" },
  openGraph: {
    title,
    description,
    url: "/refonte-form",
    siteName: "THATMUCH",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Page() {
  return <RefonteForm />;
}

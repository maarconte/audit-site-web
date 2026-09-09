import React from "react";
import RefonteForm from "./RefonteFormClient";
import type { Metadata } from "next";
import { BASE_PATH } from "@/lib/site";

const title = "Test de la refonte de site web | Thatmuch";
const description =
  "Faites le test et découvrez si c'est le bon moment pour refaire votre site internet.";
// metadataBase (app/layout.tsx) n'inclut pas le basePath : a prefixer ici a la main.
const url = `${BASE_PATH}/refonte-form`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
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

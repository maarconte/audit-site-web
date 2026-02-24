import React from "react";
import RefonteForm from "./RefonteFormClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de la refonte de site web | Thatmuch",
  description: "Faites le test et découvrez si c'est le bon moment pour refaire votre site internet.",
};

export default function Page() {
  return <RefonteForm />;
}

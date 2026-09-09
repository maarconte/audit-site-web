import { BASE_PATH } from "@/lib/site";
import ConsentSettingsLink from "@/components/ConsentBanner/ConsentSettingsLink";
import { HeroSection } from "@/components/LandingRefonte/Landing/HeroSection/HeroSection";
import Image from "next/image";
import Link from "next/link";
import LinkSection from "@/components/LandingRefonte/Landing/LinkSection/LinkSection";
import MeetingCtaSection from "@/components/LandingRefonte/Landing/MeetingCtaSection/MeetingCtaSection";
import type { Metadata } from "next";
import NumbersSection from "@/components/LandingRefonte/Landing/NumbersSection/NumbersSection";
import React from "react";
import ScoreSection from "@/components/LandingRefonte/Landing/ScoreSection/ScoreSection";
import SeoContentSection from "@/components/LandingRefonte/Landing/SeoContentSection/SeoContentSection";
import planetPink from "../public/images/planet-pink.webp";
import planetYellow from "../public/images/planet-yellow.webp";

const title =
  "Refonte site WordPress Paris : audit gratuit en 3 min | THATMUCH";
const description =
  "Découvre en 3 minutes si ton site WordPress a besoin d'une refonte. Audit gratuit et sans engagement pour les PME de Paris et Île-de-France.";
// metadataBase (app/layout.tsx) n'inclut pas le basePath : a prefixer ici a la main.
const url = `${BASE_PATH}/`;

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
  return (
    <div className="bg-landing">
      {/*
        Purement decoratif : alt vide. priority conserve sur planet-pink —
        verifie avec un vrai audit Lighthouse (pas suppose) que c'est elle,
        et non le H1, que Chrome designe comme element LCP de cette page
        (plus grande surface peinte). La retirer avait fait passer l'image
        en chargement paresseux et fait chuter le LCP de ~2s a 7,6s : pour
        l'element LCP, differer le chargement est le pire choix possible,
        decoratif ou non. Le vrai gain venait du poids du fichier
        (972 Ko -> 235 Ko, redimensionne a sa taille d'affichage reelle),
        pas du retrait de priority. planet-yellow reste eager elle aussi,
        visible des le chargement au meme titre que planet-pink.
      */}
      <Image
        src={planetPink}
        className="planet-pink"
        alt=""
        width={300}
        height={300}
        priority
      />
      <Image
        src={planetYellow}
        className="planet-yellow"
        alt=""
        width={200}
        height={200}
        priority
      />
      <div className="container-fluid z-[2] relative">
        <HeroSection
          title="Est-ce le moment de refaire mon site internet ?"
          desc="Un audit gratuit et sans engagement, pensé pour les PME parisiennes sur WordPress. Réponds à 21 questions en 3 minutes pour savoir si la refonte s'impose."
          url="/refonte-form"
          label="Évaluer mon site"
        />
        <NumbersSection />
        <ScoreSection />
        <LinkSection />
        <MeetingCtaSection />
        <SeoContentSection />
      </div>
      <div className="flex flex-col items-center gap-2 p-6 bg-dark mt-12">
        <Link
          href="/"
          className="landing-header__logo"
          aria-label="Accueil"
          title="Accueil du site THATMUCH"
        >
          <Image
            src={
              "https://cosmosdesign.thatmuch.fr/assets/logos/svg/THATMUCH_Logo_ColorWhite.svg"
            }
            alt="THATMUCH"
            width={150}
            height={50}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>
        <ConsentSettingsLink />
      </div>
    </div>
  );
}

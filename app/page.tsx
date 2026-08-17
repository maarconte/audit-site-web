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
import logo from "../public/images/THATMUCH_Logo_White.webp";
import planetPink from "../public/images/planet-pink.webp";
import planetYellow from "../public/images/planet-yellow.webp";

const title = "Refonte site WordPress Paris : audit gratuit en 3 min | THATMUCH";
const description =
  "Découvre en 3 minutes si ton site WordPress a besoin d'une refonte. Audit gratuit et sans engagement pour les PME de Paris et Île-de-France.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
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
      <Image
        src={planetPink}
        className="planet-pink"
        alt="Planète rose"
        width={300}
        height={300}
        priority
      />
      <Image
        src={planetYellow}
        className="planet-yellow"
        alt="Planète jaune"
        width={200}
        height={200}
        priority
      />
      <div className="container-fluid z-2 position-relative">
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
      </div>
      <div className="d-flex flex-column align-items-center gap-2 p-4 bg-dark mt-5">
        <Link
          href="/"
          className="landing-header__logo"
          aria-label="Accueil"
          title="Accueil du site THATMUCH"
        >
          <Image
            src={logo}
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

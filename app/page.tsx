import React from "react";
import { HeroSection } from "@/components/LandingRefonte/Landing/HeroSection/HeroSection";
import Image from "next/image";
import Link from "next/link";
import LinkSection from "@/components/LandingRefonte/Landing/LinkSection/LinkSection";
import NumbersSection from "@/components/LandingRefonte/Landing/NumbersSection/NumbersSection";
import ScoreSection from "@/components/LandingRefonte/Landing/ScoreSection/ScoreSection";
import type { Metadata } from "next";
const logo = "/images/THATMUCH_Logo_White.webp";

export const metadata: Metadata = {
  title: "Analyse de la refonte de site web | Thatmuch",
  description: "Découvrez si c'est le bon moment pour refaire ton site internet.",
};

export default function Page() {
  return (
    <div className="bg-landing">
      <Image src="/images/planet-pink.webp" className="planet-pink" alt="Planète rose" width={300} height={300} style={{ objectFit: "contain" }} priority />
      <Image src="/images/planet-yellow.webp" className="planet-yellow" alt="Planète jaune" width={200} height={200} style={{ objectFit: "contain" }} priority />
      <div className="container-fluid z-2 position-relative">
        <HeroSection
          title="Est-ce le moment de refaire mon site internet ?"
          desc="Nous avons concocté pour toi, une petite évaluation pour répondre à cette question que tu t'es sûrement déjà posé : quand faut-il engager la refonte de son site internet ?"
          url="/refonte-form"
          label="Évaluer mon site"
        />
        <NumbersSection />
        <ScoreSection />
        <LinkSection />
      </div>
      <div className="d-flex justify-content-center p-2 bg-dark mt-5">
        <Link
          href="/"
          className="landing-header__logo"
          aria-label="Accueil"
          title="Accueil du site THATMUCH"
        >
          <Image src={logo} alt="THATMUCH" width={150} height={50} style={{ objectFit: 'contain' }} priority />
        </Link>
      </div>
    </div>
  );
}

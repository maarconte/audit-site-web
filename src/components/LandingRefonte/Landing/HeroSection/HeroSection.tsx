import "./style.scss";

import * as React from "react";

import Button from "../../../UI/Button/Button";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/images/THATMUCH_Logo_White.webp";

export interface IHeroSectionProps {
  title: string;
  desc?: string;
  url?: string;
  label?: string;
  isLanding?: boolean;
}

export const HeroSection: React.FC<IHeroSectionProps> = ({
  title,
  desc,
  url,
  label = "Découvrir",
  isLanding = true,
}) => {
  return (
    <React.Fragment>
      <header className="landing-header">
        <Link
          href="/"
          className="landing-header__logo"
          aria-label="Accueil"
          title="Accueil du site THATMUCH"
        >
          <Image src={logo} alt="THATMUCH" width={150} height={50} style={{ objectFit: 'contain' }} priority />
        </Link>
      </header>
      {!isLanding && <h1 className="hero-title">{title}</h1>}
      {isLanding && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-desc">{desc}</p>
            <Button
              label={label}
              className="btn btn-dev btn-animate"
              type="link"
              url={url}
            >
              {label}
              <FaArrowRight className="btn-icon" />
            </Button>
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

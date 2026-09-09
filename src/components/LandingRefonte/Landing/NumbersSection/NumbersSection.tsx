import "./style.scss";

import {
  FaArrowTrendUp,
  FaCalendar,
  FaGlobe,
  FaHourglass,
  FaMobile,
} from "react-icons/fa6";

import React from "react";

/**
 * Chaque chiffre est sourcé (P2-10) : la source citee est celle qui
 * correspond exactement a la formulation retenue, pas juste un lien
 * generique vers "des statistiques web". Verifiees vivantes (200) le
 * 17/08/2026.
 */
const chiffres = [
  {
    valeur: "60%",
    description: "du trafic internet mondial provient du mobile",
    icone: FaMobile,
    accent: "cyan",
    source: "StatCounter Global Stats",
    url: "https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet",
  },
  {
    valeur: "75%",
    description:
      "des internautes jugent la crédibilité d’une entreprise sur le design de son site",
    icone: FaGlobe,
    accent: "green",
    source: "Stanford Web Credibility Research",
    url: "https://credibility.stanford.edu/",
  },
  {
    valeur: "3 ans",
    description: "c’est le temps qu’il faut pour qu’un site soit jugé obsolète",
    icone: FaCalendar,
    accent: "yellow",
    source: "HubSpot (données Gartner)",
    url: "https://blog.hubspot.com/website/web-redesign-stats",
  },
  {
    valeur: "3 sec",
    description: "de chargement suffisent à faire fuir 53 % des mobinautes",
    icone: FaHourglass,
    accent: "magenta",
    source: "Think with Google",
    url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-new-industry-benchmarks/",
  },
  {
    valeur: "11%",
    description: "de conversion pour les meilleures landing pages",
    icone: FaArrowTrendUp,
    accent: "cyan",
    source: "Unbounce Conversion Benchmark Report",
    url: "https://unbounce.com/conversion-benchmark-report/",
  },
];

export default function NumbersSection() {
  return (
    <div className="NumbersSection">
      <div className="NumbersSection__content mb-12">
        <h2>Chiffres clés</h2>
        <div className="divider mb-4"></div>
        <p>
          Pourquoi est-ce une bonne question à se poser en 2026 ? Le monde
          digital évolue à une vitesse fulgurante. Un site web performant hier
          peut rapidement devenir obsolète aujourd’hui. Voici quelques chiffres
          clés qui montrent les exigences du marché et ce qu’il faut pour se
          positionner au niveau de la concurrence.
        </p>
      </div>
      <div className="NumbersSection__numbers">
        {chiffres.map(
          ({ valeur, description, icone: Icone, accent, source, url }) => (
            <div
              key={valeur + description}
              className={`NumbersSection__number NumbersSection__number--${accent}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="NumbersSection__number__title">{valeur}</h3>
                <Icone className="NumbersSection__icon" size={28} />
              </div>
              <p>{description}</p>
              <a
                className="NumbersSection__source"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source : {source}
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}

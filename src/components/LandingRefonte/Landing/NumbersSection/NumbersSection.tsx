import "./style.scss";

import {
  FaArrowTrendUp,
  FaCalendar,
  FaGlobe,
  FaGoogle,
  FaHourglass,
  FaMobile,
} from "react-icons/fa6";

import React from "react";

type Props = {};

export default function NumbersSection({}: Props) {
  return (
    <div className="NumbersSection">
      <div className="NumbersSection__content mb-5">
        <h2 className="mb-4">Chiffres clés</h2>
        <p>
          Pourquoi est-ce une bonne question à se poser en 2025 ? Le monde
          digital évolue à une vitesse fulgurante. Un site web performant hier
          peut rapidement devenir obsolète aujourd’hui. Voici quelques chiffres
          clés qui présentent sur les exigences du marché/se positionner au
          niveau de la concurrence.
        </p>
      </div>
      <div className="NumbersSection__numbers">
        <div className="NumbersSection__number">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="NumbersSection__number__title">60%</h3>
            <FaMobile className="NumbersSection__icon" size={32} />
          </div>
          <p>du trafic internet mondial provient du mobile</p>
        </div>
        <div className="NumbersSection__number">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="NumbersSection__number__title">81%</h3>
            <FaGlobe className="NumbersSection__icon" size={32} />
          </div>
          <p>
            des consommateurs voient le site web comme un critère de confiance
            de la marque
          </p>
        </div>
        <div className="NumbersSection__number">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="NumbersSection__number__title">3 ans</h3>
            <FaCalendar className="NumbersSection__icon" size={32} />
          </div>
          <p>c’est le temps qu’il faut pour qu’un site soit jugé obsolète</p>
        </div>
        <div className="NumbersSection__number">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="NumbersSection__number__title">3 sec</h3>
            <FaHourglass className="NumbersSection__icon" size={32} />
          </div>
          <p>de temps de chargement augmente le taux de rebond de 40 %</p>
        </div>
        <div className="NumbersSection__number">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="NumbersSection__number__title">12%</h3>
            <FaArrowTrendUp className="NumbersSection__icon" size={32} />
          </div>
          <p>de taux de conversion pour les landing pages optimisées</p>
        </div>
      </div>
    </div>
  );
}

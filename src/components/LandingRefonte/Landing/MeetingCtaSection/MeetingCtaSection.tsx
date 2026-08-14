import "./style.scss";

import MeetingCta from "@/components/MeetingCta/MeetingCta";
import React from "react";

type Props = {};

// Sortie secondaire : capte le visiteur qui ne fera pas le quiz.
// Formule differemment du CTA de fin de tunnel — ici il n'a pas
// encore de score, lui proposer de le relire n'aurait aucun sens.
export default function MeetingCtaSection({}: Props) {
  return (
    <div className="MeetingCtaSection">
      <p className="MeetingCtaSection__text">
        Pas envie de répondre à 21 questions ?
      </p>
      <MeetingCta emplacement="accueil_bas_de_page">
        Parler de mon site à un designer 30 min
      </MeetingCta>
    </div>
  );
}

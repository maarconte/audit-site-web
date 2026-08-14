import "./style.scss";

import { CalendarIcon } from "lucide-react";
import MeetingCta from "@/components/MeetingCta/MeetingCta";
import React from "react";

// Sortie secondaire : capte le visiteur qui ne fera pas le quiz.
// Formule differemment du CTA de fin de tunnel — ici il n'a pas
// encore de score, lui proposer de le relire n'aurait aucun sens.
export default function MeetingCtaSection() {
  return (
    <div className="MeetingCtaSection no-animation">
      <CalendarIcon />
      <h3 className="MeetingCtaSection__text ">
        Pas envie de répondre à 21 questions ?
      </h3>
      <MeetingCta emplacement="accueil_bas_de_page">
        Parler de mon site à un designer 30 min
      </MeetingCta>
    </div>
  );
}

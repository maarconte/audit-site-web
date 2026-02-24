import "./style.scss";

import Button from "../../../UI/Button/Button";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import React from "react";
import img from "./tardisStars.webp";

type Props = {};

export default function LinkSection({}: Props) {
  return (
    <div className="LinkSection">
      <div className="LinkSection__content">
        <h2 className="h4">Prêt à faire le point de votre site ?</h2>
        <div className="divider mb-2"></div>
        <h3 className="h1 mb-4">Faites le test !</h3>
        <p className="LinkSection__desc">
          Répondez à notre questionnaire et obtenez une évaluation personnalisé
          en moins de 3 minutes !
        </p>
        <Button
          label={"Évaluer mon site"}
          className="btn btn-dev btn-animate"
          type="link"
          url={"./refonte-form"}
        >
          Évaluer mon site
          <FaArrowRight className="btn-icon" />
        </Button>
      </div>
      <Image
        className="LinkSection__image"
        src={img}
        alt="Tardis dans les étoiles"
      />
    </div>
  );
}

import "./style.scss";

import Image from "next/image";
import React from "react";
import scoreImage from "./ScoreInbox.webp";

export default function ScoreSection() {
  return (
    <div className="ScoreSection">
      <div>
        <h2>Le score inbox</h2>
        <div className="divider mb-4"></div>
        <p>
          Recevez votre score dans votre boîte mail, et identifiez avec
          précision les axes à refondre sur votre site.
        </p>
      </div>
      <Image
        src={scoreImage}
        alt="Score refonte site web"
        className="ScoreSection__image"
      />
    </div>
  );
}

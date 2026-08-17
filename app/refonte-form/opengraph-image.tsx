import { OG_SIZE, renderOgImage } from "@/lib/og/renderOgImage";

// Requis par "output: export" : l'image est generee une fois au build, jamais a la demande.
export const dynamic = "force-static";
export const alt = "Test de refonte de site WordPress — THATMUCH";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(
    "21 questions pour savoir si votre site tient encore la route",
    "Résultat immédiat · Gratuit · Sans engagement"
  );
}

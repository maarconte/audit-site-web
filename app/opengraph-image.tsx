import { OG_SIZE, renderOgImage } from "@/lib/og/renderOgImage";

// Requis par "output: export" : l'image est generee une fois au build, jamais a la demande.
export const dynamic = "force-static";
export const alt = "Audit gratuit de site WordPress pour PME parisiennes — THATMUCH";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(
    "Est-ce le moment de refaire son site internet ?",
    "Audit gratuit · WordPress · Paris · 3 minutes"
  );
}

import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Rendu partage par les fichiers opengraph-image.tsx de chaque route. La barre
 * degradee reprend $gradient_rainbow (src/scss/_vars.scss) : c'est la meme
 * signature visuelle que la barre de score du produit.
 */
export function renderOgImage(titre: string, sousTitre: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1e1244 0%, #331e73 100%)",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#f8f8fb",
          }}
        >
          THATMUCH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#f8f8fb",
              maxWidth: 980,
            }}
          >
            {titre}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 500,
              color: "#0fc7d2",
            }}
          >
            {sousTitre}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 12,
            borderRadius: 6,
            background:
              "linear-gradient(90deg, #0fc7d2 0%, #0fc7d2 24%, #9fdf6c 25%, #9fdf6c 49%, #fdc500 50%, #fdc500 74%, #de3d64 75%, #de3d64 100%)",
          }}
        />
      </div>
    ),
    OG_SIZE
  );
}

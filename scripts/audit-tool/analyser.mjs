/**
 * Analyse heuristique d'un site externe : SEO, accessibilite, performance,
 * design. Reproduit en code les verifications faites a la main pendant P2-9
 * (voir prospects.json) : fetch du HTML brut, sans rendu JS ni screenshot.
 *
 * Consequence assumee : un site en client-side rendering pur (SPA sans SSR)
 * remontera peu de contenu ici, ce qui EST le diagnostic recherche (Google
 * voit la meme chose).
 *
 * Usage programmatique : import { analyserSite } from "./analyser.mjs"
 */

const UA = "Mozilla/5.0 (compatible; ThatMuchAuditTool/1.0)";

// Les valeurs d'attribut (ex: une meta description) peuvent contenir une
// apostrophe ("l'innovation") : matcher [^"']* la tronque au premier guillemet
// OU apostrophe rencontre, quel que soit le delimiteur reellement utilise.
// attrValue capture le delimiteur (\1) et ne s'arrete que sur CE meme
// caractere, pas sur l'autre type de guillemet.
function attrValue(attrName) {
  return `${attrName}\\s*=\\s*(["'])((?:(?!\\1)[\\s\\S])*)\\1`;
}

function extraireTagMeta(html, filtre) {
  // filtre : regex source qui identifie le tag (ex: name="description")
  const re = new RegExp(`<meta\\b[^>]*\\b${filtre}[^>]*>`, "i");
  return html.match(re)?.[0] ?? null;
}

function extraireAttribut(tag, attrName) {
  if (!tag) return null;
  const m = tag.match(new RegExp(attrValue(attrName), "i"));
  return m ? m[2] : null;
}

function extraireMetaContent(html, nomOuPropriete, valeur) {
  const tag = extraireTagMeta(html, `${nomOuPropriete}\\s*=\\s*["']${valeur}["']`);
  return extraireAttribut(tag, "content");
}

const RE = {
  title: /<title[^>]*>([\s\S]*?)<\/title>/i,
  htmlLang: new RegExp(`<html[^>]*\\b${attrValue("lang")}`, "i"),
  themeColor: /<meta[^>]*name=["']theme-color["']/i,
  fontFace: /@font-face|fonts\.googleapis\.com|fonts\.gstatic\.com|typekit|adobe fonts/i,
};

function ogTag(html, prop) {
  return extraireMetaContent(html, "property", `og:${prop}`);
}

function decode(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function countMatches(html, re) {
  return (html.match(re) ?? []).length;
}

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
}

function visibleTextLength(html) {
  const stripped = stripScriptsAndStyles(html);
  const text = stripped
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length;
}

function detecterPlateforme(html, headers) {
  const server = (headers.get("server") || "").toLowerCase();
  const poweredBy = (headers.get("x-powered-by") || "").toLowerCase();
  const generator = decode(extraireMetaContent(html, "name", "generator"));

  if (/wordpress/i.test(generator || "") || /wp-content|wp-includes|\/wp-json\//i.test(html)) {
    const themeMatch = html.match(/Theme Name:\s*([^\n*]+)/i);
    const elementor = /elementor/i.test(html);
    const divi = /et_pb_|\bDivi\b/i.test(html);
    let precision = "WordPress";
    if (elementor) precision += " + Elementor";
    else if (divi) precision += " + Divi";
    else if (themeMatch) precision += ` + thème custom (${themeMatch[1].trim()})`;
    return precision;
  }
  if (/wix\.com|static\.wixstatic\.com/i.test(html)) return "Wix";
  if (/website-files\.com|webflow\.com/i.test(html)) return "Webflow";
  if (/window\.__NUXT__|_nuxt\//i.test(html)) return "Nuxt/Vue";
  if (/bubble\.io|\/version-live\//i.test(html) || /platform:\s*bubble/i.test(poweredBy)) return "Bubble";
  if (/odoo/i.test(generator || "") || /server:\s*odoo/i.test(server)) return "Odoo";
  if (/\/_next\//i.test(html)) return "Next.js";
  if (/\/assets\/index-[\w-]+\.(js|css)/i.test(html) || /vite\.svg/i.test(html)) return "Vite (React/Vue), CMS non détecté";
  if (/shopify/i.test(html)) return "Shopify";
  if (/squarespace/i.test(html)) return "Squarespace";
  return "Non identifié (site custom ou CMS non reconnu)";
}

function detecterAnalytics(html) {
  const outils = [];
  if (/googletagmanager\.com\/gtm\.js/i.test(html)) outils.push("Google Tag Manager");
  else if (/gtag\(|googletagmanager\.com\/gtag/i.test(html)) outils.push("Google Analytics (gtag)");
  if (/matomo|piwik/i.test(html)) outils.push("Matomo");
  if (/hotjar/i.test(html)) outils.push("Hotjar");
  if (/clarity\.ms/i.test(html)) outils.push("Microsoft Clarity");
  if (/plausible\.io/i.test(html)) outils.push("Plausible");
  return outils;
}

function detecterConsentement(html) {
  const outils = {
    axeptio: /axeptio/i,
    tarteaucitron: /tarteaucitron/i,
    cookiebot: /cookiebot/i,
    cookieyes: /cookieyes/i,
    complianz: /complianz|\bcmplz\b/i,
    onetrust: /onetrust/i,
    consentpro: /consentpro/i,
    didomi: /didomi/i,
    wixConsent: /"consentPolicy":\{/i,
  };
  for (const [nom, re] of Object.entries(outils)) {
    if (re.test(html)) {
      if (nom === "wixConsent") {
        const vide = /"consentPolicy":\{\}/i.test(html);
        return vide
          ? { present: true, actif: false, detail: "Config Wix consentPolicy détectée mais vide — bandeau probablement inactif" }
          : { present: true, actif: true, detail: "Config Wix consentPolicy détectée et configurée" };
      }
      return { present: true, actif: true, detail: `Outil détecté : ${nom}` };
    }
  }
  return { present: false, actif: false, detail: "Aucun outil de gestion des cookies détecté dans le HTML" };
}

function analyserImages(html) {
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  let sansAlt = 0;
  for (const img of imgs) {
    const m = img.match(/\balt=["']([^"']*)["']/i);
    if (!m || m[1].trim() === "") sansAlt++;
  }
  return { total: imgs.length, sansAlt, avecAlt: imgs.length - sansAlt };
}

function analyserRessourcesExternes(html) {
  const scripts = countMatches(html, /<script[^>]*\bsrc=["']https?:\/\//gi);
  const styles = countMatches(html, /<link[^>]*rel=["']stylesheet["'][^>]*href=["']https?:\/\//gi);
  return { scriptsExternes: scripts, feuillesStyleExternes: styles };
}

function statut(condition, ok, warn) {
  return condition ? { icone: "✅", texte: ok } : { icone: "⚠️", texte: warn };
}

/**
 * @param {string} url
 * @returns {Promise<object>} rapport structure par categorie
 */
export async function analyserSite(url) {
  const cible = url.startsWith("http") ? url : `https://${url}`;
  const debut = Date.now();

  const reponse = await fetch(cible, {
    headers: { "User-Agent": UA },
    redirect: "follow",
  });
  const tempsReponseMs = Date.now() - debut;
  const html = await reponse.text();
  const poidsOctets = Buffer.byteLength(html, "utf8");

  const titre = html.match(RE.title);
  const titreTexte = titre ? decode(titre[1].trim()) : null;
  const descriptionBrute = extraireMetaContent(html, "name", "description");
  const description = descriptionBrute ? decode(descriptionBrute.trim()) : null;
  const langMatch = html.match(RE.htmlLang);
  const viewportContent = extraireMetaContent(html, "name", "viewport");

  const nbH1 = countMatches(html, /<h1[\s>]/gi);
  const nbH2 = countMatches(html, /<h2[\s>]/gi);
  const nbH3 = countMatches(html, /<h3[\s>]/gi);

  const ogTitle = ogTag(html, "title");
  const ogDescription = ogTag(html, "description");
  const ogImage = ogTag(html, "image");
  const ogImageWidth = ogTag(html, "image:width");
  const ogImageHeight = ogTag(html, "image:height");

  const plateforme = detecterPlateforme(html, reponse.headers);
  const analytics = detecterAnalytics(html);
  const consentement = detecterConsentement(html);
  const images = analyserImages(html);
  const ressources = analyserRessourcesExternes(html);
  const texteVisible = visibleTextLength(html);
  const policeCustom = RE.fontFace.test(html);
  const faviconTag = html.match(/<link\b[^>]*\brel\s*=\s*["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i)?.[0];
  const faviconHref = extraireAttribut(faviconTag, "href");
  const themeColor = RE.themeColor.test(html);
  const canonicalTag = html.match(/<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i)?.[0];
  const canonicalHref = extraireAttribut(canonicalTag, "href");

  const spaVide = texteVisible < 300 && nbH1 === 0 && nbH2 === 0;

  // --- SEO ---
  const seo = {
    plateforme,
    checks: [
      {
        label: "Titre de page",
        ...statut(
          !!titreTexte && titreTexte.length >= 10 && !/^(home|accueil)$/i.test(titreTexte),
          `"${titreTexte}" (${titreTexte?.length ?? 0} caractères)`,
          titreTexte
            ? `"${titreTexte}" — trop court ou générique pour bien référencer la page`
            : "Aucune balise <title> trouvée"
        ),
      },
      {
        label: "Meta description",
        ...statut(
          !!description && description.length >= 50 && description.length <= 165,
          `Présente, ${description?.length ?? 0} caractères`,
          description
            ? `Présente mais ${description.length} caractères (idéal 50-165) : "${description.slice(0, 80)}${description.length > 80 ? "…" : ""}"`
            : "Aucune meta description trouvée"
        ),
      },
      {
        label: "Balises Open Graph (partage social)",
        ...statut(
          !!ogTitle && !!ogDescription && !!ogImage,
          "og:title, og:description et og:image présents",
          `Manquant(s) : ${[!ogTitle && "og:title", !ogDescription && "og:description", !ogImage && "og:image"].filter(Boolean).join(", ")}`
        ),
      },
      {
        label: "Titre principal (H1)",
        ...statut(
          nbH1 === 1,
          "Un seul H1, structure correcte",
          nbH1 === 0 ? "Aucun H1 sur la page — pas de sujet principal identifiable pour Google" : `${nbH1} balises H1 trouvées — plusieurs titres se disputent l'attention`
        ),
      },
      {
        label: "Hiérarchie de titres (H2/H3)",
        ...statut(nbH2 > 0, `${nbH2} H2, ${nbH3} H3`, "Aucun sous-titre H2 détecté — contenu peu structuré pour Google"),
      },
      {
        label: "Contenu indexable sans JavaScript",
        ...statut(
          !spaVide,
          `${texteVisible} caractères de texte visible dans le HTML brut`,
          `Seulement ${texteVisible} caractères de texte dans le HTML brut, sans titre — probablement une application JavaScript sans rendu serveur (SPA) : Google ne voit presque rien de la page`
        ),
      },
      {
        label: "URL canonique",
        ...statut(!!canonicalHref, `Définie : ${canonicalHref}`, "Aucune balise canonical trouvée"),
      },
    ],
  };

  // --- Accessibilité ---
  const zoomBloque = /user-scalable\s*=\s*(?:no|0)/i.test(viewportContent || "");
  const accessibilite = {
    checks: [
      {
        label: "Texte alternatif des images",
        ...statut(
          images.total === 0 || images.sansAlt === 0,
          images.total === 0 ? "Aucune image détectée" : `${images.avecAlt}/${images.total} images ont un attribut alt renseigné`,
          `${images.sansAlt}/${images.total} images sans texte alternatif (${Math.round((images.sansAlt / Math.max(images.total, 1)) * 100)}%)`
        ),
      },
      {
        label: "Langue déclarée (attribut lang)",
        ...statut(!!langMatch, `lang="${langMatch?.[2]}"`, "Aucun attribut lang sur <html> — les lecteurs d'écran ne savent pas dans quelle langue lire la page"),
      },
      {
        label: "Zoom mobile",
        ...statut(!zoomBloque, "Le zoom n'est pas bloqué", "Le zoom est désactivé (user-scalable=no) — problème pour les utilisateurs malvoyants"),
      },
      {
        label: "Viewport mobile",
        ...statut(!!viewportContent, "Balise viewport présente (site adapté au responsive)", "Aucune balise viewport — rendu mobile non garanti"),
      },
      {
        label: "Contraste des couleurs / navigation clavier",
        icone: "ℹ️",
        texte: "Non vérifiable automatiquement sans rendu visuel — à tester manuellement",
      },
    ],
  };

  // --- Performance ---
  const performance = {
    checks: [
      {
        label: "Poids du HTML",
        ...statut(
          poidsOctets < 300_000,
          `${Math.round(poidsOctets / 1024)} Ko`,
          `${(poidsOctets / 1024 / 1024).toFixed(2)} Mo — largement au-dessus de ce qui est raisonnable pour du HTML seul (hors images)`
        ),
      },
      {
        label: "Temps de réponse serveur",
        ...statut(tempsReponseMs < 1000, `${tempsReponseMs} ms`, `${tempsReponseMs} ms — lent pour une simple réponse HTML`),
      },
      {
        label: "Outil d'analyse installé",
        ...statut(analytics.length > 0, analytics.join(", "), "Aucun outil d'analytics détecté (Google Analytics, GTM, Matomo...)"),
      },
      {
        label: "Ressources externes chargées",
        icone: "ℹ️",
        texte: `${ressources.scriptsExternes} script(s) externe(s), ${ressources.feuillesStyleExternes} feuille(s) de style externe(s) — indicatif, pas de verdict automatique`,
      },
    ],
  };

  // --- Design (heuristique uniquement, pas de rendu visuel) ---
  const ratioOgImage = ogImageWidth && ogImageHeight ? Number(ogImageWidth) / Number(ogImageHeight) : null;
  const design = {
    avertissement: "Signaux observables dans le code uniquement — aucun rendu visuel, aucune note d'esthétique. À confirmer par un coup d'œil sur le site.",
    checks: [
      { label: "Plateforme / thème détecté", icone: "ℹ️", texte: plateforme },
      {
        label: "Police personnalisée",
        ...statut(policeCustom, "Police web personnalisée chargée (Google Fonts ou @font-face)", "Aucune police personnalisée détectée — probablement la police par défaut du navigateur"),
      },
      {
        label: "Image de partage (og:image)",
        ...statut(
          !!ogImage,
          ogImageWidth && ogImageHeight
            ? `Présente, ${ogImageWidth}x${ogImageHeight}${ratioOgImage && ratioOgImage < 1 ? " (format portrait — sera mal recadrée en partage)" : ""}`
            : "Présente (dimensions non déclarées)",
          "Aucune image de partage définie — un lien partagé n'affichera ni titre ni visuel sur LinkedIn/réseaux sociaux"
        ),
      },
      {
        label: "Favicon personnalisé",
        ...statut(!!faviconHref, `Défini : ${faviconHref}`, "Aucun favicon personnalisé détecté"),
      },
      {
        label: "Couleur de thème mobile (theme-color)",
        ...statut(themeColor, "Définie — la barre du navigateur mobile reprend une couleur de marque", "Non définie — détail mineur"),
      },
    ],
  };

  return {
    url: cible,
    urlFinale: reponse.url,
    codeHttp: reponse.status,
    plateforme,
    consentement,
    seo,
    accessibilite,
    performance,
    design,
  };
}

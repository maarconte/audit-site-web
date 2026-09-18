#!/usr/bin/env node
/**
 * Outil d'audit interne — a usage local uniquement, jamais deploye.
 * Page avec un champ URL, analyse heuristique par categorie (SEO,
 * accessibilite, performance, design). Ne genere aucun mail, ne stocke rien.
 *
 * Usage : node scripts/audit-tool/server.mjs [port]
 * Puis ouvrir http://localhost:<port>/
 */

import { createServer } from "node:http";
import { analyserSite } from "./analyser.mjs";

const PORT = Number(process.argv[2]) || 4949;

function page(contenu) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Outil d'audit interne</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #f5f5f3;
    color: #1a1a1a;
    margin: 0;
    padding: 40px 20px 80px;
  }
  main { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .sous-titre { color: #666; margin-top: 0; margin-bottom: 28px; font-size: 14px; }
  form {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
  }
  input[type="text"] {
    flex: 1;
    padding: 12px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 15px;
  }
  button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: #1a1a1a;
    color: white;
    font-size: 15px;
    cursor: pointer;
  }
  button:hover { background: #333; }
  .erreur {
    background: #fde8e8;
    border: 1px solid #f5b5b5;
    color: #a12525;
    padding: 14px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  .en-tete-resultat {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .en-tete-resultat a { color: #1a1a1a; }
  .badge {
    display: inline-block;
    font-size: 12px;
    padding: 3px 9px;
    border-radius: 999px;
    background: #eee;
    color: #444;
  }
  section.categorie {
    background: white;
    border: 1px solid #e5e5e3;
    border-radius: 12px;
    padding: 20px 22px;
    margin-bottom: 18px;
  }
  section.categorie h2 {
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #555;
    margin: 0 0 14px;
  }
  .avertissement {
    font-size: 13px;
    color: #8a6d00;
    background: #fff8e1;
    border: 1px solid #f0e0a0;
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 14px;
  }
  ul.checks { list-style: none; padding: 0; margin: 0; }
  ul.checks li {
    display: flex;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid #f0f0ee;
    font-size: 14px;
    line-height: 1.4;
  }
  ul.checks li:last-child { border-bottom: none; }
  .icone { flex-shrink: 0; }
  .label { font-weight: 600; display: block; }
  .detail { color: #555; }
</style>
</head>
<body>
<main>
<h1>Outil d'audit interne</h1>
<p class="sous-titre">Usage local uniquement — pas de génération de mail, rien n'est enregistré.</p>
${contenu}
</main>
</body>
</html>`;
}

function formulaire(urlPrecedente = "") {
  return `<form method="get" action="/analyser">
  <input type="text" name="url" placeholder="https://exemple.fr" value="${urlPrecedente}" required>
  <button type="submit">Analyser</button>
</form>`;
}

function ligneCheck(check) {
  const label = check.label ? `<span class="label">${escapeHtml(check.label)}</span>` : "";
  return `<li><span class="icone">${check.icone}</span><span>${label}<span class="detail">${escapeHtml(check.texte)}</span></span></li>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function categorie(titre, avertissement, checks) {
  return `<section class="categorie">
    <h2>${titre}</h2>
    ${avertissement ? `<div class="avertissement">${escapeHtml(avertissement)}</div>` : ""}
    <ul class="checks">${checks.map(ligneCheck).join("")}</ul>
  </section>`;
}

function rendreResultat(rapport) {
  const consentementTexte = rapport.consentement.present
    ? rapport.consentement.actif
      ? "Bandeau cookies détecté et actif"
      : "Bandeau cookies détecté mais probablement inactif"
    : "Aucun bandeau cookies détecté";

  return `
    <div class="en-tete-resultat">
      <div>
        <strong>${escapeHtml(rapport.urlFinale)}</strong><br>
        <span class="badge">${escapeHtml(rapport.plateforme)}</span>
        <span class="badge">HTTP ${rapport.codeHttp}</span>
        <span class="badge">${escapeHtml(consentementTexte)}</span>
      </div>
      <a href="/">← nouvelle analyse</a>
    </div>
    ${categorie("SEO", null, rapport.seo.checks)}
    ${categorie("Accessibilité", null, rapport.accessibilite.checks)}
    ${categorie("Performance", null, rapport.performance.checks)}
    ${categorie("Design", rapport.design.avertissement, rapport.design.checks)}
  `;
}

const serveur = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(page(formulaire()));
    return;
  }

  if (url.pathname === "/analyser" && req.method === "GET") {
    const cible = url.searchParams.get("url")?.trim();
    if (!cible) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(page(formulaire()));
      return;
    }
    try {
      const rapport = await analyserSite(cible);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(page(formulaire(escapeHtml(cible)) + rendreResultat(rapport)));
    } catch (erreur) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        page(
          formulaire(escapeHtml(cible)) +
            `<div class="erreur">Impossible d'analyser ${escapeHtml(cible)} : ${escapeHtml(erreur.message)}</div>`
        )
      );
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

serveur.listen(PORT, () => {
  console.log(`Outil d'audit interne : http://localhost:${PORT}`);
});

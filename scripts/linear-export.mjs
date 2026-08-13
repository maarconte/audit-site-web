#!/usr/bin/env node
/**
 * Génère les exports à partir de docs/linear/tickets.json (source de vérité) :
 *  - docs/linear/linear-import.csv  → import CSV dans Linear
 *  - docs/roadmap-tickets.md        → détail lisible des tickets
 *
 * Usage : node scripts/linear-export.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(
  readFileSync(join(root, "docs/linear/tickets.json"), "utf8")
);

const { phases, tickets, meta } = source;
const phaseById = Object.fromEntries(phases.map((p) => [p.id, p]));

/** Description Linear (markdown) d'un ticket. */
function description(ticket) {
  const blocked = ticket.blockedBy.length
    ? ticket.blockedBy.join(", ")
    : "aucune";

  return [
    `**Contexte**`,
    ``,
    ticket.context,
    ``,
    `**Spécification**`,
    ``,
    ...ticket.spec.map((s) => `- ${s}`),
    ``,
    `**Critères d'acceptation**`,
    ``,
    ...ticket.acceptance.map((a) => `- [ ] ${a}`),
    ``,
    `**Fichiers concernés**`,
    ``,
    ...ticket.files.map((f) => `- \`${f}\``),
    ``,
    `---`,
    `Réf. interne : \`${ticket.code}\` · Dépendances : ${blocked}`,
  ].join("\n");
}

/** Échappement RFC 4180 : guillemets doublés, champ toujours quoté. */
function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function buildCsv() {
  const headers = [
    "Title",
    "Description",
    "Priority",
    "Estimate",
    "Labels",
    "Project",
    "Status",
  ];

  const rows = tickets.map((t) =>
    [
      t.code + " · " + t.title,
      description(t),
      t.priority,
      t.estimate,
      t.labels.join(","),
      phaseById[t.phase].name,
      "Backlog",
    ]
      .map(csvCell)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n") + "\n";
}

function buildMarkdown() {
  const out = [
    `# Détail des tickets`,
    ``,
    `> Fichier généré par \`scripts/linear-export.mjs\`. Ne pas éditer à la main :`,
    `> modifier \`docs/linear/tickets.json\` puis relancer le script.`,
    ``,
  ];

  for (const phase of phases) {
    const scoped = tickets.filter((t) => t.phase === phase.id);
    const points = scoped.reduce((sum, t) => sum + t.estimate, 0);

    out.push(
      `## ${phase.name}`,
      ``,
      `**${phase.duration}** · ${scoped.length} tickets · ${points} points`,
      ``,
      `**Objectif** — ${phase.goal}`,
      ``,
      `**Condition de sortie** — ${phase.exit}`,
      ``
    );

    for (const t of scoped) {
      out.push(
        `### ${t.code} · ${t.title}`,
        ``,
        `\`${meta.priorityMap[t.priority]}\` · \`${t.estimate} pts\` · ${t.labels
          .map((l) => `\`${l}\``)
          .join(" ")}`,
        ``,
        description(t),
        ``
      );
    }
  }

  return out.join("\n");
}

writeFileSync(join(root, "docs/linear/linear-import.csv"), buildCsv(), "utf8");
writeFileSync(join(root, "docs/roadmap-tickets.md"), buildMarkdown(), "utf8");

const total = tickets.reduce((sum, t) => sum + t.estimate, 0);
console.log(
  `${tickets.length} tickets · ${total} points · ${phases.length} phases`
);
console.log("→ docs/linear/linear-import.csv");
console.log("→ docs/roadmap-tickets.md");

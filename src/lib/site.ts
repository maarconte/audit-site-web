/**
 * Source unique du basePath. Importe par next.config.ts (chemin relatif : la
 * config est chargee hors du contexte de compilation Next, l'alias "@/" n'y
 * fonctionne pas) et par les metadata de chaque page (chemin relatif au
 * SITE_ORIGIN, jamais resolu automatiquement par metadataBase — voir
 * docs/lecons-techniques.md).
 *
 * Ne couvre pas $base-path dans src/scss/_vars.scss, que Next ne peut pas
 * atteindre : ce fichier reste a resynchroniser a la main si le sous-dossier
 * change un jour.
 */
export const BASE_PATH = "/audit-refonte";
export const SITE_ORIGIN = "https://thatmuch.fr";

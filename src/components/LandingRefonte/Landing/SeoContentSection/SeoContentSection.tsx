import "./style.scss";

import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";

import React from "react";

/**
 * Contenu indexable sous le pli (P2-5), presente en FAQ — inspire de
 * FAQHome (ThatMuch/website), meme esthetique (accordeon, icones +/-, une
 * question ouverte a la fois).
 *
 * Ecart deliberement du modele source : FAQHome conditionne l'affichage de
 * la reponse ({activeIndex === index && ...}), ce qui retire le texte du DOM
 * tant que la question n'est pas ouverte. Sur un export statique, ca aurait
 * vide le HTML genere des 886 mots verifies pour P2-5 — l'inverse de ce que
 * ce ticket corrige. <details>/<summary> gardent le contenu dans le DOM
 * meme ferme (Google indexe le contenu des accordeons au meme titre que le
 * contenu visible), et n'ont besoin d'aucun JavaScript : name="seo-faq"
 * donne le comportement "une seule question ouverte" nativement.
 *
 * Chaque <h2> reprend une des cinq requetes ciblees par P2-2 (roadmap.md) et
 * repond a la question dans ses deux premieres phrases. Hero et CTA
 * principal, au-dessus, restent inchanges.
 *
 * Maillage interne : 4 des 5 reponses renvoient vers un article reel de
 * thatmuch.fr, verifie par son contenu (pas seulement son slug) via le
 * sitemap public. La 5e (delai de projet) n'a aucun article correspondant
 * sur le site a ce jour — aucun lien plutot qu'une correspondance forcee
 * (ex. confondre "delai de projet" et "delai de rentabilisation", deux
 * notions distinctes trouvees en cherchant).
 */
export default function SeoContentSection() {
  return (
    <section className="SeoContentSection">
      <div className="SeoContentSection__intro">
        <h2>Vos questions</h2>
        <div className="divider mb-4"></div>
        <p className="SeoContentSection__lead">
          Voici les questions qu’on nous pose le plus souvent avant de se
          lancer, avec des réponses concrètes, pas des généralités.
        </p>
      </div>

      <details className="SeoContentSection__item" name="seo-faq">
        <summary>
          <h2>Quand refaire son site WordPress ?</h2>
          <FiPlusCircle className="SeoContentSection__icon SeoContentSection__icon--plus" />
          <FiMinusCircle className="SeoContentSection__icon SeoContentSection__icon--minus" />
        </summary>
        <div className="SeoContentSection__answer">
          <p>
            Il n’y a pas d’âge fixe : le bon moment, c’est quand ton site freine
            plus qu’il n’aide. Dans les faits, ça se joue le plus souvent entre
            3 et 5 ans après la dernière refonte, le temps que le design, les
            usages mobiles et les standards du web se déplacent.
          </p>
          <p>
            Un site WordPress vieillit rarement d’un coup. Les plugins
            s’accumulent, le thème n’est plus maintenu, les mises à jour de
            sécurité prennent du retard, et le design — parfaitement dans l’air
            du temps à sa sortie — commence à dater visuellement sans qu’on s’en
            rende compte de l’intérieur. C’est souvent un client ou un
            partenaire qui le fait remarquer en premier.
          </p>
          <p>
            Deux familles de signaux valent la peine d’être surveillées de près
            : ceux qui touchent au référencement — positions qui reculent,
            impressions qui stagnent malgré une activité inchangée — et ceux qui
            touchent à la conversion — un site qui reçoit du trafic mais génère
            de moins en moins de demandes de contact. Le premier dit que Google
            a moins confiance, le second que les visiteurs, une fois arrivés, ne
            trouvent plus ce qu’ils cherchent.
          </p>
          <p className="SeoContentSection__more">
            Pour aller plus loin :{" "}
            <a
              href="https://thatmuch.fr/signes-obsolescence-site-web/"
              target="_blank"
              rel="noopener noreferrer"
            >
              les 5 signes techniques d’obsolescence à repérer
            </a>
            .
          </p>
        </div>
      </details>

      <details className="SeoContentSection__item" name="seo-faq">
        <summary>
          <h2>7 signaux qui doivent alerter une PME parisienne</h2>
          <FiPlusCircle className="SeoContentSection__icon SeoContentSection__icon--plus" />
          <FiMinusCircle className="SeoContentSection__icon SeoContentSection__icon--minus" />
        </summary>
        <div className="SeoContentSection__answer">
          <p>
            Sept signaux reviennent, dans cet ordre de fréquence, chez les PME
            parisiennes qui nous contactent. Aucun n’est disqualifiant seul,
            mais en cumuler trois ou plus est un bon indicateur qu’il est temps
            d’agir.
          </p>
          <ol>
            <li>Le site met plus de 3 secondes à s’afficher.</li>
            <li>Il est pénible à utiliser depuis un téléphone.</li>
            <li>
              Le design semble daté comparé à celui des concurrents directs.
            </li>
            <li>
              WordPress, le thème ou les plugins accusent plusieurs versions de
              retard.
            </li>
            <li>
              Le taux de rebond grimpe sans qu’aucune explication ne saute aux
              yeux.
            </li>
            <li>
              Le site ne reflète plus l’offre ou le positionnement réel de
              l’entreprise aujourd’hui.
            </li>
            <li>
              Le formulaire de contact ou la prise de rendez-vous ne génère
              quasiment plus de demandes.
            </li>
          </ol>
          <p>
            Pris isolément, chacun de ces signaux a une explication bénigne — un
            pic de trafic inhabituel, une actualité ponctuelle, un plugin mal
            configuré. C’est leur accumulation dans le temps, plus que
            l’intensité d’un seul, qui indique qu’une refonte devient rentable
            plutôt qu’un simple correctif au coup par coup.
          </p>
          <p className="SeoContentSection__more">
            Pour aller plus loin :{" "}
            <a
              href="https://thatmuch.fr/10-erreurs-refonte-site-web/"
              target="_blank"
              rel="noopener noreferrer"
            >
              les 10 erreurs à éviter avant de se lancer
            </a>
            .
          </p>
        </div>
      </details>

      <details className="SeoContentSection__item" name="seo-faq">
        <summary>
          <h2>Combien coûte une refonte de site WordPress pour une PME ?</h2>
          <FiPlusCircle className="SeoContentSection__icon SeoContentSection__icon--plus" />
          <FiMinusCircle className="SeoContentSection__icon SeoContentSection__icon--minus" />
        </summary>
        <div className="SeoContentSection__answer">
          <p>
            Pour une PME, une refonte de site WordPress sur-mesure se situe le
            plus souvent entre 2000 et 3000 €, hors contenu spécifique — photos
            professionnelles, rédaction complète ou version multilingue. C’est
            le budget qu’on observe le plus régulièrement chez THATMUCH pour un
            site vitrine complet, sans template payant ni fonctionnalité
            superflue.
          </p>
          <p>
            Le prix varie ensuite avec le nombre de pages, la présence ou non
            d’une boutique en ligne, et la quantité de contenu à produire ou à
            reprendre. Méfie-toi des offres nettement en dessous de cette
            fourchette : un site construit sur un template générique, sans
            travail d’identité visuelle ni d’ergonomie, revient souvent plus
            cher une fois qu’il faut le refaire deux ans plus tard.
          </p>
          <p>
            Dans cette fourchette, ce qui doit être inclus : un design
            sur-mesure et non un thème du commerce, une déclinaison mobile
            pensée dès le départ plutôt qu’ajoutée après coup, l’intégration du
            contenu de base, et une structure de pages pensée pour le
            référencement plutôt que copiée sur l’ancien site. Ce qui en sort en
            revanche — rédaction complète, shooting photo, boutique en ligne —
            se chiffre à part, selon l’ampleur réelle du besoin.
          </p>
          <p className="SeoContentSection__more">
            Pour aller plus loin :{" "}
            <a
              href="https://thatmuch.fr/prix-refonte-site-vitrine-pme/"
              target="_blank"
              rel="noopener noreferrer"
            >
              le détail du budget refonte pour une PME
            </a>
            .
          </p>
        </div>
      </details>

      <details className="SeoContentSection__item" name="seo-faq">
        <summary>
          <h2>Refonte complète ou simple rafraîchissement ?</h2>
          <FiPlusCircle className="SeoContentSection__icon SeoContentSection__icon--plus" />
          <FiMinusCircle className="SeoContentSection__icon SeoContentSection__icon--minus" />
        </summary>
        <div className="SeoContentSection__answer">
          <p>
            Un rafraîchissement suffit quand la structure du site fonctionne
            encore et que seuls le design ou quelques pages ont vieilli — une
            nouvelle charte graphique, un thème dépoussiéré, quelques pages
            revues. Une refonte complète s’impose quand l’arborescence, le
            parcours utilisateur ou l’offre elle-même ont changé.
          </p>
          <p>
            À Paris comme ailleurs, le critère qui tranche est simple : si tu
            dois expliquer à un visiteur où trouver l’information plutôt que de
            la laisser la trouver seul, le problème n’est pas visuel, il est
            structurel — c’est le signe qu’un rafraîchissement ne suffira pas.
          </p>
          <p>
            Deux exemples concrets. Un site vitrine dont l’offre n’a pas changé
            mais dont le design date de 2019 : un rafraîchissement suffit
            largement. Une entreprise qui a élargi son activité, ajouté une
            gamme de services ou changé de cible depuis sa création : le site
            raconte encore l’ancienne histoire, et seule une refonte peut le
            faire correspondre à la réalité actuelle de l’entreprise.
          </p>
          <p className="SeoContentSection__more">
            Pour aller plus loin :{" "}
            <a
              href="https://thatmuch.fr/refonte-site-web/"
              target="_blank"
              rel="noopener noreferrer"
            >
              les 5 étapes d’une refonte de site web
            </a>
            .
          </p>
        </div>
      </details>

      <details className="SeoContentSection__item" name="seo-faq">
        <summary>
          <h2>Combien de temps prend une refonte de site vitrine ?</h2>
          <FiPlusCircle className="SeoContentSection__icon SeoContentSection__icon--plus" />
          <FiMinusCircle className="SeoContentSection__icon SeoContentSection__icon--minus" />
        </summary>
        <div className="SeoContentSection__answer">
          <p>
            Compte entre 4 et 8 semaines pour un site vitrine, du cadrage à la
            mise en ligne. Le délai dépend surtout de la disponibilité du
            contenu — textes et visuels — plus que du développement lui-même,
            qui reste la partie la plus prévisible du projet.
          </p>
          <p>
            Le déroulé type : une à deux semaines de cadrage et de maquettes,
            deux à quatre semaines de développement, et une à deux semaines de
            relecture et d’ajustements avant mise en ligne. Un contenu prêt à
            l’avance raccourcit sensiblement ce délai.
          </p>
          <p>
            Ce calendrier suppose des retours réguliers de ton côté à chaque
            étape : c’est presque toujours l’attente d’un retour ou d’un contenu
            manquant, plus que la charge de travail elle-même, qui fait déraper
            un planning de refonte au-delà de 8 semaines.
          </p>
        </div>
      </details>
    </section>
  );
}

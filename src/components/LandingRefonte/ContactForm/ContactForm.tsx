import "./ContactForm.scss";

import { EVENEMENTS, suivre } from "../../../utils/analytics";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import MeetingCta from "../../MeetingCta/MeetingCta";
import tardis from "../../../../public/images/tardis.webp";
import { useScoreStore } from "../../../store/useScoreStore";

// Cloud Function URL — update after deployment
const SUBMIT_URL =
  process.env.NEXT_PUBLIC_SUBMIT_FUNCTION_URL ||
  "https://submitform-xxxxxxxxxx-uc.a.run.app";

const IS_TEST_ENV = process.env.NEXT_PUBLIC_IS_TEST_ENV === "true";

interface FormState {
  success: boolean;
  message: string;
}

export default function ContactForm() {
  const scores = useScoreStore((s) => s.scores);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<FormState | null>(null);

  // Le gate email est le dernier obstacle avant le lead : on veut savoir
  // combien de visiteurs l'atteignent sans le franchir.
  useEffect(() => {
    suivre(EVENEMENTS.formulaireContactVu);
  }, []);

  useEffect(() => {
    if (state?.success) {
      suivre(EVENEMENTS.resultatVu);
    }
  }, [state?.success]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setState(null);

    const formData = new FormData(e.currentTarget);

    const body = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      url: formData.get("url") as string,
      scores,
      isTest: IS_TEST_ENV,
    };

    try {
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: FormState = await response.json();
      setState(data);
      if (data.success) {
        suivre(EVENEMENTS.leadEnvoye, {
          score_total: Object.values(scores).reduce((s, v) => s + v, 0),
        });
      }
    } catch {
      setState({
        success: false,
        message: "Erreur réseau. Veuillez réessayer.",
      });
    } finally {
      setIsPending(false);
    }
  }

  const champLabelClass = "block mb-2";
  const champInputClass =
    "block w-full px-3 py-2 text-base rounded-md border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-dev-500";

  return (
    <div className="ContactFormRefonte">
      <div className="grid md:grid-cols-2 md:gap-8">
        <div className="relative">
          <h2 className="h3">Analyse terminée !</h2>
          <div className="divider mb-4"></div>
          <h3 className="h1">Recevez votre résultat par mail</h3>
          <Image
            src={tardis}
            alt=""
            width={300}
            height={300}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div>
          {!state?.success ? (
            <form
              onSubmit={handleSubmit}
              id="contact-form-refonte-siteweb"
              className="flex flex-col items-center justify-center"
            >
              <div className="mb-6 w-full">
                <label htmlFor="url" className={champLabelClass}>
                  URL du site web
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  className={champInputClass}
                  required
                />
              </div>

              <div className="mb-6 w-full">
                <label htmlFor="firstName" className={champLabelClass}>
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={champInputClass}
                  required
                />
              </div>

              <div className="mb-6 w-full">
                <label htmlFor="lastName" className={champLabelClass}>
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={champInputClass}
                  required
                />
              </div>

              <div className="mb-6 w-full">
                <label htmlFor="email" className={champLabelClass}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={champInputClass}
                  required
                />
              </div>

              <div className="mb-6 w-full">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="h-4 w-4 mt-1 shrink-0 accent-dev-500"
                    required
                  />
                  <label htmlFor="terms">
                    <small>
                      J’accepte que <span className="uppercase">Thatmuch</span>{" "}
                      collecte mes données selon sa{" "}
                      {/* <a> brute volontairement : la page vit sur thatmuch.fr, hors basePath. */}
                      <a
                        href="/politique-de-confidentialite"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        politique de confidentialité.
                      </a>
                    </small>
                  </label>
                </div>
              </div>

              {state?.message && !state?.success && (
                <div className="text-com-500 mb-6">{state.message}</div>
              )}

              <button
                type="submit"
                className="btn btn-white"
                disabled={isPending}
              >
                {isPending ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          ) : (
            <div className="">
              <span className="badge badge-success">
                <MdOutlineMarkEmailUnread className="icon" size={32} />
              </span>
              <p className=" mt-4 mb-12">
                L’analyse de votre site web vous attend dans votre boîte mail !
                Pensez à vérifier vos spams si vous ne le voyez pas dans votre
                boîte de réception.
              </p>
              {/* Seul chemin vers un RDV depuis le produit : sans lui, le tunnel
                  se termine sur une attente et le lead repart. */}
              <h4 className="h5">Une question sur votre résultat ?</h4>
              <p className=" mb-4">
                Autant en parler de vive voix et faire revoir votre site par un
                professionnel.
              </p>
              <MeetingCta emplacement="confirmation_tunnel">
                Demander un diagnostic complet
              </MeetingCta>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

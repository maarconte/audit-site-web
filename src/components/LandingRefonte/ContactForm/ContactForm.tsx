import "./ContactForm.scss";

import React, { useEffect, useState } from "react";
import Button from "../../UI/Button/Button";
import Image from "next/image";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { EVENEMENTS, suivre } from "../../../utils/analytics";
import MeetingCta from "../../MeetingCta/MeetingCta";
import { useScoreStore } from "../../../store/useScoreStore";
import tardis from "../../../../public/images/tardis.webp";

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

  return (
    <div className="ContactFormRefonte">
      <div className="row">
        <div className="col-md-6 position-relative">
          <h2 className="h3">Analyse terminée !</h2>
          <div className="divider mb-4"></div>
          <h3 className="h1">Recevez votre résultat par mail</h3>
          <Image src={tardis} alt="Tardis" width={300} height={300} style={{ objectFit: 'contain' }} />
        </div>
        <div className="col-md-6">
          {!state?.success ? (
            <form
              onSubmit={handleSubmit}
              id="contact-form-refonte-siteweb"
              className="d-flex flex-column align-items-center justify-content-center"
            >
              <div className="form-group mb-4 w-100">
                <label htmlFor="url">URL du site web</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-4 w-100">
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-4 w-100">
                <label htmlFor="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-4 w-100">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-4 w-100">
                <div className="d-flex gap-2">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="form-check-input"
                    required
                  />
                  <label htmlFor="terms" className="form-check-label">
                    <small>
                      J'accepte que <span className="uppercase">Thatmuch</span> collecte mes données selon sa{" "}
                      {/* <a> brute volontairement : la page vit sur thatmuch.fr, hors basePath. */}
                      <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="text-decoration-underline">
                        politique de confidentialité.
                      </a>
                    </small>
                  </label>
                </div>
              </div>

              {state?.message && !state?.success && (
                <div className="text-danger mb-4">{state.message}</div>
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
            <div className="d-flex flex-column align-items-center justify-content-center">
              <span className="badge badge-success">
                <MdOutlineMarkEmailUnread className="icon" size={32} />
              </span>
              <p className="text-center mt-3">
                L'analyse de votre site web vous attend dans votre boîte mail ! Pensez à vérifier vos spams si vous ne le voyez pas dans votre boîte de réception.
              </p>
              {/* Seul chemin vers un RDV depuis le produit : sans lui, le tunnel
                  se termine sur une attente et le lead repart. */}
              <p className="text-center mt-4 mb-3">
                <small>Une question sur votre résultat ? Autant en parler de vive voix.</small>
              </p>
              <MeetingCta emplacement="confirmation_tunnel">
                Faire relire mon score par une designer — 30 min
              </MeetingCta>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

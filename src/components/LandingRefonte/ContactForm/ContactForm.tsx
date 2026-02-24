import "./ContactForm.scss";

import React, { useState } from "react";
import Button from "../../UI/Button/Button";
import Image from "next/image";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useScoreStore } from "../../../store/useScoreStore";
import tardis from "../../../../public/images/tardis.webp";

// Cloud Function URL — update after deployment
const SUBMIT_URL =
  process.env.NEXT_PUBLIC_SUBMIT_FUNCTION_URL ||
  "https://submitform-xxxxxxxxxx-uc.a.run.app";

interface FormState {
  success: boolean;
  message: string;
}

export default function ContactForm() {
  const scores = useScoreStore((s) => s.scores);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<FormState | null>(null);

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
    };

    try {
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: FormState = await response.json();
      setState(data);
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

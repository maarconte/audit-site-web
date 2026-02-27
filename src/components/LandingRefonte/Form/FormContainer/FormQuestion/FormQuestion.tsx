import "./style.scss";

import { Field } from "formik";
import React from "react";

export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  question: string;
  description?: string;
  options: QuestionOption[];
}

type Props = {
  item: Question;
  currentValue: string;
  error?: string;
  isTouched?: boolean;
  showErrors?: boolean;
};

const FormQuestion = React.memo(({ item, currentValue, error, isTouched }: Props) => {
  const { question, options, id, description } = item;
  // Gestion des touches clavier pour l'accessibilité
  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="FormQuestion" key={id}>
      <fieldset
        aria-describedby={error && isTouched ? `error-${id}` : undefined}
      >
        <legend id={`legend-${id}`}>
          <h3 className="h5 mb-4">{question}</h3>
        </legend>
        {description && (
          <p className="FormQuestion__description">{description}</p>
        )}
        <div
          role="radiogroup"
          aria-labelledby={`legend-${id}`}
          aria-required="true"
        >
          {options?.map((option: QuestionOption, index: number) => {
            const inputId = `option-${item.id}-${index}`;
            const isSelected = currentValue === option.score.toString();

            return (
              <div key={index}>
                <div className={"FormQuestion__option"}>
                  <Field
                    type="radio"
                    id={inputId}
                    name={id}
                    value={option.score.toString()}
                    aria-describedby={
                      error && isTouched ? `error-${id}` : undefined
                    }
                    onKeyDown={(e: React.KeyboardEvent) =>
                      handleKeyDown(e, () => {
                        const input = e.target as HTMLInputElement;
                        input.checked = true;
                        input.focus();
                      })
                    }
                  />
                  <label htmlFor={inputId}>{option.text}</label>
                </div>

                {id === "technique-1" &&
                  index === options.length - 1 &&
                  isSelected && (
                    <Field
                      type="input"
                      id={`option-${item.id}-${index}-input`}
                      name={`${id}-ignore`}
                      placeholder="Précisez votre choix"
                      className="FormQuestion__input"
                      aria-describedby={
                        error && isTouched ? `error-${id}` : undefined
                      }
                      onKeyDown={(e: React.KeyboardEvent) =>
                        handleKeyDown(e, () => {
                          const input = e.target as HTMLInputElement;
                          input.focus();
                        })
                      }
                    />
                  )}
              </div>
            );
          })}
          {/* {showErrors && error && (
            <div className={`FormQuestion__error`} id={`error-${id}`}>
              {error || "Veuillez sélectionner une option."}
            </div>
          )} */}
        </div>
      </fieldset>
    </div>
  );
});

FormQuestion.displayName = "FormQuestion";

export default FormQuestion;

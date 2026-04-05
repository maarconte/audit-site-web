import "./style.scss";

import * as Yup from "yup";

import { Form, Formik, FormikErrors } from "formik";
import React, { useEffect, useMemo, useState } from "react";

import Button from "../../../UI/Button/Button";
import FormQuestion from "./FormQuestion/FormQuestion";
import { useScoreStore } from "../../../../store/useScoreStore";

import { Question } from "./FormQuestion/FormQuestion";

type CategoryData = {
  questions: Question[];
}

type Props = {
  currentCategoryIndex: number;
  categories: { name: string; slug: string }[];
  setCurrentCategoryIndex: (index: number) => void;
  data: CategoryData[];
  setIsFinished: (isFinished: boolean) => void;
};

export default function FormContainer({
  currentCategoryIndex,
  categories,
  setCurrentCategoryIndex,
  data,
  setIsFinished,
}: Props) {
  const updateScoreByCategory = useScoreStore((s) => s.updateScore);
  const [showErrors, setShowErrors] = useState(false);
  const isLastCategory = currentCategoryIndex === categories.length - 1;
  const currentCategory = categories[currentCategoryIndex];
  const currentCategoryData = data[currentCategoryIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategoryIndex]);

  // Helper function to calculate score for the current category based on form values
  const calculateCurrentCategoryScore = (formValues: {[key: string]: string}) => {
    const currentQuestions = currentCategoryData?.questions;
    if (!currentQuestions || !formValues) return 0;

    // ⚡ Bolt Performance Optimization:
    // Replaced multiple passes (reducing to an object, then Object.values.reduce)
    // with a single iteration pass, avoiding intermediate object allocation.
    return currentQuestions.reduce((sum: number, question) => {
      if (question.id.includes("ignore")) return sum;
      return sum + (parseInt(formValues[question.id] as string) || 0);
    }, 0);
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleNext = (formValues: {[key: string]: string}) => {
    const score = calculateCurrentCategoryScore(formValues);
    updateScoreByCategory(currentCategory.slug, score);
    setCurrentCategoryIndex(currentCategoryIndex + 1);
  };

  const handleSubmit = (formValues: {[key: string]: string}) => {
    const score = calculateCurrentCategoryScore(formValues);
    updateScoreByCategory(currentCategory.slug, score);
    // After updating the last category's score, calculate the global score
    setIsFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gestion des touches clavier pour l'accessibilité
  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const handleDisableNext = (values: {[key: string]: string}, errors: FormikErrors<{[key: string]: string}>) => {
    // if values of current category are empty disable next button
    const currentQuestions = currentCategoryData?.questions;
    if (!currentQuestions) return true; // No questions, disable

    // ⚡ Bolt Performance Optimization:
    // Replaced mapping over all form keys (getCurrentCategoryData) with a direct
    // `.some()` check on the current category's questions, preventing intermediate object allocation
    // and reducing iteration overhead.
    const hasEmptyValue = currentQuestions.some(
      (question) => question.id.startsWith(currentCategory.slug) && values[question.id] === ""
    );

    if (hasEmptyValue || Object.keys(errors).length > 0) {
      return true;
    } else {
      return false;
    }
  };

  // Initialisation des valeurs du formulaire et du schéma de validation
  const initialValues = useMemo(() => {
    const values: {[key: string]: string} = {};
    data?.forEach((category) => {
      category.questions?.forEach((q) => {
        values[q.id] = "";
      });
    });
    return values;
  }, [data]);

  const validationSchema = useMemo(() => {
    const shape: Record<string, Yup.Schema> = {};
    currentCategoryData?.questions?.forEach((q) => {
      shape[q.id] = Yup.string().required(
        "Veuillez répondre à cette question"
      );
    });
    return Yup.object().shape(shape);
  }, [currentCategoryData]);

  return (
    <div className="FormContainer">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        //enableReinitialize={true}
      >
        {({ errors, touched, values, dirty }) => (
          <Form role="form" aria-labelledby="quiz-title">
            {currentCategoryData?.questions?.map((question) => (
              <FormQuestion
                item={question}
                key={question.id}
                errors={errors}
                touched={touched}
                showErrors={showErrors}
              />
            ))}
            <div
              className="d-flex justify-content-between align-items-center mt-4"
              role="navigation"
              aria-label="Navigation du quiz"
            >
              {currentCategoryIndex > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
                  label="Revenir à la catégorie précédente"
                  className="btn btn-dev btn-outlined"
                >
                  Précédent
                </Button>
              )}
              {isLastCategory ? (
                <Button
                  type="submit"
                  disabled={handleDisableNext(values, errors)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleSubmit(values))}
                  label="Envoyer toutes les réponses"
                  className="btn btn-success ml-auto"
                >
                  Envoyer
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleNext(values)}
                  disabled={handleDisableNext(values, errors)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleNext(values))}
                  label="Passer à la catégorie suivante"
                  className="btn btn-dev ml-auto"
                >
                  Suivant
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}


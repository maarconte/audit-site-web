"use client"

import React, { useEffect, useState } from "react";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import ContactForm from "@/components/LandingRefonte/ContactForm/ContactForm";
import FormContainer from "@/components/LandingRefonte/Form/FormContainer/FormContainer";
import FormStepper from "@/components/LandingRefonte/Form/FormStepper/FormStepper";
import { HeroSection } from "@/components/LandingRefonte/Landing/HeroSection/HeroSection";
import data from "@/data/questionquiz.json";
import { useScoreStore } from "@/store/useScoreStore";

// Hoist static data transformations outside of the component to avoid
// redundant calculations and object allocations on every render.
const STATIC_CATEGORIES = data.map((item) => ({
  name: item.category as unknown as string,
  slug: item.slug as unknown as string,
}));

export default function RefonteFormClient() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const setCategories = useScoreStore((s) => s.setCategories);

  useEffect(() => {
    setCategories(STATIC_CATEGORIES);
  }, [setCategories]);

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="bg-form">
        <div className="container-fluid">
          <HeroSection
            title={"Est-ce le moment de refaire mon site internet ?"}
            isLanding={false}
          />

          {!isFinished ? (
            <>
              <FormStepper
                categories={STATIC_CATEGORIES}
                currentCategoryIndex={currentCategoryIndex}
              />
              <FormContainer
                currentCategoryIndex={currentCategoryIndex}
                categories={STATIC_CATEGORIES}
                setCurrentCategoryIndex={setCurrentCategoryIndex}
                data={data as any}
                setIsFinished={setIsFinished}
              />
            </>
          ) : (
            <ContactForm />
          )}
        </div>
        <div className="d-flex justify-content-center p-2 bg-dark mt-5">
          <span className="uppercase text-white">thatmuch</span>
        </div>
      </div>
    </ClickSpark>
  );
}

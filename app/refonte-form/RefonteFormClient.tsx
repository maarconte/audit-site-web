"use client"

import React, { useEffect, useState } from "react";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import ContactForm from "@/components/LandingRefonte/ContactForm/ContactForm";
import FormContainer from "@/components/LandingRefonte/Form/FormContainer/FormContainer";
import FormStepper from "@/components/LandingRefonte/Form/FormStepper/FormStepper";
import { HeroSection } from "@/components/LandingRefonte/Landing/HeroSection/HeroSection";
import data from "@/data/questionquiz.json";
import { useScoreStore } from "@/store/useScoreStore";

// ⚡ Bolt: Hoist static configuration outside of component
// The raw `data` represents categories directly. We can map them once globally
// instead of recomputing (even with useMemo) and avoid the unnecessary and ineffective
// `new Set(data.map(q => q))` which attempts object-reference deduplication.
const STATIC_CATEGORIES = data.map((item) => ({
  name: item.category,
  slug: item.slug,
}));

export default function RefonteFormClient() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const setCategories = useScoreStore((s) => s.setCategories);

  const categories = STATIC_CATEGORIES;

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

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
                categories={categories}
                currentCategoryIndex={currentCategoryIndex}
              />
              <FormContainer
                currentCategoryIndex={currentCategoryIndex}
                categories={categories}
                setCurrentCategoryIndex={setCurrentCategoryIndex}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

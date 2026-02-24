"use client"

import React, { useEffect, useMemo, useState } from "react";
import ClickSpark from "@/components/ClickSpark/ClickSpark";
import ContactForm from "@/components/LandingRefonte/ContactForm/ContactForm";
import FormContainer from "@/components/LandingRefonte/Form/FormContainer/FormContainer";
import FormStepper from "@/components/LandingRefonte/Form/FormStepper/FormStepper";
import { HeroSection } from "@/components/LandingRefonte/Landing/HeroSection/HeroSection";
import data from "@/data/questionquiz.json";
import { useScoreStore } from "@/store/useScoreStore";

export default function RefonteFormClient() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const setCategories = useScoreStore((s) => s.setCategories);

  const categories = useMemo(() => {
    // Récupération des catégories à partir des questions
    const uniqueCategories = new Set(data.map((q) => q));
    return Array.from(uniqueCategories).map((item) => ({
      name: item.category as unknown as string,
      slug: item.slug as unknown as string,
    }));
  }, []);

  useEffect(() => {
    const categoriesForProvider = categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));
    setCategories(categoriesForProvider);
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

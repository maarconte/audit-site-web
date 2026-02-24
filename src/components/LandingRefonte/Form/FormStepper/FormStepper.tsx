import "./style.scss";

import { MdAdsClick, MdDesignServices, MdSearch } from "react-icons/md";

import { CgIfDesign } from "react-icons/cg";
import { FaScaleBalanced } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import React from "react";
import { SiTmux } from "react-icons/si";
import { TiSpanner } from "react-icons/ti";

type Props = {
  categories: { name: string; slug: string }[];
  currentCategoryIndex: number;
};

export default function FormStepper({
  categories,
  currentCategoryIndex,
}: Props) {
  const icons: Record<string, React.ReactNode> = {
    design: <MdDesignServices className="step-icon" />,
    marketing: <MdAdsClick className="step-icon" />,
    ux: <CgIfDesign className="step-icon" />,
    dev: <SiTmux className="step-icon" />,
    seo: <MdSearch className="step-icon" />,
    performance: <IoStatsChart className="step-icon" />,
    technique: <TiSpanner className="step-icon" />,
    legal: <FaScaleBalanced className="step-icon" />,
  };
  // format categories to add an icon
  const formattedCategories = categories.map((category) => ({
    ...category,
    icon: icons[category.slug] || <MdDesignServices className="step-icon" />, // Default icon if not found
  }));
  return (
    <div className="FormStepper">
      {formattedCategories.map((category, index) => (
        <div
          key={category.slug}
          className={`FormStepper__step ${currentCategoryIndex === index ? "active" : ""
            } ${currentCategoryIndex > index ? "completed" : ""}`}
          aria-label={`Étape ${index + 1} : ${category.name}`}
          role="button"
          tabIndex={0}
        >
          <span className="FormStepper__step__icon">{category.icon}</span>
          {currentCategoryIndex === index && (
            <span className="FormStepper__step__name">{category.name}</span>
          )}
        </div>
      ))}
      <div className="FormStepper__activeLabel">
        {formattedCategories[currentCategoryIndex]?.name}
      </div>
    </div>
  );
}

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

// Performance optimization: Move static mapping outside component body to prevent
// unnecessary object allocation and React element creation on every render.
const categoryIcons: Record<string, React.ReactNode> = {
  design: <MdDesignServices className="step-icon" />,
  marketing: <MdAdsClick className="step-icon" />,
  ux: <CgIfDesign className="step-icon" />,
  dev: <SiTmux className="step-icon" />,
  seo: <MdSearch className="step-icon" />,
  performance: <IoStatsChart className="step-icon" />,
  technique: <TiSpanner className="step-icon" />,
  legal: <FaScaleBalanced className="step-icon" />,
};

const defaultIcon = <MdDesignServices className="step-icon" />;

export default function FormStepper({
  categories,
  currentCategoryIndex,
}: Props) {
  // format categories to add an icon
  const formattedCategories = React.useMemo(() => {
    return categories.map((category) => ({
      ...category,
      icon: categoryIcons[category.slug] || defaultIcon, // Default icon if not found
    }));
  }, [categories]);

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

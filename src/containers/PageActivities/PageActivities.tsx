import SectionSliderNewCategories from "./SectionSliderNewCategories";
import React, { FC, useState, useEffect } from "react";
import SectionGridFeaturePlaces from "./SectionGridFeaturePlaces";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import { TaxonomyType } from "data/types";
import SectionGridCategoryBox from "./SectionGridCategoryBox";

import ActivitySearchForm from "components/HeroSearchForm/ActivitySearchForm";
import { Helmet } from "react-helmet";
import Circles from "components/Circles"

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: string;
  currentPage?: "Activities";
}

const PageActivities: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Activities",
  currentPage,
}) => {
  const [tabActive, setTabActive] = useState(currentTab);

  const isArchivePage = !!currentPage && !!currentTab;
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Ticketshala.com || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="container search-container-bg relative space-y-24 mb-24 lg:space-y-24 lg:mb-24">
        {/* SECTION HERO */}
        <div className="relative z-10">
          <ActivitySearchForm />
        </div>
        <Circles />
      </div>

      <div className="container relative space-y-24 lg:space-y-24">
        {/* SECTION */}
        <div className="relative">
          <SectionGridFeaturePlaces />
        </div>

        {/* SECTION 1 */}
        <div className="relative py-8 lg:py-16">
          <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
          <SectionSliderNewCategories
            categoryCardType="card4"
            itemPerRow={4}
            heading="Recommended Activities"
            subHeading="Grab exciting discounts for your upcoming trips to our most-loved destinations!"
            sliderStyle="style2"
          />
        </div>

        {/* SECTION 
        <div className="relative">
          <BackgroundSection className="rounded-none-imp" />
          <SectionGridCategoryBox />
        </div> */}

      </div>
    </div>
  );
}

export default PageActivities;

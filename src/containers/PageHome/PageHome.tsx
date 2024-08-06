import React, { FC, useState, useEffect } from "react";
import SectionSliderNewCategories from "./SectionSliderNewCategories";
import SectionSliderNewBlogs from "./SectionSliderNewBlogs";
import SectionSubscribe2 from "./SectionSubscribe2";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import Circles from "components/Circles"
import SectionGridCategoryBox from "./SectionGridCategoryBox";
import SectionSliderPromotions from "./SectionSliderPromotions"
import SectionGridFeaturePlaces from "./SectionGridFeaturePlaces";
import FlightSearchForm from "components/HeroSearchForm/FlightSearchForm";
import { Helmet } from "react-helmet";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: string;
  currentPage?: "Flights";
}

const PageHome: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Flights",
  currentPage,
}) => {
  const isArchivePage = !!currentPage && !!currentTab;

  const getSearchResult = () => {

  }

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Ticketshala.com || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="search-container-bg search-result relative bread-bg-flights">
        {/* SECTION HERO */}
        <div className="container flight-search relative z-10">
          <FlightSearchForm haveDefaultValue={isArchivePage} header={true} page='page1' getSearchResult={getSearchResult} />
        </div>
        <Circles />
      </div>

      <div className="container relative">
        {/* SECTION PROMOTIONS */}
        <SectionSliderPromotions className='relative py-8' />
      </div>

      <div className="container relative">
        {/* SECTION */}
        <div className="relative">
          <BackgroundSection className="bg-neutral-100 dark:bg-black dark:bg-opacity-20 rounded-none-imp" />
          <SectionGridCategoryBox className="relative py-8 lg:py-16" />
        </div>
      </div>

      <div className="container relative">
        {/* SECTION POPULAR DESTINATIONS */}
        <SectionSliderNewCategories className='relative py-8 lg:py-16' />
      </div>

      <div className="container relative">
      <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
        {/* SECTION HOTEL STAYS */}
        <SectionGridFeaturePlaces />
      </div>

      <div className="container relative">
        {/* SECTION BLOGS */}
        <SectionSliderNewBlogs className='relative py-8 lg:py-16' />
      </div>

    </div>
  );
}

export default PageHome;

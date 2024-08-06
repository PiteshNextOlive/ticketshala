import React, { FC, useState, useEffect } from "react";
import SectionGridCategoryBox from "./SectionGridCategoryBox";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";

import TransferSearchForm from "components/HeroSearchForm/TransferSearchForm";
import { Helmet } from "react-helmet";
import Circles from "components/Circles"
import { Service, Storage } from "services/Service";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: string;
  currentPage?: "Transfers";
}

const PageTransfers: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Transfers",
  currentPage,
}) => {
  const [popular, setPopular]: any = useState(null);
  const [locationData, setLocationData]: any = useState(null);

  const getUserLocation = async () => {
    const url = 'https://ipapi.co/json/'
    try {
      const response = await fetch(url, {
        method: 'GET'
      })
      return await response.json()
    } catch (error) {
      return null
    }
  }

  useEffect(() => {

    const location = Storage.get('location')
   
    if (location) {
      setLocationData(location)
    } else {
      getUserLocation().then(response => {
        if (response !== null) {
          Storage.set('location', response);
        }
      })
    }

  }, [])

  const isArchivePage = !!currentPage && !!currentTab;
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Ticketshala.com || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="container search-container-bg relative space-y-24 lg:space-y-24">
        {/* SECTION HERO */}
        <div className="relative z-10">
        <TransferSearchForm haveDefaultValue={isArchivePage} location={locationData} popular={popular} />
        </div>
        <Circles />
      </div>

      <div className="container relative">        
        {/* SECTION */}
        <div className="relative">
          <BackgroundSection className="bg-neutral-100 dark:bg-black dark:bg-opacity-20 rounded-none-imp z-0" />
          <SectionGridCategoryBox className="relative py-8 lg:py-16 z-5" location={locationData} setPopular={setPopular} />
        </div>
      </div>
    </div>
  );
}

export default PageTransfers;

import SectionSliderNewCategories from "./SectionSliderNewCategories";
import React, { FC, useState, useEffect } from "react";
import SectionGridFeaturePlaces from "./SectionGridFeaturePlaces";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import { TaxonomyType } from "data/types";
import Circles from "components/Circles"

import HotelSearchForm from "components/HeroSearchForm/HotelSearchForm";
import SectionClientSay from "components/SectionClientSay/SectionClientSay";
import { Helmet } from "react-helmet";

const DEMO_CATS_2: TaxonomyType[] = [
  {
    id: "1",
    href: "#",
    name: "Enjoy the great cold",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  },
  {
    id: "222",
    href: "#",
    name: "Sleep in a floating way",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "3",
    href: "#",
    name: "In the billionaire's house",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "4",
    href: "#",
    name: "Cool in the deep forest",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "5",
    href: "#",
    name: "In the billionaire's house",
    taxonomy: "category",
    count: 188288,
    thumbnail:
      "https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
];

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: string;
  currentPage?: "Hotels";
}

const PageHotels: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Hotels",
  currentPage,
}) => {
  const [tabActive, setTabActive] = useState(currentTab);

  const isArchivePage = !!currentPage && !!currentTab;

  const getHotelList = () => {
    
  }
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Hotels || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="search-container-bg relative bread-bg-hotels">
        {/* SECTION HERO */}
        <div className="container relative z-10">
          <HotelSearchForm haveDefaultValue={isArchivePage} header={true} page='page1' getHotelList={getHotelList} />
        </div>
        <Circles />
      </div>

      <div className="container relative">
        {/* SECTION */}
        <div className="relative py-8 lg:py-16">
          <SectionGridFeaturePlaces />
        </div>

        {/* SECTION 1 */}
        <div className="relative py-8 lg:py-16">
          <SectionSliderNewCategories
            categories={DEMO_CATS_2}
            categoryCardType="card4"
            itemPerRow={4}
            heading="Popular places to stay"
            subHeading="Popular places to stay that ticketshala recommends for you"
            sliderStyle="style2"
          />
        </div>

      </div>
    </div>
  );
}

export default PageHotels;

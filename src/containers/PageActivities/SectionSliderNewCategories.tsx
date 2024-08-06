import React, { FC, useEffect, useState } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import { TaxonomyType } from "data/types";
import ncNanoId from "utils/ncNanoId";
import PackageCard from "./PackageCard";
import NextPrev from "shared/NextPrev/NextPrev";
import { Service, Storage } from 'services/Service';
import ButtonPrimary from "shared/Button/ButtonPrimary";

export interface SectionSliderNewCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categories?: TaxonomyType[];
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
}

const SectionSliderNewCategories: FC<SectionSliderNewCategoriesProps> = ({
  heading = "Explore popular destinations",
  subHeading = "Explore thousands of destinations around the world",
  className = "",
  itemClassName = "",
  itemPerRow = 5,
  sliderStyle = "style1",
}) => {

  const DEMO_CATS_2 = []
  const UNIQUE_CLASS = "glide_" + ncNanoId();
  const [destinations, setDestinations]: any = useState([])
  const [loading, setLoading] = useState(false)

  const [searching, setSearching] = useState(false);
  const [activities, setActivities]: any = useState([])

  const getLists = (data?: any) => {
    setSearching(true)
    Service.get({
      url: '/activities/featured'
    }).then(response => {
      setSearching(false);
      if (response && response.data && response.data.length > 0) {
        setActivities(response.data)
      } else {
        setActivities([])
      }
    })
  }

  useEffect(() => {
    getLists()
  }, [])

  useEffect(() => {
    if (document.querySelector(`.${UNIQUE_CLASS}`)) {
      new Glide(`.${UNIQUE_CLASS}`, {
        perView: itemPerRow,
        gap: 32,
        bound: true,
        rewind: true,
        breakpoints: {
          1280: {
            perView: itemPerRow - 1,
          },
          1024: {
            gap: 20,
            perView: itemPerRow - 1,
          },
          768: {
            gap: 20,
            perView: itemPerRow - 2,
          },
          640: {
            gap: 20,
            perView: itemPerRow - 3,
          },
          500: {
            gap: 20,
            perView: 1,
          },
        },
      }).mount();
    }
  }, [activities]);

  const renderCard = (stay: any) => {
    return <PackageCard key={stay.id} data={stay} />;
  };

  return (
    <div className={`nc-SectionSliderNewCategories ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`}>
        <Heading
          desc={subHeading}
          hasNextPrev={sliderStyle === "style1"}
          isCenter={sliderStyle === "style2"}
        >
          {heading}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {activities.map((item: any, index: any) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                {renderCard(item)}
              </li>
            ))}
          </ul>
        </div>

        {sliderStyle === "style2" && (
          <NextPrev className="justify-center mt-16" />
        )}
      </div>
 
    </div>
  );
};

export default SectionSliderNewCategories;

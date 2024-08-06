import React, { FC, useEffect } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import { TaxonomyType } from "data/types";
import ncNanoId from "utils/ncNanoId";
import CardCategory4 from "./CardCategory4";
import NextPrev from "shared/NextPrev/NextPrev";
import CardCategory5 from "./CardCategory5";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link, useHistory } from 'react-router-dom'

export interface SectionSliderNewCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categories?: TaxonomyType[];
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
  slug?: string;
}

const SectionSliderNewCategories: FC<SectionSliderNewCategoriesProps> = ({
  heading = "Explore popular destinations ✈",
  subHeading = "Explore thousands of destinations around the world",
  className = "",
  itemClassName = "",
  categories = [],
  itemPerRow = 5,
  categoryCardType = "card3",
  sliderStyle = "style1",
  slug = ""
}) => {
  const UNIQUE_CLASS = "glide_" + ncNanoId();

  useEffect(() => {
    if (document.querySelector(`.${UNIQUE_CLASS}`)) {
      new Glide(`.${UNIQUE_CLASS}`, {
        perView: itemPerRow,
        gap: 32,
        bound: true,
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

  }, [categories]);

  const renderCard = (item: TaxonomyType, index: number) => {
    switch (categoryCardType) {
      case "card4":
        return <CardCategory4 col={item} />;
      case "card5":
        return <CardCategory5 col={item} />;
      default:
        return <CardCategory4 col={item} />;
    }
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
            {categories.map((item, index) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                {renderCard(item, index)}
              </li>
            ))}
          </ul>
        </div>

        {sliderStyle === "style2" && (
          <NextPrev className="justify-center mt-16" />
        )}
      </div>
      
      {(slug !== '') ?
        <div className="mt-16 flex items-center justify-center space-x-5">
          <Link to={`/packages/search?slug=${slug}`}><ButtonPrimary className="w-56">Show All</ButtonPrimary></Link>
        </div>
      : null}

    </div>
  );
};

export default SectionSliderNewCategories;

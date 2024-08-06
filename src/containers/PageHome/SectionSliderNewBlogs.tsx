import React, { FC, useEffect, useState } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import { TaxonomyType } from "data/types";
import ncNanoId from "utils/ncNanoId";
import CardCategory3 from "./CardCategory3";
import NextPrev from "shared/NextPrev/NextPrev";
import { Service, Storage } from 'services/Service';

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
  heading = "Featured Blogs",
  subHeading = "Explore thousands of destinations around the world",
  className = "",
  itemClassName = "",
  categories = "",
  itemPerRow = 5,
  categoryCardType = "card3",
  sliderStyle = "style1",
}) => {

  const UNIQUE_CLASS = "glide_" + ncNanoId();
  const [blogs, setBlogs]: any = useState([])
  const [loading, setLoading] = useState(false)

  const getLists = (data: any) => {
    setLoading(true)
    Service.post({
        url: '/data/blogs',
        body: JSON.stringify(data)
    }).then(response => {
        setLoading(false)
        if (response.data && response.data.length > 0) {
          setBlogs(response.data)
        } else {
          setBlogs([])
        }
    })
}

  useEffect(() => {
    getLists({
      page: 1,
      order: "desc",
      limit: 10,
      status: 2
    })
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
  }, [blogs]);

  const renderCard = (item: TaxonomyType, index: number) => {
    return <CardCategory3 col={item} loading={loading} type="blogs" />
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
            {blogs.map((item: any, index: any) => (
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
    </div>
  );
};

export default SectionSliderNewCategories;

import CardCategoryBox1 from "./CardCategoryBox1";
import Heading from "components/Heading/Heading";
import { TaxonomyType } from "data/types";
import React, { FC, useState, useEffect } from "react";
import { Service } from 'services/Service'

export interface SectionGridCategoryBoxProps {
  categories?: TaxonomyType[];
  headingCenter?: boolean;
  categoryCardType?: "card1";
  className?: string;
  gridClassName?: string;
}

const SectionGridCategoryBox: React.FC<SectionGridCategoryBoxProps> = ({
  categoryCardType = "card1",
  headingCenter = true,
  className = "",
  gridClassName = "grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3",
}) => {
  let CardComponentName = CardCategoryBox1;
  switch (categoryCardType) {
    case "card1":
      CardComponentName = CardCategoryBox1;
      break;

    default:
      CardComponentName = CardCategoryBox1;
  }

  
  const [popular, setPopular] = useState([])

  const getPopularFlights = () => {
    Service.get({ url: '/data/pf' })
      .then((response) => {
        if (response) {
          if (response.data.length > 0) {
            setPopular(response.data)
          }
        }
      })
  }

  useEffect(() => {
    getPopularFlights()
  }, [])

  return (
    <>
    {(popular && popular.length > 0) ?
      <div className={`nc-SectionGridCategoryBox relative py-16 ${className}`}>
        <Heading
          desc="Check these popular routes on ticketshala.com"
          isCenter={headingCenter}
        >
          Popular flights ✈
        </Heading>
        <div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
          {popular.map((item, i) => (
            (i < 9) ?
              <CardComponentName key={i} taxonomy={item} />
            : null
          ))}
        </div>
      </div>
    : null }
    </>
  );
};

export default SectionGridCategoryBox;

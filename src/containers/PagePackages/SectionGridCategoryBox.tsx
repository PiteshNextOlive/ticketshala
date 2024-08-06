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
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3",
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
  const [loading, setLoading] = useState(false)

  const getPopularFlights = () => {
    setLoading(true)
    Service.get({ url: '/data/pd/package' })
      .then((response) => {
        setLoading(false)
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
    <div className={`nc-SectionGridCategoryBox relative ${className}`}>
      <Heading
        desc="Check these top destinations on ticketshala.com"
        isCenter={headingCenter}
      >
        TOP Destinations
      </Heading>
      <div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
        {popular.map((item, i) => (
          (i < 9) ?
            <CardComponentName key={i} col={item} loading={loading} />
          : null
        ))}
      </div>
    </div>
  );
};

export default SectionGridCategoryBox;

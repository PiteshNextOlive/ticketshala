import Heading from "components/Heading/Heading";
import { TaxonomyType } from "data/types";
import React, { FC, useState, useEffect } from "react";
import Airports from '../../data/jsons/__airports.json'
import { FaCar, FaClock, FaPlane } from "react-icons/fa"

export interface SectionGridCategoryBoxProps {
  categories?: TaxonomyType[];
  headingCenter?: boolean;
  categoryCardType?: "card1";
  className?: string;
  gridClassName?: string;
  location?: any;
  setPopular?: (value: string) => void;
}

const SectionGridCategoryBox: React.FC<SectionGridCategoryBoxProps> = ({
  categoryCardType = "card1",
  headingCenter = true,
  className = "",
  location,
  setPopular,
  gridClassName = "grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3",
}) => {
  
  const [popularRoutes, setPopularRoutes]: any = useState([])

  useEffect(() => {
    if (location && location.country) {
     
      const airportData = Airports.filter(item => item.country_code.toLowerCase() === location.country.toLowerCase())

      if (airportData && airportData.length > 0) {
        setPopularRoutes(airportData)
      }
    }
  }, [location])

  const searchByPopular = (value: any) => {
    if (setPopular) {
      setPopular(value)
    }
  }

  return (
    <>
    
    {(popularRoutes && popularRoutes.length > 0) ?
      <div className={`nc-SectionGridCategoryBox relative py-8 lg:py-16 ${className}`}>
        <Heading
          desc="Check these Top Airport Cab Routes on ticketshala.com"
          isCenter={headingCenter}
        >
          Top Airport Cab Routes
        </Heading>
        <div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
          {popularRoutes.map((item: any, i: any) => (
            (i < 9) ?
            <div className={`nc-CardCategoryBox1 relative flex cursor-pointer items-center p-3 sm:p-6 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ]`}
              onClick={() => searchByPopular(item)}
            >
              <div className="relative flex items-center justify-center w-12 h-12 border bg-neutral-100 dark:bg-neutral-700 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full overflow-hidden">
              <FaCar size={22}  />
              </div>
              <div className="ml-4 flex-grow overflow-hidden">
                <h2 className="text-base font-medium">
                  <span className="text-neutral-500 dark:text-neutral-400">Cab To</span> <span>{item.city} Airport</span>
                </h2>
              </div>
            </div>  
            : null
          ))}
        </div>
      </div>
    : null }
    </>
  );
};

export default SectionGridCategoryBox;

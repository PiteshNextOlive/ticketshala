import React, { FC, ReactNode, useState, useEffect } from "react";
import { DEMO_STAY_LISTINGS } from "data/listings";
import { StayDataType } from "data/types";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import PackageCard from "./PackageCard";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { Service } from 'services/Service'

//
export interface SectionGridFeaturePlacesProps {
  stayListings?: StayDataType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  gridClass = "",
  heading = "Popular Activities",
  subHeading = "Popular activities that ticketshala recommends for you",
}) => {

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

  const renderCard = (stay: any) => {
    return <PackageCard key={stay.id} data={stay} />;
  };

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={"New York"}
        subHeading={subHeading}
        tabs={[]}
        heading={heading}
        onClickTab={() => {}}
      />
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {activities.map((stay: any) => renderCard(stay))}
      </div>

    </div>
  );
};

export default SectionGridFeaturePlaces;

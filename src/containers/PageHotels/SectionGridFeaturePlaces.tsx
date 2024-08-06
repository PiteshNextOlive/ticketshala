import { Fragment, useState, useEffect, FC, ReactNode } from 'react'
import { DEMO_STAY_LISTINGS } from "data/listings";
import { StayDataType } from "data/types";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "./StayCard";
import { Service } from 'services/Service'
import moment from "moment";

// OTHER DEMO WILL PASS PROPS
const DEMO_DATA: StayDataType[] = DEMO_STAY_LISTINGS.filter((_, i) => i < 8);

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
  stayListings = DEMO_DATA,
  gridClass = "",
  heading = "Featured places to stay",
  subHeading = "Featured places to stay that ticketshala recommends for you",
  headingIsCenter,
  tabs = [],
}) => {
  const renderCard = (stay: StayDataType) => {
    return <StayCard key={stay.id} data={stay} fromDate={moment().add(14, "days").format('YYYY-MM-DD')} toDate={moment().add(15, "days").format('YYYY-MM-DD')} />;
  };

  const [searching, setSearching] = useState(false);
  const [hotels, setHotels]: any = useState([])

  const getLists = (data?: any) => {
    setSearching(true)
    Service.post({
      url: '/hotels/featured',
      body: JSON.stringify(data)
    }).then(response => {
      setSearching(false);
      if (response && response.data && response.data.length > 0) {
        setHotels(response.data)
      } else {
        setHotels([])
      }
    })
  }

  useEffect(() => {
    const formData: any = {
      fromDate: moment().add(14, "days").format('YYYY-MM-DD'),
      toDate: moment().add(15, "days").format('YYYY-MM-DD'),
      occupancies: [{
        rooms: 1,
        adults: 2,
        children: 0
      }]
    }
   
    getLists(formData)
  }, [])

  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={"New York"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
        onClickTab={() => {}}
      />
      <div
        className={`grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {hotels.map((stay: any) => renderCard(stay))}
      </div>
      <div className="flex mt-16 justify-center items-center hidden">
        <ButtonSecondary className="!leading-none">
          <span>View all</span>
          <i className="ml-3 las la-arrow-right text-xl"></i>
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default SectionGridFeaturePlaces;

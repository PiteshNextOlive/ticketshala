import React, { FC, useState, useEffect } from "react";
import "react-dates/initialize";
import ExperiencesSearchForm from "./ExperiencesSearchForm";
import StaySearchForm from "./StaySearchForm";
import FlightSearchForm from "./FlightSearchForm";
import { FaPlaneDeparture, FaHotel, FaBed, FaCar, FaFly, FaTripadvisor, FaCalendar, FaUser } from "react-icons/fa"

export type SearchTab = "Flights" | "Packages" | "Hotels" | "Activities" | "Transfers";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: "Flights" | "Packages" | "Hotels" | "Activities" | "Transfers";
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Flights",
  currentPage,
}) => {
  const tabs: SearchTab[] = ["Flights", "Packages", "Hotels", "Activities", "Transfers"];
  const [tabActive, setTabActive] = useState<SearchTab>(currentTab);

  useEffect(() => {

  }, [])

  const renderTab = () => {
    return (
      <ul className="ml-6 md:ml-0 xl:ml-0 flex space-x-4 sm:space-x-8 lg:space-x-11 hidden">
        {tabs.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => setTabActive(tab)}
              className={`flex items-center tab-label cursor-pointer text-sm lg:text-base font-medium ${
                active
                  ? ""
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-100"
              } `}
              key={tab}
            >
              {tab === 'Flights' && (
                <FaPlaneDeparture className="mr-1 h-4 w-4" aria-hidden="true" />
              )}
              {tab === 'Packages' && (
                <FaFly className="mr-1 h-4 w-4" aria-hidden="true" />
              )}
              {tab === 'Hotels' && (
                <FaHotel className="mr-1 h-4 w-4" aria-hidden="true" />
              )}
              {tab === 'Activities' && (
                <FaTripadvisor className="mr-1 h-4 w-4" aria-hidden="true" />
              )}
              {tab === 'Transfers' && (
                <FaCar className="mr-1 h-4 w-4" aria-hidden="true" />
              )}

              <span>{tab}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const getSearchResult = () => {

  }

  const renderForm = () => {
    const isArchivePage = !!currentPage && !!currentTab;
    switch (tabActive) {
      case "Flights":
        return <FlightSearchForm haveDefaultValue={isArchivePage} page='list' getSearchResult={getSearchResult} />;
      case "Packages":
        return <ExperiencesSearchForm haveDefaultValue={isArchivePage} />;
      case "Hotels":
        return <StaySearchForm haveDefaultValue={isArchivePage} />;
      case "Activities":
        return <ExperiencesSearchForm haveDefaultValue={isArchivePage} />;
      case "Transfers":
        return <StaySearchForm haveDefaultValue={isArchivePage} />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full py-5 lg:py-0 ${className}`}
      data-nc-id="HeroSearchForm"
    >
      {renderTab()}
      {renderForm()}
    </div>
  );
};

export default HeroSearchForm;

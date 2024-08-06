import React, { FC, useState, Fragment, useEffect } from "react";
import AnyReactComponent from "./Map/AnyReactComponent";
import StayCardH from "./StayCardH";
import GoogleMapReact from "google-map-react";
import { DEMO_STAY_LISTINGS } from "data/listings";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Config from 'config.json'

export interface SectionGridHasMapProps {}

const SectionGridHasMap  = ({ showFullMapFixed, setShowFullMapFixed, hotels, handleLoadMore, searching, loading, totalPage, currentPage, handleSorting, sortBy }: any) => {
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [sortingBy, setSortingBy] = useState('Price - Low to High');

  useEffect(() => {
    if (sortBy && sortBy === 'priceAsc') {
      setSortingBy('Price - Low to High')
    } else if (sortBy && sortBy === 'priceDesc') {
      setSortingBy('Price - High to Low')
    } else if (sortBy && sortBy === 'starAsc') {
      setSortingBy('Stars - Lowest First')
    } else if (sortBy && sortBy === 'starDesc') {
      setSortingBy('Stars - Highest First')
    }
  }, [sortBy])

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className={`min-h-screen w-full ${(showFullMapFixed) && 'xl:w-[780px] 2xl:w-[880px]'} flex-shrink-0`}>

          {!showFullMapFixed && (
          <div className='flex flex-row items-center mb-6 justify-end'>
            <h5 className='text-md text-neutral-800 font-normal'>Sort By:</h5>
            
            <Popover className="relative">
            {({ open, close }) => (
              <>
                <Popover.Button
                  className={`flex items-center justify-center px-2 py-2 text-sm`}
                >
                  <span className="text-primary">{sortingBy}</span>

                  <ChevronDownIcon
                    className="ml-2 h-4 w-4 text-neutral-500"
                    aria-hidden="true"
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel static className="sub-menu nc-will-change-transform absolute transform z-10 w-56 pt-3 left-0">
                    <ul className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 text-sm relative bg-white dark:bg-neutral-900 py-4 grid space-y-1">
                      <li key={1} className="px-2">
                        <span onClick={() => { handleSorting('priceAsc'); setSortingBy('Price - Low to High')}} className="flex items-center cursor-pointer font-normal text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                          Price - Low to High
                        </span>
                      </li>
                      <li key={2} className="px-2">
                        <span onClick={() => { handleSorting('priceDesc'); setSortingBy('Price - High to Low')}} className="flex items-center font-normal cursor-pointer text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                          Price - High to Low
                        </span>
                      </li>
                      <li key={3} className="px-2">
                        <span onClick={() => { handleSorting('starAsc'); setSortingBy('Stars - Lowest First')}} className="flex items-center font-normal cursor-pointer text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                          Stars (Lowest First)
                        </span>
                      </li>
                      <li key={4} className="px-2">
                        <span onClick={() => { handleSorting('starDesc'); setSortingBy('Stars - Highest First')}} className="flex items-center font-normal cursor-pointer text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                          Stars (Highest First)
                        </span>
                      </li>
                  </ul>
                  </Popover.Panel>
                </Transition>
              </>
            )}
            </Popover>
          </div>
          )}
          
          <div className="grid grid-cols-1 gap-8">
            {hotels.length > 0 && hotels.map((item :any) => (
              <div key={item.id}
                onMouseEnter={() => setCurrentHoverID((_) => item.id)}
                onMouseLeave={() => setCurrentHoverID((_) => -1)}
              >
                <StayCardH data={item} />
              </div>
            ))}
          </div>
          
          {(totalPage && totalPage > 1) &&
            <div className="flex mt-16 justify-center items-center">
              <ButtonPrimary onClick={() => { handleLoadMore('prev')}} disabled={currentPage === 1} sizeClass="custom-paginate rounded-2xl px-10 py-3">Previous</ButtonPrimary>
              <ButtonPrimary onClick={() => { handleLoadMore('next')}} disabled={currentPage === totalPage} sizeClass="custom-paginate rounded-2xl px-10 py-3 ml-2">Next</ButtonPrimary>
            </div>
          }
        </div>

        {showFullMapFixed && (
        <>
        {/* MAPPPPP */}
          <div className={`hotel-map xl:flex-grow xl:static xl:block lg:pl-10  ${
              showFullMapFixed ? "fixed inset-0 z-50" : "hidden"
            }`} style={{ position: 'relative' }}
          >
            {showFullMapFixed && (
              <ButtonClose
                onClick={() => { setShowFullMapFixed(!showFullMapFixed) }}
                className="btn-close z-50 absolute w-11 h-11 items-center justify-center rounded-full bg-primary-6000 focus:outline-none"
              />
            )}

            <div className="fixed xl:sticky top-0 xl:top-[88px] left-0 w-full h-full xl:h-[calc(100vh-88px)] rounded-md overflow-hidden">
              
              {/* BELLOW IS MY GOOGLE API KEY -- PLEASE DELETE AND TYPE YOUR API KEY */}

              <GoogleMapReact
                bootstrapURLKeys={{
                  key: Config.MAP_API_KEY
                }}
                defaultZoom={11}
                yesIWantToUseGoogleMapApiInternals
                defaultCenter={{ lat: Number(hotels[0].coord[0]), lng: Number(hotels[0].coord[1]) }}
              >
              
                {hotels.length > 0 && hotels.map((item :any) => (
                  <AnyReactComponent
                    isSelected={currentHoverID === item.id}
                    key={item.id}
                    lat={item.coord[0]}
                    lng={item.coord[1]}
                    listing={item}
                  />
                ))}
              </GoogleMapReact>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default SectionGridHasMap;

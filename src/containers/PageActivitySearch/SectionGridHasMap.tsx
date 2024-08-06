import React, { FC, useState, Fragment, useEffect } from "react";
import StayCardH from "./StayCardH";
import Pagination from "shared/Pagination/Pagination";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

export interface SectionGridHasMapProps { }

const SectionGridHasMap = ({ activityData }: any) => {

  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);

  const [sortingBy, setSortingBy] = useState('Price (Low to High)');

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full flex-shrink-0">
          {(activityData && activityData.length > 0) ?
            <>
              {/*
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
                              <span className="flex items-center cursor-pointer font-normal text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                                Price ( Low to High)
                              </span>
                            </li>
                            <li key={2} className="px-2">
                              <span className="flex items-center font-normal cursor-pointer text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                                Price (High to Low)
                              </span>
                            </li>
                            <li key={3} className="px-2">
                              <span className="flex items-center font-normal cursor-pointer text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                                Duration (Short to Long)
                              </span>
                            </li>
                            <li key={4} className="px-2">
                              <span className="flex items-center font-normal cursor-pointer text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                              Duration (Long to Short)
                              </span>
                            </li>
                          </ul>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
              */}
              
              <div className="grid grid-cols-1 gap-8">
                {activityData.map((item: any) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setCurrentHoverID((_) => item.id)}
                    onMouseLeave={() => setCurrentHoverID((_) => -1)}
                  >
                    <StayCardH data={item} />
                  </div>
                ))}
              </div>
            </>
            : null}
        </div>

      </div>
    </div>
  );
};

export default SectionGridHasMap;

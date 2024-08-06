import React, { FC } from "react";
import { Link } from "react-router-dom";
import { getCurrency, amountSeparator } from 'components/Helper'
import NcImage from "shared/NcImage/NcImage";
import { FaMapMarkerAlt, FaMarker } from "react-icons/fa";

const ActivityCard = ({
  size = "default",
  data
}: any) => {

  const renderSliderGallery = () => {
    return (
      <div className="relative aspect-w-4 aspect-h-3">
        <NcImage
          src={data && data.images[0]}
          className="object-cover w-full h-full"
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "p-4 space-y-4" : "p-3 space-y-2"}>
        <div className="space-y-2">
          <div className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm space-x-2">
            {size === "default" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}

            <span className="text-sm text-neutral-500 dark:text-neutral-400">
               {data && data.places.join()}, {data && data.country}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <h3
              className={` font-medium capitalize ${
                size === "default" ? "text-md" : "text-base"
              }`}
            >
              <span className="line-clamp-1">{data && data.name}</span>
            </h3>
          </div>
          
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="relative activityPriceWrapper">
          {(data && data.fareFrom.discount.amount > 0) &&
            <div className="text-sm text-neutral-500 dark:text-neutral-400 font-normal line-through"><span className='currency-font'>{getCurrency(data.fareFrom.baseFare.currency)}</span>{amountSeparator(Number(data.fareFrom.baseFare.amount))}</div>
          }
          <div className="flex justify-between items-center">
            <div className="text-base font-semibold flex flex-row items-center">
              <span className='currency-font'>{getCurrency(data.fareFrom.totalFare.currency)}</span>{amountSeparator(Number(data.fareFrom.totalFare.amount))}
              {` `}
              {size === "default" && (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                  /person<span className="text-red-500">*</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCard group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
      data-nc-id="StayCard"
    >
      <Link target='_blank' to={`/activity/view/${data.id}?${encodeURIComponent(`name=${data && data.name}`)}`}>
        {renderSliderGallery()}
        {renderContent()}
      </Link>
    </div>
  );
};

export default ActivityCard;

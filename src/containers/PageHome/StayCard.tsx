import React, { FC, useEffect, useState } from "react";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { Link } from "react-router-dom";
import Badge from "shared/Badge/Badge";
import Config from 'config.json';
import { amountSeparator, getCurrency } from 'components/Helper';
import moment from "moment";

export interface StayCardProps {
  className?: string;
  ratioClass?: string;
  data?: [];
  size?: "default" | "small";
}

const StayCard = ({ data, fromDate, toDate }: any) => {
  
  const [galleryImgs, setGalleryImgs] = useState([])
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestRooms: 1 });
  const [totalNights, setTotalNights]: any = useState(null);

  const getBookingNights = (cin :any, cout: any) => {
    return moment(cout).diff(moment(cin), 'days')
  }

  useEffect(() => {
    let img: any = []
    if (data.images && data.images.length > 0) {
      for (var i = 0; i < data.images.length; i++) {
        img.push(`${Config.GIATA_URL + data.images[i].path}`)
      }
      setGalleryImgs(img);
    }

    setTotalNights(getBookingNights(fromDate, toDate))
  }, [])

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider ratioClass={`aspect-w-6 aspect-h-5`} galleryImgs={galleryImgs} />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={"p-4 space-y-4 cursor-pointer"} onClick={() => data && getHotelData(data)}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h2
              className={` font-medium capitalize text-lg`}
            >
              <span className="line-clamp-1">{data && data.name}</span>
            </h2>
          </div>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-2">
            {(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            <span className="text-sm truncate overflow-hidden text-primary">{data && data.addr}</span>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <span className="block text-xs text-neutral-700 dark:text-neutral-400 font-bold">
              Starts from
          </span>
          <div className="font-semibold">
            
            <span className='currency-font'>{(data && data.minFare) && getCurrency(data.minFare.totalFare.currency)}</span>{data && amountSeparator(Math.round(data.minFare.totalFare.amount / totalNights))}
            {` `}
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
              /night
            </span>

            <span className="block text-xs text-neutral-700 dark:text-neutral-400 font-normal">
              Excludes Taxes & Fees
            </span>
          </div>
        </div>
      </div>
    );
  };

  const getHotelData = (item: any) => {
    window.open(`/hotel/view/${data.id}?${encodeURIComponent(`name=${data.name.replace(/\s+/g, '-')}&location=${data.locationName}&country=${data.country}&city=${data.location}&lat=${data.coord[0]}&lng=${data.coord[1]}&chkin=${moment().add(14, "days").format('YYYY-MM-DD')}&chkout=${moment().add(15, "days").format('YYYY-MM-DD')}&rooms=1&adults=2&children=0&featured=true`)}`, "_blank");
  }

  return (
    <div
      className={`nc-StayCard group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
      data-nc-id="StayCard"
    >
      <div className=''>
        {renderSliderGallery()}
        {renderContent()}
      </div>
    </div>
  );
};

export default StayCard;

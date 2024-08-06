import React, { FC, useEffect, useState } from "react";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { Link } from "react-router-dom";
import BtnLikeIcon from "components/BtnLikeIcon/BtnLikeIcon";
import Badge from "shared/Badge/Badge";
import { amountSeparator, getCurrency } from 'components/Helper';
import Config from '.././../../config.json';
import moment from "moment";

export interface StayCardProps {
  className?: string;
  ratioClass?: string;
  data?: [];
  size?: "default" | "small";
}

const StayCard = ({ data }: any) => {

  const [galleryImgs, setGalleryImgs] = useState([])
  const [departureCity, setDepartureCity] = useState("");
  const [departureCityName, setDepartureCityName] = useState("");
  const [departureCountry, setDepartureCountry]: any = useState("")
  const [dateInValue, setDateInValue] = useState<moment.Moment | null>(null);
  const [dateOutValue, setDateOutValue] = useState<moment.Moment | null>(null);
  const [totalNights, setTotalNights]: any = useState(null);
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestRooms: 1 });

  const getBookingNights = (cin :any, cout: any) => {
    return moment(cout).diff(moment(cin), 'days')
  }

  useEffect(() => {
    let img: any = []
    if (data.images && data.images.length > 0) {
      for (var i = 0; i < data.images.length; i++) {
        img.push(`${Config.GIATA_URL + data.images[i].path}`)
      }
      setGalleryImgs(img)
    }

    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params.get('country') && params.get('country') !== "") {
      setDepartureCountry(params.get('country'))
    }
    if (params.get('city') && params.get('city') !== "") {
      setDepartureCity(params.get('city'))
    }
    if (params.get('cityName') && params.get('cityName') !== "") {
      setDepartureCityName(params.get('cityName'))
    }
    if (params.get('fromDate') && params.get('fromDate') !== "") {
      setDateInValue(params.get('fromDate'))
    }
    if (params.get('toDate') && params.get('toDate') !== "") {
      setDateOutValue(params.get('toDate'))
    }

    if (params.get('fromDate') && params.get('fromDate') !== "" && params.get('toDate') && params.get('toDate') !== "") {
      setTotalNights(getBookingNights(params.get('fromDate'), params.get('toDate')))
    }

    const guests = guestValue;
    if (params.get('rooms') && params.get('rooms') !== "") {
      guests['guestRooms'] = params.get('rooms')
    }
    if (params.get('adults') && params.get('adults') !== "") {
      guests['guestAdults'] = params.get('adults')
    }
    if (params.get('child') && params.get('child') !== "") {
      guests['guestChildren'] = params.get('child')
    }
    setGuestValue(guests)
  }, []);

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider ratioClass="aspect-w-6 aspect-h-5" galleryImgs={galleryImgs} />
        <BtnLikeIcon isLiked={true} className="absolute right-3 top-3" />
      </div>
    );
  };

  const getHotelData = (item: any) => {
    window.open(`/hotel/view/${data.id}?${encodeURIComponent(`name=${data.name.replace(/\s+/g, '-')}&location=${data.locationName}&lat=${data.coord[0]}&lng=${data.coord[1]}&chkin=${dateInValue}&chkout=${dateOutValue}&city=${departureCity}&cityName=${departureCityName}&country=${departureCountry}&rooms=${guestValue.guestRooms}&adults=${guestValue.guestAdults}&children=${guestValue.guestChildren}`)}`, "_blank");
  }

  const renderContent = () => {
    return (
      <div className={"p-4 space-y-4"} onClick={() => data && getHotelData(data)}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h2 className={` font-medium capitalize ${"text-lg"
              }`}
            >
              <span className="line-clamp-1">{data && data.name}</span>
            </h2>
          </div>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm text-primary space-x-2">
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
            <span className="text-sm text-primary">{data && data.addr}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-base font-semibold mt-5">
            <span className="block text-xs text-neutral-700 dark:text-neutral-400 font-bold">
              Starts from
            </span>
            <div className="block text-sm text-neutral-400 dark:text-neutral-400 font-normal relative">
              {(data && data.minFare.discount && data.minFare.discount.amount > 0) ? <><div className="flight-lineThroughRed"><span className='currency-font'>{getCurrency(data.minFare.baseFare.currency)}</span>{data && amountSeparator(Number(data.minFare.baseFare.amount) + Number(data.minFare.tax.amount))}</div></> : null}
            </div>
            <span className='currency-font'>{(data && data.minFare.totalFare) && getCurrency(data.minFare.totalFare.currency)}</span>{data && amountSeparator(data.minFare.totalFare.amount)}
            
            <span className="text-xs text-neutral-400 dark:text-neutral-400 font-normal">
              / {(totalNights && totalNights > 1) ? `${totalNights} Nights` : `${totalNights} Night`}
            </span>

            <span className="block text-xs text-neutral-700 dark:text-neutral-400 font-normal">
              Excludes Taxes & Fees
            </span>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCard group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
      data-nc-id="StayCard"
    >
      <div className="">
        {renderSliderGallery()}
        {renderContent()}
      </div>
    </div>
  );
};

export default StayCard;

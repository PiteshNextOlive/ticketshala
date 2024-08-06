import React, { FC, useEffect, useState } from "react";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { Link } from "react-router-dom";
import BtnLikeIcon from "components/BtnLikeIcon/BtnLikeIcon";
import Badge from "shared/Badge/Badge";
import { amountSeparator, getCurrency, renderFacilities, getRatingLabel } from 'components/Helper';
import { FaMapMarkerAlt, FaMarker } from "react-icons/fa";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Config from './../../config.json';
import moment from "moment";
import NcImage from "shared/NcImage/NcImage";
import defaultImg from 'images/hotel-placeholder.png'
import { StarIcon } from "@heroicons/react/solid";

const StayCardH = ({ data }: any) => {

  const [galleryImgs, setGalleryImgs] = useState([])
  const [departureCity, setDepartureCity] = useState("");
  const [departureCityName, setDepartureCityName] = useState("");
  const [departureCountry, setDepartureCountry]: any = useState("")
  const [dateInValue, setDateInValue] = useState<moment.Moment | null>(null);
  const [dateOutValue, setDateOutValue] = useState<moment.Moment | null>(null);
  const [totalNights, setTotalNights]: any = useState(null);
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestRooms: 1 });

  useEffect(() => {
    let img: any = []
    if (data.images && data.images.length > 0) {
      for (var i = 0; i < data.images.length; i++) {
        img.push(`${Config.GIATA_URL}${data.images[i].path}`)
      }
      setGalleryImgs(img);
    }

    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params) {
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
    }
  }, []);
  //

  const getHotelData = (item: any) => {
    window.open(`/hotel/view/${data.id}?${encodeURIComponent(`name=${data.name.replace(/\s+/g, '-')}&location=${data.locationName}&lat=${data.coord[0]}&lng=${data.coord[1]}&chkin=${dateInValue}&chkout=${dateOutValue}&city=${departureCity}&cityName=${departureCityName}&country=${departureCountry}&rooms=${guestValue.guestRooms}&adults=${guestValue.guestAdults}&children=${guestValue.guestChildren}`)}`, "_blank");
  }

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full sm:w-72 ">
        {(galleryImgs && galleryImgs.length > 0) ?
        <>
          <GallerySlider
            ratioClass="aspect-w-6 aspect-h-5"
            galleryImgs={galleryImgs}
          />
        </>
        : 
          <NcImage className='not-available' src={defaultImg} />
        }
      </div>
    );
  };

  const renderTienIch = () => {
    return (
      <>
        {data && data.facilities.filter((_: any, i: any) => i < 8).map((item: any) => (
          <div key={item.name} className="text-neutral-500 text-sm space-x-3 mr-4">
            {renderFacilities(item)}
          </div>
        ))}
      </>
    );
  };

  const getBookingNights = (cin :any, cout: any) => {
    return moment(cout).diff(moment(cin), 'days')
  }

  const getHotelCategory = (hClass: any) => {
    return(
      <>
      {(hClass.includes('STAR')) ?
      <>
         <div className={`ml-2 flex items-center text-neutral-300`}>
          {[1, 2, 3, 4, 5].slice(0, hClass.split(' STAR')[0]).map((item) => {
            return (
              <StarIcon
                key={item}
                className={`text-yellow-500 w-5 h-5`}
              />
            );
          })}
        </div>
      </>
      :  <Badge name={hClass} className='ml-2' color="green" />}
      </>
    )
  }

  const getBoard = (board: any, val: any) => {
    const res = board && board.filter((item: any) =>  item && item.includes(val))
     return (res && res.length > 0) ? true : false
  }

  const renderContent = () => {
    return (
      <div className="flex flex-grow flex-grow-m p-3 sm:p-4 sm:justify-between">
        <div className="">
          <div className="flex flex-row items-center">
            {/*<Badge name="ADS" className='hidden' color="green" />*/}
            <h2 className="flex flex-row items-center text-md font-semibold capitalize pb-2 cursor-pointer" onClick={() => data && getHotelData(data)}>
              <span className="line-clamp-1">{data && data.name}</span>
              {getHotelCategory(data.category)}
            </h2>
          </div>
          <div className="flex sm:items-center text-sm text-primary dark:text-neutral-400">
            <FaMapMarkerAlt className='mr-1' /> {data && data.addr}
          </div>

          <div className="hidden sm:block w-14 border-b border-neutral-200 dark:border-neutral-800 my-4"></div>

          <div className="flex justify-start">
            <div className="flex flex-col justify-center">
              <div className="flex items-start mt-3 sm:mt-0 mb-3 sm:mb-0">{renderTienIch()}</div>
              <div className={`hidden sm:block lg:block md:block xl:block w-14 border-b border-neutral-100 dark:border-neutral-800 my-4`}></div>
              {(data && data.refundable && data.refundable.flag === true) &&
              <>
                <div className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
                  <i className="las la-check-circle text-md text-green"></i>
                  <span className="text-sm text-green">Free Cancellation</span>
                </div>
              </>
              }
              {(data && data.board.length > 0 && getBoard(data.board, 'BREAKFAST') === true) ?
              <>
                <div key={`includes_1`} className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
                  <i className="las la-check-circle text-md text-green"></i>
                  <span className="text-sm text-green">Breakfast Included</span>
                </div>
              </>
              : 
                (data && data.board.length > 0 && getBoard(data.board, 'ROOM ONLY') === true) &&
                <>
                  <div key={`includes_1`} className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
                    <i className="las la-check-circle text-md text-green"></i>
                    <span className="text-sm text-green">Room Only</span>
                  </div>
                </>
              }
              
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-end'>
          <span className="text-xs text-right text-neutral-400 dark:text-neutral-400 font-normal">
           {(totalNights && totalNights > 1) ? `${totalNights} Nights` : `${totalNights} Night`}, {guestValue.guestAdults} Adults {(guestValue.guestChildren > 0) ? `, ${guestValue.guestChildren} Child` : '' }
          </span>

          <div className="text-base text-right font-semibold mt-3">
            <span className="block text-xs text-neutral-700 dark:text-neutral-400 font-bold">
              Starts from
            </span>
            <div className="block text-sm text-neutral-400 dark:text-neutral-400 font-normal relative">
              {(data && data.minFare.discount && data.minFare.discount.amount > 0) ? <><div className="flight-lineThroughRed"><span className='currency-font'>{getCurrency(data.minFare.baseFare.currency)}</span>{data && amountSeparator(Number(data.minFare.baseFare.amount) + Number(data.minFare.tax.amount))}</div></> : null}
            </div>
            <span className='currency-font'>{(data && data.minFare.totalFare) && getCurrency(data.minFare.totalFare.currency)}</span>{data && amountSeparator(data.minFare.totalFare.amount)}
            {(totalNights > 1) &&
              <div className="block text-xs text-neutral-500 dark:text-neutral-400 font-normal ml-1">
                {data && getCurrency(data.minFare.totalFare.currency)} {data && amountSeparator(Math.round(data.minFare.totalFare.amount / totalNights))} /night
              </div>
            }
            <span className="block text-xs text-neutral-700 dark:text-neutral-400 font-normal">
              Excludes Taxes & Fees
            </span>
          </div>
          <ButtonPrimary className='mt-5 selectRoom' onClick={() => data && getHotelData(data)} >Select</ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCardH group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
      data-nc-id="StayCardH"
    >
      <div className="flex flex-col sm:flex-row sm:items-start">
        {renderSliderGallery()}
        {renderContent()}
      </div>
    </div>
  );
};

export default StayCardH;

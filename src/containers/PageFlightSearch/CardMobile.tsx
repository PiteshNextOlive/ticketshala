import React, { FC, Fragment, useEffect, useState } from "react";
import NcImage from "shared/NcImage/NcImage";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Badge from "shared/Badge/Badge";
import Avatar from "shared/Avatar/Avatar";
import CardViewMobile from "./CardViewMobile";
import moment from "moment";
import { getAirline, getDuration, getAirlineLogo, getCurrency, getAirportCity, getAirport, amountSeparator } from 'components/Helper'
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap_white.css';
import FlightSeat from "../../images/seat-icon.png";

export interface Card3Props {
  className?: string;
  col: any;
  cabin: string;
  onSubmit?: (item: any) => void;
}

const CardMobile: FC<Card3Props> = ({ className = "h-full", col, cabin, onSubmit }) => {

  const [isOpenModalItinerary, setIsOpenModalItinerary] = useState(false);
  const [cardData, setCardData] = useState<any>([]);

  const openModalItinerary = (col: any) => {
    setCardData(col)
    setIsOpenModalItinerary(true);
  }

  const handleCloseModal = () => setIsOpenModalItinerary(false);

  const onClickBooking = (item: any) => {
    if (onSubmit) {
      onSubmit(item)
    }
  }

  const getBaggagesInfo = (info: any) => {
    const baggaged = info.sort((a: any, b: any) => b.Weight - a.Weight);
    return (
      <>
        {(baggaged && baggaged.length > 0) ?
          <>{(baggaged[0].allowance && baggaged[0].allowance.Weight > 0) ? <><span className="mx-2">·</span> <i className="las la-suitcase text-xl mr-1"></i> {baggaged[0].allowance.Weight} {baggaged[0].allowance.Unit}</> : null} </>
          :
          null}
      </>
    )
  }

  const renderMultiAirlines = (item: any, segments: any) => {

    const codes = segments.map((o :any) => o.airlineCode)
    const filtered = segments.filter(({airlineCode}: any, index: any) => !codes.includes(airlineCode, index + 1))

    return (
      <>
        {(filtered && filtered.length > 0) &&
          <>
            {filtered.map((item: any, index: any) => (
              <>

                <Avatar
                  sizeClass="h-8 w-8 wil-img"
                  radius="rounded"
                  imgUrl={getAirlineLogo(item.airlineCode)}
                  title={getAirline(item.airlineCode)}
                />
              </>
            ))}
            <>
              {(filtered && filtered.length > 1) ?
                <div className={`ml-6 sm:ml-0 w-32`}>
                  <span className="text-xs font-semibold text-center">
                    {getAirline(col.ValidatingCarrier)}
                  </span>
                </div>
                :
                <div className={`ml-3 sm:ml-0 w-32`}>
                  <span className="text-xs font-semibold text-center">
                    {getAirline(segments[0].airlineCode)}
                  </span>
                  <div className="flex items-start sm:items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <span className='sm:m-auto'>{`${segments[0].airlineCode} - ${segments[0].flightNo}`}</span>
                  </div>
                </div>
              }
            </>
          </>
        }
      </>
    )
  }

  const renderLayover = (item: any) => {
    const filtered = item.filter((arr: any, index: any) => item.length > 1 && index !== item.length - 1).map((obj: any) => obj.arrival);
    return (
      <>
        {(filtered.length > 0) && `( ${filtered.join()} )`}
      </>
    )
  }

  return (
    <>
      <div className={`nc-Card3 nc-card-flights relative flex sm:flex-row sm:items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl group hover:shadow-xl transition-shadow ${className}`}
        data-nc-id="Card3"
        onClick={() => openModalItinerary(col)}
      >
        <div className="p-5 w-full relative" data-nc-id="FlightCard">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center relative segments">
                {renderMultiAirlines(col, col.options[0].flightSegment)}
              </div>
              <div className="flex flex-col justify-center whitespace-nowrap sm:text-right">
                <div className="block text-xs text-neutral-400 dark:text-neutral-400 font-normal relative">
                {(col && col.fare.discount && col.fare.discount.amount > 0) ? <><div className="flight-lineThroughRed"><span className='currency-font'>{getCurrency(col.fare.baseFare.currency)}</span>{col && amountSeparator(Number(col.fare.baseFare.amount) + Number(col.fare.tax.amount))}</div></> : null}

                </div>
                <div className="text-lg font-semibold text-emerald-600">
                  <span className='currency-font'>{getCurrency(col.fare.totalFare.currency)}</span>{amountSeparator(col.fare.totalFare.amount)}
                </div>
              </div>
            </div>
            <div className="block mt-3">
              <div className="flex flex-row justify-between items-center font-semibold">
                <div>
                  <span>{moment(col.options[0].flightSegment[0].depTime).format('HH:mm')}</span>
                  <span className="flex items-center text-xs text-neutral-500 font-normal mt-0.5">{getAirportCity(col.options[0].flightSegment[0].depature)} ({col.options[0].flightSegment[0].depature})</span>
                </div>
                <span className="w-20 flex flex-col justify-center items-center text-xs font-normal">
                  <span className="text-neutral-500">{getDuration(col.options[0].duration)}</span>
                  <i className="text-2xl las la-long-arrow-alt-right"></i>
                  <span className="text-neutral-500">{(col.options[0].flightSegment.length > 2) ? `${col.options[0].flightSegment.length - 1} Stops` : (col.options[0].flightSegment.length > 1) ? `${col.options[0].flightSegment.length - 1} Stop` : `Non Stop`}</span>
                  <span className="text-neutral-500">{renderLayover(col.options[0].flightSegment)}</span>
                </span>
                <div className="flex flex-col items-end">
                  <span>{moment(col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrTime).format('HH:mm')}</span>
                  <span className="flex items-center text-xs text-neutral-500 font-normal mt-0.5">
                  {getAirportCity(col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrival)}({col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrival})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(col && col.options[1]) &&
          <div className="flex flex-col mt-6 border-t border-b mb-6 sm:flex-row sm:items-center">
            <div className="flex flex-row items-center pt-5 justify-between">
              <div className="flex flex-row items-center relative segments">
                {col.options[1] && renderMultiAirlines(col, col.options[1].flightSegment)}
              </div>
            </div>
            <div className="block mt-3 mb-5">
              <div className="flex flex-row justify-between items-center font-semibold">
                <div>
                  <span>{col.options[1] && moment(col.options[1].flightSegment[0].depTime).format('HH:mm')}</span>
                  <span className="flex items-center text-xs text-neutral-500 font-normal mt-0.5">{col.options[1] && getAirportCity(col.options[1].flightSegment[0].depature)}({col.options[1] && col.options[1].flightSegment[0].depature})</span>
                </div>
                <span className="w-20 flex flex-col justify-center items-center text-xs font-normal">
                  <span className="text-neutral-500">{col.options[1] && getDuration(col.options[1].duration)}</span>
                  <i className="text-2xl las la-long-arrow-alt-right"></i>
                  <span className="text-neutral-500">{(col.options[1] && col.options[1].flightSegment.length > 2) ? `${col.options[1].flightSegment.length - 1} Stops` : (col.options[1] && col.options[1].flightSegment.length > 1) ? `${col.options[1].flightSegment.length - 1} Stop` : `Non Stop`}</span>
                  <span className="text-neutral-500">{col.options[1] && renderLayover(col.options[1].flightSegment)}</span>
                </span>
                <div className="flex flex-col items-end">
                  <span>{col.options[1] && moment(col.options[1].flightSegment[col.options[1].flightSegment.length - 1].arrTime).format('HH:mm')}</span>
                  <span className="flex items-center text-xs text-neutral-500 font-normal mt-0.5">
                    {col.options[1] && getAirportCity(col.options[1].flightSegment[col.options[1].flightSegment.length - 1].arrival)}({col.options[1] && col.options[1].flightSegment[col.options[1].flightSegment.length - 1].arrival})
                  </span>
                </div>
              </div>
            </div>
          </div>
          }

          <div className="flex flex-row text-sm text-neutral-500 font-normal mt-3">
            {(col.isNonRefundable === true) ?
              <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-red-700 text-red-50 rounded-full`}>
                Non Refundable
              </div>
              :
              <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-green-600 text-green-50 rounded-full`}>
                Partially Refundable
              </div>
            }
            {getBaggagesInfo(col.baggage)}

            {(col.options[0].flightSegment && col.options[0].flightSegment[0].seat && col.options[0].flightSegment[0].seat !== "") &&
              <Badge className="ml-2" name={<Tooltip placement="top" trigger={['hover']} overlay={`${col.options[0].flightSegment[0].seat.Number} Seat(s) Left`}>
              <img src={FlightSeat} className='w-4 h-4' /></Tooltip>} />
            }
          
            {(col.airportChange) &&
              <>
                <Badge key={1} color="yellow" name={<Tooltip placement="top" trigger={['hover']} overlay={'Airport change required'}><span className="block text-xs"><i className="las la-info-circle exclamation-info"></i></span></Tooltip>} />
              </>
            }
          </div>
        </div>
      </div>

      <Transition appear show={isOpenModalItinerary} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full">
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-6 border-b border-neutral-200 dark:border-neutral-800 text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-300"
                      id="headlessui-dialog-title-70"
                    >
                      Details Of Your Trip
                    </h3>
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={handleCloseModal} />
                    </span>
                  </div>

                  <div className="px-4 mt-2 flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300">
                    <CardViewMobile tripType={'one'} col={cardData} cabin={cabin} />
                  </div>

                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex flex flex-col">
                   
                    <div className="flex flex-row items-end justify-between">
                      <div className="flex flex-col">
                        <div className="block text-md mt-2 font-semibold text-secondary-700">
                          <span className='currency-font'>{(cardData && cardData.fare && cardData.fare.totalFare) && getCurrency(cardData.fare.totalFare.currency)}</span>{(cardData && cardData.fare && cardData.fare.totalFare) && amountSeparator(cardData.fare.totalFare.amount)}<span className="astrick">*</span>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Includes Taxes & Fees</span>
                      </div>
                      <ButtonPrimary sizeClass="px-5 text-xs sm:pr-2 p-3 bg-secondary-900" onClick={() => onClickBooking(col)}>
                        Book Now
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

    </>
  );
};

export default CardMobile;

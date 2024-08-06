import React, { FC, Fragment, useEffect, useState } from "react";
import NcImage from "shared/NcImage/NcImage";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Badge from "shared/Badge/Badge";
import Avatar from "shared/Avatar/Avatar";
import CardView from "./CardView";
import CardMobile from "./CardMobile";
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

const Card3: FC<Card3Props> = ({ className = "h-full", col, cabin, onSubmit }) => {

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
          <>{(baggaged[0].allowance && baggaged[0].allowance.Weight > 0) ? <><i className="las la-suitcase text-xl mr-1"></i> CheckIn: {baggaged[0].allowance.Weight} {baggaged[0].allowance.Unit}</> : <><i className="las la-suitcase text-xl mr-1"></i> No Baggage Included</>} </>
          :
          <><i className="las la-suitcase text-xl mr-1"></i> No Baggage Included</>}
      </>
    )
  }

  const renderMultiAirlines = (item: any) => {

    const codes = col.options[0].flightSegment.map((o: any) => o.airlineCode)
    const filtered = col.options[0].flightSegment.filter(({ airlineCode }: any, index: any) => !codes.includes(airlineCode, index + 1))

    return (
      <>
        {(filtered && filtered.length > 0) &&
          <>
            <div className="sm:w-40">
              {filtered.map((item: any, index: any) => (
                <>
                  <Avatar
                    sizeClass="h-12 w-12 wil-img"
                    radius="rounded"
                    imgUrl={getAirlineLogo(item.airlineCode)}
                    title={getAirline(item.airlineCode)}
                  />
                </>
              ))}
            </div>
            <div className={`ml-6 sm:ml-0 sm:w-40`}>
              <span className="block text-md font-medium text-left truncate">
                {(filtered && filtered.length > 1) ? <>
                  {getAirline(col.ValidatingCarrier)}
                </> : <>
                  {getAirline(col.options[0].flightSegment[0].airlineCode)}
                </>}
              </span>
              <div className="mt-1.5 flex items-start sm:items-start justify-start text-sm text-neutral-500 dark:text-neutral-400">
                <span className='text-xs truncate'>
                  {col.options[0].flightSegment.map((items: any, x: any) => (
                    <>{`${items.airlineCode} ${items.flightNo}`}{(x !== col.options[0].flightSegment.length - 1) && <>, </>}</>
                  ))}
                </span>
              </div>
            </div>

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
      <div className="hidden sm:block lg:block md:block xl:block">
        <div className={`nc-Card3 nc-card-flights relative flex flex-col-reverse sm:flex-row sm:items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl group hover:shadow-xl transition-shadow ${className}`} >
          <div className="flex flex-col flex-grow">
            <div className="space-y-5 p-5">


              <div className="flex items-center justify-between sm:space-x-8 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="hidden sm:block flex flex-col md:flex md:flex-row relative justify-between segments sm:flex-row items-center text-center sm:text-center w-56">
                  {renderMultiAirlines('d')}
                </div>
                <div className="flex flex-col sm:flex-row items-end space-y-3 sm:space-y-0 sm:text-right sm:space-x-3 ">
                  <div>
                    <span className="block text-sm font-medium">
                      {getAirportCity(col.options[0].flightSegment[0].depature)} ({col.options[0].flightSegment[0].depature})
                    </span>
                    <span className="block text-lg font-medium">
                      {moment(col.options[0].flightSegment[0].depTime.substring(0, 19)).format('HH:mm')}
                    </span>
                    <span className="mt-1.5 w-20 text-xs text-neutral-500 dark:text-neutral-400">
                      {moment(col.options[0].flightSegment[0].depTime.substring(0, 19)).format('ll')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-center sm:space-x-3 ">
                  <div>
                    <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                      {getDuration(col.options[0].duration)}
                    </span>
                    <div className="w-20 border-b mt-2 mb-2 border-neutral-300 dark:border-neutral-700"></div>
                    <span className="block text-sm text-neutral-500 text-primary-700 dark:text-neutral-400">
                      {(col.options[0].flightSegment.length > 2) ? `${col.options[0].flightSegment.length - 1} Stops` : (col.options[0].flightSegment.length > 1) ? `${col.options[0].flightSegment.length - 1} Stop` : `Non Stop`}
                    </span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      {renderLayover(col.options[0].flightSegment)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
                  <div>
                    <span className="block text-sm font-medium">
                      {getAirportCity(col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrival)}({col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrival})
                    </span>
                    <span className="block text-lg font-medium">
                      {moment(col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrTime.substring(0, 19)).format('HH:mm')}
                    </span>
                    <div className="mt-1.5 w-20 text-xs text-neutral-500 dark:text-neutral-400">
                      <span> {moment(col.options[0].flightSegment[col.options[0].flightSegment.length - 1].arrTime.substring(0, 19)).format('ll')} <br /> </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 */}
              <div className="flex flex-wrap sm:flex-row items-center justify-between xl:justify-start xl:space-x-8 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
                  <span className={`flex items-center justify-center px-4 py-1 text-xs rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none`}>
                    {(cabin === 'F') ? 'First Class' : ((cabin === 'C') ? 'Business' : 'Economy')}
                  </span>
                </div>

                {(col.isNonRefundable === true) ?
                  <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-red-700 text-red-50 rounded-full`}
                    data-nc-id="SaleOffBadge"
                  >
                    Non Refundable
                  </div>
                  :
                  <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-green-600 text-green-50 rounded-full`}
                    data-nc-id="SaleOffBadge"
                  >
                    Partially Refundable
                  </div>
                }

                <div className="flex sm:flex-row items-center mt-5 sm:mt-0 text-neutral-500 space-y-3 text-sm sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
                  {getBaggagesInfo(col.baggage)}
                </div>

                {(col.options[0].flightSegment && col.options[0].flightSegment[0].seat && col.options[0].flightSegment[0].seat !== "") &&
                  <Badge className='items-center text-xs' name={<><img src={FlightSeat} className='w-3 h-3' />{`${col.options[0].flightSegment[0].seat.Number} Seat(s) Left`}</>} />
                }

                {(col.airportChange) &&
                  <>
                    <Badge key={1} color="yellow" name={<Tooltip placement="top" trigger={['hover']} overlay={'Airport change required'}><span className="block text-xs"><i className="las la-info-circle exclamation-info"></i></span></Tooltip>} />
                  </>
                }
              </div>

            </div>
          </div>

          <div className={`block custom-book flex-shrink-0 text-center sm:w-56 md:w-48 overflow-hidden mb-5 py-5 sm:mb-0`}>
            <div className="block text-md text-neutral-400 dark:text-neutral-400 font-normal relative">
              {(col && col.fare.discount && col.fare.discount.amount > 0) ? <><div className="flight-lineThroughRed"><span className='currency-font'>{getCurrency(col.fare.baseFare.currency)}</span>{col && amountSeparator(Number(col.fare.baseFare.amount) + Number(col.fare.tax.amount))}</div></> : null}
            </div>
            <span className="block text-xl font-semibold text-secondary-700">
              <span className='currency-font'>{getCurrency(col.fare.totalFare.currency)}</span>{amountSeparator(col.fare.totalFare.amount)}
            </span>
            {(col && col.fare.discount && col.fare.discount.amount > 0) ? <div className="block text-xs text-emerald-600 mb-2">You save <span className='currency-font'>{col && getCurrency(col.fare.discount.currency)}</span> {col && amountSeparator(col.fare.discount.amount)}</div> : null}
            <ButtonPrimary onClick={() => onClickBooking(col)}>Book Now</ButtonPrimary>
            <div className="items-center mt-5 text-center sm:text-center">
              <span className="text-green-800 text-sm m-auto cursor-pointer" onClick={() => openModalItinerary(col)}> View Details</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flight-card-m sm:hidden lg:hidden md:hidden xl:hidden">
        <CardMobile col={col} cabin={cabin} onSubmit={onSubmit} />
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
                      className="text-xl font-medium leading-6 text-gray-900 dark:text-neutral-300"
                      id="headlessui-dialog-title-70"
                    >
                      Details Of Your Trip
                    </h3>
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={handleCloseModal} />
                    </span>
                  </div>

                  <div className="px-8 mt-2 flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300">
                    <CardView tripType={'one'} col={cardData} cabin={cabin} />
                  </div>

                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                    <div>
                      {(cardData && cardData.isNonRefundable === true) ?
                        <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-red-700 text-red-50 rounded-full`}
                          data-nc-id="SaleOffBadge"
                        >
                          Non Refundable
                        </div>
                        :
                        <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-green-600 text-green-50 rounded-full`}
                          data-nc-id="SaleOffBadge"
                        >
                          Partially Refundable
                        </div>
                      }
                    </div>
                    <div className="flex items-right sm:justify-end">
                      <div className="flex flex-col">
                        <div className="block text-xl mx-10 mt-2 font-semibold text-secondary-700">
                          <span className='currency-font'>{(cardData && cardData.fare && cardData.fare.totalFare) && getCurrency(cardData.fare.totalFare.currency)}</span>{(cardData && cardData.fare && cardData.fare.totalFare) && amountSeparator(cardData.fare.totalFare.amount)}<span className="astrick">*</span>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Includes Taxes & Fees</span>
                      </div>
                      <ButtonPrimary sizeClass="px-10 py-3 sm:pr-5 sm:px-5 bg-secondary-900" onClick={() => onClickBooking(col)}>
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

export default Card3;

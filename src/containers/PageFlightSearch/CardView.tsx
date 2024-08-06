import React, { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Badge from "shared/Badge/Badge";
import Avatar from "shared/Avatar/Avatar";
import { getAirline, getDuration, getAirlineLogo, getCurrency, getAirportCity, getAirport, amountSeparator } from 'components/Helper'
import { FaClock, FaPlane } from "react-icons/fa"
import { Tab } from "@headlessui/react";
import { Collapse } from 'reactstrap'
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap_white.css';

const CardData = (props: any) => {

  const [flightData, setFlightData] = useState<any['options']>([])
  const [cabin, setCabin] = useState<any>('Y')
  const [tripType, setTripType] = useState<any>('one')

  const [collapse, setCollapse]: any = useState(true)

  useEffect(() => {
    if (props.col) {
      setFlightData(props.col)
      setCabin(props.cabin)
    }

    if (props.tripType) {
      setTripType(props.tripType)
    }

  }, [props]);

  const renderLayover = (item: any, item1: any) => {
    let layover: any = ''
    let changed: any = false
    if (item1) {
      const a = moment(item1.depTime.substring(0, 19))
      const b = moment(item.arrTime.substring(0, 19))
      layover = getDuration(a.diff(b, 'minutes'))
      changed = (item.arrival !== item1.depature) ? true : false
    }
    return (
      <>
        {(item && item1) &&
          <div className='layover divider'>
            <div className='flex items-center justify-center mt-3 w-full divider-tex bg-gray-100 p-2'>
              {layover} &nbsp; Layover in {getAirportCity(item.arrival)} &nbsp;
              {(changed === true) && <Badge key={1} color="yellow" name={<span className="block text-xs"><i className="las la-info-circle exclamation-info"></i> Airport change required</span>} />}
            </div>
          </div>
        }
      </>
    )
  }

  const baggageData = flightData.baggage && flightData.baggage.filter((item: any) => { return item.allowance.Weight > 0 })

  const renderFlightData = (options: any) => {
    return (
      <>
        {options && options.flightSegment.map((item: any, index: any, elements: any) => (
          <>
            <div className={`block nc-card-flights relative mt-3 rounded-2xl group`}>
              <div className="flex flex-col flex-grow">

                <div className="p-4 md:p-8 border border-neutral-200 dark:border-neutral-700 rounded-2xl ">
                  <div>
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="w-72">
                        <div className="flex flex-row">
                          <img src={getAirlineLogo(item.airlineCode)} className="w-12" alt="" />
                          <div className={`ml-6`}>
                            <span className="text-sm font-medium text-center">
                              {getAirline(item.airlineCode)}
                            </span>
                            <div className=" text-xs text-neutral-500 dark:text-neutral-400">
                              <span>{`${item.airlineCode} - ${item.flightNo}`}</span>
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm text-neutral-500 mt-6 dark:text-neutral-400 space-y-1 md:space-y-2">
                          <li className="flex flex-row ">Duration: &nbsp; <span className="font-semibold">{getDuration(item.duration)}</span></li>
                          <li className="text-primary">{(item.cabinType === 'F') ? 'First Class' : ((item.cabinType === 'C') ? 'Business' : 'Economy')}</li>
                        </ul>
                      </div>
                      <div className="flex my-5 md:my-0">
                        <div className="flex-shrink-0 flex flex-col items-center py-2"><span className="block w-6 h-6 rounded-full border border-neutral-400"></span><span className="block flex-grow border-l border-neutral-400 border-dashed my-1"></span><span className="block w-6 h-6 rounded-full border border-neutral-400"></span></div>
                        <div className="ml-4 space-y-10 text-sm">
                          <div className="flex flex-col space-y-1"><span className=" text-neutral-500 dark:text-neutral-400">{moment(item.depTime.substring(0, 19)).format('dddd, lll')}</span><span className=" font-semibold">{getAirport(item.depature)} ({item.depature})</span></div>
                          <div className="flex flex-col space-y-1"><span className=" text-neutral-500 dark:text-neutral-400">{moment(item.arrTime.substring(0, 19)).format('dddd, lll')}</span><span className=" font-semibold">{getAirport(item.arrival)} ({item.arrival}) {(item.arrival.terminalId) && `Terminal ${item.arrival.terminalId}`}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            {renderLayover(item, elements[index + 1])}
          </>
        ))
        }
      </>
    )
  }

  const showPassengerFare = () => {
    return (
      <div>
        {(flightData && flightData.fare && flightData.fare.baseFare) &&
          <>
            <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg" onClick={()=> { setCollapse(!collapse)}}>
              <div className="flex justify-between items-center cursor-pointer">
                <span>Passenger Base Fare</span>
                <div><span className='currency-font'>{getCurrency(flightData.fare.baseFare.currency)}</span>{amountSeparator(flightData.fare.baseFare.amount)}</div>
              </div>
              <div className={`mx-0 mt-2 ${(collapse === true) ? 'block' : 'hidden'}`}>
                {flightData && flightData.fare && flightData.fare.passenger && flightData.fare.passenger.length > 0 &&
                  <>
                    {flightData.fare.passenger.map((col: any, index: any) => (
                      <div className="p-2 px-0 mt-0 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
                        <span className="text-xs">{(col.type === 'CNN' || col.type === 'CHD') ? 'Children' : ((col.type === 'INF') ? 'Infant' : 'Adults')} ({col.qty})</span>
                        <div className="text-xs"><span className='currency-font'>{getCurrency(col.currency)}</span>{amountSeparator(col.base)}</div>
                      </div>
                    ))}
                  </>
                }
              </div>
            </div>
          </>
        }
        {(flightData && flightData.fare && flightData.fare.tax) &&
          <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
            <span>Fee & Taxes</span>
            <div><span className='currency-font'>{getCurrency(flightData.fare.tax.currency)}</span>{amountSeparator(flightData.fare.tax.amount)}</div>
          </div>
        }
        {(flightData && flightData.fare && flightData.fare.discount && flightData.fare.discount.amount > 0) &&
          <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center text-emerald-600 space-x-4 rounded-lg">
            <span>Discount</span>
            <div><span className='currency-font'>{getCurrency(flightData.fare.discount.currency)}</span>{amountSeparator(flightData.fare.discount.amount)}</div>
          </div>
        }
      </div>
    )
  }

  const getBaggageInfo = (info: any) => {
    return (
      <>
        {(flightData.baggage && flightData.baggage.length > 0) ?
          <>{(flightData.baggage[info] && flightData.baggage[info].allowance && flightData.baggage[info].allowance.Weight > 0) ? <><i className="las la-suitcase text-xl mr-1"></i> Check-In: {flightData.baggage[info].allowance.Weight} {flightData.baggage[info].allowance.Unit}</> : null} </>
          :
          null}
      </>
    )
  }

  const showBaggageRules = () => {

    return (
      <>
        <div>
          {flightData && flightData.options && flightData.options[0] && flightData.options[0].flightSegment.map((item: any, index: any, elements: any) => (
            <>
              {(flightData.baggage[index] && flightData.baggage[index].allowance && flightData.baggage[index].allowance.Weight > 0) ?
                <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex flex-col sm:flex-row justify-between items-center space-x-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-center">
                    <Avatar
                      sizeClass="h-12 w-12"
                      radius="rounded"
                      imgUrl={getAirlineLogo(item.airlineCode)}
                    />
                    <div className="ml-3">
                      <a className="flex flex-row items-center text-lg font-medium" href="##">
                        {item.depature} - {item.arrival} <span className="ml-4 text-sm text-neutral-500">({`${item.airlineCode} - ${item.flightNo}`})</span>
                      </a>
                    </div>
                  </div>
                  <div>{getBaggageInfo(index)}</div>
                </div>
                : null}
            </>
          ))}

          <div className="mt-11">
            {flightData && flightData.options && flightData.options[1] && flightData.options[1].flightSegment.map((item: any, index: any, elements: any) => (
              <>
                {(flightData.baggage[Number(flightData.options[0].flightSegment.length) + Number(index)] && flightData.baggage[Number(flightData.options[0].flightSegment.length) + Number(index)].allowance && flightData.baggage[Number(flightData.options[0].flightSegment.length) + Number(index)].allowance.Weight > 0) ?
                  <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex flex-col sm:flex-row justify-between items-center space-x-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center">
                      <Avatar
                        sizeClass="h-12 w-12"
                        radius="rounded"
                        imgUrl={getAirlineLogo(item.airlineCode)}
                      />
                      <div className="ml-3">
                        <a className="flex flex-row items-center text-lg font-medium" href="##">
                          {item.depature} - {item.arrival} <span className="ml-4 text-sm text-neutral-500">({`${item.airlineCode} - ${item.flightNo}`})</span>
                        </a>
                      </div>
                    </div>
                    <div>{getBaggageInfo(Number(flightData.options[0].flightSegment.length) + Number(index))}</div>
                  </div>
                  : null}
              </>
            ))}
          </div>
        </div>
      </>
    )
  }

  const showPassengerFareDetail = () => {
    return (
      <div className='flex flex-col w-56 justify-between'>
        <h2 className="mt-2">Passenger Fare</h2>
        {flightData && flightData.fare && flightData.fare.passenger && flightData.fare.passenger.length > 0 &&
          <>
            {flightData.fare.passenger.map((col: any, index: any) => (
              <div className="flex justify-between dark:text-neutral-300 mb-2">
                <span>{(col.type === 'CNN' || col.type === 'CHD') ? 'Children' : ((col.type === 'INF') ? 'Infant' : 'Adults')} ({col.qty})</span>
                <div><span className='currency-font'>{getCurrency(col.currency)}</span>{amountSeparator(col.fare)}</div>
              </div>
            ))}
          </>
        }
      </div>
    )
  }

  return (
    <div className='itinerary-details mt-3'>
      <Tab.Group>
        <Tab.List className="flex flex-wrap sm:flex-row space-x-1 overflow-x-auto">
          <Tab key={1} as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                  ? "bg-secondary-900 text-secondary-50 "
                  : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  } `}
              >
                FLIGHT INFORMATION
              </button>
            )}
          </Tab>
          <Tab key={2} as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                  ? "bg-secondary-900 text-secondary-50 "
                  : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  } `}
              >
                FARE DETAILS
              </button>
            )}
          </Tab>
          {(baggageData && baggageData.length > 0) ?
            <>
              <Tab key={3} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                      ? "bg-secondary-900 text-secondary-50 "
                      : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      } `}
                  >
                    BAGGAGE RULES
                  </button>
                )}
              </Tab>
            </>
            : null
          }
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="mt-5">
            {(flightData && flightData.options && flightData.options.length > 0) &&
              <>
                {(tripType && tripType === 'multi') ? <>

                  {(flightData && flightData.options && flightData.options.map((items: any) => (
                    <>
                      <div className='relative mb-5'>
                        <div className='flex p-3 mb-4 bg-gray-dt dark:bg-neutral-800'>
                          <FaPlane size={16} className='mt-1 mr-2' /> {getAirportCity(items.flightSegment[0].depature)} To {getAirportCity(items.flightSegment[items.flightSegment.length - 1].arrival)},  {moment(items.flightSegment[0].depTime).format('ll')}
                        </div>
                        {renderFlightData(items)}
                      </div>
                    </>
                  )))}

                </> : <>
                  {(flightData && flightData.options[0]) &&
                    <div className='relative'>
                      <div className='flex p-3 mb-4 bg-gray-dt dark:bg-neutral-800'>
                        <FaPlane size={16} className='mt-1 mr-2' /> {getAirportCity(flightData.options[0].flightSegment[0].depature)} To {getAirportCity(flightData.options[0].flightSegment[flightData.options[0].flightSegment.length - 1].arrival)},  {moment(flightData.options[0].flightSegment[0].depTime).format('ll')}
                      </div>
                      {renderFlightData(flightData.options[0])}
                    </div>
                  }

                  {(flightData && flightData.options[1]) &&
                    <div className='relative mt-12 mb-12'>
                      <div className='flex p-3 mb-4 bg-gray-dt dark:bg-neutral-800'>
                        <FaPlane size={16} className='mt-1 mr-2' /> {getAirportCity(flightData.options[1].flightSegment[0].depature)} To {getAirportCity(flightData.options[1].flightSegment[flightData.options[1].flightSegment.length - 1].arrival)},  {moment(flightData.options[1].flightSegment[0].depTime).format('ll')}
                      </div>
                      {renderFlightData(flightData.options[1])}
                    </div>
                  }
                </>
                }
              </>
            }
          </Tab.Panel>
          <Tab.Panel className="mt-5">
            <div className="flow-root">
              <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
                {showPassengerFare()}
                {(flightData && flightData.fare && flightData.fare.totalFare) ?
                  <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
                    <div>
                      <span className="font-semibold">Total Fare</span><span className="astrick">*</span> <Tooltip placement="top" trigger={['click']} overlay={showPassengerFareDetail()}><i className="las la-info-circle fare-exclamation-info"></i></Tooltip>
                      <span className="block text-xs text-neutral-500 dark:text-neutral-400">Includes Taxes & Fees</span>
                    </div>
                    <div className="font-semibold">
                      <span className='currency-font'>{getCurrency(flightData.fare.totalFare.currency)}</span>{amountSeparator(flightData.fare.totalFare.amount)}
                    </div>
                  </div>
                  : null}
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel className="mt-5">
            {showBaggageRules()}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CardData;

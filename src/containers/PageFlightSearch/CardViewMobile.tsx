import React, { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Badge from "shared/Badge/Badge";
import Avatar from "shared/Avatar/Avatar";
import { getAirline, getDuration, getAirlineLogo, getCurrency, getAirportCity, getAirport, amountSeparator } from 'components/Helper'
import { FaClock, FaPlane } from "react-icons/fa"
import { Tab } from "@headlessui/react";

const CardData = (props: any) => {

  const [flightData, setFlightData] = useState<any['options']>([])
  const [cabin, setCabin] = useState<any>('Y')

  useEffect(() => {
    if (props.col) {
      setFlightData(props.col)
      setCabin(props.cabin)
    }
  }, [props]);

  const renderLayover = (item: any, item1: any) => {
    let layover: any = ''
    let changed: any = false
    if (item1) {
      const a = moment(item1.depTime)
      const b = moment(item.arrTime)
      layover = getDuration(a.diff(b, 'minutes'))
      changed = (item.arrival !== item1.depature) ? true : false
    }
    return (
      <>
        {(item && item1) &&
          <div className="my-7 mt-3 md:my-10 space-y-5 md:pl-24">
            <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex flex-row text-center justify-center text-neutral-700 dark:text-neutral-300 text-sm md:text-base">{layover} &nbsp; Layover in {getAirportCity(item.arrival)}</div>
            {(changed === true) && <div className="flex flex-row text-center justify-center"><Badge key={1} color="yellow" name={<span className="block text-xs"><i className="las la-info-circle exclamation-info"></i> Airport change required</span>} /></div>}
            <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
          </div>
        }
      </>
    )
  }

  const baggageData = flightData.baggage && flightData.baggage.filter((item: any) => { return item.allowance.Weight > 0 })

  const renderFlightData = (options: any) => { console.log(options)
    return (
      <>
        {options && options.flightSegment.map((item: any, index: any, elements: any) => (
          <>
            <div className={`block nc-card-flights relative mt-3 rounded-2xl group`}>
              <div className="flex flex-col flex-grow">
                <div className="p-4 md:p-8 border border-neutral-200 dark:border-neutral-700 rounded-2xl ">
                  <div>
                    <div className="flex flex-col md:flex-row ">
                      <div className="flex flex-row md:pt-7">
                        <img src={getAirlineLogo(item.airlineCode)} className="w-10" alt="" />
                        <div className={`ml-3 sm:ml-0`}>
                          <span className="text-sm font-medium text-center">
                            {getAirline(item.airlineCode)}
                          </span>
                          <div className="flex items-start sm:items-center text-xs text-neutral-500 dark:text-neutral-400">
                            <span className='sm:m-auto'>{`${item.airlineCode} - ${item.flightNo}`}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex my-5 md:my-0">
                        <div className="flex-shrink-0 flex flex-col items-center py-2"><span className="block w-6 h-6 rounded-full border border-neutral-400"></span><span className="block flex-grow border-l border-neutral-400 border-dashed my-1"></span><span className="block w-6 h-6 rounded-full border border-neutral-400"></span></div>
                        <div className="ml-4 space-y-10 text-xs">
                          <div className="flex flex-col space-y-1"><span className=" text-neutral-500 dark:text-neutral-400">{moment(item.depTime).format('dddd, lll')}</span><span className=" font-semibold">{getAirport(item.depature)} ({item.depature})</span></div>
                          <div className="flex flex-col space-y-1"><span className=" text-neutral-500 dark:text-neutral-400">{moment(item.arrTime).format('dddd, lll')}</span><span className=" font-semibold">{getAirport(item.arrival)} ({item.arrival}) {(item.arrival.terminalId) && `Terminal ${item.arrival.terminalId}`} </span></div>
                        </div>
                      </div>
                      <div className="border-l border-neutral-200 dark:border-neutral-700 md:mx-6 lg:mx-10"></div>
                        <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1 md:space-y-2">
                          <li className="flex flex-row ">Duration: &nbsp; {getDuration(item.duration)}</li>
                        </ul>
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
        {flightData && flightData.fare && flightData.fare.passenger && flightData.fare.passenger.length > 0 &&
          <>
            {flightData.fare.passenger.map((col: any, index: any) => (
              <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 text-sm flex justify-between items-center space-x-4 rounded-lg">
                <span>{(col.type === 'CNN' || col.type === 'CHD') ? 'Children' : ((col.type === 'INF') ? 'Infant' : 'Adults')} ({col.qty})</span>
                <div><span className='currency-font'>{getCurrency(col.currency)}</span>{amountSeparator(col.qty * col.fare)}</div>
              </div>
            ))}
          </>
        }
      </div>
    )
  }

  const getBaggageInfo = (info: any) => {
    return (
      <>
        {(flightData.baggage && flightData.baggage.length > 0) ?
          <>{(flightData.baggage[info] && flightData.baggage[info].allowance && flightData.baggage[info].allowance.Weight > 0) ? <span className="text-sm flex items-center"><i className="las la-suitcase text-xl mr-1"></i> {flightData.baggage[info].allowance.Weight} {flightData.baggage[info].allowance.Unit}</span> : null} </>
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
              <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex flex-row justify-between items-center space-x-4 rounded-lg">
                <div className="flex flex-row items-center">
                  <Avatar
                    sizeClass="h-8 w-8"
                    radius="rounded"
                    imgUrl={getAirlineLogo(item.airlineCode)}
                  />
                  <div className="ml-3">
                    <a className="flex flex-col items-start text-sm font-medium" href="##">
                      <span>{item.depature} - {item.arrival} </span>
                      <span className="text-xs text-neutral-500">({`${item.airlineCode} - ${item.flightNo}`})</span>
                    </a>
                  </div>
                </div>
                <div>{getBaggageInfo(index)}</div>
              </div>
            : null }
          </>
        ))}

        <div className="mt-6">
          {flightData && flightData.options && flightData.options[1] && flightData.options[1].flightSegment.map((item: any, index: any, elements: any) => (
            <>
              {(flightData.baggage[Number(flightData.options[0].flightSegment.length) + Number(index)] && flightData.baggage[Number(flightData.options[0].flightSegment.length) + Number(index)].allowance && flightData.baggage[Number(flightData.options[0].flightSegment.length) + Number(index)].allowance.Weight > 0) ?
                <div className="p-4 mt-2 bg-neutral-100 dark:bg-neutral-800 flex flex-row justify-between items-center space-x-4 rounded-lg">
                  <div className="flex flex-row items-center">
                    <Avatar
                      sizeClass="h-8 w-8"
                      radius="rounded"
                      imgUrl={getAirlineLogo(item.airlineCode)}
                    />
                    <div className="ml-3">
                      <a className="flex flex-col items-start text-xs font-medium" href="##">
                        <span>{item.depature} - {item.arrival} </span>
                        <span className="text-xs text-neutral-500">({`${item.airlineCode} - ${item.flightNo}`})</span>
                      </a>
                    </div>
                  </div>
                  <div>{getBaggageInfo(Number(flightData.options[0].flightSegment.length) + Number(index))}</div>
                </div>
              : null }
            </>
          ))}
        </div>
      </div>
    </>
    )
  }

  return (
    <div className='itinerary-details mt-3'>
      <Tab.Group>
        <Tab.List className="flex flex-wrap sm:flex-row overflow-x-auto">
          <Tab key={1} as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-shrink-0 block !leading-none font-medium px-3 py-2 text-xs capitalize sm:text-base sm:px-6 sm:py-3 rounded-full focus:outline-none ${selected
                  ? "bg-secondary-900 text-secondary-50 "
                  : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  } `}
              >
                Flight Info
              </button>
            )}
          </Tab>
          <Tab key={2} as={Fragment}>
            {({ selected }) => (
              <button
                className={`flex-shrink-0 block !leading-none font-medium px-3 py-2 text-xs capitalize sm:text-base sm:px-6 sm:py-3 rounded-full focus:outline-none ${selected
                  ? "bg-secondary-900 text-secondary-50 "
                  : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  } `}
              >
                Fare Details
              </button>
            )}
          </Tab>
          {(baggageData && baggageData.length > 0) ?
          <>
            <Tab key={3} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`flex-shrink-0 block !leading-none font-medium px-3 py-2 text-xs capitalize sm:text-base sm:px-6 sm:py-3 rounded-full focus:outline-none ${selected
                    ? "bg-secondary-900 text-secondary-50 "
                    : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    } `}
                >
                  Baggage Rules
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
                <div className='relative'>
                  <div className='flex p-3 mb-4 bg-gray-dt dark:bg-neutral-800 text-xs'>
                    <FaPlane size={14} className='mt-1 mr-2' /> {getAirportCity(flightData.options[0].flightSegment[0].depature)} To {getAirportCity(flightData.options[0].flightSegment[flightData.options[0].flightSegment.length - 1].arrival)},  {moment(flightData.options[0].flightSegment[0].depTime).format('MMM DD, YY')}
                  </div>
                  {renderFlightData(flightData.options[0])}
                </div>

                {(flightData && flightData.options[1]) &&
                  <div className='relative mt-12 mb-12'>
                    <div className='flex p-3 mb-4 bg-gray-dt dark:bg-neutral-800 text-xs'>
                      <FaPlane size={14} className='mt-1 mr-2' /> {getAirportCity(flightData.options[1].flightSegment[0].depature)} To {getAirportCity(flightData.options[1].flightSegment[flightData.options[1].flightSegment.length - 1].arrival)},  {moment(flightData.options[1].flightSegment[0].depTime).format('MMM DD, YY')}
                    </div>
                    {renderFlightData(flightData.options[1])}
                  </div>
                }

                {(flightData.isNonRefundable === true) ?
                  <div className={`flex flex-col items-center mt-6 w-36 text-xs py-0.5 px-3 bg-red-700 text-red-50 rounded-full`}
                    data-nc-id="SaleOffBadge"
                  >
                    Non Refundable
                  </div>
                  :
                  <div className={`flex flex-col items-center mt-6 w-36 text-xs py-0.5 px-3 bg-green-600 text-green-50 rounded-full`}
                    data-nc-id="SaleOffBadge"
                  >
                    Partially Refundable
                  </div>
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
                      <span className="font-semibold">Total Fare</span><span className="astrick">*</span>
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

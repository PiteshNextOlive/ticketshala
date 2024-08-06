import React, { FC, Fragment, useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom'
import ButtonPrimary from "shared/Button/ButtonPrimary";
import NcImage from "shared/NcImage/NcImage";
import { Service, Storage } from 'services/Service';
import { amountSeparator, getCurrency, getAirportCity, getAirport, OpenNotification } from 'components/Helper';
import moment from "moment";
import Badge from "shared/Badge/Badge";
import Config from './../../config.json';
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { Popover, Transition } from "@headlessui/react";
import { FaPlaneDeparture, FaPlaneArrival, FaBed, FaCar, FaFly, FaTripadvisor, FaCalendar, FaUser, FaDownload, FaEllipsisV } from "react-icons/fa"
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { DotsVerticalIcon } from "@heroicons/react/solid";

export interface PayPageProps {
  className?: string;
}

const OrderPage: FC<PayPageProps> = ({ className = "" }) => {

  const { txtid }: any = useParams()
  const history = useHistory()
  const [data, setData]: any = useState([])
  const [passanger, setPassanger]: any = useState([])
  const [loading, setLoading] = useState(true)

  const getBookingData = () => {
    setLoading(true)
    Service.get({ url: `/user/txn/${txtid}` })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops!', 'History Not Found!', '', true)
          history.push('/account/my-trips')
          return false
        } else {
          setData(response.data)
          setPassanger(JSON.parse(response.data.passangerReq))
        }
      })
  }

  useEffect(() => {
    if (txtid) {
      getBookingData()
    }
  }, [txtid])

  const renderCities = (cities: any) => {
    if (cities && cities !== null) {
      const city = cities.split(',');
      return (
        (city && city.length > 0) &&
        <>
          {city.map((item: any, index: any) => (
            <>
              <Badge name={item} className='mr-1' color="blue" />
            </>
          ))}
        </>
      )
    }
  }

  const handleClickDelete = () => {

    Service.post({ url: '/user/txn/cancel', body: JSON.stringify({ txnId: txtid }) })
      .then((response) => {
        if (response) {
          if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message, '', true)
            return false
          } else {
            OpenNotification('success', 'Success!', 'Your cancellation request has been sent. Ticketshala will review your request and send you confirmation email.', '', true)
            getBookingData()
          }
        }
      })
  }

  const cancelBooking = () => {

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to cancel this booking?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                handleClickDelete();
                onClose();
              }}
            >
              Yes, Cancel it!
            </button>
          </div>
        );
      }
    })
  }

  const generatePayment = () => {
    Service.post({ url: '/payment/generate/paymentlink', body: JSON.stringify({ txnId: txtid }) })
      .then((response) => {
        if (response) {
          if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message, '', true)
            return false
          } else {
            window.location.href = response.data.url
          }
        }
      })
  }

  const issueTicket = () => {
    Service.post({ url: '/flight/user/fulfillPnr', body: JSON.stringify({ txnId: txtid }) })
      .then((response) => {
        if (response) {
          if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message, '', true)
            return false
          } else {
            OpenNotification('success', 'Success!', 'Your ticket has been issued. An email confirmation of your booking details with PNR has been sent!', '', true)
            getBookingData()
          }
        }
      })
  }

  const renderContent = () => {
    return (
      <div className="w-full order-rendered hover:bg-neutral-100 dark:hover:bg-neutral-800 flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">

        {/* ------------------------ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Your Booking</h3>
            {((data && data.pStatus === 2 && data.bStatus === 2 && data.cStatus !== 2 && data.isExpired === 0) || (data && data.isExpired === 0 && (data.pStatus === 0 || data.pStatus === 7) && (data.bStatus === 1 || data.bStatus === 2)) || (data && data.pStatus === 2 && data.bStatus === 1 && data.isExpired === 0 && data.cStatus === 0) || (data && data.cStatus === 0 && data.isExpired === 0)) ?
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`flex text-left w-full flex-shrink-0 items-center space-x-3 focus:outline-none cursor-pointer`}
                  >
                    <div className="text-neutral-400 dark:text-neutral-400">
                      <DotsVerticalIcon
                        className="ml-2 h-4 w-4 text-neutral-500"
                        aria-hidden="true"
                      />
                    </div>
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
                        {(data && data.pStatus === 2 && data.bStatus === 2 && data.cStatus !== 2) &&
                        <li className="px-2 text-md">
                          <Link to={{ pathname: `${Config.BASE_URL}/printer/ticket/${data.txnId}` }} target='_blank'>
                            <span className="flex items-center cursor-pointer font-normal text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                              Download Ticket
                            </span>
                          </Link>
                        </li>
                        }
                        {(data && data.isExpired === 0 && (data.pStatus === 0 || data.pStatus === 7) && (data.bStatus === 1 || data.bStatus === 2)) &&
                        <li className="px-2 text-md" onClick={generatePayment}>
                          <span className="flex items-center cursor-pointer font-normal text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                            Complete Payment
                          </span>
                        </li>
                        }
                        {(data && data.pStatus === 2 && data.bStatus === 1 && data.isExpired === 0 && data.cStatus === 0) &&
                        <li className="px-2 text-md" onClick={issueTicket}>
                          <span className="flex items-center cursor-pointer font-normal text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                            Issue Ticket
                          </span>
                        </li>
                        }
                        {(data && data.pStatus === 2 && data.bStatus === 2 && data.cStatus === 0) ?
                          <li className="px-2 text-md" onClick={cancelBooking}>
                            <span className="flex items-center cursor-pointer font-normal text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                              Cancel Booking
                            </span>
                          </li>
                        : null}
                      </ul>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            : null}
          </div>

          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

          {/******** HOTEL **********/}
          {(data && data.bookingType === 'hotel' && data.hotel) &&
            <>
              <div className="flex flex-col sm:flex-row sm:items-center bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl">
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-base sm:text-lg font-medium mt-1 block">
                      {data && data.hotel && data.hotel.name}
                    </span>
                    <span className="mt-2 text-sm text-primary dark:text-neutral-400 line-clamp-1">
                     {data && data.hotel && data.hotel.address}
                    </span>
                    <span className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                     {data && data.hotel && data.hotel.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
                <div className="flex-1 p-5 flex space-x-4">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Checkin - Checkout</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      {data && moment(data.tripDate).format('MMM DD, YYYY')} {(data && data.tripUpto) && ` - ${moment(data.tripUpto).format('MMM DD, YYYY')}`}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex space-x-4">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 5.07987C14.8551 4.11105 16.1062 3.5 17.5 3.5C20.0773 3.5 22.1667 5.58934 22.1667 8.16667C22.1667 10.744 20.0773 12.8333 17.5 12.8333C16.1062 12.8333 14.8551 12.2223 14 11.2535M17.5 24.5H3.5V23.3333C3.5 19.4673 6.63401 16.3333 10.5 16.3333C14.366 16.3333 17.5 19.4673 17.5 23.3333V24.5ZM17.5 24.5H24.5V23.3333C24.5 19.4673 21.366 16.3333 17.5 16.3333C16.225 16.3333 15.0296 16.6742 14 17.2698M15.1667 8.16667C15.1667 10.744 13.0773 12.8333 10.5 12.8333C7.92267 12.8333 5.83333 10.744 5.83333 8.16667C5.83333 5.58934 7.92267 3.5 10.5 3.5C13.0773 3.5 15.1667 5.58934 15.1667 8.16667Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Guests</span>
                    <span className="mt-1.5 text-lg font-semibold">{(passanger && passanger.length)} {(passanger && passanger.length > 1) ? 'Guests' : 'Guest'}</span>
                  </div>
                </div>
              </div>
            </>
          }

          {/******** PACKAGE **********/}
          {(data && data.bookingType === 'package' && data.package) &&
            <>
              <div className="flex flex-col sm:flex-row sm:items-center bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex-shrink-0 w-full sm:w-40 p-5">
                  <div className="aspect-w-4 aspect-h-4 sm:aspect-h-4 rounded-2xl overflow-hidden">
                    <NcImage src={`${Config.MEDIA_URL}${data.package.image}`} /> 
                  </div>
                </div>
                <div className="pt-5 sm:pb-5 ml-3 space-y-3">
                  <div>
                    <span className="text-base sm:text-lg font-medium mt-1 mb-1 block">
                      {data && data.package && data.package.title}
                    </span>

                    <span className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      <i className="las la-map-marker-alt text-info"></i>
                      <span className="ml-1"> {renderCities(data && data.package && data.package.cities)}</span>
                    </span>

                    <div className="text-neutral-6000 text-sm mt-3 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data && data.package.short_description.replace(/<\/?[^>]+(>|$)/g, "") }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
                <div className="flex-1 p-5 flex space-x-4">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Date</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      {data && moment(data.tripDate).format('ll')}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex space-x-4">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 5.07987C14.8551 4.11105 16.1062 3.5 17.5 3.5C20.0773 3.5 22.1667 5.58934 22.1667 8.16667C22.1667 10.744 20.0773 12.8333 17.5 12.8333C16.1062 12.8333 14.8551 12.2223 14 11.2535M17.5 24.5H3.5V23.3333C3.5 19.4673 6.63401 16.3333 10.5 16.3333C14.366 16.3333 17.5 19.4673 17.5 23.3333V24.5ZM17.5 24.5H24.5V23.3333C24.5 19.4673 21.366 16.3333 17.5 16.3333C16.225 16.3333 15.0296 16.6742 14 17.2698M15.1667 8.16667C15.1667 10.744 13.0773 12.8333 10.5 12.8333C7.92267 12.8333 5.83333 10.744 5.83333 8.16667C5.83333 5.58934 7.92267 3.5 10.5 3.5C13.0773 3.5 15.1667 5.58934 15.1667 8.16667Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Travellers</span>
                    <span className="mt-1.5 text-lg font-semibold">{(passanger && passanger.length)} {(passanger && passanger.length > 1) ? 'Travellers' : 'Traveller'}</span>
                  </div>
                </div>
              </div>
            </>
          }

          {/******** FLIGHT **********/}
          {(data && data.bookingType === 'flight') &&
            <>
              <div className="flex flex-col sm:flex-row sm:items-center">

                <div className="pt-5 w-full sm:pb-5 space-y-3">
                  <div className="text-base flex mt-1 mb-1 ">
                    <div className={`flex w-full relative items-center space-x-3 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl dark:border-neutral-800`}>
                      <div className="text-neutral-300 mt-3 dark:text-neutral-400">
                        <FaPlaneDeparture size='25' />
                      </div>
                      <div className="flex-grow">
                        <span className="block mb-3 text-sm text-neutral-400 leading-none font-light">
                          DEPARTURE:
                        </span>
                        <span className="block xl:text-lg font-semibold">
                          {data && getAirportCity(data.tripFrom)} ({data && data.tripFrom})
                        </span>
                        <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                          {data && getAirport(data.tripFrom)}
                        </span>
                      </div>
                    </div>

                    <div className={`flex w-full relative ml-2 items-center space-x-3 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl dark:border-neutral-800`}>
                      <div className="text-neutral-300 mt-3 dark:text-neutral-400">
                        <FaPlaneArrival size='25' />
                      </div>
                      <div className="flex-grow">
                        <span className="block mb-3 text-sm text-neutral-400 leading-none font-light">
                          ARRIVAL:
                        </span>
                        <span className="block xl:text-lg font-semibold">
                          {data && getAirportCity(data.tripTo)} ({data && data.tripTo})
                        </span>
                        <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                          {data && getAirport(data.tripTo)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
                <div className="flex-1 p-5 flex space-x-4 ">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Date</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      {data && moment(data.tripDate).format('ll')}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex space-x-4">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 5.07987C14.8551 4.11105 16.1062 3.5 17.5 3.5C20.0773 3.5 22.1667 5.58934 22.1667 8.16667C22.1667 10.744 20.0773 12.8333 17.5 12.8333C16.1062 12.8333 14.8551 12.2223 14 11.2535M17.5 24.5H3.5V23.3333C3.5 19.4673 6.63401 16.3333 10.5 16.3333C14.366 16.3333 17.5 19.4673 17.5 23.3333V24.5ZM17.5 24.5H24.5V23.3333C24.5 19.4673 21.366 16.3333 17.5 16.3333C16.225 16.3333 15.0296 16.6742 14 17.2698M15.1667 8.16667C15.1667 10.744 13.0773 12.8333 10.5 12.8333C7.92267 12.8333 5.83333 10.744 5.83333 8.16667C5.83333 5.58934 7.92267 3.5 10.5 3.5C13.0773 3.5 15.1667 5.58934 15.1667 8.16667Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Travellers</span>
                    <span className="mt-1.5 text-lg font-semibold">{(passanger && passanger.length)} {(passanger && passanger.length > 1) ? 'Travellers' : 'Traveller'}</span>
                  </div>
                </div>
              </div>
            </>
          }

          {/******** TRANSFER **********/}
          {(data && data.bookingType === 'transfer') &&
            <>
              <div className="flex flex-col sm:flex-row sm:items-center">

                <div className="w-full">
                  <div className="text-base flex mt-1 mb-1 ">
                    <div className={`flex w-full relative items-center space-x-3 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700`}>
                      <div className="text-neutral-300 mt-3 dark:text-neutral-400">
                        <FaCar size='25' />
                      </div>
                      <div className="flex-grow">
                        <span className="block mb-3 text-sm text-neutral-400 leading-none font-light">
                          FROM:
                        </span>
                        <span className="block xl:text-lg font-semibold">
                          {data && data.tripFrom}
                        </span>
                      </div>
                    </div>

                    <div className={`flex w-full relative ml-2 items-center space-x-3 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700`}>
                      <div className="text-neutral-300 mt-3 dark:text-neutral-400">
                        <FaCar size='25' />
                      </div>
                      <div className="flex-grow">
                        <span className="block mb-3 text-sm text-neutral-400 leading-none font-light">
                          TO:
                        </span>
                        <span className="block xl:text-lg font-semibold">
                          {data && data.tripTo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
                <div className="flex-1 p-5 flex space-x-4">
                  <svg
                    className="w-8 h-8 text-neutral-300 dark:text-neutral-6000"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
                      stroke="#D1D5DB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Date</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      {data && moment(data.tripDate).format('lll')}
                    </span>
                  </div>
                </div>
              </div>
            </>
          }
        </div>

        {/* ------------------------ */}
        <div className="space-y-6 pt-5">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">Booking Detail {(data && data.isExpired === 1) && <Badge color={'red'} className="ml-2 p-2" name={'Booking Expired'} /> }</h3>
          </div>

          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

          <div className="flex flex-col space-y-4">
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Booking Ref #</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {data && data.txnId && data.txnId}
              </span>
            </div>
            {(data && data.bookingType === 'flight') &&
              <div className="flex text-neutral-6000 dark:text-neutral-300">
                <span className="flex-1">PNR</span>
                <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                  {data && data.pnr && data.pnr}
                </span>
              </div>
            }
            <div className="flex hidden text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Booking Date</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {data && moment().format('ll')}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Amount</span>
              <div className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                <span className='currency-font'>{data && data.currency && getCurrency(data.currency)}</span>{data && data.amount && amountSeparator(data.amount)}
              </div>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Booking Status</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                <Badge color={(data && data.bStatus === 2) ? 'green' : 'yellow'} className="p-2" name={(data.bStatus === 2) ? 'Completed' : 'Pending'} />
              </span>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Payment Status</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                <Badge color={(data && data.pStatus === 2) ? 'green' : 'yellow'} className="p-2" name={(data.pStatus === 2) ? 'Completed' : 'Pending'} />
              </span>
            </div>
            {(data && data.cStatus !== 0) ?
              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                <span className="flex-1">Cancellation Status</span>
                <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                  <Badge color={(data.cStatus === 2) ? 'red' : 'yellow'} className="p-2" name={(data.cStatus === 2) ? 'Cancelled' : 'Pending'} />
                </span>
              </div>
            : null }
          </div>
        </div>

        <div className="pt-5">
          <ButtonSecondary href={(data && data.bookingType === 'package') ? "/packages" : ((data && data.bookingType === 'hotel') ? "/hotels" : ((data && data.bookingType === 'activity') ? "/activities" : ((data && data.bookingType === 'transfer') ? "/transfers" : "/")))}>Explore More Bookings</ButtonSecondary>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-PayPage ${className}`} data-nc-id="PayPage">
      <main className="container mt-11 mb-24 lg:mb-32 ">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default OrderPage;

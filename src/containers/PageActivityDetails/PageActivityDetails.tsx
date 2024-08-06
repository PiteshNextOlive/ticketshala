import React, { FC, Fragment, useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom'
import GuestsInput from "components/HeroSearchForm/ActivityGuestsInput";
import DateSingleInput from "./DateSingleInput";
import moment from "moment";
import Avatar from "shared/Avatar/Avatar";
import { Service, Storage } from 'services/Service';
import Config from './../../config.json';
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { amountSeparator, renderAmenities, getCurrency, OpenNotification } from 'components/Helper';
import { Tab } from "@headlessui/react";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import ModalPhotos from "./ModalPhotos";
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const ActivityDetailPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const { slug }: any = useParams()
  const history = useHistory()
  const [data, setData]: any = useState(null)
  const [dataOptions, setDataOptions]: any = useState([])

  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [dateDepartureValue, setdateDepartureValue] = useState<moment.Moment | null>(null);
  const [guestValue, setGuestValue] = useState({ guestAdults: 1, guestChildren: 0, guestInfants: 0 });

  const [dateDepartureFocused, setDateDepartureFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)
  const [shareTitle, setShareTitle] = useState(null)
  const [shareUrl, setShareUrl]: any = useState(null)
  const [departureDate, setDepartureDate] = useState([])
  const [galleries, setGalleries] = useState([])
  const [price, setPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [countAdult, setCountAdult] = useState(1)
  const [countChild, setCountChild] = useState(0)
  const [countInfant, setCountInfant] = useState(0)
  const [travellers, setTravellers] = useState(1)
  const [categories, setCategories]: any = useState([])
  const [coordinates, setCoordinates]: any = useState(null)

  const getActivityData = () => {
    const params = {
      id: slug,
      sDate: moment().format('YYYY-MM-DD'),
      eDate: moment().add(7, "days").format('YYYY-MM-DD'),
      qty: [
        { type: "ADT", qty: 1 }
      ]
    }
    setLoading(true)
    Service.post({ url: `/activities/detail`, body: JSON.stringify(params) })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          return false
        } else {
          setData(response.data)
          setGalleries(response.data.images)
          setDataOptions(response.data.options[0])
        }
      })
  }

  const showPosition = (position: any) => {
    if (position && position !== null) {
      Storage.set('coords', { lat: position.coords.latitude, lng: position.coords.longitude });
    }
  }

  const getDepartureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  const getUserLocation = async () => {
    const url = 'https://ipapi.co/json/'
    try {
      const response = await fetch(url, {
        method: 'GET'
      })
      return await response.json()
    } catch (error) {
      return null
    }

  }

  useEffect(() => {
    if (slug) {
      getActivityData()

      const coords = Storage.get('coords')
      if (coords === null) {
        getDepartureLocation()

        getUserLocation().then(response => {
          if (response !== null) {
            setCoordinates(response)
          }
        })
      }

    }
  }, [slug])

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleCloseModal = () => setIsOpen(false);

  const proceedBooking = () => {

    if (departureDate === null) {
      OpenNotification('error', 'Missing Selection!', 'Please select the Departure Date!', '', true)
      return false
    }

    const coords = Storage.get('coords')
    let depLatitude: any = ''
    let depLongitude: any = ''
    if (coords && coords !== null) {
      depLatitude = coords.lat;
      depLongitude = coords.lng;
    } else if (coordinates && coordinates !== null) {
      depLatitude = coordinates.latitude;
      depLongitude = coordinates.longitude;
    }

    const depDate = (departureDate && Array.isArray(departureDate) && departureDate.length) > 0 ? moment(departureDate[0]).format('YYYY-MM-DD') : moment(departureDate).format('YYYY-MM-DD')

    history.push(`/activity/proceed/${slug}?${encodeURIComponent(`depDate=${depDate}&depLatitude=${depLatitude}&depLongitude=${depLongitude}&adults=${countAdult}&child=${countChild}&infant=${countInfant}&v=1.0`)}`)

  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap border-none p-0 mb-5 !space-y-6">

        {/* 1 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{data && data.name}</h2>

        {/* 2 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          {(data && data.duration.v && data.duration.v !== '') &&
            <span className="mb-5 sm:mb-0">
              <i className="las la-clock text-2xl"></i>
              <span className="ml-1">Duration: {data && data.duration.v} {data && data.duration.m}</span>
            </span>
          }
          <span className="ml-0 mb-5 sm:mb-0 sm:ml-2">
            <i className="las la-map-marker-alt text-2xl text-info"></i>
            <span> {data && data.places.join()}, {data && data.country}</span>
          </span>

          <LikeSaveBtns shareUrl={shareUrl} shareTitle={shareTitle} />
        </div>

        {/* 3 */}
        <div className="flex justify-between items-center">
          <div>
            {data && data.days.map((item: any, key: any) => (
              <>
                <Badge name={item} className="mr-1 capitalize" color="green" />
              </>
            ))}
          </div>
        </div>

      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <>
        <div className="listingSection__wrap">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="text-neutral-6000 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data && data.desc }} />
        </div>
        
      </>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Includes </h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>Pick-up and drop off at your selected hotel/ location</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>Transportation by 4WD air-conditioned Land Cruiser</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>English-speaking licensed driver</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>Sunset view photo stop</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>Camel ride experience (can be repeated)</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>Tanura and Ladies Khaliji Dance</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-check-circle text-2xl"></i>
          <span>Barbecue meal with vegetarian and non-vegetarian options. </span>
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Excludes </h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="flex items-center space-x-3">
          <i className="las la-times-circle text-2xl"></i>
          <span>Alcoholic beverages</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-times-circle text-2xl"></i>
          <span>Quad Bike “ ATV” options (available on request)</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-times-circle text-2xl"></i>
          <span>Any other expenses not mentioned</span>
        </div>
        <div className="flex items-center space-x-3">
          <i className="las la-times-circle text-2xl"></i>
          <span>Tipping</span>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <>
        {(data && data.terms && data.terms !== null) &&
          <div className="listingSection__wrap">
            <div>
              <h2 className="text-2xl font-semibold">Terms and Conditions </h2>
            </div>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            {/* 6 */}
            <div className="flex flex-col gap-6 text-sm text-neutral-700 dark:text-neutral-300"></div>
          </div>
        }
      </>
    );
  };

  const renderSection6 = () => {
    return (
      <>

        <div className="listingSection__wrap">
          <div>
            <h2 className="text-2xl font-semibold">Cancellation Policy </h2>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          {/* 6 */}
          <ul className="flex flex-col gap-6 text-sm text-neutral-700 dark:text-neutral-300">
            <li>
              <div>For a full refund, you must cancel at least 24 hours before the experience's start time.</div>
            </li>
            <li>
              <div>If you cancel less than 24 hours before the experience's start time, the amount you paid will not be refunded.</div>
            </li>
            <li>
              <div>Any changes made less than 24 hours before the experience's start time will not be accepted.</div>
            </li>
            <li>
              <div>Cut-off times are based on the experience's local time.</div>
            </li>
            <li>
              <div>This experience requires good weather. If it's canceled due to poor weather, you'll be offered a different date or a full refund.</div>
            </li>
            <li>
              <div>This experience requires a minimum number of travelers. If it's canceled because the minimum isn't met, you'll be offered a different date/experience or a full refund.</div>
            </li>
          </ul>
        </div>

      </>
    );
  }

  const handleGuest = (data: any) => {
    if (data) {
      const guest = guestValue
      guest['guestAdults'] = data.guestAdults;
      guest['guestChildren'] = data.guestChildren;
      guest['guestInfants'] = data.guestInfants;

      const travellersCount = Number(data.guestAdults) + Number(data.guestChildren) + Number(data.guestInfants)
      setTravellers(travellersCount)
      setGuestValue(guest)
      setCountAdult(Number(data.guestAdults))
      setCountChild(Number(data.guestChildren))
      setCountInfant(Number(data.guestInfants))
    }
  }

  const fixedNumber = (num: any) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const renderSidebar = () => {
    return (
      <div className="listingSection__wrap shadow-xl p-5">
        {/* PRICE */}
        <div className="flex justify-between items-center">
          <div className='flex flex-col w-full'>
            <div className="text-3xl font-semibold">
              <span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.totalFare.currency)}</span> {dataOptions && dataOptions.rate && amountSeparator(Number(dataOptions.rate.totalFare.amount))}
              <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
                /per person
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">

          <DateSingleInput
            defaultValue={dateDepartureValue}
            onChange={(date: any) => { setDepartureDate(date) }}
            placeHolder='Travelling On'
            defaultFocus={dateDepartureFocused}
            onFocusChange={(focus: boolean) => {
              setDateDepartureFocused(focus);
            }}
          />

          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput
            fieldClassName="p-5"
            onChange={(data) => handleGuest(data)}
            defaultValue={guestValue}
          />
        </form>

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Base Fare ({`1 Pax`})</span>
            <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.baseFare.currency)}</span> {dataOptions && dataOptions.rate && amountSeparator(Number(dataOptions.rate.baseFare.amount))}</div>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Fee & Taxes</span>
            <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.tax.currency)}</span> {dataOptions && dataOptions.rate && amountSeparator(0.00)}</div>
          </div>
          {(dataOptions && dataOptions.rate && dataOptions && dataOptions.rate.discount.amount > 0) &&
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.discount.currency)}</span>{dataOptions && dataOptions.rate && amountSeparator(dataOptions.rate.discount.amount)}</div>
            </div>
          }
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Grand Total</span>
            <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.totalFare.currency)}</span>{dataOptions && dataOptions.rate && amountSeparator(Number(dataOptions.rate.totalFare.amount))}</div>
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary onClick={proceedBooking}>Reserve</ButtonPrimary>
      </div>
    );
  };

  const _renderLoading = () => {
    return (
      <>
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h3 className="blocl text-lg pt-5 text-neutral-400">Please Wait, Fetching Details...</h3>
      </>
    );
  };

  return (
    <div className={`nc-ListingStayDetailPage  py-11  ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      {(!loading) ?
        <>


          {/* SINGLE HEADER */}
          <>
            <header className="container rounded-md sm:rounded-xl">

              {renderSection1()}

              <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 gallery-height">
                <div
                  className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => handleOpenModal(0)}
                >
                  <NcImage
                    containerClassName="absolute inset-0"
                    className="object-cover w-full h-full rounded-md sm:rounded-xl"
                    src={`${(galleries.length > 0) && `${galleries[0]}`}`}
                    prevImageHorizontal
                  />
                  <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>
                {galleries.filter((_: any, i: any) => i >= 1 && i < galleries.length).map((item: any, index: any) => (
                  <div
                    key={index}
                    className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? "hidden sm:block" : ""
                      }`}
                  >
                    <NcImage
                      containerClassName="aspect-w-4 sm:aspect-w-6 h-full"
                      className="object-cover w-full h-full rounded-md sm:rounded-xl "
                      src={item}
                      prevImageHorizontal
                    />

                    {/* OVERLAY */}
                    <div
                      className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleOpenModal(index + 1)}
                    />
                  </div>
                ))}

                <div
                  className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
                  onClick={() => handleOpenModal(0)}
                >
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span className="ml-2 text-neutral-800 text-sm font-medium">
                    Show all photos
                  </span>
                </div>
              </div>
            </header>
            {/* MODAL PHOTOS */}
            <ModalPhotos
              imgs={galleries}
              isOpen={isOpen}
              onClose={handleCloseModal}
              initFocus={openFocusIndex}
            />
          </>

          {/* MAIn */}
          <main className="container mt-11 flex flex-col sm:flex-row">

            <>
              {/* CONTENT */}
              <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10 package-details">

                <Tab.Group>
                  <Tab.List className="flex flex-wrap sm:flex-row">
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <span
                          className={`flex-shrink-0 block !leading-none font-semibold py-2.5 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                            ? "border-b text-secondary-700 border-b-green-900"
                            : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                            } `}
                        >
                          OVERVIEW
                        </span>
                      )}
                    </Tab>

                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <span
                          className={`flex-shrink-0 block !leading-none font-semibold ml-6 py-2.5 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                            ? "border-b text-secondary-700 border-b-green-900"
                            : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                            } `}
                        >
                          INCLUSION(S)
                        </span>
                      )}
                    </Tab>
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <span
                          className={`flex-shrink-0 block !leading-none font-semibold ml-0 sm:ml-6 py-2.5 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                            ? "border-b text-secondary-700 border-b-green-900"
                            : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                            } `}
                        >
                          EXCLUSION(S)
                        </span>
                      )}
                    </Tab>
                    {/*
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <span
                      className={`flex-shrink-0 block !leading-none font-semibold ml-6 py-2.5 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                        ? "border-b text-secondary-700 border-b-green-900"
                        : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                        } `}
                    >
                      POLICIES
                    </span>
                  )}
                </Tab>
                */}
                  </Tab.List>

                  <Tab.Panels>
                    <Tab.Panel className="space-y-5">
                      {renderSection2()}
                    </Tab.Panel>
                    <Tab.Panel className="space-y-5">
                      {renderSection3()}
                    </Tab.Panel>
                    <Tab.Panel className="space-y-5">
                      {renderSection7()}
                    </Tab.Panel>
                    <Tab.Panel className="space-y-5">
                      {renderSection5()}
                      {renderSection6()}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>

              </div>

              {/* SIDEBAR */}
              <div className="lg:block flex-grow">
                <div className="sticky top-24">{renderSidebar()}</div>
              </div>

            </>
          </main>
        </>
        :
        <div className="w-full p-5">
          <div className='flex flex-col justify-center items-center'>{_renderLoading()}</div>
        </div>
      }

    </div>
  );
};

export default ActivityDetailPage;

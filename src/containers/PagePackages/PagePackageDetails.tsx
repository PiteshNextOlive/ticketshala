import React, { FC, Fragment, useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom'
import GuestsInput from "components/HeroSearchForm/PackageGuestsInput";
import DateSingleInput from "./DateSingleInput";
import moment from "moment";
import { Service, Storage } from 'services/Service';
import Config from './../../config.json';
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { amountSeparator, renderAmenities, getCurrency, OpenNotification } from 'components/Helper';
import { Tab } from "@headlessui/react";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import SocialTags from "./SocialTags";
import ModalPhotos from "./ModalPhotos";
import { Input } from 'reactstrap'
import { useForm } from 'react-hook-form'

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const PackageDetailPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const { slug }: any = useParams()
  const history = useHistory()
  const [data, setData]: any = useState(null)

  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [dateDepartureValue, setdateDepartureValue] = useState<moment.Moment | null>(null);
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestInfants: 0 });

  const [dateDepartureFocused, setDateDepartureFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)
  const [packageYears, setPackageYears] = useState([])
  const [packageMonths, setPackageMonths] = useState([])
  const [packageDays, setPackageDays] = useState([])
  const [fixedDates, setFixedDates] = useState([])
  const [shareTitle, setShareTitle] = useState(null)
  const [shareUrl, setShareUrl]: any = useState(null)
  const [departureDate, setDepartureDate] = useState([])
  const [galleries, setGalleries] = useState([])
  const [countAdult, setCountAdult] = useState(2)
  const [countChild, setCountChild] = useState(0)
  const [countInfant, setCountInfant] = useState(0)
  const [travellers, setTravellers] = useState(2)
  const [coordinates, setCoordinates]: any = useState(null)
  const [socialTags, setSocialTags]: any = useState([])

  const [departureCity, setDepartureCity]: any = useState([])

  const getPackageGallery = (id: any) => {
    const params = {
      page: 1,
      limit: 20,
      order: 'desc',
      refId: id
    }
    Service.post({ url: `/data/gallery/packages`, body: JSON.stringify(params) })
      .then(response => {
        if (response.status === 'error') {
          return false
        } else {
          let photos: any = []
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].fileType === 'image') {
              photos.push(`${Config.MEDIA_URL}${response.data[i].filePath}`)
            }
          }

          setGalleries(photos)
        }
      })
  }

  const getLocationData = async (val: any) => { }

  const getPackageData = () => {
    setLoading(true)
    Service.get({ url: `/packages/${slug}` })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          history.push(`/packages`)
          return false
        } else {
          setData(response.data)
          getPackageGallery(response.data.id)
          setPackageYears(response.data.years.split(','))
          setPackageMonths(response.data.months.split(','))
          if (response.data.date && response.data.date !== "") {
            setPackageDays(response.data.date.split(','))
            const years = response.data.years.split(',')
            const months = response.data.months.split(',')
            const days = response.data.date.split(',')

            const formatdate: any = []
            years.map((y: any) => (
              months.map((m: any) => (
                days.map((d: any) => {
                  const mn = moment().month(m).format('M')
                  const aligndate = moment(`${y}-${mn}-${d}`).format('YYYY-MM-DD');
                  if (moment().format('YYYY-MM-DD') < aligndate) {
                    formatdate.push(aligndate)
                  }
                })
              ))
            ))
            setFixedDates(formatdate)
          }
          if (response.data.dCities && response.data.dCities !== "") {
            setDepartureCity(response.data.dCities.split(','))
          }
          setShareTitle(response.data.title)
          setShareUrl(`${Config.SITE_URL}/packages/${slug}`)
          if (response.data.dCountry) {
            getLocationData(response.data.dCountry)
          }

          if (response.data.social_tag && response.data.social_tag !== null) {
            setSocialTags(response.data.social_tag.split(','))
          }
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
      getPackageData()

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

    if (data.expireOn && data.expireOn !== "" && depDate > data.expireOn) {
      OpenNotification('error', 'Date not available!', 'Please select the date within validity date!', '', true)
      return false
    }

    history.push(`/package/proceed/${slug}?${encodeURIComponent(`depDate=${depDate}&depLatitude=${depLatitude}&depLongitude=${depLongitude}&adults=${countAdult}&child=${countChild}&infant=${countInfant}&v=1.0`)}`)

  }

  const renderCities = (cities: any) => {
    if (cities && cities !== null) {
      return cities.replace(/,/g, ', ')
    }
  }

  const renderCategories = (category: any) => {
    if (category && category !== null) {
      const catg = category.split(',');
      return (
        (catg && catg.length > 0) &&
        <>
          {catg.map((item: any, index: any) => (
            <>
              <Badge name={item.replace(/_/g, ' ')} className='mr-1 capitalize' color="blue" />
            </>
          ))}
        </>
      )
    }
  }

  const renderMonths = (months: any) => {
    if (months && months !== null) {
      const month = months.split(',');
      return (
        (month && month.length > 0) &&
        <>
          {month.map((item: any, index: any) => (
            <>
              <Badge name={item} className='mr-1 capitalize pl-3 pr-3' color="green" />
            </>
          ))}
        </>
      )
    }
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap border-none p-0 mb-5 !space-y-6">

        {/* 1 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{data && data.title}</h2>

        {/* 2 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">

          <div className="border border-neutral-300 dark:border-neutral-500 text-neutral-6000 dark:text-neutral-300 rounded-md py-2 px-5"><span className="font-semibold">Code</span>: {data && data.code}</div>
          <span className="mb-5 sm:mb-0 flex flex-row text-neutral-6000 dark:text-neutral-300">
            <i className="las la-calendar-alt text-xl"></i>
            <span className="ml-1">{data && data.days - 1} Nights / {data && data.days} Days</span>
          </span>
          <span className="ml-0 sm:ml-2 flex flex-row text-neutral-6000 dark:text-neutral-300">
            <i className="las la-map-marker-alt text-xl text-info"></i>
            <span> {renderCities(data && data.cities)}</span>
          </span>
          <div className="hidden sm:block pr-2">
            <LikeSaveBtns className="hidden sm:block" shareUrl={shareUrl} shareTitle={shareTitle} />
          </div>
          {(data && data.socialTags && data.socialTags !== "") &&
            <div className="hidden sm:block ml-2 tags ">
              <SocialTags className="hidden sm:block " tags={data.socialTags} />
            </div>
          }
        </div>

        {(data && data.category && data.category !== "") &&
          <div className="mb-2 text-sm">
            {renderCategories(data && data.category)}
          </div>
        }

      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Package information</h2>
        <div className="w-14 border-b hidden sm:block border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data && data.shortDesc.replace(/<\/?[^>]+(>|$)/g, "") }}></div>

        <div className="text-neutral-6000 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data && data.description }}></div>
        <div className="mt-2 mb-2 text-sm">
          Available Months: {data && renderMonths(data.months)}
        </div>

        {(data && data.p_type === "offline" || data && data.p_type === "both") &&
          <div className="mt-2 mb-2 flex flex-row">
            <span className="flex ietms-center justify-center border border-primary-500 bg-primary-50 text-primary-700 px-4 py-2 text-sm rounded-full capitalize"><i className="text-xl las la-info-circle mr-1"></i> Offline {(data.p_type === "both") && '& Online '} Payment</span>
          </div>
        }
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Includes </h2>
        </div>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="flex flex-col gap-6 text-sm text-neutral-700 dark:text-neutral-300" id="includes" dangerouslySetInnerHTML={{ __html: data && data.include }} />

      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Excludes </h2>
        </div>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="flex flex-col gap-6 text-sm text-neutral-700 dark:text-neutral-300" id="excludes" dangerouslySetInnerHTML={{ __html: data && data.exclude }} />
      </div>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Amenities </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            About the property's amenities and services
          </span>
        </div>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="flex flex-wrap gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {data && renderAmenities(data.tags, data.tags.length)}
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
            <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
            {/* 6 */}
            <div className="flex flex-col gap-6 text-sm text-neutral-700 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data.terms }} />
          </div>
        }
      </>
    );
  };

  const renderSection6 = () => {
    return (
      <>
        {(data && data.cPolicy && data.cPolicy !== null) &&
          <div className="listingSection__wrap">
            <div>
              <h2 className="text-2xl font-semibold">Cancellation Policy </h2>
            </div>
            <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
            {/* 6 */}
            <div className="flex flex-col gap-6 text-sm text-neutral-700 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data.cPolicy }} />
          </div>
        }
      </>
    );
  };


  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Detailed Itinerary</h2>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <Tab.Group>
            <Tab.List className="flex">
              {data && data.itineraries.length > 0 && data.itineraries.map((col: any, index: any) => (
                <>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full focus:outline-none ${selected
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-6000 dark:text-neutral-400"
                          }`}
                      >
                        {`Day ${index + 1}`}
                      </button>
                    )}
                  </Tab>
                </>
              ))}
            </Tab.List>

            <div className="w-full border-b border-neutral-200 my-5"></div>
            <Tab.Panels>
              {data && data.itineraries.map((col: any, index: any) => (
                <>
                  <Tab.Panel className="space-y-5">
                    {/* CONTENT */}
                    <div>
                      <h4 className="text-lg font-semibold">{col.title}</h4>
                      <div className="block mt-3 text-neutral-500 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: col.shortDesc }}></div>
                      <div className="block mt-3 text-neutral-500 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: col.description }}></div>
                    </div>
                    <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

                    <NcImage
                      className="rounded-md sm:rounded-xl"
                      src={`${Config.MEDIA_URL}${col.image}`}
                      prevImageHorizontal
                    />

                  </Tab.Panel>
                </>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    );
  };

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

  const renderSidebar = () => {
    return (
      <div className="listingSection__wrap shadow-2xl sm:shadow-xl p-5 mt-4 sm:mt-0">
        {/* PRICE */}
        <div className="flex justify-between items-center">
          <div className='flex flex-col w-full'>
            <div className='flex justify-between items-center'>
              {(data && data.fare && data.fare.discount.amount > 0) ? <span className="text-xl"><div className="flight-lineThroughRed">{data && getCurrency(data.fare.baseFare.currency)} {data && amountSeparator(data.fare.baseFare.amount)}</div></span> : null}
              {(data && data.fare.discount && data.fare.discount.amount > 0) ? <div className="text-sm text-emerald-600">You save <span className='currency-font'>{data && getCurrency(data.fare.discount.currency)}</span> {data && data.fare.discount.amount}</div> : null}
            </div>
            <div className="text-3xl font-semibold">
              <span className='currency-font'>{data && getCurrency(data.fare.totalFare.currency)}</span> {data && amountSeparator(data.fare.totalFare.amount)}
              <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
                /per person <span className="text-xs">(Incl. Tax)</span>
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          {(packageDays && packageDays.length > 0) ?
            <>
              <div className="flex items-center w-full relative px-5 py-5">
                <div className="text-neutral-300 dark:text-neutral-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="nc-icon-field"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <Input
                    type='select'
                    className={`block w-full dark:bg-neutral-900 border-none font-medium rounded-2xl px-2 py-3`}
                    name={`departureDate`}
                    id={`departureDate`}
                    control={control}
                    onChange={(e: any) => setDepartureDate(e.target.value)}
                    innerRef={register({ required: true })}
                    invalid={errors[`departureDate`] && true}
                  >
                    <option value="">Travelling On</option>
                    {fixedDates.map((item: any, index: any) => (
                      <>
                        <option value={item}>{moment(item).format('DD MMM, YYYY')}</option>
                      </>
                    ))}
                  </Input>
                </div>
              </div>
            </>
            :
            <DateSingleInput
              defaultValue={dateDepartureValue}
              onChange={(date: any) => { setDepartureDate(date) }}
              placeHolder='Travelling On'
              defaultFocus={dateDepartureFocused}
              onFocusChange={(focus: boolean) => {
                setDateDepartureFocused(focus);
              }}
              availableMonths={data && data.months}
              availableYears={data && data.years}
            />
          }

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
            <span>Base Fare ({`${travellers} Pax`})</span>
            <div><span className='currency-font'>{data && getCurrency(data.fare.baseFare.currency)}</span> {data && amountSeparator(Math.round(data.fare.baseFare.amount) * travellers)}</div>
          </div>
          {(data && data.fare.tax && data.fare.tax.amount > 0) &&
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span>Fee & Taxes</span>
              <div><span className='currency-font'>{data && getCurrency(data.fare.tax.currency)}</span> {data && amountSeparator(Math.round(data.fare.tax.amount) * travellers)}</div>
            </div>
          }

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Grand Total</span>
            <div><span className='currency-font'>{data && getCurrency(data.fare.totalFare.currency)}</span>{data && amountSeparator(Math.round(data.fare.totalFare.amount) * travellers)}</div>
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary onClick={proceedBooking}>Book Now</ButtonPrimary>
      </div>
    );
  };

  return (
    <div className={`nc-ListingStayDetailPage  py-11  ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
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
            {galleries.filter((_: any, i: any) => i >= 1 && i < 9).map((item: any, index: any) => (
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
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10 package-details">

          <Tab.Group>
            <Tab.List className="flex flex-wrap sm:flex-row justify-center sm:justify-start">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={`flex-shrink-0 block !leading-none font-semibold py-2.5 mb-2 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                      ? "border-b text-secondary-700 border-b-green-900"
                      : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                      } `}
                  >
                    ABOUT PACKAGE
                  </span>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={`flex-shrink-0 block !leading-none font-semibold ml-6 py-2.5 mb-2 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                      ? "border-b text-secondary-700 border-b-green-900"
                      : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                      } `}
                  >
                    ITINERARY
                  </span>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={`flex-shrink-0 block !leading-none font-semibold ml-6 py-2.5 text-sm mb-2 sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
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
                    className={`flex-shrink-0 block !leading-none font-semibold ml-0 sm:ml-6 py-2.5 mb-2 text-sm sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                      ? "border-b text-secondary-700 border-b-green-900"
                      : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                      } `}
                  >
                    EXCLUSION(S)
                  </span>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={`flex-shrink-0 block !leading-none font-semibold ml-6 py-2.5 text-sm mb-2 sm:text-base sm:pr-0 sm:py-3 capitalize cursor-pointer rounded-none focus:outline-none ${selected
                      ? "border-b text-secondary-700 border-b-green-900"
                      : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900"
                      } `}
                  >
                    POLICIES
                  </span>
                )}
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel className="space-y-5">
                {renderSection2()}
                {renderSection4()}
              </Tab.Panel>
              <Tab.Panel className="space-y-5">
                {renderSection8()}
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
      </main>

    </div>
  );
};

export default PackageDetailPage;

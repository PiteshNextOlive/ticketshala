import { Fragment, useState, useEffect, FC } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Heading from "components/Heading/Heading";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import WidgetFilters from "./WidgetFilters";
import CardOne from "./CardOne";
import CardRound from "./CardRound";
import CardMultiCity from "./CardMultiCity";
import CardMobileHead from "./CardMobileHead";
import { Service, Storage } from 'services/Service'
import { getFlightValidate, getFlightSearch } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'
import { getAirportCity, checkInternational, amountSeparator, getCurrency, getDuration, getAirport, getAirline, eventTrack, OpenNotification } from 'components/Helper'
import { Helmet } from "react-helmet";
import FlightModifiedSearchForm from "../../components/HeroSearchForm/FlightModifiedSearchForm";
import { FaFilter, FaLongArrowAltDown, FaLongArrowAltUp, FaSearch } from "react-icons/fa"
import moment from "moment";
import 'react-loading-skeleton/dist/skeleton.css'
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Circles from "components/Circles"
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup, Collapse } from 'reactstrap'
import PhoneInput from 'components/PhoneInput'
import AsyncSelect from 'react-select/async'
import airports from '../../data/jsons/__airports.json'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"

export interface ListingCarMapPageProps {
  className?: string;
}

const ListingCarMapPage: FC<ListingCarMapPageProps> = ({ className = "" }) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const dispatch = useDispatch();
  const history = useHistory();

  const [searching, setSearching] = useState(false);
  const [flightList, setFlightList] = useState([]);
  const [flightData, setFlightData] = useState([]);
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [tripType, setTripType] = useState('one');
  const [currentPage, setCurrentPage] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [classValue, setClassValue]: any = useState('Y');
  const [countAdult, setCountAdult] = useState(1);
  const [countChild, setCountChild] = useState(0);
  const [countInfant, setCountInfant] = useState(0);
  const [booking, setBooking] = useState(false);
  const [country, setCountry] = useState(null);
  const [international, setInternational] = useState('Y')
  const [sorting, setSorting] = useState({ departure: '', arrival: '', duration: '', price: '' })
  const [dateDeparture, setDateDeparture] = useState<moment.Moment | null>(null);
  const [dateArrival, setDateArrival] = useState<moment.Moment | null>(null);
  const [airlineCategory, setAirlineCategory] = useState([])
  const [multiCities, setMultiCities]: any = useState([])
  const [buttonDisable, setButtonDisable] = useState(false)

  const [earliest, setEearliest]: any = useState(null);
  const [fastest, setFastest]: any = useState(null);
  const [cheapest, setCheapest]: any = useState(null);
  const [fastArrival, setFastArrival]: any = useState(null);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isGroupModal, setIsGroupModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);
  const [type, setType]: any = useState('filter');
  const [clicked, setClicked] = useState(false);

  const [departLocation, setDepartLocation]: any = useState(null)
  const [arrivalLocation, setArrivalLocation]: any = useState(null)
  const [leadDepartueDate, setLeadDepartureDate]: any = useState<moment.Moment | null>(null)

  const getSortingData = (item: any) => {

    /********* SORT BY PRICE ***********/
    const sortedPrice = item.sort(function (a: any, b: any) {
      return a.fare.totalFare.amount - b.fare.totalFare.amount
    })
    setCheapest((sortedPrice && sortedPrice.length > 0) ? sortedPrice[0] : null)

    /********* SORT BY DURATION ***********/
    const sortedDuration = item.sort(function (a: any, b: any) {
      return a.options[0].duration - b.options[0].duration
    })
    setFastest((sortedDuration && sortedDuration.length > 0) ? sortedDuration[0] : null)

    /********* SORT BY DEPARTURE  ***********/
    const sortedDeparture = item.sort(function (a: any, b: any) {
      const date1: any = new Date(a.options[0].flightSegment[0].depTime)
      const date2: any = new Date(b.options[0].flightSegment[0].depTime)

      return date1 - date2
    })
    setEearliest((sortedDeparture && sortedDeparture.length > 0) ? sortedDeparture[0] : null)

    /********* SORT BY ARRIVAL  ***********/
    const sortedArrival = item.sort(function (a: any, b: any) {
      const date1: any = new Date(a.options[0].flightSegment[a.options[0].flightSegment.length - 1].arrTime)
      const date2: any = new Date(b.options[0].flightSegment[b.options[0].flightSegment.length - 1].arrTime)

      return date1 - date2
    })
    setFastArrival((sortedArrival && sortedArrival.length > 0) ? sortedArrival[0] : null)
  }

  const handleGroupBooking = () => {
    setIsGroupModal(true)

    const userInfo = Storage.get('auth')

    setTimeout(() => {
      if (userInfo) {
        setValue('contactEmail', userInfo.email)
        setValue('contactMobile', userInfo.phone)
      }
      setDepartLocation({ value: departure, label: `(${departure}) ${getAirportCity(departure)}, ${getAirport(departure)}` })
      setArrivalLocation({ value: arrival, label: `(${arrival}) ${getAirportCity(arrival)}, ${getAirport(arrival)}` })
    }, 1000)
  }

  const getSearchResult = () => {

    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    const depart: any = params.get('origin');
    const arrive: any = params.get('destination');
    const trip: any = params.get('tripType');
    const adults: any = params.get('adults');
    const child: any = params.get('child');
    const infants: any = params.get('infant');
    const departD: any = params.get('departDate');
    const returnD: any = params.get('returnDate');
    const cabin: any = params.get('cabinClass');
    const country: any = params.get('country');
    const multicity: any = params.get('multicity');

    if (trip) setTripType(trip)
    if (depart) setDeparture(depart)
    if (arrive) setArrival(arrive)
    if (country) setCountry(country)
    if (cabin) setClassValue(cabin)

    if (depart && arrive && depart !== '' && arrive !== '') {
      const intl = checkInternational(depart, arrive);
      if (!intl) {
        setInternational('N')
      } else {
        setInternational('Y')
      }
    }

    const requests: any = {
      from: depart,
      to: arrive,
      fromDate: departD,
      seatQty: [{ type: "ADT", qty: parseInt(adults) }],
      cabin: cabin,
      country: country
    }

    if (returnD && returnD !== '') {
      requests.returnDate = returnD
    }

    if (infants && infants !== "0") {
      requests.seatQty.push({ type: "INF", qty: parseInt(infants) })
    }

    if (child && child !== "0") {
      requests.seatQty.push({ type: "CNN", qty: parseInt(child) })
    }

    if (trip === 'multi') {
      const multiCityData = multicity.split('_')
      requests.multiCity = []
      if (multiCityData && multiCityData.length > 0) {
        for (let i = 0; i < multiCityData.length; i++) {
          const obj = multiCityData[i].split('|')
          requests.multiCity.push({ from: obj[0], to: obj[1], fromDate: obj[2] })
        }
      }
    }

    setSearching(true)

    setTimeout(() => {
      setClicked(true)
    }, 500);

    Service.post({ url: '/flight', body: JSON.stringify(requests) })
      .then((response) => {
        if (response) {
          setSearching(false)
          if (response.data.length > 0) {

            if (trip === 'return') {
              const flights: any = []
              const flightsResult: any = []
              const flightsResultSort: any = []
              for (let i = 0; i < response.data.length; i++) {
                const uniq = response.data[i].options[0].flightSegment[0].airlineCode + response.data[i].options[0].flightSegment[response.data[i].options[0].flightSegment.length - 1].airlineCode + parseInt(response.data[i].options[0].duration) + parseInt(response.data[i].options[0].flightSegment.length) + response.data[i].options[1].flightSegment[0].airlineCode + response.data[i].options[1].flightSegment[response.data[i].options[1].flightSegment.length - 1].airlineCode + parseInt(response.data[i].options[1].duration) + parseInt(response.data[i].options[1].flightSegment.length) + moment(response.data[i].options[0].flightSegment[0].depTime).valueOf() + moment(response.data[i].options[0].flightSegment[response.data[i].options[0].flightSegment.length - 1].arrTime).valueOf()

                if (flights.indexOf(uniq) === -1 || response.data[i].airportChange === true) {
                  flightsResult.push(response.data[i])
                  flightsResultSort.push(response.data[i])
                  flights.push(uniq)
                }
              }
              setFlightData(flightsResult)
              setFlightList(flightsResult)
              getSortingData(flightsResultSort)
            } else {

              const flights: any = []
              const flightsResult: any = []
              const flightsResultSort: any = []
              for (let i = 0; i < response.data.length; i++) {
                const uniq = response.data[i].options[0].flightSegment[0].airlineCode + response.data[i].options[0].flightSegment[response.data[i].options[0].flightSegment.length - 1].airlineCode + parseInt(response.data[i].options[0].duration) + parseInt(response.data[i].options[0].flightSegment.length) + moment(response.data[i].options[0].flightSegment[0].depTime).valueOf() + moment(response.data[i].options[0].flightSegment[response.data[i].options[0].flightSegment.length - 1].arrTime).valueOf()

                if (flights.indexOf(uniq) === -1 || response.data[i].airportChange === true) {
                  flightsResult.push(response.data[i])
                  flightsResultSort.push(response.data[i])
                  flights.push(uniq)
                }
              }
              setFlightData(flightsResult)
              setFlightList(flightsResult)
              getSortingData(flightsResultSort)
            }

          } else {
            setFlightData([])
            setFlightList([])
          }
          setTimeout(() => {
            setClicked(false)
          }, 5000);
        }

      })
  }

  useEffect(() => {
    getSearchResult()
  }, [])

  useEffect(() => {

    // AIRLINES
    const grouped: any = flightList.map((item: any) => item.options[0].flightSegment[0].airlineCode).filter((value: any, index: any, self: any) => self.indexOf(value) === index)

    if (grouped) {
      setAirlineCategory(grouped)
    }
  }, [flightList])

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    const depart: any = params.get('origin');
    const arrive: any = params.get('destination');
    const trip: any = params.get('tripType');
    const adults: any = params.get('adults');
    const child: any = params.get('child');
    const infants: any = params.get('infant');
    const departD: any = params.get('departDate');
    const returnD: any = params.get('returnDate');
    const cabin: any = params.get('cabinClass');
    const country: any = params.get('country');
    const multicity: any = params.get('multicity');

    if (depart) setDeparture(depart)
    if (arrive) setArrival(arrive)
    if (trip) setTripType(trip)
    if (cabin) setClassValue(cabin)
    if (adults) setCountAdult(adults)
    if (child) setCountChild(child)
    if (infants) setCountInfant(infants)
    if (country) setCountry(country)
    if (departD) setDateDeparture(departD)
    if (returnD) setDateArrival(returnD)

    if (trip === 'multi') {
      const multiCityData = multicity.split('_')
      const multi = []
      if (multiCityData && multiCityData.length > 0) {
        for (let i = 0; i < multiCityData.length; i++) {
          const obj = multiCityData[i].split('|')
          multi.push({ from: obj[0], to: obj[1], fromDate: obj[2] })
        }
        setMultiCities(multi)
      }
    }

  }, [window.location.search])

  // RE-VALIDATE API
  const onSubmitBooking = (item: any) => {

    const depature = item.options[0].flightSegment[0].depature
    const arrival = item.options[0].flightSegment[item.options[0].flightSegment.length - 1].arrival

    const params: any = {
      from: depature,
      to: arrival,
      startDepature: item.options[0].flightSegment[0].depTime,
      seatQty: [{ type: "ADT", qty: Number(countAdult) }],
      country: country
    }

    if (countChild > 0) {
      params.seatQty.push({ type: "CNN", qty: Number(countChild) })
    }

    if (countInfant > 0) {
      params.seatQty.push({ type: "INF", qty: Number(countInfant) })
    }

    if (item && item.code && item.code !== '') {
      params.code = item.code
    }

    // START SEGMENTS
    const starts: any = []
    for (let i = 0; i < item.options[0].flightSegment.length; i++) {
      const temp = {
        departure: item.options[0].flightSegment[i].depTime,
        arrival: item.options[0].flightSegment[i].arrTime,
        from: item.options[0].flightSegment[i].depature,
        to: item.options[0].flightSegment[i].arrival,
        airline: item.options[0].flightSegment[i].airlineCode,
        mAirline: item.options[0].flightSegment[i].marketingAirline,
        desigCode: item.options[0].flightSegment[i].desigCode,
        flightNo: parseInt(item.options[0].flightSegment[i].flightNo)
      }
      starts.push(temp)
    }
    params['start'] = starts
    /******************/

    // RETURN SEGMENTS
    if (tripType === 'return' && item.options.length > 0) {
      const returns: any = []
      for (let i = 0; i < item.options[1].flightSegment.length; i++) {
        const temp = {
          departure: item.options[1].flightSegment[i].depTime,
          arrival: item.options[1].flightSegment[i].arrTime,
          from: item.options[1].flightSegment[i].depature,
          to: item.options[1].flightSegment[i].arrival,
          airline: item.options[1].flightSegment[i].airlineCode,
          mAirline: item.options[1].flightSegment[i].marketingAirline,
          desigCode: item.options[1].flightSegment[i].desigCode,
          flightNo: parseInt(item.options[1].flightSegment[i].flightNo)
        }
        returns.push(temp)
      }
      params['returnDepature'] = item.options[1].flightSegment[0].depTime
      params['return'] = returns
      /******************/
    }

    setBooking(true)
    dispatch(getFlightValidate(params))

    history.push(`/flight/review?${encodeURIComponent(`origin=${departure}&destination=${arrival}&intl=${international}&cabin=${classValue}&carrier=${item.ValidatingCarrier}`)}`)
  }

  const renderCard = (item: any) => {
    return <CardOne key={item.id} cabin={classValue} col={item} onSubmit={(data) => onSubmitBooking(data)} />;
  };

  const renderRoundCard = (item: any) => {
    return <CardRound key={item.id} cabin={classValue} col={item} onSubmit={(data) => onSubmitBooking(data)} />;
  };

  const renderMultiCard = (item: any) => {
    return <CardMultiCity key={item.id} cabin={classValue} col={item} onSubmit={(data) => onSubmitBooking(data)} />;
  };

  const handleLoadMore = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
      setLoadingMore(true)
      setTimeout(() => {
        const page = currentPage + 10;
        setCurrentPage(page)
        console.log(page)
        setLoadingMore(false)
      }, 800)
    }
  }

  const handleSorting = (type: any) => {
    const sort: any = { ...sorting }
    sort["departure"] = ''
    sort["arrival"] = ''
    sort["duration"] = ''
    sort["price"] = ''
    sort[type] = 'asc'
    setSorting(sort)

    /********* SORT BY PRICE ***********/
    if (type === 'price') {
      const sortedPrice = flightData.sort(function (a: any, b: any) {
        return (sort[type] === 'asc') ? a.fare.totalFare.amount - b.fare.totalFare.amount : b.fare.totalFare.amount - a.fare.totalFare.amount
      })
      setFlightData(sortedPrice)
    }

    /********* SORT BY DURATION ***********/
    else if (type === 'duration') {
      const sortedDuration = flightData.sort(function (a: any, b: any) {
        return (sort[type] === 'asc') ? a.options[0].duration - b.options[0].duration : b.options[0].duration - a.options[0].duration
      })
      setFlightData(sortedDuration)
    }

    /********* SORT BY DEPARTURE  ***********/
    else if (type === 'departure') {
      const sortedDeparture = flightData.sort(function (a: any, b: any) {
        const date1: any = new Date(a.options[0].flightSegment[0].depTime)
        const date2: any = new Date(b.options[0].flightSegment[0].depTime)

        return (sort[type] === 'asc') ? date1 - date2 : date2 - date1
      })
      setFlightData(sortedDeparture)
    }

    /********* SORT BY ARRIVAL  ***********/
    else if (type === 'arrival') {
      const sortedArrival = flightData.sort(function (a: any, b: any) {
        const date1: any = new Date(a.options[0].flightSegment[a.options[0].flightSegment.length - 1].arrTime)
        const date2: any = new Date(b.options[0].flightSegment[b.options[0].flightSegment.length - 1].arrTime)

        return (sort[type] === 'asc') ? date1 - date2 : date2 - date1
      })
      setFlightData(sortedArrival)
    }

  }

  const handleCalendar = (data: any) => {
    window.scrollTo(0, 0)

    if (data === 'previous') {
      const previous = moment(dateDeparture).subtract('1', 'd').format('YYYY-MM-DD')
      const returnDate = moment(dateArrival).format('YYYY-MM-DD')
    }
    if (data === 'next') {
      const next_day = moment(dateDeparture).add('1', 'd').format('YYYY-MM-DD')
      const arriv_day = moment(dateArrival).format('YYYY-MM-DD')
    }
  }

  const loadOptions = (inputValue: any, callback: any) => {

    if (inputValue.length > 2) {

      const response = airports.filter(item => item.city.toLowerCase().includes(inputValue.toLowerCase()) || item.iata_code.toLowerCase().includes(inputValue.toLowerCase()) || item.name.toLowerCase().includes(inputValue.toLowerCase()))

      setTimeout(() => {

        if (response.length > 0) {
          const options: any = []
          response.map((item, index) => {
            const temp = {
              value: item.iata_code,
              label: `(${item.iata_code}) ${item.city}, ${item.name}`
            }
            options.push(temp)
          })
          callback(options)
        }

      }, 500)
    }

  }

  const noData = () => {
    return (
      <div className='text-center border border-neutral-200 py-11 px-11 rounded-xl bg-white dark:bg-neutral-900'>
        <h2 className="text-xl font-semibold">No Flights Found!</h2>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>We could not find any flights as per your search criteria.</p>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>Please update your search criteria and do the search again.</p>
      </div>
    )
  }

  const showLoader = () => {
    return (
      <div className='relative mt-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-500 rounded-xl overflow-hidden mb-5'>
        <div id="loading_flight" className="loading-results-globe-wrapper">
          <div className="loading-results-globe ski-svg-responsive ski-svg-globe-geometry-loadingpage">
            <span className="origin"><small>Flying From</small>
              <div className="clear"></div>
              <strong>
                <span className="flying_from py-2">{getAirportCity(departure)}</span>
                <div className="clear"></div>
              </strong>
              <small className="text-md text-neutral-500 dark:text-neutral-400">{moment(dateDeparture).format('ll')}</small>
            </span>
            <span className="destination-prefix">To Destination</span> <span className="destination flying_to" id="">{(tripType === 'multi') ? getAirportCity(multiCities[multiCities.length - 1]['to']) : getAirportCity(arrival)}</span>
            <div className="loading-results-track">
              <div className={`loading-results-track-progress is-active ${(clicked) ? 'clicked' : ''}`}></div>
              <div className="loading-results-progress is-active"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onSubmitLead = (values: any) => {

    const params = {
      type: "flight",
      startDate: dateDeparture,
      source: departure,
      destination: arrival,
      email: values.contactEmail,
      phone: values.contactMobile,
      info: {
        notes: values.contactNotes,
        preferred_airline: values.preferredAirline
      },
      pax: {
        ADT: values.countAdults,
        INF: values.countChildren,
        CHD: values.countInfants
      }
    }

    setButtonDisable(true)

    Service.post({
      url: '/support/lead',
      body: JSON.stringify(params)
    })
      .then(response => {
        setButtonDisable(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, '', false)
        } else {
          OpenNotification('success', 'Success!', 'Request submitted successfully!', '', true)
          setIsGroupModal(false)
        }
      })

  }

  return (
    <>
      <div className={`nc-ListingCarMapPage relative bg-neutral-100 dark:bg-black dark:bg-opacity-20 ${className}`}
        data-nc-id="ListingCarMapPage"
      >
        <Helmet>
          <title>Flight Search || Best Online Travel Agency in Bangladesh</title>
        </Helmet>

        {/* SECTION */}
        <div className="relative search-container-bg search-engine-desktop hidden sm:block lg:block md:block xl:block search-result pb-4 xl:pl-10 xl:pr-10 xl:max-w-none">
          <div className='p-5 relative z-10'>
            <FlightModifiedSearchForm haveDefaultValue={true} header={false} page='page2' getSearchResult={getSearchResult} />
          </div>
          <Circles />
        </div>

        {(!searching && departure !== null && arrival !== null && flightList && flightList.length > 0) &&
          <div className='bg-white space-y-5 p-3 mb-6 sm:hidden lg:hidden md:hidden xl:hidden border border-t'>
            <CardMobileHead departure={departure} arrival={arrival} cabin={classValue} departD={dateDeparture} setIsOpenModal={setIsOpenModal} setType={setType} />
          </div>
        }

        {/* SECTION */}
        <div className="container pb-24 lg:pb-32 relative">

          <div className={`nc-SectionLatestPosts relative sm:mt-24`}>
            <div className="flex items-start flex-col lg:flex-row">
              <div className="w-full search-filter-desktop hidden sm:block lg:block md:block xl:block space-y-7 mt-24 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-14">
                <WidgetFilters
                  tripType={tripType}
                  searching={searching}
                  flightList={flightList}
                  flightData={flightData}
                  handleFiltered={(data: any) => setFlightData(data)}
                  handleCalendar={handleCalendar}
                  setIsOpenModal={setIsOpenModal}
                />
              </div>

              {(searching === true) &&
                <div className="w-full lg:w-4/5 xl:w-3/3">
                  {showLoader()}
                </div>
              }

              {(!searching && departure !== null && arrival !== null && flightList && flightList.length > 0) &&
                <>
                  <div className="w-full lg:w-4/5 xl:w-3/3">
                    <div className='flex items-center justify-between'>
                      <Heading desc="" className='hidden sm:block lg:block md:block xl:block'>{`Flights from ${getAirportCity(departure)} to ${(tripType === 'multi') ? getAirportCity(multiCities[multiCities.length - 1]['to']) : getAirportCity(arrival)}`}</Heading>
                      <div className='flex items-center text-primary-700 dark:text-primary-500 cursor-pointer' onClick={() => handleGroupBooking()}>
                        <i className="text-xl las la-users mr-1"></i> <span className='underline'>Group Booking?</span>
                      </div>
                    </div>

                    {(flightData && flightData.length > 0) ?
                      <>
                        <div className='hidden sm:block lg:block md:block xl:block'>
                          <h5 className='text-md mt-11 text-neutral-500 font-semibold'></h5>
                          <div className="flex flex-col sm:flex-row mb-10 mt-4 flex-sorting">
                           
                            <div className={`flex flex-1 items-center justify-center bg-white dark:bg-neutral-900 cursor-pointer border border-neutral-200 dark:border-neutral-800 p-3`} onClick={() => handleSorting('price')}>
                              <div className={`flex items-start justify-center py-3 ${(sorting && sorting.price !== '') ? 'sorted' : ''}`}>
                                <div className='flex flex-col items-start justify-center text-sm'>
                                  <span className='capitalize text-xs font-semibold'>CHEAPEST</span>
                                  <div className='sorting-sub-text text-neutral-500'>Show the cheapest flights in ascending order </div>
                                </div>
                              </div>
                            </div>
                            <div className={`flex flex-1 items-center justify-center bg-white dark:bg-neutral-900 cursor-pointer border border-neutral-200 dark:border-neutral-800 p-3`} onClick={() => handleSorting('duration')}>
                              <div className={`flex items-start justify-center py-3 ${(sorting && sorting.duration !== '') ? 'sorted' : ''}`}>
                                <div className='flex flex-col items-start justify-center text-sm'>
                                  <span className='capitalize text-xs font-semibold'>FASTEST</span>
                                  <div className='flex sorting-sub-text text-neutral-500'>Show the fastest flights in ascending order </div>
                                </div>
                              </div>
                            </div>
                            <div className={`flex flex-1 items-center justify-center bg-white dark:bg-neutral-900 cursor-pointer border border-neutral-200 dark:border-neutral-800 p-3`} onClick={() => handleSorting('arrival')}>
                              <div className={`flex items-start justify-center py-3 ${(sorting && sorting.arrival !== '') ? 'sorted' : ''}`}>
                                <div className='flex flex-col items-start justify-center text-sm'>
                                  <span className='capitalize text-xs font-semibold'>EARLIEST</span>
                                  <div className='flex sorting-sub-text text-neutral-500'>Show the earliest flights in ascending order </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/******* MOBILE ***********/}
                        <div className='sm:hidden lg:hidden md:hidden xl:hidden'>
                          <div className="flex flex-row items-center justify-between mb-4">
                            <div className='flex flex-1 items-center justify-center cursor-pointer p-3' onClick={() => handleSorting('duration')}>
                              <div className='flex flex-col items-center justify-center'>
                                <span className='capitalize text-xs font-semibold'>FASTEST</span>
                              </div>
                              {(sorting && sorting.duration === 'asc') && <FaLongArrowAltDown size='14' />} {(sorting && sorting.duration === 'desc') && <FaLongArrowAltUp size='14' />}
                            </div>
                            <div className='flex flex-1 items-center justify-center cursor-pointer p-3' onClick={() => handleSorting('price')}>
                              <div className='flex flex-col items-center justify-center'>
                                <span className='capitalize text-xs font-semibold'>CHEAPEST</span>
                              </div>
                              {(sorting && sorting.price === 'asc') && <FaLongArrowAltDown size='14' />} {(sorting && sorting.price === 'desc') && <FaLongArrowAltUp size='14' />}
                            </div>
                          </div>
                        </div>
                        {/*****************/}

                        <div className={`grid gap-6 md:gap-8 grid-cols-1`}>
                          {(tripType === 'return' && flightData && flightData.length > 0) &&
                            <>
                              {flightData.slice(0, currentPage).map((item) => renderRoundCard(item))}
                            </>
                          }

                          {(tripType === 'multi' && flightData && flightData.length > 0) &&
                            <>
                              {flightData.slice(0, currentPage).map((item) => renderMultiCard(item))}
                            </>
                          }

                          {(tripType === 'one' && flightData && flightData.length > 0) &&
                            <>
                              {flightData.slice(0, currentPage).map((item: any) => (item.ValidatingCarrier !== "") && renderCard(item))}
                            </>
                          }
                        </div>
                      </>
                      : <div className='mt-11'>{noData()}</div>}

                    {(flightData && flightData.length > 0 && (flightData.length - currentPage > 0)) &&
                      <>
                        <div className="flex flex-col mt-12 md:mt-12 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row mx-auto sm:items-center">
                          <ButtonPrimary className='mx-auto' disabled={loadingMore} loading={loadingMore} onClick={handleLoadMore}>Show more flights</ButtonPrimary>
                        </div>
                      </>
                    }
                  </div>
                </>
              }

              {(!searching && flightList && flightList.length === 0) &&
                <div className="w-full lg:w-4/5 xl:w-3/3">
                  {noData()}
                </div>
              }
            </div>

          </div>
        </div>
      </div>

      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div"
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
              <div className="inline-block py-8 w-full">
                <div className="inline-flex flex-col w-full max-w-xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 text-left">
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={handleCloseModal} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {(type === 'search') ?
                      <>
                        <div className="search-container-bg search-result pb-8 lg:pb-8 pt-4 xl:pl-10 xl:pr-10 xl:max-w-none">
                          <div className='p-5'>
                            <FlightModifiedSearchForm haveDefaultValue={true} header={false} page='page2' setIsOpenModal={setIsOpenModal} getSearchResult={getSearchResult} />
                          </div>
                        </div>
                      </>
                      :
                      <>
                        <div className="w-full sm-view space-y-7 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-14">
                          <WidgetFilters
                            tripType={tripType}
                            searching={searching}
                            flightList={flightList}
                            flightData={flightData}
                            handleFiltered={(data: any) => setFlightData(data)}
                            handleCalendar={handleCalendar}
                            setIsOpenModal={setIsOpenModal}
                          />
                        </div>
                      </>
                    }
                  </div>

                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isGroupModal} as={Fragment}>
        <Dialog as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => <></>}
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
              <div className="inline-block py-8 w-full">
                <div className="inline-flex flex-col w-full max-w-5xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 text-left">
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={() => setIsGroupModal(false)} />
                    </span>
                  </div>

                  <div className="listingSection__wrap p-5 py-11 flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    <Form onSubmit={handleSubmit(onSubmitLead)}>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 mt-11">
                        <FormGroup>
                          <Label className='block mb-1' for="leadOrigin">Origin<span className="astrick">*</span></Label>
                          <AsyncSelect
                            isClearable={true}
                            className='react-select custom-react-select'
                            classNamePrefix='select'
                            name='callback-react-select leadOrigin'
                            loadOptions={loadOptions}
                            defaultOptions
                            value={departLocation}
                            onChange={(data) => {
                              setDepartLocation(data !== null ? data : null)
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="leadDestination">Destination<span className="astrick">*</span></Label>
                          <AsyncSelect
                            isClearable={true}
                            className='react-select custom-react-select'
                            classNamePrefix='select'
                            name='callback-react-select leadDestination'
                            loadOptions={loadOptions}
                            defaultOptions
                            value={arrivalLocation}
                            onChange={(data) => {
                              setArrivalLocation(data !== null ? data : null)
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="leadDepartueDate">Departure Date<span className="astrick">*</span></Label>
                          <Flatpickr
                            className='form-control custom-platpickr'
                            placeholder='Departure Date'
                            name="leadDepartueDate"
                            options={{
                              minDate: moment().format('YYYY-MM-DD'),
                              disableMobile: true,
                              defaultDate: moment(dateDeparture).format('YYYY-MM-DD'),
                              onChange: function (date) {
                                setLeadDepartureDate(date)
                              }
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="countAdults">No Of Adults<span className="astrick">*</span></Label>
                          <Input id={`countAdults`} name={`countAdults`}
                            type="number"
                            className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                            placeholder='No Of Adults'
                            min={1}
                            innerRef={register({ required: true })}
                            invalid={errors[`countAdults`] && true}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="countChildren">No Of Children</Label>
                          <Input id={`countChildren`} name={`countChildren`}
                            type="number"
                            min={0}
                            className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                            placeholder='No Of Children'
                            innerRef={register({ required: false })}
                            invalid={errors[`countChildren`] && true}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="countAdults">No Of Infants</Label>
                          <Input id={`countInfants`} name={`countInfants`}
                            type="number"
                            min={0}
                            className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                            placeholder='No Of Infants'
                            innerRef={register({ required: false })}
                            invalid={errors[`countInfants`] && true}
                          />
                        </FormGroup>

                        <FormGroup className='col-span-3'>
                          <Label className='block mb-1' for="contactNotes">Notes</Label>
                          <Input id={`contactNotes`} name={`contactNotes`}
                            type="textarea"
                            rows={5}
                            className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                            placeholder='Write Your Notes Here'
                            innerRef={register({ required: false })}
                            invalid={errors[`contactNotes`] && true}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="preferredAirline">Preferred Airline</Label>
                          <Input
                            type='select'
                            id={`preferredAirline`} name={`preferredAirline`}
                            className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                            placeholder='Name'
                            innerRef={register({ required: false })}
                            invalid={errors[`preferredAirline`] && true}
                          >
                            <option value="">Select Airline</option>
                            {airlineCategory.map((item: any, index: any) => (
                              <>
                                <option key={`airline${index}`} value={item}>{`${item} (${getAirline(item)})`}</option>
                              </>
                            ))}
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label className='block mb-1' for="contactEmail">Email<span className="astrick">*</span></Label>
                          <Input id={`contactEmail`} name={`contactEmail`}
                            className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                            placeholder='Email'
                            innerRef={register({ required: true })}
                            invalid={errors[`contactEmail`] && true}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for='contactMobile'>Mobile Number</Label>
                          <Controller
                            control={control}
                            id={`contactMobile`}
                            name={`contactMobile`}
                            innerRef={register({ required: false })}
                            invalid={errors[`contactMobile`] && true}
                            rules={{ required: false }}
                            defaultValue={false}
                            render={({ onChange, value, name }) => (
                              <PhoneInput value={value} name={name} onChange={onChange} />
                            )}
                          />
                        </FormGroup>
                      </div>
                      {/* SUBMIT */}
                      <div className="relative mt-3 md:mt-3 space-y-5 sm:space-y-0 sm:space-x-3">
                        <ButtonPrimary className='bg-secondary-900' disabled={buttonDisable} loading={buttonDisable}>Send Request</ButtonPrimary>
                      </div>
                    </Form>
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

export default ListingCarMapPage;

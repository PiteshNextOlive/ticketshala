import { Fragment, useState, useEffect, FC } from 'react'
import Heading from "components/Heading/Heading";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import WidgetFilters from "./WidgetFilters";
import CardOne from "./CardOne";
import CardRound from "./CardRound";
import { Service } from 'services/Service'
import { getAirportCity } from 'components/Helper'
import Config from './../../config.json'

const SectionFlightResults = () => {

  const [searching, setSearching] = useState(false)
  const [flightData, setFlightData] = useState([])
  const [departure, setDeparture] = useState(null)
  const [arrival, setArrival] = useState(null)
  const [tripType, setTripType] = useState('one')
  const [currentPage, setCurrentPage] = useState(10)
  const [loadingMore, setLoadingMore] = useState(false)
  const [classValue, setClassValue]: any = useState('Y');

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

    if (depart) setDeparture(depart)
    if (arrive) setArrival(arrive)
    if (trip) setTripType(trip)
    if (cabin) setClassValue(cabin)

    const requests = {
      from: depart,
      to: arrive,
      fromDate: departD,
      seatQty: [{ type: "ADT", qty: parseInt(adults) }],
      cabin: params.get('cabinClass'),
      country: params.get('country'),
      returnDate: returnD
    }

    if (infants && infants !== "0") {
      requests.seatQty.push({ type: "INF", qty: parseInt(infants) })
    }

    if (child && child !== "0") {
      requests.seatQty.push({ type: "CNN", qty: parseInt(child) })
    }

    setSearching(true)

    Service.post({ url: '/flight', body: JSON.stringify(requests) })
      .then((response) => {
        if (response) {
          setSearching(false)
          if (response.data.length > 0) {
            setFlightData(response.data)
          }
        }
      })
  }

  useEffect(() => {
    getSearchResult()
  }, [])

  const renderCard = (item: any) => {
    return <CardOne key={item.id} className="" cabin={classValue} col={item} />;
  };

  const renderRoundCard = (item: any) => {
    return <CardRound key={item.id} className="" cabin={classValue} col={item} />;
  };

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      const page = currentPage + 10;
      setCurrentPage(page)
      setLoadingMore(false)
    }, 2000)
  }

  return (
    <div className={`nc-SectionLatestPosts relative mt-24`}>
      <div className="flex items-start flex-col lg:flex-row">

        {(searching === true) &&
          <div className='flex-1 text-center'>
            <div className='block'>
              <img src={`${Config.SITE_URL}/loader.gif`} style={{ margin: 'auto' }} width='250' />
            </div>
            <span className='block mt-2 ml-50'>Hold on, We are fetching flight for you...</span>
          </div>
        }


        {(!searching && departure !== null && arrival !== null) &&
          <>
            <div className="w-full space-y-7 mt-24 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-14">
              <WidgetFilters />
            </div>
            <div className="w-full lg:w-4/5 xl:w-3/3">
              <Heading desc="">{`Flights from ${getAirportCity(departure)} to ${getAirportCity(arrival)}`}</Heading>
              <div className="flex mb-10">
                <div className='flex-1 text-center border border-neutral-200 p-3 rounded-l-full'>DEPARTURE</div>
                <div className='flex-1 text-center border border-neutral-200 p-3'>DURATION</div>
                <div className='flex-1 text-center border border-neutral-200 p-3'>ARRIVAL</div>
                <div className='flex-1 text-center border border-neutral-200 p-3 rounded-r-full'>PRICE</div>
              </div>
              <div className={`grid gap-6 md:gap-8 grid-cols-1`}>
                {(tripType === 'return' && flightData && flightData.length > 0) &&
                  <>
                    {flightData.slice(0, currentPage).map((item) => renderRoundCard(item))}
                  </>
                }

                {(tripType === 'one' && flightData && flightData.length > 0) &&
                  <>
                    {flightData.slice(0, currentPage).map((item) => renderCard(item))}
                  </>
                }

              </div>

              {(flightData && flightData.length > 0 && (flightData.length - currentPage > 0)) &&
              <>
                <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <ButtonPrimary disabled={loadingMore} loading={loadingMore} onClick={handleLoadMore}>Show me more</ButtonPrimary>
                </div>
              </>
              }

            </div>
            
          </>
        }

        {(!searching && flightData && flightData.length === 0) &&
          <p className='w-full m-auto text-muted mt-4 text-center'>No flights found on this route for the requested date!</p>
        }
      </div>
    </div>
  );
};

export default SectionFlightResults;

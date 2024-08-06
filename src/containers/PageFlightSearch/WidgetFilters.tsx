import { Fragment, useState, useEffect, FC } from 'react'
import WidgetHeading1 from "./WidgetHeading1";
import Checkbox from "shared/Checkbox/Checkbox";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getAirline } from 'components/Helper'
import { amountSeparator, getCurrency } from 'components/Helper'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const percentFormatter = (v: any) => {
  return (
    <>
      <span className='currency-font'>{getCurrency('BDT')}</span>{amountSeparator(v)}
    </>
  )
}

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const WidgetTags = ({ tripType, searching, flightList, flightData, handleFiltered, handleCalendar, setIsOpenModal }: any) => {

  const [airlineCategory, setAirlineCategory] = useState([])
  const [onwardDeparture, setOnwardDeparture] = useState([false, false, false, false])
  const [onwardArrival, setOnwardArrival] = useState([false, false, false, false])
  const [returnDeparture, setReturnDeparture] = useState([false, false, false, false])
  const [returnArrival, setReturnArrival] = useState([false, false, false, false])

  const [pricing, setPricing] = useState([])
  const [priceDetails, setPriceDetails] = useState([0, 0])

  // FILTERS
  const [airlineFilter, setAirlineFilter]: any = useState([])
  const [stopsFilter, setStopsFilter]: any = useState([])
  const [returnStopsFilter, setReturnStopsFilter]: any = useState([])
  const [refundFilter, setRefundFilter]: any = useState([])
  const [minAirFare, setMinAirFare]: any = useState([])

  useEffect(() => {
    if (!searching) {

      if (flightList.length > 0) {

        // PRICE
        const min = Math.min(...flightList.map((item: any) => item.fare.totalFare.amount))
        const max = Math.max(...flightList.map((item: any) => item.fare.totalFare.amount))
        const price: any = []
        price[0] = (min === max) ? 0 : min
        price[1] = max

        setPricing(price)
        setPriceDetails(price)

        // AIRLINES
        const grouped = flightList.map((item: any) => item.options[0].flightSegment[0].airlineCode).filter((value: any, index: any, self: any) => self.indexOf(value) === index)
        if (grouped) {
          setAirlineCategory(grouped)

          const minFare = flightData.map((item: any) => {
            if (grouped.includes(item.options[0].flightSegment[0].airlineCode)) {
              return {
                airline: item.options[0].flightSegment[0].airlineCode,
                amount: item.fare.totalFare.amount
              }
            }
          })
          setMinAirFare(minFare)
        }
      }

    }

  }, [flightList])

  const checkArray = (val: any) => val.every((v: any) => v === false)

  // FILTERS
  const handleFilter = async (type: any, departure: any, arrival: any, stops: any, price: any, airline: any, refund: any) => {

    const onwardDepartureItems = [...onwardDeparture]
    const onwarArrivalItems = [...onwardArrival]
    const returnDepartureItems = [...returnDeparture]
    const returnArrivalItems = [...returnArrival]
    const onewayStop: any = stopsFilter;
    const returnStops: any = returnStopsFilter;
    const airlineData: any = airlineFilter;
    const refundData: any = refundFilter;

    let fare = priceDetails;

    setIsOpenModal(false)

    if (type === 'return') {

      if (departure !== '') {
        if (departure === 'before11') {
          returnDepartureItems[0] = !returnDepartureItems[0]; setReturnDeparture(returnDepartureItems)
        }
        if (departure === 'bw11-5') {
          returnDepartureItems[1] = !returnDepartureItems[1]; setReturnDeparture(returnDepartureItems)
        }
        if (departure === 'bw5-9') {
          returnDepartureItems[2] = !returnDepartureItems[2]; setReturnDeparture(returnDepartureItems)
        }
        if (departure === 'after9') {
          returnDepartureItems[3] = !returnDepartureItems[3]; setReturnDeparture(returnDepartureItems)
        }
      }

      if (arrival !== '') {

        if (arrival === 'before11') {
          returnArrivalItems[0] = !returnArrivalItems[0]; setReturnArrival(returnArrivalItems)
        }
        if (arrival === 'bw11-5') {
          returnArrivalItems[1] = !returnArrivalItems[1]; setReturnArrival(returnArrivalItems)
        }
        if (arrival === 'bw5-9') {
          returnArrivalItems[2] = !returnArrivalItems[2]; setReturnArrival(returnArrivalItems)
        }
        if (arrival === 'after9') {
          returnArrivalItems[3] = !returnArrivalItems[3]; setReturnArrival(returnArrivalItems)
        }
      }
    } else {

      if (departure !== '') {

        if (departure === 'before11') {
          onwardDepartureItems[0] = !onwardDepartureItems[0]; setOnwardDeparture(onwardDepartureItems)
        }
        if (departure === 'bw11-5') {
          onwardDepartureItems[1] = !onwardDepartureItems[1]; setOnwardDeparture(onwardDepartureItems)
        }
        if (departure === 'bw5-9') {
          onwardDepartureItems[2] = !onwardDepartureItems[2]; setOnwardDeparture(onwardDepartureItems)
        }
        if (departure === 'after9') {
          onwardDepartureItems[3] = !onwardDepartureItems[3]; setOnwardDeparture(onwardDepartureItems)
        }
      }

      if (arrival !== '') {
        if (arrival === 'before11') {
          onwarArrivalItems[0] = !onwarArrivalItems[0]; setOnwardArrival(onwarArrivalItems)
        }
        if (arrival === 'bw11-5') {
          onwarArrivalItems[1] = !onwarArrivalItems[1]; setOnwardArrival(onwarArrivalItems)
        }
        if (arrival === 'bw5-9') {
          onwarArrivalItems[2] = !onwarArrivalItems[2]; setOnwardArrival(onwarArrivalItems)
        }
        if (arrival === 'after9') {
          onwarArrivalItems[3] = !onwarArrivalItems[3]; setOnwardArrival(onwarArrivalItems)
        }
      }
    }

    // MAX CONNECTIONS
    if (stops !== undefined && stops !== '') {
      if (type === 'return') {
        const roundIndex = returnStops.indexOf(parseInt(stops.target.value))
        if (stops.target.checked) {
          returnStops.push(parseInt(stops.target.value))
        } else {
          returnStops.splice(roundIndex, 1)
        }
      } else {
        const index = onewayStop.indexOf(parseInt(stops.target.value))
        if (stops.target.checked) {
          onewayStop.push(parseInt(stops.target.value))
        } else {
          onewayStop.splice(index, 1)
        }
      }
    }
    setStopsFilter([...onewayStop])
    setReturnStopsFilter([...returnStops])

    // REFUNDABLE
    if (refund !== undefined && refund !== '') {
      const refundIndex = refundData.indexOf(parseInt(refund.target.value))
      if (refund.target.checked) {
        refundData.push(parseInt(refund.target.value))
      } else {
        refundData.splice(refundIndex, 1)
      }
    }
    setRefundFilter(refundData)

    // PRICING
    if (price !== undefined && price !== '' && price.length > 0) {
      fare = price
    }
    setPriceDetails(fare)

    // AIRLINES
    if (airline !== undefined && airline !== '') {
      const airlineIndex = airlineData.indexOf(airline.target.value);
      if (airline.target.checked) {
        airlineData.push(airline.target.value)
      } else {
        airlineData.splice(airlineIndex, 1)
      }
    }
    setAirlineFilter([...airlineData])

    // DEPARTURE & ARRIVAL
    const departs = checkArray(onwardDepartureItems)
    const arrives = checkArray(onwarArrivalItems)

    let allData = []

    const filteredData = flightList.filter(function (item: any) {
      const depTime = new Date(item.options[0].flightSegment[0].depTime).getHours()
      const arrTime = new Date(item.options[0].flightSegment[item.options[0].flightSegment.length - 1].arrTime).getHours()

      return (
        ((departs === false && arrives === false) ? ((onwardDepartureItems[0] === true && depTime < 11) ||
          (onwardDepartureItems[1] === true && depTime >= 11 && depTime < 17) ||
          (onwardDepartureItems[2] === true && depTime >= 17 && depTime < 21) ||
          (onwardDepartureItems[3] === true && depTime >= 21)) &&
          ((onwarArrivalItems[0] === true && arrTime < 11) ||
            (onwarArrivalItems[1] === true && arrTime >= 11 && arrTime < 17) ||
            (onwarArrivalItems[2] === true && arrTime >= 17 && arrTime < 21) ||
            (onwarArrivalItems[3] === true && arrTime >= 21)) : (departs === false && arrives === true) ? ((onwardDepartureItems[0] === true && depTime < 11) ||
              (onwardDepartureItems[1] === true && depTime >= 11 && depTime < 17) ||
              (onwardDepartureItems[2] === true && depTime >= 17 && depTime < 21) ||
              (onwardDepartureItems[3] === true && depTime >= 21)) : ((onwarArrivalItems[0] === true && arrTime < 11) ||
                (onwarArrivalItems[1] === true && arrTime >= 11 && arrTime < 17) ||
                (onwarArrivalItems[2] === true && arrTime >= 17 && arrTime < 21) ||
                (onwarArrivalItems[3] === true && arrTime >= 21)))
      )
    })

    if (departs === true && arrives === true) {
      allData = flightList
    } else {
      allData = filteredData
    }

    // RETURN DEPARTURE & ARRIVAL
    const returndeparts = checkArray(returnDepartureItems)
    const returnarrives = checkArray(returnArrivalItems)

    if (type === 'return') {
      const filteredData = await flightList.filter(function (item: any) {
        const depTime = new Date(item.options[1].flightSegment[0].depTime).getHours()
        const arrTime = new Date(item.options[1].flightSegment[item.options[1].flightSegment.length - 1].arrTime).getHours()
        return (
          ((returndeparts === false && returnarrives === false) ? ((returnDepartureItems[0] === true && depTime < 11) ||
            (returnDepartureItems[1] === true && depTime >= 11 && depTime < 17) ||
            (returnDepartureItems[2] === true && depTime >= 17 && depTime < 21) ||
            (returnDepartureItems[3] === true && depTime >= 21)) &&
            ((returnArrivalItems[0] === true && arrTime < 11) ||
              (returnArrivalItems[1] === true && arrTime >= 11 && arrTime < 17) ||
              (returnArrivalItems[2] === true && arrTime >= 17 && arrTime < 21) ||
              (returnArrivalItems[3] === true && arrTime >= 21)) : (returndeparts === false && returnarrives === true) ? ((returnDepartureItems[0] === true && depTime < 11) ||
                (returnDepartureItems[1] === true && depTime >= 11 && depTime < 17) ||
                (returnDepartureItems[2] === true && depTime >= 17 && depTime < 21) ||
                (returnDepartureItems[3] === true && depTime >= 21)) : ((returnArrivalItems[0] === true && arrTime < 11) ||
                  (returnArrivalItems[1] === true && arrTime >= 11 && arrTime < 17) ||
                  (returnArrivalItems[2] === true && arrTime >= 17 && arrTime < 21) ||
                  (returnArrivalItems[3] === true && arrTime >= 21)))
        )
      })

      if (returndeparts === true && returnarrives === true) {
        allData = flightList
      } else {
        allData = filteredData
      }
    }

    // ONWARD MAX CONNECTIONS
    if (onewayStop.length > 0) {
      const filteredData = await allData.filter(function (item: any) {
        if (onewayStop.includes(3)) {
          return item.options[0].flightSegment.length > 2 || onewayStop.includes(item.options[0].flightSegment.length)
        }
        return onewayStop.includes(item.options[0].flightSegment.length)
      })
      allData = filteredData
    }

    // RETURN MAX CONNECTION 
    if (returnStops.length > 0) {
      const filteredData = await allData.filter(function (item: any) {
        if (returnStops.includes(3)) {
          return item.options[1].flightSegment.length > 2 || returnStops.includes(item.options[1].flightSegment.length)
        }
        return returnStops.includes(item.options[1].flightSegment.length)
      })
      allData = filteredData
    }

    // FARE
    if (fare.length > 0) {
      const filteredData = await allData.filter(function (item: any) {
        return Number(item.fare.totalFare.amount) >= Number(Math.floor(fare[0])) && parseInt(item.fare.totalFare.amount) <= Number(Math.floor(fare[1]))
      })
      allData = filteredData
    }

    // AIRLINE
    if (airlineData.length > 0) {
      const filteredData = await allData.filter(function (item: any) {
        return airlineData.includes(item.options[0].flightSegment[0].airlineCode)
      })
      allData = filteredData
    }

    // REFUNDABLE
    if (refundData.length > 0) {
      const filteredData = await allData.filter(function (item: any) {
        return refundData.includes((item.isNonRefundable ? 0 : 1))
      })
      allData = filteredData
    }

    handleFiltered(allData)
  }

  const onSliderChange = (value: any) => {
    handleFilter(tripType, '', '', '', value, '', '')
  }

  const resetFilter = () => {
    setOnwardDeparture([false, false, false, false])
    setOnwardArrival([false, false, false, false])
    setReturnDeparture([false, false, false, false])
    setReturnArrival([false, false, false, false])
    setPriceDetails([pricing[0], pricing[1]])
    setIsOpenModal(false)
    // FILTERS
    setAirlineFilter([])
    setStopsFilter([])
    setReturnStopsFilter([])
    setRefundFilter([])
    handleFiltered(flightList)
  }

  const showMinFare = (airline: any) => {
    if (airline && airlineCategory.length > 0) {
      if (minAirFare.length > 0) {
        const data = minAirFare.filter((obj: any) => obj.airline === airline).map((item: any) => item.amount)
        return amountSeparator(Math.min.apply(null, data))
      } else {
        return null
      }
    } else {
      return null
    }
  }

  return (
    <div
      className={`nc-WidgetTags nc-widgetFilters rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 ${(searching) ? 'gray-widget' : ''}`}
      data-nc-id="WidgetTags"
    >
      <div className={`nc-WidgetHeading1 flex items-center justify-between p-4 xl:p-5 border-b border-neutral-200 dark:border-neutral-700`} data-nc-id="WidgetHeading1">
        <h2 className="flex flex-row items-center text-lg text-neutral-900 dark:text-neutral-100 font-semibold">
          <i className="las la-sliders-h mr-1"></i> Filters
        </h2>
        <span className="flex-shrink-0 reset block text-primary-700 dark:text-primary-500 font-semibold text-sm cursor-pointer" onClick={resetFilter}>
          Reset
        </span>
      </div>

      {/**** AIRLINES ****/}
      <WidgetHeading1
        title="Airlines"
        viewAll={{ label: "", href: "/#" }}
      />
      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5 airline-filter">
          {(searching) ?
            <Skeleton height="20px" count={1} />
            :
            <>
              {airlineCategory.map((brand) => (
                <Checkbox
                  label={getAirline(brand)}
                  subLabel={`${getCurrency('BDT')}${showMinFare(brand)}`}
                  key={brand}
                  name={getAirline(brand)}
                  className='text-sm'
                  value={brand}
                  checked={airlineFilter.indexOf(brand) > -1}
                  onChange={(e: any) => {
                    handleFilter(tripType, '', '', '', '', e, '')
                  }}
                />
              ))}
            </>
          }
        </div>
      </div>

      {/**** REFUNDABLE ****/}
      <WidgetHeading1
        title={`Refundable / Non Refundable`}
        viewAll={{ label: "", href: "/#" }}
      />
      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
          <Checkbox
            label="Refundable"
            name="Refundable"
            className='text-sm'
            value={'1'}
            checked={refundFilter.indexOf(1) > -1}
            onChange={(e: any) => {
              handleFilter('oneway', '', '', '', '', '', e)
            }}
          />
          <Checkbox
            label="Non Refundable"
            name="Non Refundable"
            className='text-sm'
            value={'0'}
            checked={refundFilter.indexOf(0) > -1}
            onChange={(e: any) => {
              handleFilter('oneway', '', '', '', '', '', e)
            }}
          />
        </div>
      </div>

      {/**** STOPS ****/}
      <WidgetHeading1
        title={(tripType === 'return') ? `Onward Max Connections` : `Max Connections`}
        viewAll={{ label: "", href: "/#" }}
      />
      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
          <Checkbox
            label="Non-Stop"
            name="Non-Stop"
            className='text-sm'
            value={'1'}
            checked={stopsFilter.indexOf(1) > -1}
            onChange={(e: any) => {
              handleFilter('oneway', '', '', e, '', '', '')
            }}
          />
          <Checkbox
            label="1 Stop"
            name="1 Stop"
            className='text-sm'
            value={'2'}
            checked={stopsFilter.indexOf(2) > -1}
            onChange={(e: any) => {
              handleFilter('oneway', '', '', e, '', '', '')
            }}
          />
          <Checkbox
            label="2+ Stops"
            name="2+ Stops"
            className='text-sm'
            value={'3'}
            checked={stopsFilter.indexOf(3) > -1}
            onChange={(e: any) => {
              handleFilter('oneway', '', '', e, '', '', '')
            }}
          />
        </div>
      </div>

      {(tripType === 'return') &&
        <>
          <WidgetHeading1
            title={`Return Max Connections`}
            viewAll={{ label: "", href: "/#" }}
          />
          <div className="flow-root">
            <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
              <Checkbox
                label="Non-Stop"
                name="Return-Non-Stop"
                className='text-sm'
                value={'1'}
                checked={returnStopsFilter.indexOf(1) > -1}
                onChange={(e: any) => {
                  handleFilter('return', '', '', e, '', '', '')
                }}
              />
              <Checkbox
                label="1 Stop"
                name="Return 1 Stop"
                className='text-sm'
                value={'2'}
                checked={returnStopsFilter.indexOf(2) > -1}
                onChange={(e: any) => {
                  handleFilter('return', '', '', e, '', '', '')
                }}
              />
              <Checkbox
                label="2+ Stops"
                name="Return 2+ Stops"
                className='text-sm'
                value={'3'}
                checked={returnStopsFilter.indexOf(3) > -1}
                onChange={(e: any) => {
                  handleFilter('return', '', '', e, '', '', '')
                }}
              />
            </div>
          </div>
        </>
      }

      {/**** DEPARTURE ****/}
      <WidgetHeading1
        title={(tripType === 'return') ? `Onward Departure` : `Departure`}
        viewAll={{ label: "", href: "/#" }}
      />
      <div className="flex flex-wrap p-4 xl:p-5">
        <span className={`nc-Tag inline-block bg-white ${(onwardDeparture[0] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', 'before11', '', '', '', '', '') }}
        >
          <i className="las la-sun"></i> Before 11AM
        </span>
        <span className={`nc-Tag inline-block bg-white ${(onwardDeparture[1] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', 'bw11-5', '', '', '', '', '') }}
        >
          <i className="las la-cloud-sun"></i> 11AM - 5PM
        </span>
        <span className={`nc-Tag inline-block bg-white ${(onwardDeparture[2] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', 'bw5-9', '', '', '', '', '') }}
        >
          <i className="las la-cloud-moon"></i> 5PM - 9PM
        </span>
        <span className={`nc-Tag inline-block bg-white ${(onwardDeparture[3] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-3 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', 'after9', '', '', '', '', '') }}
        >
          <i className="las la-moon"></i> After 9PM
        </span>
      </div>

      {/**** ARRIVAL ****/}
      <WidgetHeading1
        title={(tripType === 'return') ? `Onward Arrival` : `Arrival`}
        viewAll={{ label: "", href: "/#" }}
      />
      <div className="flex flex-wrap p-4 xl:p-5">
        <span className={`nc-Tag inline-block bg-white ${(onwardArrival[0] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', '', 'before11', '', '', '', '') }}
        >
          <i className="las la-sun"></i> Before 11AM
        </span>
        <span className={`nc-Tag inline-block bg-white ${(onwardArrival[1] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', '', 'bw11-5', '', '', '', '') }}
        >
          <i className="las la-cloud-sun"></i> 11AM - 5PM
        </span>
        <span className={`nc-Tag inline-block bg-white ${(onwardArrival[2] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', '', 'bw5-9', '', '', '', '') }}
        >
          <i className="las la-cloud-moon"></i> 5PM - 9PM
        </span>
        <span className={`nc-Tag inline-block bg-white ${(onwardArrival[3] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleFilter('oneway', '', 'after9', '', '', '', '') }}
        >
          <i className="las la-moon"></i> After 9PM
        </span>
      </div>

      {(tripType === 'return') &&
        <>
          {/**** RETURN DEPARTURE ****/}
          <WidgetHeading1
            title={'Return Departure'}
            viewAll={{ label: "", href: "/#" }}
          />
          <div className="flex flex-wrap p-4 xl:p-5">
            <span className={`nc-Tag inline-block bg-white ${(returnDeparture[0] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-6 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', 'before11', '', '', '', '', '') }}
            >
              Before 11AM
            </span>
            <span className={`nc-Tag inline-block bg-white ${(returnDeparture[1] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-6 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', 'bw11-5', '', '', '', '', '') }}
            >
              11AM - 5PM
            </span>
            <span className={`nc-Tag inline-block bg-white ${(returnDeparture[2] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-6 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', 'bw5-9', '', '', '', '', '') }}
            >
              5PM - 9PM
            </span>
            <span className={`nc-Tag inline-block bg-white ${(returnDeparture[3] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-6 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', 'after9', '', '', '', '', '') }}
            >
              After 9PM
            </span>
          </div>

          {/**** RETURN ARRIVAL ****/}
          <WidgetHeading1
            title={'Return Arrival'}
            viewAll={{ label: "", href: "/#" }}
          />
          <div className="flex flex-wrap p-4 xl:p-5">
            <span className={`nc-Tag inline-block bg-white ${(returnArrival[0] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', '', 'before11', '', '', '', '') }}
            >
              Before 11AM
            </span>
            <span className={`nc-Tag inline-block bg-white ${(returnArrival[1] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', '', 'bw11-5', '', '', '', '') }}
            >
              11AM - 5PM
            </span>
            <span className={`nc-Tag inline-block bg-white ${(returnArrival[2] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', '', 'bw5-9', '', '', '', '') }}
            >
              5PM - 9PM
            </span>
            <span className={`nc-Tag inline-block bg-white ${(returnArrival[3] === true) ? 'active' : ''} text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-300 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
              data-nc-id="Tag"
              onClick={() => { handleFilter('return', '', 'after9', '', '', '', '') }}
            >
              After 9PM
            </span>
          </div>
        </>
      }

      {/**** NEXT / PREVIOUS DAY ****/}
      <WidgetHeading1
        title={`Previous / Next Day`}
        viewAll={{ label: "", href: "/#" }}
        className='hidden'
      />
      <div className="hidden flex flex-wrap p-4 xl:p-5">
        <span className={`nc-Tag inline-block bg-white text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-100 md:py-2.5 md:px-6 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleCalendar('previous') }}
        >
          Previous Day
        </span>
        <span className={`nc-Tag inline-block bg-white text-sm text-neutral-600 py-2 px-3 rounded-lg cursor-pointer border border-neutral-100 md:py-2.5 md:px-6 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 mr-2 mb-2`}
          data-nc-id="Tag"
          onClick={() => { handleCalendar('next') }}
        >
          Next Day
        </span>
      </div>

      {/**** PRICE ****/}
      <div className={`nc-WidgetHeading1 flex items-center justify-between p-4 xl:p-5 border-b border-neutral-200 dark:border-neutral-700`}
        data-nc-id="WidgetHeading1"
      >
        <h2 className="text-sm text-neutral-900 dark:text-neutral-100 font-semibold flex-grow">
          Price (<span className='currency-font'>{getCurrency('BDT')}</span>{amountSeparator(priceDetails[0])} - <span className='currency-font'>{getCurrency('BDT')}</span>{amountSeparator(priceDetails[1])})
        </h2>
      </div>

      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
          <Range defaultValue={pricing} min={pricing[0]} max={pricing[1]} value={priceDetails} tipFormatter={percentFormatter} onChange={onSliderChange} />
        </div>
      </div>

    </div>
  );
};

export default WidgetTags;

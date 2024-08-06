import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./LocationInput";
import FlightGuestsInput from "./FlightGuestsInput";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import DateSingleInput from "./DateSingleInput";
import ButtonSubmit from "./ButtonSubmit";
import { FC } from "react";
import moment from "moment";
import { OpenNotification, eventTrack } from 'components/Helper'
import { FaExchangeAlt } from "react-icons/fa"
import ButtonPrimary from "shared/Button/ButtonPrimary";

export interface DateRage {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

export interface TimeRage {
  startTime: string;
  endTime: string;
}

export interface FlightSearchFormProps {
  haveDefaultValue?: boolean;
  header?: boolean,
  page?: string;
  getSearchResult: () => void;
}

const FlightSearchForm: FC<FlightSearchFormProps> = ({
  haveDefaultValue,
  header,
  page,
  getSearchResult
}) => {

  // USE STATE
  const [dateRangeValue, setDateRangeValue] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });

  const history = useHistory()

  const [departureValue, setDepartureValue] = useState("DAC");
  const [arrivalValue, setArrivalValue] = useState("BKK");

  const [departureInputValue, setDepartureInputValue] = useState("DAC");
  const [arrivalInputValue, setArrivalInputValue] = useState("BKK");
  const [guestValue, setGuestValue]: any = useState({ guestAdults: 1, guestChildren: 0, guestInfants: 0, cabinClass: 'Y' });
  const [trip, setTrip] = useState("one");
  const [dateDepartureValue, setdateDepartureValue] = useState<moment.Moment | null>(null);
  const [dateReturnValue, setdateReturnValue] = useState<moment.Moment | null>(null);
  const [departureFocused, setDepartureFocused] = useState<boolean>(false);
  const [returnFocused, setReturnFocused] = useState<boolean>(false);
  const [dateDepartureFocused, setDateDepartureFocused] = useState<boolean>(false);
  const [dateReturnFocused, setDateReturnFocused] = useState<boolean>(false);
  const [departureCountry, setDepartureCountry]: any = useState('BD')
  const [arrivalCountry, setArrivalCountry]: any = useState('TH')
  const [multiCities, setMultiCities]: any = useState([]);

  // USER EFFECT
  useEffect(() => {
    if (haveDefaultValue) {
      setDateRangeValue({
        startDate: moment(),
        endDate: moment().add(4, "days"),
      });
    }

    // SEARCH PARAM VALUE
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    if (params) {
      const depart: any = params.get('origin');
      const arrive: any = params.get('destination');
      const trip: any = params.get('tripType');
      const adults: any = params.get('adults');
      const child: any = params.get('child');
      const infants: any = params.get('infant');
      const cabin: any = params.get('cabinClass');
      const fromDate: any = params.get('departDate');
      const returnDate: any = params.get('returnDate');
      const country: any = params.get('country');
   
      if (country) {
        setDepartureCountry(country.split('-')[0])
        setArrivalCountry(country.split('-')[1])
      }

      if (depart) { setDepartureInputValue(depart); setDepartureValue(depart); }
      if (arrive) { setArrivalInputValue(arrive); setArrivalValue(arrive); }
      if (trip) setTrip(trip)
      if (fromDate) setdateDepartureValue(fromDate)
      if (returnDate) setdateReturnValue(returnDate)

      const guests = guestValue;
      if (adults) guests['guestAdults'] = Number(adults);
      if (child) guests['guestChildren'] = Number(child);
      if (infants) guests['guestInfants'] = Number(infants);
      if (cabin) guests['cabinClass'] = cabin;
      setGuestValue(guests)
    }
  }, []);
  //

  const handleGuest = (data: any) => {
    if (data) {
      const guest = guestValue
      guest['guestAdults'] = data.guestAdults;
      guest['guestChildren'] = data.guestChildren;
      guest['guestInfants'] = data.guestInfants;
      guest['cabinClass'] = data.cabinClass;

      setGuestValue(guest)
    }
  }

  const handleSearch = () => {

    if (departureInputValue === "" && arrivalInputValue === "" && dateDepartureValue === null) {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }

    if (departureInputValue === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid departure!', '', true)
      return false
    }

    if (arrivalInputValue === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid destination!', '', true)
      return false
    }

    if (dateDepartureValue === null) {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid departure date!', '', true)
      return false
    }

    if (trip === 'return' && dateReturnValue === null) {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid return date!', '', true)
      return false
    }

    if (departureInputValue === arrivalInputValue) {
      OpenNotification('error', 'Oops!', 'From and To airports/cities cannot be same!', '', true)
      return false
    }

    let multiCityData: any = ''
    let multiCity: any = ''

    multiCities.unshift({
      departure: departureInputValue,
      arrival: arrivalInputValue,
      departDate: moment(dateDepartureValue).format('YYYY-MM-DD')
    })

    if (trip === 'multi') {
      for (let i = 0; i < multiCities.length; i++) {
        multiCityData += `${multiCities[i].departure}`
        multiCityData += `|${multiCities[i].arrival}`
        multiCityData += `|${multiCities[i].departDate}`
        if (i !== multiCities.length - 1) {
          multiCityData += `_`
        }
      }
      multiCity = `&multicity=${multiCityData}`
    }

    if ((Number(guestValue.guestAdults) + Number(guestValue.guestChildren) + Number(guestValue.guestInfants)) > 8) {
      OpenNotification('error', 'Pax Count Exceeded!', "Pax count should't be more than 8!", '', true)
      return false
    }

    const fromDate = moment(dateDepartureValue).format('YYYY-MM-DD')
    const date = `departDate=${fromDate}${(trip === 'return') ? `&returnDate=${moment(dateReturnValue).format('YYYY-MM-DD')}` : ''}`
    const aCounrty = `${departureCountry}-${arrivalCountry}`

    eventTrack('Search', 'Flight', `${departureInputValue} - ${arrivalInputValue}`)

    history.push(`/flights/search?${encodeURIComponent(`origin=${departureInputValue}&destination=${arrivalInputValue}&tripType=${trip}&${date}${multiCity}&cabinClass=${guestValue.cabinClass}&country=${aCounrty}&adults=${guestValue.guestAdults}&child=${guestValue.guestChildren}&infant=${guestValue.guestInfants}&v=1.0`)}`)

    if (page && page === 'page2') {
      getSearchResult()
    }
  }

  const renderRadioBtn = () => {
    return (
      <div className=" py-5 [ nc-hero-field-padding ] flex items-center md:space-y-4 md:space-y-0 sm:flex-row sm:space-x-10 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center">
          <input
            id="same-drop-off"
            name="drop-off-type"
            type="radio"
            className="focus:ring-primary-500 h-4 w-4 text-primary-700 border-neutral-300"
            checked={trip === "one"}
            onChange={(e) => {
              setTrip('one');
              setdateReturnValue(null);
              setMultiCities([])
            }
            }
          />
          <label
            htmlFor="same-drop-off"
            className="ml-2 sm:ml-3 block text-sm font-medium text-gray-700 dark:text-neutral-300"
          >
            ONE WAY
          </label>
        </div>
        <div className="flex items-center px-3">
          <input
            id="different-drop-off"
            name="drop-off-type"
            type="radio"
            className="focus:ring-indigo-500 h-4 w-4 text-primary-700 border-neutral-300"
            checked={trip === "return"}
            onChange={(e) => {
              setTrip('return')
              setdateReturnValue((dateDepartureValue && dateDepartureValue !== null) ? moment(dateDepartureValue).add(7, "days") : null)
              setMultiCities([])
            }
            }
          />
          <label
            htmlFor="different-drop-off"
            className="ml-2 sm:ml-3 block text-sm font-medium text-gray-700 dark:text-neutral-300"
          >
            ROUND TRIP
          </label>
        </div>
        <div className="flex hidden items-center px-3">
          <input
            id="multiple-drop-off"
            name="multiple-off-type"
            type="radio"
            className="focus:ring-indigo-500 h-4 w-4 text-primary-700 border-neutral-300"
            checked={trip === "multi"}
            onChange={(e) => {
              setTrip('multi')
              setMultiCities([{ departure: arrivalInputValue, arrival: "", departureCountry: "", arrivalCountry: "", departDate: "" }])
            }
            }
          />
          <label
            htmlFor="multiple-drop-off"
            className="ml-2 sm:ml-3 block text-sm font-medium text-gray-700 dark:text-neutral-300"
          >
            MULTI CITY
          </label>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="lg:pb-12 pb-8 lg:pt-12 pt-6 sm:pb-8 sm:pt-4 lg:pt-4 lg:pb-8 lg:pb-8">
        <div className="w-full searchForm mt-10 mb-10">
          {(header) &&
            <>
              <h3 className="font-medium text-white text-center text-3xl hidden sm:block md:text-4xl xl:text-4xl leading-[110%]">
                Find a flexible flight for your next trip
              </h3>
            </>
          }

          <form action="javascript:void(0)" className="w-full relative border border-gray-100 mt-8 rounded-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-900">
            {renderRadioBtn()}
            <div className="flex search-container border-b border-gray-100 flex-wrap flex-col-custom divide-x divide-gray-100 md:flex-row md:items-center w-full rounded-none [ nc-divide-field ] ">
              <LocationInput
                defaultValue={departureValue}
                placeHolder='From'
                autoFocus={departureFocused}
                desc='City or Airport'
                onInputDone={(data) => { setDepartureInputValue(data); setReturnFocused(true); }}
                onInputChange={(data: any) => { setDepartureCountry(data) }}
                type={'departure'}
              />
              <span className='exchange hidden'><FaExchangeAlt size='18' /></span>
              <LocationInput
                defaultValue={arrivalValue}
                placeHolder='To'
                desc='City or Airport'
                autoFocus={returnFocused}
                onInputDone={(data) => { setArrivalInputValue(data); setDateDepartureFocused(true); }}
                onInputChange={(data: any) => { setArrivalCountry(data) }}
                type={'arrival'}
              />
              <DateSingleInput
                defaultValue={dateDepartureValue}
                onChange={(date) => { setdateDepartureValue(date); setdateReturnValue(null); }}
                placeHolder='Departure'
                trip='oneway'
                defaultFocus={dateDepartureFocused}
                onFocusChange={(focus: boolean) => {
                  setDateReturnFocused(false);
                }}
                minDate={moment().format('YYYY-MM-DD')}
              />
              {(trip !== 'multi') &&
                <DateSingleInput
                  defaultValue={dateReturnValue}
                  onChange={(date) => { setdateReturnValue(date); ((date !== null) && setTrip('return')) }}
                  defaultFocus={dateReturnFocused}
                  placeHolder='Return'
                  trip='return'
                  onFocusChange={(focus: boolean) => {
                    setDateReturnFocused(focus);
                  }}
                  minDate={(dateDepartureValue !== null) ? moment(dateDepartureValue).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                />
              }
              <FlightGuestsInput
                defaultValue={guestValue}
                onChange={(data: any) => handleGuest(data)}
              />
            </div>

            {(trip === 'multi') &&
              <>
                {multiCities.map((item: any, i: any) => (
                  <div className="flex search-container pb-3 border-b border-gray-100 flex-wrap flex-col-custom divide-x divide-gray-100 flex-col md:flex-row md:items-center w-full rounded-none [ nc-divide-field ] ">
                    <LocationInput
                      defaultValue={item.departure}
                      onInputDone={(data) => { const inp = multiCities; inp[i].departure = data; setMultiCities(inp) }}
                      onInputChange={(data: any) => { const inp = multiCities; inp[i].departureCountry = data; setMultiCities(inp) }}
                      placeHolder='From'
                      type={'departure'}
                      desc='City or Airport'
                    />
                    <LocationInput
                      defaultValue={item.arrival}
                      onInputDone={(data) => { const inp = multiCities; inp[i].arrival = data; setMultiCities(inp) }}
                      onInputChange={(data: any) => { const inp = multiCities; inp[i].arrivalCountry = data; setMultiCities(inp) }}
                      placeHolder='To'
                      type={'arrival'}
                      desc='City or Airport'
                    />
                    <DateSingleInput
                      defaultValue={null}
                      onChange={(date) => { const inp = multiCities; inp[i].departDate = moment(date).format('YYYY-MM-DD'); setMultiCities(inp); setdateReturnValue(null) }}
                      placeHolder='Departure'
                      trip={trip}
                      onFocusChange={(focus: boolean) => {
                        setDateReturnFocused(false);
                      }}
                      minDate={(multiCities && multiCities[i - 1] && multiCities[i - 1].departDate) ? moment(multiCities[i - 1].departDate).format('YYYY-MM-DD') : ((dateDepartureValue) ? moment(dateDepartureValue).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))}
                    />
                    <div className="relative dark:bg-neutral-800 text-center" style={{ flex: "0.59 0 0%" }}>
                      {(multiCities.length - 1 === i) ? <>
                        <ButtonPrimary type='button' className="btn-signin mx-auto btn-add-city" onClick={() => { setMultiCities((state: any) => [...state, { departure: multiCities[multiCities.length - 1]['arrival'], arrival: "", departureCountry: "", arrivalCountry: "", departDate: "" }]) }}><i className="las la-plus mr-1"></i> Add City</ButtonPrimary>
                      </> : <>
                        <ButtonPrimary type='button' className="btn-signin mx-auto btn-add-city" onClick={() => { setMultiCities(multiCities.filter((item: any, k: any) => (k !== i))) }}><i className="las la-times"></i></ButtonPrimary>
                      </>}
                    </div>
                  </div>
                ))}
              </>
            }
            <div className=" flex md:items-center justify-center w-full rounded-full mt-8 lg:mt-16">
              {/* BUTTON SUBMIT OF FORM */}
              <div className='absolute btn-search'>
                <ButtonSubmit onClick={() => handleSearch()} page={page} />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return renderForm();
};

export default FlightSearchForm;

import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./LocationInput";
import FlightGuestsInput from "./FlightGuestsInput";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import { FocusedInputShape } from "react-dates";
import DateSingleInput from "./DateSingleInput";
import ButtonSubmit from "./ButtonSubmit";
import { FC } from "react";
import moment from "moment";
import { OpenNotification, eventTrack } from 'components/Helper'
import { FaExchangeAlt } from "react-icons/fa"

export interface DateRage {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

export interface TimeRage {
  startTime: string;
  endTime: string;
}

export interface RentalCarSearchFormProps {
  haveDefaultValue?: boolean;
  header?: boolean,
  page?: string;
  getSearchResult: () => void;
  setIsOpenModal?: (val: any) => void;
}

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({
  haveDefaultValue,
  header,
  page,
  getSearchResult,
  setIsOpenModal
}) => {
 
  // USE STATE
  const [dateRangeValue, setDateRangeValue] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });

  const history = useHistory()
  
  const [departureValue, setDepartureValue] = useState("");
  const [arrivalValue, setArrivalValue] = useState("");

  const [departureInputValue, setDepartureInputValue] = useState("");
  const [arrivalInputValue, setArrivalInputValue] = useState("");
  const [guestValue, setGuestValue]: any = useState({ guestAdults: 1, guestChildren: 0, guestInfants: 0, cabinClass: 'Y' });
  const [trip, setTrip] = useState("one");
  const [dateDepartureValue, setdateDepartureValue] = useState<moment.Moment | null>(null);
  const [dateReturnValue, setdateReturnValue] = useState<moment.Moment | null>(null);
  const [departureFocused, setDepartureFocused] = useState<boolean>(false);
  const [returnFocused, setReturnFocused] = useState<boolean>(false);
  const [dateDepartureFocused, setDateDepartureFocused] = useState<boolean>(false);
  const [dateReturnFocused, setDateReturnFocused] = useState<boolean>(false);
  const [departureCountry, setDepartureCountry]: any = useState(null)
  const [arrivalCountry, setArrivalCountry]: any = useState(null)
  
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
      setGuestValue(guests);
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
    
    if ((Number(guestValue.guestAdults) + Number(guestValue.guestChildren) + Number(guestValue.guestInfants)) > 8) {
      OpenNotification('error', 'Pax Count Exceeded!', "Pax count should't be more than 8!", '', true)
      return false
    }
    
    const fromDate =  moment(dateDepartureValue).format('YYYY-MM-DD')
    const date = `departDate=${fromDate}${(trip === 'return') ? `&returnDate=${moment(dateReturnValue).format('YYYY-MM-DD')}` : ''}`
    const aCounrty = `${departureCountry}-${arrivalCountry}`

    eventTrack('Search', 'Flight', `${departureInputValue} - ${arrivalInputValue}`)

    history.push(`/flights/search?${encodeURIComponent(`origin=${departureInputValue}&destination=${arrivalInputValue}&tripType=${trip}&${date}&cabinClass=${guestValue.cabinClass}&country=${aCounrty}&adults=${guestValue.guestAdults}&child=${guestValue.guestChildren}&infant=${guestValue.guestInfants}&v=1.0`)}`)
    
    if (setIsOpenModal) {
      setIsOpenModal(false)
    }
    
    if (page && page === 'page2') {
      getSearchResult()
    }
  }

  const renderRadioBtn = () => {
    return (
      <div className=" py-5 [ nc-hero-field-padding ] flex items-center sm:space-y-0 sm:flex-row sm:space-x-10">
        <div className="flex items-center">
          <input
            id="same-drop-off"
            name="drop-off-type"
            type="radio"
            className="focus:ring-primary-500 h-4 w-4 text-primary-500 border-neutral-300"
            checked={trip === "one"}
            onChange={(e) => {
                setTrip('one');
                setdateReturnValue(null);
                console.log(trip, "one")
              }
            }
          />
          <label
            htmlFor="same-drop-off"
            className="ml-2 sm:ml-3 block text-sm font-medium text-neutral-300 dark:text-neutral-300"
          >
            ONE WAY
          </label>
        </div>
        <div className="flex items-center px-4">
          <input
            id="different-drop-off"
            name="drop-off-type"
            type="radio"
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            checked={trip === "return"}
            onChange={(e) => {
              setTrip('return')
              setdateReturnValue((dateDepartureValue && dateDepartureValue !== null) ? moment(dateDepartureValue).add(7, "days") : null)
              console.log(trip === "return")
              }
            }
          />
          <label
            htmlFor="different-drop-off"
            className="ml-2 sm:ml-3 block text-sm font-medium text-neutral-300 dark:text-neutral-300"
          >
            ROUND TRIP
          </label>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
        <div className="w-full searchForm search-container modified">
          
          <form action="javascript:void(0)" className="w-full relative rounded-3xl shadow-xl dark:shadow-2xl">
            {renderRadioBtn()}
            <div className="flex justify-between gap-2 md:gap-2 flex-wrap flex-col-custom md:items-center w-full rounded-none [ nc-divide-field ] ">
              <LocationInput
                defaultValue={departureValue}
                placeHolder='From'
                autoFocus={departureFocused}
                desc='City or Airport'
                onInputDone={(data) => { setDepartureInputValue(data); setReturnFocused(true); }}
                onInputChange={(data: any) => { setDepartureCountry(data) }}
              />
              <span className='exchange hidden'><FaExchangeAlt size='18'/></span>
              <LocationInput
                defaultValue={arrivalValue}
                placeHolder='To'
                desc='City or Airport'
                autoFocus={returnFocused}
                onInputDone={(data) => { setArrivalInputValue(data); setDateDepartureFocused(true); }}
                onInputChange={(data: any) => { setArrivalCountry(data) }}
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
              <FlightGuestsInput
                defaultValue={guestValue}
                onChange={(data: any) => handleGuest(data)}
              />
              {/* BUTTON SUBMIT OF FORM */}
              <div className="flex items-center justify-center">
                <ButtonSubmit onClick={() => handleSearch()} page={page} />
              </div>
            </div>
          </form>
        </div>
    );
  };

  return renderForm();
};

export default RentalCarSearchForm;

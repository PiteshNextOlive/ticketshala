import React, { FC, useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./HotelLocationInput";
import HotelGuestsInput from "./HotelGuestsInput";
import { OpenNotification, eventTrack } from 'components/Helper'
import { FocusedInputShape } from "react-dates";
import StayDatesRangeInput from "components/HeroSearchForm/HotelDatesRangeInput";
import ButtonSubmit from "./ButtonSubmit";
import moment from "moment";
import useWindowSize from "hooks/useWindowResize";

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
  page?: string;
  getHotelList: () => void;
  header?: boolean,
}

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({
  haveDefaultValue,
  header,
  page,
  getHotelList
}) => {
 
  // USE STATE
  const history = useHistory()
  const windowSize = useWindowSize();

  const [departureCity, setDepartureCity] = useState("");
  const [departureCountry, setDepartureCountry]: any = useState("")
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestRooms: 1 });
  const [departureCityName, setDepartureCityName] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateRage>({ startDate: moment().add(14, "days"), endDate: moment().add(15, "days") });
  const [departureFocused, setDepartureFocused] = useState<boolean>(false);
  const [dateFocused, setDateFocused] = useState<FocusedInputShape | null>(null);
  // USE EFFECT
  useEffect(() => {
    
    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params) {
      if(params.get('country') && params.get('country') !== "") {
        setDepartureCountry(params.get('country'))
      }
      if(params.get('city') && params.get('city') !== "") {
        setDepartureCity(params.get('city'))
      }
      if(params.get('cityName') && params.get('cityName') !== "") {
        setDepartureCityName(params.get('cityName'))
      }
      if(params.get('fromDate') && params.get('fromDate') !== "") {
        setSelectedDate((date) => ({ ...date, startDate: moment(params.get('fromDate')) }))
      }
      if(params.get('toDate') && params.get('toDate') !== "") {
        setSelectedDate((date) => ({ ...date, endDate: moment(params.get('toDate')) }))
      }
    }
  }, []);
  //

  const handleSearch = () => {

    if (departureCity === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }

    if (selectedDate.startDate === null) {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid check-in date!', '', true)
      return false
    }
   
    const fromDate =  moment(selectedDate.startDate).format('YYYY-MM-DD')
    const date = `fromDate=${fromDate}&toDate=${moment(selectedDate.endDate).format('YYYY-MM-DD')}`

    eventTrack('Search', 'Hotel', `${departureCityName} - ${departureCountry}`)

    history.push(`/hotels/search?${encodeURIComponent(`city=${departureCity}&cityName=${departureCityName}&country=${departureCountry}&${date}&adults=${guestValue.guestAdults}&child=${guestValue.guestChildren}&rooms=${guestValue.guestRooms}&v=1.0`)}`)
    
    if (page && page === 'page2') {
      getHotelList()
    }
  }

  const handleGuest = (data: any) => {
    if (data) {
      const guest = guestValue
      guest['guestAdults'] = data.guestAdults;
      guest['guestChildren'] = data.guestChildren;
      guest['guestRooms'] = data.guestRooms;
      setGuestValue(guest)
    }
  }

  const handleData = (item: any) => {
    if (item && item !== null) {
      const data = item.split('_')
      if (data && data.length > 0) {
        setDepartureCity(data[0])
        setDepartureCountry(data[1])
        setDepartureCityName(data[2])
      }
    }
  }

  const renderForm = () => {
    return (
      <div className="lg:pb-8 pb-4 lg:pt-8 pt-4">
        <div className="w-full searchForm lg:mt-10 mt-5 lg:mb-14 mb-8">
          {(header) &&
          <>
            <h3 className="font-medium hidden sm:block lg:block md:block xl:block text-white text-center text-3xl md:text-4xl xl:text-4xl leading-[110%]">
              Explore by types of stays
            </h3>
          </>
          }
          <form action="javascript:void(0)" className="w-full relative mt-8 rounded-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-900">
            
            <div className="flex search-container custom-top-radius flex-col border border-gray-100 flex-col divide-x flex-col md:flex-row md:items-center w-full rounded-none [ nc-divide-field ] ">
              <LocationInput
                defaultValue={(departureCity !== "") ? `${departureCountry}_${departureCity}_${departureCityName}`: ""}
                placeHolder='Where To?'
                desc='Locality or City'
                onInputDone={(data) => { handleData(data); setDateFocused("startDate") }}
                autoFocus={departureFocused}
              />
              <StayDatesRangeInput
                wrapClassName="divide-x divide-neutral-200 dark:divide-neutral-700"
                onChange={(date) => setSelectedDate(date)}
                numberOfMonths={2}
                fieldClassName="p-5"
                defaultValue={selectedDate}
                anchorDirection={windowSize.width > 1400 ? "left" : "right"}
                defaultFocus={dateFocused}
                onFocusChange={(focus) => setDateFocused(focus)}
              />
              <HotelGuestsInput
                defaultValue={guestValue}
                onChange={(data) => handleGuest(data)}
              />
            </div>
            <div className=" flex md:items-center justify-center w-full rounded-full mt-12">
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

export default RentalCarSearchForm;

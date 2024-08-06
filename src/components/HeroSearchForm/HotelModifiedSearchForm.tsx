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
  getHotelList: (val: any) => void;
  header?: boolean,
  setIsOpenModal?: (val: any) => void;
  setCurrentPage?: (val: any) => void
}

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({
  haveDefaultValue,
  header,
  page,
  getHotelList,
  setIsOpenModal,
  setCurrentPage
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
    
    if (setIsOpenModal) {
      setIsOpenModal(false)
    }

    if(setCurrentPage) {
      setCurrentPage(1)
    }
    
    if (page && page === 'page2') {
      getHotelList(true)
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
    } else {
      setDepartureCity("")
      setDepartureCountry("")
      setDepartureCityName("")
    }
  }

  const renderForm = () => {
    return (
      <div className="w-full searchForm search-container modified mt-10 mb-10">
        
        <form action="javascript:void(0)" className="w-full relative rounded-3xl shadow-xl dark:shadow-2xl">
          
          <div className="flex justify-between gap-2 md:gap-2 flex-wrap flex-col-custom md:items-center w-full rounded-none [ nc-divide-field ] ">
            <LocationInput
              defaultValue={(departureCity !== "") ? `${departureCountry}_${departureCity}_${departureCityName}`: ""}
              placeHolder='WHERE TO?'
              desc='LOCALITY OR CITY'
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
            <div className="flex items-center justify-center">
              {/* BUTTON SUBMIT OF FORM */}
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

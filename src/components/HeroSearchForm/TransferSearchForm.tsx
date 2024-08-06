import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import CountryInput from "./TransferCountryInput";
import LocationInput from "./TransferLocationInput";
import TransferGuestsInput from "./TransferGuestsInput";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import { FocusedInputShape } from "react-dates";
import DateSingleInput from "./TransferDateSingleInput";
import ButtonSubmit from "./ButtonSubmit";
import { FC } from "react";
import moment from "moment";
import { OpenNotification, eventTrack } from 'components/Helper'

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
  location?: any;
  popular?: any;
}

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({
  haveDefaultValue,
  location,
  popular
}) => {
  
  // USE STATE
  const [dateRangeValue, setDateRangeValue] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });

  const history = useHistory()

  const [countryValue, setCountryValue] = useState("");
  const [countryInputName, setCountryInputName] = useState("");
  const [pickupInpuName, setPickupInputName] = useState("");
  const [dropInputName, setDropInputName] = useState("");
  const [pickupInputValue, setPickupInputValue] = useState("");
  const [dropInputValue, setDropInputValue] = useState("");
  const [guestValue, setGuestValue] = useState({ guestAdults: 1, guestChildren: 0, guestInfants: 0 });
  const [dateDepartureValue, setDateDepartureValue] = useState<moment.Moment | null>(null);

  const [pickupFocused, setPickupFocused] = useState<boolean>(false);
  const [dropFocused, setDropFocused] = useState<boolean>(false);
  const [dateDepartureFocused, setDateDepartureFocused] = useState<boolean>(false);

  
  // USER EFFECT
  useEffect(() => {
    if (haveDefaultValue) {
      setDateRangeValue({
        startDate: moment(),
        endDate: moment().add(4, "days"),
      });
    }
  }, []);

  useEffect(() => {
    if (popular) {
      setDropInputName(popular.name)
      setDropInputValue(popular.iata_code)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [popular])

  useEffect(() => {
    if (location) {
      setCountryValue(location.country)
      setCountryInputName(location.country_code_iso3)
    }    
  }, [location])
  
  const handleGuest = (data: any) => {
    if (data) {
      const guest: any = guestValue
      guest['guestAdults'] = data.guestAdults;
      guest['guestChildren'] = data.guestChildren;
      guest['guestInfants'] = data.guestInfants;
      guest['cabinClass'] = data.cabinClass;

      setGuestValue(guest)
    }
  }

  const handleSearch = () => {
    
    if (countryValue === "" && pickupInputValue === "" && dropInputValue === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }

    if (pickupInputValue === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid pickup city!', '', true)
      return false
    }

    if (dropInputValue === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid drop off city!', '', true)
      return false
    }

    if (dateDepartureValue === null) {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid date & time!', '', true)
      return false
    }

    if (pickupInputValue === dropInputValue) {
      OpenNotification('error', 'Oops!', 'Pickup and Drop off cities cannot be same!', '', true)
      return false
    }
    
    const date =  moment(dateDepartureValue).format('YYYY-MM-DD HH:mm')

    eventTrack('Search', 'Transfer', `${pickupInpuName} - ${dropInputName}`)

    history.push(`/transfers/search?${encodeURIComponent(`country=${countryValue}&origin=${pickupInputValue}&pickup=${pickupInpuName}&destination=${dropInputValue}&dropoff=${dropInputName}&time=${date}&country_iso=${countryInputName}&adults=${guestValue.guestAdults}&child=${guestValue.guestChildren}&infant=${guestValue.guestInfants}&v=1.0`)}`)
    
  }

  const renderForm = () => {
    return (
      <div className="lg:pb-8 pb-4 lg:pt-8 pt-4">
        <div className="w-full searchForm lg:mt-10 mt-5 lg:mb-14 mb-8">
          <h3 className="font-medium text-white text-center text-3xl md:text-4xl xl:text-4xl leading-[110%]">
            Book transfer at best prices around the world!
          </h3>
          <form action="javascript:void(0)" className="w-full relative mt-8 rounded-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-900">

            <div className="flex search-container transfers custom-top-radius flex-col md:flex-row md:items-center w-full rounded-full [ nc-divide-field ] ">
              <CountryInput
                defaultValue={countryInputName}
                placeHolder='Country'
                desc='Select Country'
                onChange={(data: any) => { setCountryInputName(data) }}
                onInputDone={(data) => { setCountryValue(data); setPickupFocused(true); }}
              />

              <LocationInput
                defaultValue={pickupInpuName}
                countryValue={countryValue}
                placeHolder='Pick Up'
                autoFocus={pickupFocused}
                desc='Airport, Place or Hotel Name'
                onChange={(data: any) => { setPickupInputName(data) }}
                onInputDone={(data) => { setPickupInputValue(data); setDropFocused(true) }}
              />

              <LocationInput
                defaultValue={dropInputName}
                countryValue={countryValue}
                placeHolder='Drop Off'
                autoFocus={dropFocused}
                desc='Airport, Place or Hotel Name'
                onChange={(data: any) => { setDropInputName(data) }}
                onInputDone={(data) => { setDropInputValue(data); setDateDepartureFocused(true) }}
              />

              <DateSingleInput
                defaultValue={dateDepartureValue}
                onChange={(date) => { setDateDepartureValue(date) }}
                defaultFocus={dateDepartureFocused}
                placeHolder='Date & Time'
                trip='Pickup Date & Time'
                onFocusChange={(focus: boolean) => {
                  setDateDepartureFocused(focus);
                }}
              />
              <TransferGuestsInput
                defaultValue={guestValue}
                onChange={(data) => handleGuest(data)}
              />
            </div>
            <div className=" flex md:items-center justify-center w-full rounded-full mt-12">
              {/* BUTTON SUBMIT OF FORM */}
              <div className='absolute btn-search'>
                <ButtonSubmit onClick={() => handleSearch()} />
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

import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./TransferLocationInput";
import TransferGuestsInput from "./TransferGuestsInput";
import ButtonSubmit from "./ButtonSubmit";
import { OpenNotification, eventTrack } from 'components/Helper'
import { FC } from "react";
import moment from "moment";
import DateSingleInput from "./TransferDateSingleInput";
import CountryInput from "./TransferCountryInput";

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
  header?: boolean,
  getSearchResult: () => void;
  setIsOpenModal?: (val: any) => void;
}

const TransferModifySearchForm: FC<RentalCarSearchFormProps> = ({
  haveDefaultValue,
  page,
  header,
  getSearchResult,
  setIsOpenModal
}) => {

  // USE STATE
  const [dateRangeValue, setDateRangeValue] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });

  const history = useHistory()

  const [countryValue, setCountryValue] = useState("");
  const [countryInpuName, setCountryInputName] = useState("");
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

    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params.get('country') && params.get('country') !== "") {
      setCountryValue(params.get('country'))
    }
    if (params.get('country_iso') && params.get('country_iso') !== "") {
      setCountryInputName(params.get('country_iso'))
    }
    if (params.get('origin') && params.get('origin') !== "") {
      setPickupInputValue(params.get('origin'))
    }
    if (params.get('destination') && params.get('destination') !== "") {
      setDropInputValue(params.get('destination'))
    }
    if (params.get('pickup') && params.get('pickup') !== "") {
      setPickupInputName(params.get('pickup'))
    }
    if (params.get('dropoff') && params.get('dropoff') !== "") {
      setDropInputName(params.get('dropoff'))
    }
    if (params.get('time') && params.get('time') !== "") {
      setDateDepartureValue(params.get('time'))
    }

    const adults: any = params.get('adults');
    const child: any = params.get('child');
    const infants: any = params.get('infant');

    const guests = guestValue;
    if (adults) guests['guestAdults'] = Number(adults);
    if (child) guests['guestChildren'] = Number(child);
    if (infants) guests['guestInfants'] = Number(infants);
    setGuestValue(guests);
  }, []);
  //

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

    const date = moment(dateDepartureValue).format('YYYY-MM-DD HH:mm')

    eventTrack('Search', 'Transfer', `${pickupInpuName} - ${dropInputName}`)

    history.push(`/transfers/search?${encodeURIComponent(`country=${countryValue}&origin=${pickupInputValue}&destination=${dropInputValue}&time=${date}&country_iso=${countryInpuName}&adults=${guestValue.guestAdults}&child=${guestValue.guestChildren}&infant=${guestValue.guestInfants}&v=1.0`)}`)

    if (setIsOpenModal) {
      setIsOpenModal(false)
    }

    if (page && page === 'page2') {
      getSearchResult()
    }
  }
  const handleGuest = (data: any) => {
    if (data) {
      const guest = guestValue
      guest['guestAdults'] = data.guestAdults;
      guest['guestChildren'] = data.guestChildren;
      guest['guestInfants'] = data.guestInfants;

      setGuestValue(guest)
    }
  }

  const renderForm = () => {
    return (
      <div className="w-full searchForm transfers search-container modified mt-10 mb-10">

        <div className="w-full relative rounded-3xl shadow-xl dark:shadow-2xl">

          <div className="flex justify-start gap-2 md:gap-2 flex-col md:flex-row md:items-center w-full rounded-none [ nc-divide-field ] ">
            <CountryInput
              defaultValue={countryInpuName}
              placeHolder='Country'
              desc='Select Country'
              onChange={(data: any) => { setCountryInputName(data) }}
              onInputDone={(data) => { setCountryValue(data); setPickupFocused(false); }}
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

            {/* BUTTON SUBMIT OF FORM */}
            <div className="flex items-center justify-center">
              <ButtonSubmit onClick={() => handleSearch()} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderForm();
};

export default TransferModifySearchForm;

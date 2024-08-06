import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./ActivityLocationInput";
import CategoryInput from "./ActivityCategoryInput";
import ButtonSubmit from "./ButtonSubmit";
import { OpenNotification } from 'components/Helper'
import { FC } from "react";
import moment from "moment";
import DateSingleInput from "./DateSingleInput";

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

const ActivityModifySearchForm: FC<RentalCarSearchFormProps> = ({
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

  const [arrivalCountry, setArrivalCountry] = useState("")
  const [arrivalCity, setArrivalCity] = useState("")
  const [departureCityName, setDepartureCityName] = useState("")
  const [arrivalCityName, setArrivalCityName] = useState("")
  const [dateDepartureValue, setDateDepartureValue] = useState<moment.Moment | null>(null);
  
  const [categoryInputName, setCategoryInputName] = useState("");

  const [arrivalFocused, setArrivalFocused] = useState<boolean>(false);
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

    if (params) {
      if(params.get('country') && params.get('country') !== "") {
        setArrivalCountry(params.get('country'))
      }
      if(params.get('city') && params.get('city') !== "") {
        setArrivalCity(params.get('city'))
      }
      if(params.get('cityName') && params.get('cityName') !== "") {
        setArrivalCityName(params.get('cityName'))
      }
      if(params.get('during') && params.get('during') !== "") {
        setDateDepartureValue(params.get('during'))
      }
      if(params.get('keyword') && params.get('keyword') !== "") {
        setCategoryInputName(params.get('keyword'))
      }
    }
  }, []);
  //

  const handleSearch = () => {

    if (arrivalCountry === "" && arrivalCity === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }

    let during = ''
    let keywords = ''

    if (dateDepartureValue && dateDepartureValue !== null) {
      during = `&during=${moment(dateDepartureValue).format('YYYY-MM-DD')}`
    }
    let keyword: any = ""
    if (categoryInputName !== '') {
      keyword = `&keyword=${categoryInputName}`
    }

    history.push(`/activities/search?${encodeURIComponent(`city=${arrivalCity}&cityName=${arrivalCityName}&country=${arrivalCountry}${during}${keyword}&v=1.0`)}`)

    if (setIsOpenModal) {
      setIsOpenModal(false)
    }
    
    if (page && page === 'page2') {
      getSearchResult()
    }
  }
  const handleData = (item: any) => {
    if (item && item !== null) {
      const data = item.split('_')
      if (data && data.length > 0) {
        setArrivalCity(data[0])
        setArrivalCountry(data[1])
        setArrivalCityName(data[2])
      }
    }
  }

  const renderForm = () => {
    return (
      <div className="search-result pb-8 lg:pb-8 pt-4 xl:max-w-none">
        <div className="container">
          <div className="w-full searchForm search-container packages modified custom-top-radius mt-10 mb-10">
            
            <form action="javascript:void(0)" className="relative mt-4 rounded-3xl shadow-xl dark:shadow-2xl">

              <div className="flex justify-between gap-2 md:gap-2 flex-col md:flex-row md:items-center w-full rounded-none [ nc-divide-field ] ">
                
                <LocationInput
                  defaultValue={`${arrivalCountry}_${arrivalCity}_${arrivalCityName}`}
                  placeHolder='Destination'
                  desc='Destination'
                  autoFocus={arrivalFocused}
                  onInputDone={(data) => { handleData(data) }}
                />
                <CategoryInput
                  defaultValue={categoryInputName}
                  placeHolder='Activities or Keyword'
                  desc='Activities or Keyword'
                  autoFocus={arrivalFocused}
                  onChange={(e) => setCategoryInputName(e)}
                />
                <DateSingleInput
                  defaultValue={dateDepartureValue}
                  onChange={(date) => { setDateDepartureValue(date) }}
                  placeHolder='WHEN ARE YOU TRAVELING?'
                  trip='oneway'
                  defaultFocus={dateDepartureFocused}
                  onFocusChange={(focus: boolean) => {
                    setDateDepartureFocused(false);
                  }}
                  minDate={moment().format('YYYY-MM-DD')}
                />
                
                {/* BUTTON SUBMIT OF FORM */}
                <div className="flex items-center justify-center">
                  <ButtonSubmit onClick={() => handleSearch()} page={page} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return renderForm();
};

export default ActivityModifySearchForm;

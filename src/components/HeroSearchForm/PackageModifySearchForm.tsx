import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./PackageLocationInput";
import ButtonSubmit from "./ButtonSubmit";
import { OpenNotification, eventTrack } from 'components/Helper'
import { FC } from "react";
import moment from "moment";
import DateFlatpickr from "./DateFlatpickr";

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

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({
  haveDefaultValue,
  page,
  header,
  getSearchResult,
  setIsOpenModal
}) => {
  // DEFAULT DATA FOR ARCHIVE PAGE
  const defaultPickUpInputValue = "Tokyo, Jappan";
  const defaultDropOffInputValue = "Paris, France";

  // USE STATE
  const [dateRangeValue, setDateRangeValue] = useState<DateRage>({
    startDate: null,
    endDate: null,
  });

  const history = useHistory()

  const [departureCountry, setDepartureCountry] = useState("")
  const [departureCity, setDepartureCity] = useState("")
  const [arrivalCountry, setArrivalCountry] = useState("")
  const [arrivalCity, setArrivalCity] = useState("")
  const [departureCityName, setDepartureCityName] = useState("")
  const [arrivalCityName, setArrivalCityName] = useState("")
  const [packageTitle, setPackageTitle] = useState("")
  const [dateDepartureValue, setDateDepartureValue] = useState<moment.Moment | null>(null);

  const [departureFocused, setDepartureFocused] = useState<boolean>(false);
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
      if(params.get('dCountry') && params.get('dCountry') !== "") {
        setDepartureCountry(params.get('dCountry'))
      }
      if(params.get('dCity') && params.get('dCity') !== "") {
        setDepartureCity(params.get('dCity'))
      }
      if(params.get('dCityName') && params.get('dCityName') !== "") {
        setDepartureCityName(params.get('dCityName'))
      }
      if(params.get('country') && params.get('country') !== "") {
        setArrivalCountry(params.get('country'))
      }
      if(params.get('city') && params.get('city') !== "") {
        setArrivalCity(params.get('city'))
      }
      if(params.get('cityName') && params.get('cityName') !== "") {
        setArrivalCityName(params.get('cityName'))
      }
      if(params.get('title') && params.get('title') !== "") {
        setPackageTitle(params.get('title'))
      }
      if(params.get('during') && params.get('during') !== "") {
        setDateDepartureValue(params.get('during'))
      }
    }
  }, []);
  //

  const handleSearch = () => {

    if (departureCountry === "" && arrivalCountry === "" && departureCity === "" && arrivalCity === "" && packageTitle === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }

    if (packageTitle.length < 3) {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }
    
    let dCountry = ''
    let dCity = ''
    let dCityName = ''
    let country = ''
    let city = ''
    let cityName = ''
    let during = ''
    let title = ''

    let gaTitle = ''
    let gaCountry = ''
    let gaCity = ''

    if (departureCountry && departureCountry !== "") {
      dCountry = `&dCountry=${departureCountry}`
      gaCountry = departureCountry
    }
    if (departureCity && departureCity !== "") {
      dCity = `&dCity=${departureCity}`
      gaCity = departureCity
    }
    if (departureCityName && departureCityName !== "") {
      dCityName = `&dCityName=${departureCityName}`
    }
    if (arrivalCountry && arrivalCountry !== "") {
      country = `&country=${arrivalCountry}`
    }
    if (arrivalCity && arrivalCity !== "") {
      city = `&city=${arrivalCity}`
    }
    if (arrivalCityName && arrivalCityName !== "") {
      cityName = `&cityName=${arrivalCityName}`
    }
    if (dateDepartureValue && dateDepartureValue !== null) {
      during = `&during=${moment(dateDepartureValue).format('YYYY-MM-DD')}`
    }
    if (departureCountry === "" && packageTitle && packageTitle !== "") {
      title = `&title=${packageTitle}`
      gaTitle = packageTitle
    }
    
    const gaVal = (gaTitle !== '') ? gaTitle : (gaCity !== '' ? `${gaCity}-${gaCountry}` : gaCountry)
    eventTrack('Search', 'Package', gaVal)

    history.push(`/packages/search?${encodeURIComponent(`v=1.0${dCity}${dCityName}${title}${dCountry}${city}${cityName}${country}${during}`)}`)
    if (setIsOpenModal) {
      setIsOpenModal(false)
    }
    
    if (page && page === 'page2') {
      getSearchResult()
    }
  }

  const handleData = (item: any, type: any) => {
    if (item && item.length > 0) {
      const data = item.split('_')
      if (type === 'departure') {
        setDepartureCountry("")
        setDepartureCity("")
        setDepartureCityName("")
        setPackageTitle("")

        if (data && data.length === 1) {
          setDepartureCountry(data[0])
        } else if (data && data.length > 0) {
          setDepartureCity(data[0])
          setDepartureCountry(data[1])
          if (data[2]) {
            setDepartureCityName(data[2])
          }
        } 
      } else if (type === 'arrival') {
        setArrivalCountry("")
        setArrivalCity("")
        setArrivalCityName("")
        setPackageTitle("")
        
        if (data && data.length === 1) {
          setArrivalCountry(data[0])
        } else if (data && data.length > 0) {
          setArrivalCity(data[0])
          setArrivalCountry(data[1])
          if (data[2] && data[0] === "" && data[1] === "") {
            setPackageTitle(data[2])
          } else if(data[2]) {
            setArrivalCityName(data[2])
            setPackageTitle(data[2])
          }
        }
      }
    } else {
      if (type === 'departure') {
        setDepartureCountry("")
        setDepartureCity("")
        setDepartureCityName("")
        setPackageTitle("")
      } else if (type === 'arrival') {
        setArrivalCountry("")
        setArrivalCity("")
        setArrivalCityName("")
        setPackageTitle("")
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
                {/*<LocationInput
                  defaultValue={(departureCity !== "" || departureCountry !== "") ? `${departureCountry}_${departureCity}_${departureCityName}`: ""}
                  placeHolder='DEPART FROM?'
                  desc='TO COUNTRY OR CITY'
                  autoFocus={departureFocused}
                  className="bg-white"
                  onInputDone={(data) => { handleData(data, 'departure'); setArrivalFocused(true) }}
                />*/}
                <LocationInput
                  defaultValue={(packageTitle !== "") ? `${arrivalCountry}_${arrivalCity}_${packageTitle}` : ((arrivalCity !== "" || arrivalCountry !== "") ? `${arrivalCountry}_${arrivalCity}_${arrivalCityName}` : "")}
                  placeHolder='Going To?'
                  desc='To Country Or City Or Keyword'
                  autoFocus={arrivalFocused}
                  onInputDone={(data) => { handleData(data, 'arrival'); }}
                  onChange={(data) => { setPackageTitle(data) }}
                />
                <DateFlatpickr
                  defaultValue={dateDepartureValue}
                  onChange={(date) => { setDateDepartureValue(date) }}
                  placeHolder='When?'
                  trip='oneway'
                  defaultFocus={dateDepartureFocused}
                  onFocusChange={(focus: boolean) => {
                    setDateDepartureFocused(false);
                  }}
                  dateFormat={'MMM YY'}
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

export default RentalCarSearchForm;

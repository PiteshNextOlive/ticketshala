import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import LocationInput from "./ActivityLocationInput";
import CategoryInput from "./ActivityCategoryInput";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
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

const ActivitySearchForm = () => {

  const history = useHistory()

  const [departureInputValue, setDepartureInputValue] = useState("");
  const [categoryInputName, setCategoryInputName] = useState("");
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [arrivalCountry, setArrivalCountry] = useState("")
  const [arrivalCity, setArrivalCity] = useState("")
  const [arrivalCityName, setArrivalCityName] = useState("")

  const handleSearch = () => {
    if (arrivalCountry === "" && arrivalCity === "") {
      OpenNotification('error', 'Missing Selection!', 'Please enter a valid Source!', '', true)
      return false
    }
    let keyword: any = ""
    if (categoryInputName !== '') {
      keyword = `&keyword=${categoryInputName}`
    }

    eventTrack('Search', 'Activity', `${arrivalCityName}-${arrivalCountry}`)
    history.push(`/activities/search?${encodeURIComponent(`city=${arrivalCity}&cityName=${arrivalCityName}&country=${arrivalCountry}${keyword}&v=1.0`)}`)
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
      <div className="lg:pb-8 pb-4 lg:pt-8 pt-4">
        <div className="w-full searchForm lg:mt-10 mt-5 lg:mb-14 mb-8">
          <h3 className="font-medium text-white text-center text-3xl md:text-4xl xl:text-4xl leading-[110%]">
          Activities & Things to do around the world
          </h3>
          <BgGlassmorphism />
          <form action="javascript:void(0)" className="w-full relative mt-8 rounded-3xl shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-900">
            
            <div className=" flex search-container custom-top-radius flex-col border-b border-gray-100 flex-col divide-x divide-gray-100 md:flex-row md:items-center w-full rounded-none [ nc-divide-field ] ">
              <LocationInput
                defaultValue={departureInputValue}
                placeHolder='Destination'
                desc='Destination'
                onInputDone={(data) => { handleData(data) }}
              />
              <CategoryInput
                defaultValue={categoryInputName}
                placeHolder='Activities or Keyword'
                desc='Activities or Keyword'
                onChange={(e) => setCategoryInputName(e)}
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

export default ActivitySearchForm;

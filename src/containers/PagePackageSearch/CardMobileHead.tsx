import React, { FC, Fragment, useEffect, useState } from "react";
import NcImage from "shared/NcImage/NcImage";
import { Link } from "react-router-dom";

const CardMobileHead = ({ className = "h-full", setType, setIsOpenModal }: any) => {

  const [arrivalCountry, setArrivalCountry] = useState("")
  const [arrivalCity, setArrivalCity] = useState("")
  const [departureCityName, setDepartureCityName] = useState("")
  const [arrivalCityName, setArrivalCityName] = useState("")
  const [packageTitle, setPackageTitle] = useState("")
  const [dateDepartureValue, setDateDepartureValue] = useState<moment.Moment | null>(null);

  // USER EFFECT
  useEffect(() => {
   
    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params) {
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

  return (
    <div className="p-3 flex justify-between items-center bg-neutral-100 border border-neutral-400 rounded-md">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold capitalize text-md"><span className="line-clamp-1">{packageTitle}</span></h2>
        </div>
      </div>
      <div className="flex items-center text-neutral-500">
        <span onClick={() => { setIsOpenModal(true); setType('search'); }}><i className="text-2xl las la-search mr-4"></i></span>
        <span onClick={() => { setIsOpenModal(true); setType('filter'); }}><i className="text-2xl las la-filter mr-4"></i></span>
      </div>
    </div>
  );
};

export default CardMobileHead;

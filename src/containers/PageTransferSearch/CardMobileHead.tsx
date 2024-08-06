import React, { FC, Fragment, useEffect, useState } from "react";
import NcImage from "shared/NcImage/NcImage";
import { Link } from "react-router-dom";

const CardMobileHead = ({ className = "h-full", setType, setIsOpenModal }: any) => {

  const [departureCity, setDeparturelCity] = useState("")
  const [arrivalCity, setArrivalCity] = useState("")

  // USER EFFECT
  useEffect(() => {
   
    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params) {
      if(params.get('pickup') && params.get('pickup') !== "") {
        setDeparturelCity(params.get('pickup'))
      }
      if(params.get('dropoff') && params.get('dropoff') !== "") {
        setArrivalCity(params.get('dropoff'))
      }
    }
  }, []);

  return (
    <div className="p-3 flex justify-between items-center bg-neutral-100 border border-neutral-400 rounded-md">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold capitalize text-md"><span className="line-clamp-1">{departureCity} - {arrivalCity}</span></h2>
        </div>
      </div>
      <div className="flex items-center text-neutral-500">
        <span onClick={() => { setIsOpenModal(true); setType('search'); }}><i className="text-2xl las la-search mr-1"></i></span>
      </div>
    </div>
  );
};

export default CardMobileHead;

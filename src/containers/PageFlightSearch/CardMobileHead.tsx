import React, { useState } from "react";
import moment from "moment";
import { getAirportCity } from 'components/Helper' 

const CardMobileHead = ({ className = "h-full", departure, arrival, cabin, departD, setType, setIsOpenModal }: any) => { 
  return (
    <div className="p-3 flex justify-between items-center bg-neutral-100 border border-neutral-400 rounded-md">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold capitalize text-md"><span className="line-clamp-1">{getAirportCity(departure)} - {getAirportCity(arrival)}</span></h2>
        </div>
        <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-xs space-x-2">
            <span className="">{(cabin === 'F') ? 'First Class' : ((cabin === 'C') ? 'Business' : 'Economy')}</span>,
            <span>{moment(departD).format('ll')}</span>
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

import React, { FC, Fragment, useEffect, useState } from "react";
import moment from "moment";

const CardMobileHead = ({ className = "h-full", departure, arrival, departD, setType, setIsOpenModal }: any) => {

  const [isOpenModalItinerary, setIsOpenModalItinerary] = useState(false);
  const [cardData, setCardData] = useState<any>([]);
  const [cityName, setCityName] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // USER EFFECT
  useEffect(() => {
   
    // SEARCH PARAM VALUE
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (params) {
      if(params.get('cityName') && params.get('cityName') !== "") {
        setCityName(params.get('cityName'))
      }
      if(params.get('fromDate') && params.get('fromDate') !== "") {
        setFromDate(params.get('fromDate'))
      }
      if(params.get('toDate') && params.get('toDate') !== "") {
        setToDate(params.get('toDate'))
      }
    }
  }, []);

  return (
    <div className="p-3 flex justify-between items-center bg-neutral-100 border border-neutral-400 rounded-md">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold capitalize text-md"><span className="line-clamp-1">{cityName}</span></h2>
        </div>
        <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-xs space-x-2">
            <span>{moment(fromDate).format('ll')} - {moment(toDate).format('ll')}</span>
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

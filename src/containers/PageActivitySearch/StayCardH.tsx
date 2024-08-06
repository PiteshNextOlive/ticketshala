import React, { FC, useState, useEffect } from "react";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { Link, useHistory } from "react-router-dom";
import { amountSeparator, renderAmenities, getCurrency } from 'components/Helper';
import NcImage from "shared/NcImage/NcImage";
import Config from './../../config.json'
import ButtonPrimary from "shared/Button/ButtonPrimary";
import defaultImg from 'images/not-available.png'
import { FaMapMarkerAlt, FaMarker } from "react-icons/fa";

const StayCardH = ({ data }: any) => {

  const history = useHistory()
  const [categories, setCategories]: any = useState([])
  const [galleryImgs, setGalleryImgs] = useState([])

  useEffect(() => {

    let img: any = []
    if (data.images && data.images.length > 0) {
      for (var i = 0; i < data.images.length; i++) {
        img.push(`${data.images[i]}`)
      }
      setGalleryImgs(img);
    }

    if (data.type && data.type !== null) {
      setCategories(data.type.split(','))
    }
  }, [])

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full sm:w-72 activityGallery">
        {(galleryImgs && galleryImgs.length > 0) ?
        <>
          <GallerySlider
            ratioClass="aspect-w-6 aspect-h-5"
            galleryImgs={galleryImgs}
          />
        </>
        : 
          <NcImage className='not-available' src={defaultImg} />
        }
      </div>
    )
  };

  const getActivityData = (item: any) => {
    window.open(`/activity/view/${data && data.id}?${encodeURIComponent(`name=${data && data.name}`)}`, "_blank");
  }

  const renderContent = () => {
    return (
      <div className="flex-grow p-3 sm:p-5 flex flex-col">
        <div className="">
          <div className="flex justify-between space-x-2">
            <h2 className="text-lg font-medium capitalize">
              <span className="line-clamp-1 text-ellipsis overflow-hidden">{data && data.name}</span>
            </h2>
          </div>
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            {data && data.desc}
          </div>
          <div className="flex sm:items-center text-sm text-primary dark:text-neutral-400">
            <FaMapMarkerAlt className='mr-1' /> {data && data.places.join()}, {data && data.country}
          </div>
        </div>
        <div className="hidden sm:block my-2"></div>

        <div className='flex flex-col sm:flex-row justify-between items-end'>
          <div className="space-y-3">
           <div className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
              <i className="las la-calendar text-md"></i>
              <div className="text-sm"><span className="font-bold">Days:</span> {data && data.days.join(', ')}</div>
            </div>
            {(data && data.duration.v !== "") && 
              <div key={`includes_1`} className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
                <i className="las la-clock text-md"></i>
                <span className="text-sm">{data && data.duration.v} {data && data.duration.m}</span>
              </div>
            }
            <div className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
              <i className="las la-check-circle text-md text-green"></i>
              <span className="text-sm text-green">Free Cancellation</span>
            </div>
          </div>
          <div className="space-y-2 relative text-right">
            <div className="priceWrapper">
              <div className="block text-base text-lg font-semibold mb-1">
                <span className="block text-xs text-neutral-800 dark:text-neutral-400 font-normal">Starts from</span>
                <div className="flex flex-row items-center justify-end">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-normal line-through"><span className='currency-font'>{getCurrency(data.fareFrom.baseFare.currency)}</span>{amountSeparator(Number(data.fareFrom.baseFare.amount))}</div>
                  <div><span className='currency-font ml-3'>{getCurrency(data.fareFrom.totalFare.currency)}</span>{amountSeparator(Number(data.fareFrom.totalFare.amount))}</div>
                </div>
              </div>
              
              <ButtonPrimary className='selectRoom' onClick={() => data && getActivityData(data)}>Book Now</ButtonPrimary>
            </div>
          </div>
        </div>
        
      </div>
    );
  };

  return (
    <div
      className={`nc-StayCardH group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
      data-nc-id="StayCardH"
    >
      <div className="flex flex-col sm:flex-row sm:items-start">
        {renderSliderGallery()}
        {renderContent()}
      </div>
    </div>
  );
};

export default StayCardH;

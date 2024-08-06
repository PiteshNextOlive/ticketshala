import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BtnLikeIcon from "components/BtnLikeIcon/BtnLikeIcon";
import Badge from "shared/Badge/Badge";
import { amountSeparator, renderAmenities, getCurrency } from 'components/Helper';
import NcImage from "shared/NcImage/NcImage";
import Config from './../../config.json'
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { FaCalendarAlt } from "react-icons/fa";

const StayCardH = ({ data }: any) => {

  const [socialTags, setSocialTags]: any = useState([])

  useEffect(() => {
    if (data.socialTags && data.socialTags !== null) {
      setSocialTags(data.socialTags.split(','))
    }
  }, [])

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full flex items-center justify-center md:w-72 flex-shrink-0 border-r border-neutral-100 dark:border-neutral-800">
        <div className="w-full sm:py-0">
          <NcImage className="w-full" style={{ height: '270px' }} src={`${Config.MEDIA_URL}${data.image}`} />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="flex-grow p-3 sm:p-5 flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <h2 className="text-lg font-medium capitalize">
              <span className="line-clamp-1  text-ellipsis overflow-hidden">{data.title}</span>
            </h2>
            <span className="block text-xs w-20 text-neutral-500 dark:text-neutral-400 font-normal">
              {`${data.days - 1}N / ${data.days}D`}
            </span>
          </div>
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
           {data.short_description && data.short_description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100)}...
          </div>
        </div>
        <div className="hidden sm:block my-2"></div>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end'>
          <div className="space-y-3">
            {socialTags && socialTags.filter((_: any, i: any) => i < 3).map((item: any, key: any) => (
            <>
              <Badge name={item} className="mr-1 capitalize" color="green" />
            </>
            ))}
            <div className="w-14 border-b border-neutral-100 dark:border-neutral-800 my-4"></div>
            <div className="space-x-3">
              <div className='flex items-center'>
                {renderAmenities(data.tags, 5)}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-40 space-y-2 relative text-right">
            <div className="priceWrapper mt-5 sm:mt-1 flex flex-row lg:flex-col justify-between items-start sm:items-end">
              <div className="flex flex-col justify-between items-start sm:items-end">
                <div className="relative block text-sm text-neutral-600 dark:text-neutral-400 font-normal">
                  {(data && data.fare && data.fare.discount.amount > 0) ? <><span className="lineThroughRed" /><span className='currency-font'>{getCurrency(data.fare.baseFare.currency)}</span>{data && amountSeparator(Number(data.fare.baseFare.amount))}</> : null}
                </div>
                <div className="block text-base font-semibold mb-0 sm:mb-1">
                  <span className='currency-font'>{getCurrency(data.fare.totalFare.currency)}</span>{amountSeparator(Number(data.fare.totalFare.amount))}
                  <span className="block text-xs text-neutral-400 dark:text-neutral-400 font-normal">
                    Per Person
                  </span>
                </div>
              </div>

              <ButtonPrimary className='selectRoom mt-2'>Book Now</ButtonPrimary>
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
      <Link to={`/package/view/${data.slug}`} className="flex flex-col sm:flex-row sm:items-center">
        {renderSliderGallery()}
        {renderContent()}
      </Link>
    </div>
  );
};

export default StayCardH;

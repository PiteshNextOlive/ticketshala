import React, { FC } from "react";
import NcImage from "shared/NcImage/NcImage";
import { TaxonomyType } from "data/types";
import { Link } from "react-router-dom";
import convertNumbThousand from "utils/convertNumbThousand";
import Config from './../../config.json'
import { getCurrency, amountSeparator } from 'components/Helper'

const CardCategory5 = (props: any) => {
  
  return (
    <Link
      to={`/package/view/${props.col.slug}`}
      className={`nc-CardCategory5 flex flex-col`}
      data-nc-id="CardCategory5"
    >
      <div
        className={`flex-shrink-0 relative w-full aspect-w-4 aspect-h-3 h-0 rounded-2xl overflow-hidden group`}
      >
        <NcImage
          src={`${Config.MEDIA_URL}${props.col.image}`}
          className="object-cover w-full h-full rounded-2xl"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      <div className="mt-4 px-3 truncate">
        <h2
          className={`text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-medium truncate`}
        >
          {props.col.title}
        </h2>
        <span
          className={`block mt-2 text-sm text-neutral-6000 dark:text-neutral-400`}
        >
          {(props.col.price) ? 
            <>
              {`Starting from`} <span className='currency-font'>{getCurrency(props.col.currency)}</span>{`${amountSeparator(props.col.price)}`} 
            </>
          :
            <>
              {`Starting from`} <span className='currency-font'>{getCurrency(props.col.fare.totalFare.currency)}</span>{`${amountSeparator(props.col.fare.totalFare.amount)}`} 
            </>
          }
        </span>
      </div>
    </Link>
  );
};

export default CardCategory5;

import React, { FC } from "react";
import NcImage from "shared/NcImage/NcImage";
import { TaxonomyType } from "data/types";
import { Link } from "react-router-dom";
import convertNumbThousand from "utils/convertNumbThousand";
import Config from 'config.json';
import moment from "moment";

export interface CardCategory4Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategory4 = ({ col, loading }: any) => {
 
  return (
    <Link
      to={`/hotels/search?${encodeURIComponent(`v=1.0&city=${col && col.city}&cityName=${col && col.city}&country=${col && col.country}&fromDate=${moment().add(1, "days").format('YYYY-MM-DD')}&toDate=${moment().add(3, "days").format('YYYY-MM-DD')}&adults=${2}&child=${0}&rooms=${1}`)}`}
      className={`nc-CardCategory4 flex flex-col`}
      data-nc-id="CardCategory4"
    >
      <div
        className={`flex-shrink-0 relative w-full aspect-w-5 aspect-h-4 sm:aspect-h-6 h-0 rounded-2xl overflow-hidden group`}
      >
        <NcImage
          src={(loading) ? "" : ((col && col.image.indexOf("http://") == 0 || col && col.image.indexOf("https://") == 0) ? col.image : `${Config.MEDIA_URL}${col && col.image}`)}
          className="object-cover w-full h-full rounded-2xl"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      <div className="mt-4 px-2 truncate">
        <h2
          className={`text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-medium truncate`}
        >
          {col && col.title}
        </h2>
        <span
          className={`block mt-2 text-sm text-neutral-6000 dark:text-neutral-400`}
        >
          {col && convertNumbThousand(col.desc)}
        </span>
      </div>
    </Link>
  );
};

export default CardCategory4;

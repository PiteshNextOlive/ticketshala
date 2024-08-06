import React, { FC } from "react";
import NcImage from "shared/NcImage/NcImage";
import { TaxonomyType } from "data/types";
import { Link } from "react-router-dom";
import convertNumbThousand from "utils/convertNumbThousand";
import Config from './../../config.json';

export interface CardCategory3Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategory3 = ({ col, loading, type }: any) => {
  
  return (
    <Link to={(type && type === 'blogs') ? `/blog-single/${col && col.slug}` : `/packages/search?${encodeURIComponent(`v=1.0&country=${col && col.country}`)}`}
      className={`nc-CardCategory3 flex flex-col`}
      data-nc-id="CardCategory3"
    >
      <div
        className={`flex-shrink-0 relative w-full aspect-w-5 aspect-h-4 sm:aspect-h-7 h-0 rounded-2xl overflow-hidden group`}
      >
        <NcImage
          src={(loading) ? "" : (type && type === 'promotions') ? `${Config.MEDIA_URL}${col && col.i}` : ((col && col.image.indexOf("http://") == 0 || col && col.image.indexOf("https://") == 0) ? col.image : `${Config.MEDIA_URL}${col && col.image}`)}
          className="object-cover w-full h-full rounded-2xl"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      {(type && type === 'promotions') ? <></> : 
        <div className="mt-4 truncate">
          <h2
            className={`text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-medium truncate`}
          >
            {col && col.title}
          </h2>
          <span
            className={`block mt-2 text-sm text-neutral-6000 dark:text-neutral-400 truncate`}
          >
            {(type && type === 'blogs') ? col && convertNumbThousand(col.short_description) : col && convertNumbThousand(col.desc)}
          </span>
        </div> }
    </Link>
  );
};

export default CardCategory3;

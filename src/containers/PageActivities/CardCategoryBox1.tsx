import React, { FC } from "react";
import { Link, useHistory } from 'react-router-dom'
import NcImage from "shared/NcImage/NcImage";
import Badge from "shared/Badge/Badge";
import { getAirportCity, getAirportCountry, getFlightCountry } from 'components/Helper'
import { FaClock, FaPlane } from "react-icons/fa"
import Config from './../../config.json';

const CardCategoryBox1 = ({ col, loading }: any) => {

  const history = useHistory()

  const searchByPopular = (item: any) => {
    
  }
 
  return (
    <Link to={`/activities/search?${encodeURIComponent(`v=1.0&country=${col && col.country}`)}`}>
      <div className={`nc-CardCategoryBox1 relative cursor-pointer items-center rounded-xl p-1 sm:p-1 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ]`}
        data-nc-id="CardCategoryBox1"
        onClick={() => searchByPopular(col)}
      >
        <div className="relative activity-destination w-full aspect-w-5 aspect-h-4 sm:aspect-h-5 overflow-hidden">
          <NcImage
            src={(loading) ? "" : ((col && col.image.indexOf("http://") == 0 || col && col.image.indexOf("https://") == 0) ? col.image : `${Config.MEDIA_URL}${col && col.image}`)}
            className="object-cover w-full h-full rounded-xl"
          />
          <h2 className="text-base font-medium absolute">
            <span className="line-clamp-1">{col && col.title}</span>
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default CardCategoryBox1;

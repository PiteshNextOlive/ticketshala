import React, { FC } from "react";
import { Link, useHistory } from 'react-router-dom'
import NcImage from "shared/NcImage/NcImage";
import Badge from "shared/Badge/Badge";
import { amountSeparator, getAirportCity, getAirportCountry, getCurrency, getFlightCountry } from 'components/Helper'
import { FaCar, FaClock, FaPlane } from "react-icons/fa"
import moment from "moment";

const CardCategoryBox1 = ({ taxonomy }: any) => {

  const history = useHistory()

  const searchByPopular = (item: any) => {
    const aCounrty = `${getAirportCountry(getFlightCountry(item.origin))}-${getAirportCountry(getFlightCountry(item.destination))}`
    
    //history.push(`/flights/search?${encodeURIComponent(`origin=${item.origin}&destination=${item.destination}&tripType=one&departDate=${moment().add(7, "days").format('YYYY-MM-DD')}&cabinClass=Y&country=${aCounrty}&adults=1&child=0&infant=0&v=1.0`)}`)
  }
 
  return (
    <div className={`nc-CardCategoryBox1 relative flex cursor-pointer items-center p-3 sm:p-6 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ]`}
      data-nc-id="CardCategoryBox1"
      onClick={() => searchByPopular(taxonomy)}
    >
      <div className="relative flex items-center justify-center w-12 h-12 border bg-neutral-100 dark:bg-neutral-700 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full overflow-hidden">
       <FaCar size={22}  />
      </div>
      <div className="ml-4 flex-grow overflow-hidden">
        <h2 className="text-base font-medium">
          <span className="line-clamp-2">{taxonomy.origin} - {taxonomy.destination}</span>
        </h2>
      </div>
    </div>
  );
};

export default CardCategoryBox1;

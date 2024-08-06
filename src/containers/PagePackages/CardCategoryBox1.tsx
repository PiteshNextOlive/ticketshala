import React, { FC } from "react";
import { Link, useHistory } from 'react-router-dom'
import NcImage from "shared/NcImage/NcImage"; 
import Config from './../../config.json';

const CardCategoryBox1 = ({ col, loading }: any) => {

  const history = useHistory()

  const searchByPopular = (item: any) => {
    
  }
 
  return (
    <Link to={`/packages/search?${encodeURIComponent(`v=1.0&country=${col && col.country}`)}`}>
      <div className={`nc-CardCategoryBox1 relative flex cursor-pointer items-center p-3 sm:p-6 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ]`}
        data-nc-id="CardCategoryBox1"
        onClick={() => searchByPopular(col)}
      >
        <div className="relative flex items-center justify-center w-12 h-12 border bg-neutral-100 rounded-full overflow-hidden">
          <NcImage
            src={(loading) ? "" : ((col && col.image.indexOf("http://") == 0 || col && col.image.indexOf("https://") == 0) ? col.image : `${Config.MEDIA_URL}${col && col.image}`)}
            className="object-cover w-full h-full rounded-2xl"
          />
        </div>
        <div className="ml-4 flex-grow overflow-hidden">
          <h2 className="text-base font-medium">
            <span className="line-clamp-1">{col && col.title}</span>
          </h2>
          <span
            className={`block mt-2 text-sm text-neutral-500 dark:text-neutral-400`}
          >
            {col && col.desc}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CardCategoryBox1;

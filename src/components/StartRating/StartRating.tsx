import { StarIcon } from "@heroicons/react/solid";
import React, { FC } from "react";
import { getRatingLabel } from 'components/Helper';

export interface StartRatingProps {
  className?: string;
  point?: any;
  reviewCount?: number;
}

const StartRating: FC<StartRatingProps> = ({
  className = "",
  point = 4.5,
  reviewCount = 0,
}) => {
  return (
    <div className={`nc-StartRating flex items-center justify-center space-x-1 text-sm  ${className}`}
      data-nc-id="StartRating"
    > 
      {(point === 0) ?
      <span className="bg-amber-300 text-xs p-2">New to ticketshala.com</span>
      : 
      <div className="rating-badge text-xs w-32">
        <span className="font-bold text-sm">{point}</span>/5 <span className="ml-2 font-medium">({getRatingLabel(point)})</span>
        {/*<span className="text-neutral-500 dark:text-neutral-400">
          {reviewCount} reviews
        </span>*/}
      </div>
      }
    </div>
  );
};

export default StartRating;

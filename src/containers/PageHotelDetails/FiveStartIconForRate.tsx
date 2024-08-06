import { StarIcon } from "@heroicons/react/solid";
import React, { FC, useEffect } from "react";
import { useState } from "react";

export interface FiveStartIconForRateProps {
  className?: string;
  iconClass?: string;
  category?: any;
}

const FiveStartIconForRate: FC<FiveStartIconForRateProps> = ({
  className = "",
  iconClass = "w-5 h-5",
  category = 0,
}) => {
  const [point, setPoint] = useState(0);

  useEffect(() => {
    setPoint(category);
  }, [category]);

  return (
    <>
      {(category && category > 0) ?
        <div className={`mt-2 mb-2 flex items-center text-neutral-300`}>
          {[1, 2, 3, 4, 5].slice(1, 3).map((item) => {
            return (
              <StarIcon
                key={item}
                className={`text-neutral-900 ${iconClass}`}
              />
            );
          })}
        </div>
      : null }
    </>
  );
};

export default FiveStartIconForRate;

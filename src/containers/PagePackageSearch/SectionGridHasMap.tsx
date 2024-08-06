import React, { FC, useState } from "react";
import StayCardH from "./StayCardH";
import Pagination from "shared/Pagination/Pagination";

export interface SectionGridHasMapProps {}

const SectionGridHasMap  = ({ packageData }: any) => {
 
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full flex-shrink-0">
          {(packageData && packageData.length > 0) ? 
            <>
            <div className="grid grid-cols-1 gap-8">
              {packageData.map((item: any) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setCurrentHoverID((_) => item.id)}
                  onMouseLeave={() => setCurrentHoverID((_) => -1)}
                >
                  <StayCardH data={item} />
                </div>
              ))}
            </div>
          </>
          : null }
        </div>

      </div>
    </div>
  );
};

export default SectionGridHasMap;

import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import ClearDataButton from "./ClearDataButton";
import { useRef } from "react";
import { FaMapMarkerAlt, FaPlaneDeparture } from "react-icons/fa"
import Packages from 'data/jsons/__countries.json'
import { Service } from 'services/Service';

export interface LocationInputProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  onInputDone?: (value: string) => void;
  onInputChange?: (value: any) => void;
  placeHolder?: string;
  desc?: string;
  className?: string;
  autoFocus?: boolean;
  defaultFocus?: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  defaultValue,
  autoFocus = false,
  onChange,
  onInputDone,
  onInputChange,
  defaultFocus = false,
  placeHolder = "Location",
  desc = "Where are you going?",
  className = "nc-flex-1.5",
}) => {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);
  const [anotherValue, setAnotherValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [packageCity, setPackageCity] = useState([]);
  const [userCCode, setUserCCode] = useState('BD');
  
  useEffect(() => {
    if (defaultValue) {
      const dVal = defaultValue.split("_")
      const country = Packages.filter((item: any) => item.iso2 === dVal[0])
      if (dVal[2]) {
        setValue(dVal[2])
      } else {
        setValue(country[0].name)
      }
    }
  }, [defaultValue]);
 
  useEffect(() => {
    setShowPopover(autoFocus);
  }, [autoFocus]);

  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    showPopover && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
  }, [showPopover]);

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover, focusedInput]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setShowPopover(false);
  };

  const getUserLocation = async () => {
    const url = 'https://ipapi.co/json/'
    try {
      const response = await fetch(url, {
        method: 'GET'
      })
      return await response.json()
    } catch (error) {
      return null
    }
    
  }

  useEffect(() => {
    {/*getUserLocation().then(response => {
      if (response !== null) {
        setUserCCode(response.country_code)
      }
    })*/}
  }, [])

  const handleSelectLocation = (item: any) => {
    const code = (item.cname) ? item.ccode : `${item.cd}_${item.cc}_${item.dn}`
    const name = (item.cname) ? item.cname : item.dn
    setValue(name);
    setShowPopover(false);
    onInputDone && onInputDone(code);
  };
  
  const handleChange = (e: any) => {
    setValue(e.target.value)
    
    if(e.target.value.length > 2) {
      Service.post({ url: '/data/destination', body: JSON.stringify({ keyword: e.target.value, type: 'package' }) })
      .then((response) => {
        if (response) {
          const countryPackages: any = Packages.filter(item => { return (item.name.toLowerCase() === e.target.value.toLowerCase()) })
          
          if (response.data.length > 0) {
            if(countryPackages && countryPackages.length > 0) {
              response.data.unshift({
                cname: countryPackages[0].name,
                ccode: countryPackages[0].iso2
              })
            }
            setPackageCity(response.data)
          } else {
            setPackageCity([])
          }
        }
      })
    }
  }

  const renderSearchValue = () => {
    return (
      <>
        {packageCity.map((res: any, key) => (
          <span onClick={() => handleSelectLocation(res)}
            key={key}
            className="c-search-res-items flex px-3 sm:px-3 items-center space-x-3 sm:space-x-4 py-3 sm:py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <span className="block svg-bg text-neutral-400">
              <FaMapMarkerAlt className="mr-1 h-3 w-3" size='20' aria-hidden="true" />
            </span>
            <div className='flex items-center w-full justify-between'>
              {(res.cname) ?
                <><div><span className="font-medium text-neutral-700 dark:text-neutral-200">{res.cname}</span></div> <span className="font-medium text-xs text-neutral-400 dark:text-neutral-200">Country</span></>
              : ((res.dn && res.cn === "") ?
              <><div><span className="font-medium text-neutral-700 dark:text-neutral-200">{res.dn}</span></div> <span className="font-medium text-xs text-neutral-400 dark:text-neutral-200">Package</span></>
              :
              <><div><span className="font-medium text-neutral-700 dark:text-neutral-200">{res.dn}</span>, <span className="font-medium text-neutral-400 dark:text-neutral-200">{res.cn}</span></div> <span className="font-medium text-xs text-neutral-400 dark:text-neutral-200">City</span></>
              )}
            </div>
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={`relative locations flex [ nc-flex-1 ]`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex flex-1 relative [ nc-hero-field-padding ] w-full bg-white dark:bg-neutral-800 flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${
          showPopover ? " dark:bg-neutral-800" : ""
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nc-icon-field"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg font-bigger font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={focusedInput}
            onChange={(e) => { handleChange(e) }}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => { setValue(""); setAnotherValue(""); onInputDone && onInputDone(""); }} />
          )}
        </div>
      </div>
      {value && showPopover && (
        <div className="c-search-res-dropDown absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 shadow-xl max-h-96 overflow-y-auto">
          {value ? renderSearchValue() : null}
        </div>
      )}
    </div>
  );
};

export default LocationInput;

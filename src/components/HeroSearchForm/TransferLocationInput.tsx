import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import ClearDataButton from "./ClearDataButton";
import { useRef } from "react";
import { FaHotel, FaMapMarkerAlt, FaPlaneDeparture } from "react-icons/fa"
import Airports from 'data/jsons/__airports.json'
import { Service } from 'services/Service';

export interface LocationInputProps {
  defaultValue: string;
  countryValue: string;
  onChange?: (value: string) => void;
  onInputDone?: (value: any) => void;
  placeHolder?: string;
  desc?: string;
  className?: string;
  autoFocus?: boolean;
  defaultFocus?: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  defaultValue,
  countryValue,
  autoFocus = false,
  onChange,
  onInputDone,
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
  const [locations, setLocations] = useState([]);
  const [searching, setSearching] = useState(false);
  
  useEffect(() => {

    if (defaultValue) {
      setValue(defaultValue)
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
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setShowPopover(false);
  };

  const handleChange = (value: any) => {
    setValue(value)
    const res: any = []
    if(value.length > 2) {

      const iataCodes: any = Airports.filter(item => { return (countryValue !== '' ? (item.country_code === countryValue && (item.iata_code.toLowerCase() === value.toLowerCase() || item.name.toLowerCase().includes(value.toLowerCase()) || item.city.toLowerCase().includes(value.toLowerCase()))) : (item.iata_code.toLowerCase() === value.toLowerCase() || item.name.toLowerCase().includes(value.toLowerCase()) || item.city.toLowerCase().includes(value.toLowerCase()))) })

      Service.post({ url: '/data/landmark', body: JSON.stringify({ country: countryValue, keyword: value }) })
      .then((response) => {
        if (response) {

          if (iataCodes && iataCodes.length > 0) {
            for (var i = 0; i < iataCodes.length; i++) {
              response.data.unshift({
                c: iataCodes[i].iata_code,
                n: iataCodes[i].name,
                a: `${iataCodes[i].city}, ${iataCodes[i].country}`,
                t: `flight`
              })
            }
          }

          setLocations(response.data)
        }

      })
    }
  }

  const handleSelectLocation = (item: any) => {
    setValue(item.n);
    setShowPopover(false);
    const code = item.c
    onInputDone && onInputDone(code);
  };
  
  const renderSearchValue = () => {
    return (
      <>
        {locations.map((res: any, key) => (
          <span onClick={() => handleSelectLocation(res)}
            key={key}
            className="c-search-res-items flex px-3 sm:px-3 items-center space-x-3 sm:space-x-4 py-3 sm:py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <span className="block svg-bg text-neutral-400">
              {(res && res.t && res.t === 'flight') ?
                <FaPlaneDeparture className="mr-1 h-3 w-3" aria-hidden="true" />
              : 
                <FaHotel className="mr-1 h-3 w-3" aria-hidden="true" />
              }
            </span>
            <div className=''>
              <span className="font-medium text-neutral-700 dark:text-neutral-200">{res.n}</span>
              <span className="block font-medium text-sm text-neutral-400 dark:text-neutral-200">{(res && res.t && res.t === 'flight') ? <>[{res.c}]</> : null} {res.a}</span>
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
        className={`flex flex-1 relative [ nc-hero-field-padding ] w-full flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${
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
            onChange={(e) => handleChange(e.currentTarget.value)}
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light ">
            <span className="line-clamp-1">{desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => { setValue(""); setAnotherValue(""); onInputDone && onInputDone(null) }} />
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

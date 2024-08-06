import React, { useState } from "react";
import { FC } from "react";
import { useEffect } from "react";
import ClearDataButton from "./ClearDataButton";
import { useRef } from "react";
import { FaPlaneDeparture } from "react-icons/fa"
import airports from '../../data/jsons/__airports.json'
import { getAirportCountry } from 'components/Helper'

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
  type?: string;
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
  type
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue);
  const [anotherValue, setAnotherValue] = useState("");
  const [anotherCityValue, setAnotherCityValue] = useState("");
  const [countryValue, setCountryValue]: any = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  
  useEffect(() => {
    if (defaultValue) {
      const airport = airports.filter((item) => item.iata_code === defaultValue)
      if (airport) {
        setValue(airport[0].city);
        setAnotherValue(airport[0].iata_code);
        setAnotherCityValue(airport[0].name);
        setCountryValue(getAirportCountry(airport[0].country));
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

  const handleSelectLocation = (item: any) => {
    setValue(item.city);
    onInputDone && onInputDone(item.iata_code);
    setShowPopover(false);
    setAnotherValue(item.iata_code)
    setAnotherCityValue(item.name)
    onInputChange && onInputChange(getAirportCountry(item.country))
  };
  
  const handleChange = (value: string) => {
    setValue(value)
  }

  const renderSearchValue = () => {
    return (
      <>
        {airports.filter(item => item.city.toLowerCase().includes(value.toLowerCase()) || item.iata_code.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase()))
        .map(res => (
          <div
            onClick={() => handleSelectLocation(res)}
            key={`${res.iata_code}_${res.city}`}
            className="c-search-res-items flex px-3 sm:px-3 items-center space-x-3 sm:space-x-4 py-3 sm:py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <span className="block svg-bg text-neutral-400">
              <FaPlaneDeparture className="mr-1 h-4 w-4" aria-hidden="true" />
            </span>
            <div className=''>
              <span className="font-medium text-neutral-700 dark:text-neutral-200">{res.city}, {res.country}</span>
              <span className="font-medium text-neutral-400 dark:text-neutral-200"> ({res.iata_code})</span>
              <span className="block font-light text-sm text-neutral-400"> {res.name}</span>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`relative locations flex [ nc-flex-1 ]`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex flex-1 dark:bg-neutral-800 relative [ nc-hero-field-padding ] w-full flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left  ${
          showPopover ? " dark:bg-neutral-800" : ""
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          {(type === 'departure') && <i className="las la-plane-departure text-4xl"></i> }
          {(type === 'arrival') && <i className="las la-plane-arrival text-4xl"></i> }
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
            <span className="line-clamp-1">{!!value ? `${(anotherValue !== "") ? `${anotherValue},` : ''} ${(anotherCityValue !== "") ? anotherCityValue : ''}` : desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => { setValue(""); setAnotherValue(""); setAnotherCityValue(""); setCountryValue(""); onInputDone && onInputDone(""); }} />
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

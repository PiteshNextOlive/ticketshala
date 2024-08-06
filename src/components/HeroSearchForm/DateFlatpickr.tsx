import React, { useEffect, useState } from "react";
import { SingleDatePicker, AnchorDirectionShape } from "react-dates";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import moment from "moment";
import useWindowSize from "hooks/useWindowResize";
import Flatpickr from "react-flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect"
import "flatpickr/dist/plugins/monthSelect/style.css"
import "flatpickr/dist/themes/light.css"
import flatpickr from "flatpickr";

export interface DateSingleInputProps {
  defaultValue: moment.Moment | null;
  onChange?: (date: moment.Moment | null) => void;
  defaultFocus?: boolean;
  placeHolder?: string;
  trip?: string;
  fieldClassName?: string;
  onFocusChange: (focused: boolean) => void;
  className?: string;
  anchorDirection?: AnchorDirectionShape;
  minDate?: string;
  dateFormat?: string;
}

const DateSingleInputProps: FC<DateSingleInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = false,
  placeHolder = "Date",
  onFocusChange,
  anchorDirection,
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
  minDate,
  dateFormat
}) => {

  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [startDate, setStartDate] = useState(defaultValue);
  const [picker, setPicker]: any = useState(null)
  const [openClicked, setOpenClicked]: any = useState(false)

  const windowSize = useWindowSize();

  useEffect(() => {
    if (defaultValue) {
      setStartDate(moment(defaultValue));
    } else {
      setStartDate(null)
    }
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  useEffect(() => {
    if (onChange) {
      onChange(startDate);
    }
  }, []);

  const handleClearData = () => {
    setStartDate(null);
    if (onChange) {
      onChange(null)
    }
  };

  const handleDateFocusChange = (arg: { focused: boolean }) => {
    const fp: any = flatpickr("#range-picker", {
      minDate: moment().format('YYYY'),
      enableTime: false,
      altInput: false,
      plugins: [(monthSelectPlugin as any)({ shorthand: true, dateFormat: "M Y" })],
      onChange: (date) => handleChange(date),
      disableMobile: true
    })
   
    fp.open()
    setFocusedInput(arg.focused);
    onFocusChange && onFocusChange(arg.focused);
  };

  const handleChange = (data: any) => {
    setStartDate(data[0]);
    if (onChange) {
      onChange(data[0]);
    }
  }

  const renderInputCheckInDate = () => {
    const focused = focusedInput;
    return (
      <div
        className={`flex w-full bg-white dark:bg-neutral-800 relative ${fieldClassName} px-4 items-center space-x-3 cursor-pointer`}
        onClick={() => handleDateFocusChange({ focused: true })}
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <span className="font-bigger block xl:text-lg font-semibold">
            {startDate ? moment(startDate).format((dateFormat) ? dateFormat : "MMM'YY") : <>{placeHolder}<span className="ml-1 text-sm text-neutral-400 leading-none font-light">(Optional)</span></>}
          </span>
          <span className="block mt-2 text-sm text-neutral-400 leading-none font-light">
            {startDate ? `During Month` : `During Month`}
          </span>
          {startDate && (
            <ClearDataButton onClick={() => handleClearData()} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative flex ${className}`} style={{ flex: "1 0 0%" }}>
      <div className="absolute abs-picker inset-x-2 bottom-2">
        <input
          id='range-picker'
          name='date-picker'
          className='form-control w-10 dark:bg-neutral-900 border-none font-bigger-size' />
      </div>

      {renderInputCheckInDate()}
    </div>
  );
};

export default DateSingleInputProps;

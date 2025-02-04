import React, { useEffect, useState } from "react";
import {
  AnchorDirectionShape,
  DateRangePicker,
  FocusedInputShape,
} from "react-dates";
import { DateRage } from "./StaySearchForm";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import useWindowSize from "hooks/useWindowResize";

type Fields = "Check-In" | "Check-Out";

export interface StayDatesRangeInputProps {
  defaultValue: DateRage;
  defaultFocus?: FocusedInputShape | null;
  onChange?: (data: DateRage) => void;
  onFocusChange?: (focus: FocusedInputShape | null) => void;
  fieldClassName?: string;
  wrapClassName?: string;
  numberOfMonths?: number;
  anchorDirection?: AnchorDirectionShape;
}

const HotelDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  defaultValue,
  onChange,
  defaultFocus = null,
  onFocusChange,
  fieldClassName = "[ nc-hero-field-padding ]",
  wrapClassName = "divide-y divide-neutral-200 lg:divide-y-0 md:border-l md:border-r border-neutral-200 lg:border-none",
  numberOfMonths,
  anchorDirection,
}) => {
  const [focusedInput, setFocusedInput] = useState(defaultFocus);
  const [stateDate, setStateDate] = useState(defaultValue);

  const windowSize = useWindowSize();

  useEffect(() => {
    setStateDate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setFocusedInput(defaultFocus);
  }, [defaultFocus]);

  useEffect(() => {
    if (onChange) {
      onChange(stateDate);
    }
  }, [stateDate]);

  const handleClearData = (field: Fields) => {
    switch (field) {
      case "Check-In": {
        return setStateDate((date) => ({ ...date, startDate: null }));
      }
      case "Check-Out": {
        return setStateDate((date) => ({ ...date, endDate: null }));
      }

      default:
        break;
    }
  };

  const handleDateFocusChange = (focus: FocusedInputShape | null) => {
    setFocusedInput(focus);
    onFocusChange && onFocusChange(focus);
  };

  const renderInputCheckInDate = () => {
    const focused = focusedInput === "startDate";
    return (
      <div
        className={`relative flex flex-1 ${fieldClassName} flex-shrink-0 items-center space-x-3 cursor-pointer`}
        onClick={() => handleDateFocusChange("startDate")}
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
          <span className="block xl:text-lg font-semibold">
            {stateDate.startDate
              ? stateDate.startDate.format("D MMM'YY")
              : "Check-In"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.startDate ? "Check-In" : `Add Date`}
          </span>
          {stateDate.startDate && focused && (
            <ClearDataButton onClick={() => handleClearData("Check-In")} />
          )}
        </div>
      </div>
    );
  };

  const renderInputCheckOutDate = () => {
    const focused = focusedInput === "endDate";
    return (
      <div
        className={`relative flex flex-1 ${fieldClassName} flex-shrink-0 items-center space-x-3 cursor-pointer`}
        onClick={() => handleDateFocusChange("endDate")}
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
          <span className="block xl:text-lg font-semibold">
            {stateDate.endDate
              ? stateDate.endDate.format("D MMM'YY")
              : "Check-Out"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {stateDate.endDate ? "Check-Out" : `Add Date`}
          </span>
          {stateDate.endDate && focused && (
            <ClearDataButton onClick={() => handleClearData("Check-Out")} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex z-10 [ nc-flex-1 ] ">
      <div className="absolute inset-x-0 bottom-0">
        <DateRangePicker
          startDate={stateDate.startDate}
          endDate={stateDate.endDate}
          focusedInput={focusedInput}
          onDatesChange={(date) => { setStateDate(date); (focusedInput === "endDate") && setFocusedInput(null) }}
          onFocusChange={handleDateFocusChange}
          numberOfMonths={
            numberOfMonths || (windowSize.width <= 1024 ? 1 : undefined)
          }
          startDateId={"nc-hero-stay-startDateId"}
          endDateId={"nc-hero-stay-endDateId"}
          daySize={windowSize.width > 500 ? 56 : undefined}
          orientation={"horizontal"}
          showClearDates
          noBorder
          keepOpenOnDateSelect
          hideKeyboardShortcutsPanel
          anchorDirection={anchorDirection}
        />
      </div>

      <div
        className={`flex flex-col lg:flex-row lg:items-center w-full flex-shrink-0 relative  ${wrapClassName}`}
      >
        {renderInputCheckInDate()}

        {renderInputCheckOutDate()}
      </div>
    </div>
  );
};

export default HotelDatesRangeInput;

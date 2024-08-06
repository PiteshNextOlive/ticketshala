import React, { useEffect, useState } from "react";
import { SingleDatePicker, AnchorDirectionShape } from "react-dates";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import moment from "moment";
import useWindowSize from "hooks/useWindowResize";

export interface DateSingleInputProps {
  defaultValue: moment.Moment | null;
  onChange?: (date: moment.Moment | null) => void;
  defaultFocus?: boolean;
  placeHolder?: string;
  trip?:string;
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
    setFocusedInput(arg.focused);
    onFocusChange && onFocusChange(arg.focused);
  };

  const handleChange = (data: any) => {
    if (onChange) {
      onChange(data);
    }
  }

  const renderInputCheckInDate = () => {
    const focused = focusedInput;
    return (
      <div
        className={`flex w-full relative ${fieldClassName} px-4 items-center space-x-3 cursor-pointer`}
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
          <span className="block xl:text-lg font-semibold">
            {startDate ? moment(startDate).format((dateFormat) ? dateFormat : "D MMM'YY") : placeHolder}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {startDate ? placeHolder : `Add date`}
          </span>
          {startDate && (
            <ClearDataButton onClick={() => handleClearData()} />
          )}
        </div>
      </div>
    );
  };

  {/******** isOutsideRange ********/}
  const isBeforeDay = (a: any, b: any) => {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  
    const aYear = a.year();
    const aMonth = a.month();
  
    const bYear = b.year();
    const bMonth = b.month();
  
    const isSameYear = aYear === bYear;
    const isSameMonth = aMonth === bMonth;
  
    if (isSameYear && isSameMonth) return a.date() < b.date();
    if (isSameYear) return aMonth < bMonth;
    return aYear < bYear;
  }

  const isAfterDay = (a: any, b: any) => {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
    return !isBeforeDay(a, b);
  }

  const isInclusivelyAfterDay = (a: any, b: any) => {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
    return !isBeforeDay(a, b);
  }

  const isInclusivelyBeforeDay = (a: any, b: any) => {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
    return !isAfterDay(a, b);
  }

  const minD = moment(minDate)
  const maxD = moment().add(2, 'years').endOf('year')
  const isOutsideRange = (day: any) => isInclusivelyBeforeDay(day, minD) || isInclusivelyAfterDay(day, maxD)
  {/******** isOutsideRange ********/}
  
  return (
    <div className={`relative dark:bg-neutral-800 flex ${className}`} style={{ flex: "1 0 0%" }}>
        <div className="absolute inset-x-0 bottom-0">
          <SingleDatePicker
            date={startDate}
            onDateChange={(date) => { setStartDate(date); handleChange(date); handleDateFocusChange({ focused: false }) }}
            id={"nc-hero-ExperiencesDateSingleInput-startDateId"}
            focused={focusedInput}
            daySize={windowSize.width > 425 ? 56 : undefined}
            orientation={"horizontal"}
            onFocusChange={handleDateFocusChange}
            noBorder
            hideKeyboardShortcutsPanel
            keepOpenOnDateSelect
            numberOfMonths={1}
            anchorDirection={anchorDirection}
            isOutsideRange={isOutsideRange}
            initialVisibleMonth={()=>  moment(minDate)}
          />
        </div>

        {renderInputCheckInDate()}
      </div>
  );
};

export default DateSingleInputProps;

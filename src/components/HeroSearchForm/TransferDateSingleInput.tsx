import React, { useEffect, useState } from "react";
import { SingleDatePicker, AnchorDirectionShape } from "react-dates";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import moment from "moment";
import useWindowSize from "hooks/useWindowResize";
import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";

type Fields = "pickUp" | "dropOff";

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
  const [stateTimeRage, setStateTimeRage] = useState({
    startTime: "10:00 AM"
  })

  useEffect(() => {

    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    const time: any = params.get('time');
    if (time !== null) {
      setStateTimeRage((state: any) => ({ ...state, startTime: moment(time).format('LT') }))
    }

  }, [])

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
      const dd = `${moment(data).format('YYYY-MM-DD')}`
      setStartDate(data)
      const dt = moment(stateTimeRage.startTime, ["h:mm A"]).format("HH:mm");
      onChange(moment(`${dd} ${dt}`));
    }
  }

  const handleTimeChange = (time: any) => {
    if (onChange) {
      setStateTimeRage((state: any) => ({ ...state, startTime: time }))

      const dd = `${moment(startDate).format('YYYY-MM-DD')}`
      const dt = moment(time, ["h:mm A"]).format("HH:mm");
      onChange(moment(`${dd} ${dt}`));
    }
  }

  const renderEditTime = (field: Fields) => {
    const times = [
      "12:00 AM",
      "12:30 AM",
      "01:00 AM",
      "01:30 AM",
      "02:00 AM",
      "02:30 AM",
      "03:00 AM",
      "03:30 AM",
      "04:00 AM",
      "04:30 AM",
      "05:00 AM",
      "05:30 AM",
      "06:00 AM",
      "06:30 AM",
      "07:00 AM",
      "07:30 AM",
      "08:00 AM",
      "08:30 AM",
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
      "05:00 PM",
      "05:30 PM",
      "06:00 PM",
      "06:30 PM",
      "07:00 PM",
      "07:30 PM",
      "08:00 PM",
      "08:30 PM",
      "09:00 PM",
      "09:30 PM",
      "10:00 PM",
      "10:30 PM",
      "11:00 PM",
      "11:30 PM"
    ];
    let timeValue = stateTimeRage.startTime;

    return (
      <Listbox
        value={stateTimeRage.startTime}
        onChange={(time) => {
          if (field === "pickUp") {
            handleTimeChange(time)
          }
        }}
        as="div"
        className="relative flex-shrink-0"
      >
        <Listbox.Button className="focus:outline-none inline-flex items-center group">
          <span className="text-base sm:text-sm font-medium">
            {timeValue}
          </span>
          <span className="ml-1 absolute left-1/2 top-0 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-40 min-w-max py-1 mt-1 overflow-auto text-base bg-white dark:bg-neutral-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" style={{ width: '10rem' }}>
          {times.map((time, index) => (
            <Listbox.Option
              key={index}
              className={({ active }) =>
                `${active
                  ? "text-amber-900 bg-amber-100"
                  : "text-gray-900 dark:text-neutral-200"
                } cursor-default select-none relative py-2 pl-10 pr-4`
              }
              value={time}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={`${selected ? "font-medium" : "font-normal"
                      } block truncate`}
                  >
                    {time}
                  </span>
                  {selected ? (
                    <span
                      className={`${active ? "text-amber-600" : "text-amber-600"
                        }  absolute inset-y-0 left-0 flex items-center pl-3`}
                    >
                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    );
  };

  const renderInputCheckInDate = () => {
    const focused = focusedInput;
    return (
      <div className={`flex w-full relative ${fieldClassName} px-5 items-center space-x-3 cursor-pointer`}>
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

        <div className="flex-grow flex-shrink-0">
          <div className="absolute inset-0"
            onClick={() => handleDateFocusChange({ focused: true })}
          />
          <div className="inline-flex items-center text-base xl:text-lg font-semibold">
            <span className="block xl:text-lg font-semibold">
              {startDate ? moment(startDate).format((dateFormat) ? dateFormat : "D MMM'YY") : placeHolder}
            </span>
          </div>

          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {startDate ? renderEditTime("pickUp") : `Add Date & Time`}
          </span>
          {startDate && (
            <ClearDataButton onClick={() => handleClearData()} />
          )}
        </div>
      </div>
    );
  };

  {/******** isOutsideRange ********/ }
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
  {/******** isOutsideRange ********/ }

  return (
    <div className={`relative flex ${className}`} style={{ flex: "1 0 0%" }}>
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
          initialVisibleMonth={() => moment(minDate)}
        />
      </div>

      {renderInputCheckInDate()}
    </div>
  );
};

export default DateSingleInputProps;

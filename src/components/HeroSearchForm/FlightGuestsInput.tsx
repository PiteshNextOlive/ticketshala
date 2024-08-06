import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "components/NcInputNumber/NcInputNumber";
import Select from "shared/Select/Select"
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import { Label } from "reactstrap";

export interface GuestsInputProps {
  defaultValue: {
    guestAdults?: number;
    guestChildren?: number;
    guestInfants?: number;
    cabinClass?: string;
  };
  onChange?: (data: GuestsInputProps["defaultValue"]) => void;
  fieldClassName?: string;
}

const GuestsInput: FC<GuestsInputProps> = ({
  defaultValue,
  onChange,
  fieldClassName = "[ nc-hero-field-padding ]",
}) => {

  const [guestAdultsInputValue, setGuestAdultsInputValue]: any = useState(defaultValue.guestAdults || 1);
  const [guestChildrenInputValue, setGuestChildrenInputValue]: any = useState(defaultValue.guestChildren || 0);
  const [guestInfantsInputValue, setGuestInfantsInputValue]: any = useState(defaultValue.guestInfants || 0);
  const [guestClassValue, setGuestClassValue]: any = useState(defaultValue.cabinClass || 'Y');
  const [totalGuests, setTotalGuest]: any = useState(1);
  const [age, setAge]: any = useState([])


  const childAge = [
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 11, value: 11 }
  ]
  // USER EFFECT
  useEffect(() => {

    // SEARCH PARAM VALUE
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    if (params) {
      const adults: any = params.get('adults');
      const child: any = params.get('child');
      const infants: any = params.get('infant');
      const cabin: any = params.get('cabinClass');

      if (adults) setGuestAdultsInputValue(Number(adults));
      if (child) setGuestChildrenInputValue(Number(child));
      if (infants) setGuestInfantsInputValue(Number(infants));
      if (cabin) setGuestClassValue(cabin);

      setTotalGuest(parseInt(adults) + parseInt(child) + parseInt(infants))
    }
  }, []);

  const renderChildAges = () => {
    const childAges = [];
    for (let i = 0; i < guestChildrenInputValue; i++) {
      childAges.push(
        <>
          <Label className="mt-2">Child {i + 1} Age</Label>
          <Select
            className="rounded-1xl "
            name={`age${i + 1}`}
            value={age[i] || ''}
            onChange={(e) => {
              const newAges = [...age];
              newAges[i] = e.target.value;
              setAge(newAges);
            }}
          >
            {childAge &&
              childAge.map((item: any) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
          </Select>
        </>
      );
    }
    return childAges;
  };

  useEffect(() => {
    if (onChange) {
      onChange({
        guestAdults: guestAdultsInputValue,
        guestChildren: guestChildrenInputValue,
        guestInfants: guestInfantsInputValue,
        cabinClass: guestClassValue
      });

      setTotalGuest(parseInt(guestAdultsInputValue) + parseInt(guestChildrenInputValue) + parseInt(guestInfantsInputValue))
    }
  }, [guestAdultsInputValue, guestChildrenInputValue, guestInfantsInputValue, guestClassValue]);

  return (
    <Popover className="flex relative dark:bg-neutral-800 flight-guests">
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex text-left w-full items-center ${fieldClassName} space-x-3 focus:outline-none cursor-pointer ${open ? " dark:bg-neutral-800" : ""
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div className="flex-grow">
              <span className="block xl:text-lg font-semibold">
                {totalGuests || ""} {(totalGuests > 1) ? 'Travellers' : 'Traveller'}
              </span>
              <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                {guestClassValue ? ((guestClassValue === 'C') ? 'Business' : ((guestClassValue === 'F') ? 'First Class' : 'Economy')) : "Cabin Class"}
              </span>
              {!!totalGuests && open && (
                <ClearDataButton
                  onClick={() => console.log()}
                />
              )}
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-20 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-2xl shadow-xl">
              <NcInputNumber
                className="w-full"
                defaultValue={guestAdultsInputValue}
                onChange={(value) => { setGuestAdultsInputValue(value) }}
                max={(totalGuests >= 9) ? guestAdultsInputValue : 9}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
              />
              <NcInputNumber
                className="w-full mt-6"
                defaultValue={guestChildrenInputValue}
                onChange={(value) => { setGuestChildrenInputValue(value) }}
                max={(totalGuests < 9 && totalGuests - guestChildrenInputValue >= 4) ? totalGuests - guestChildrenInputValue : 9 - (guestAdultsInputValue + guestChildrenInputValue)}
                min={0}
                label="Children"
                desc="Ages 2–12"
              />

              <NcInputNumber
                className="w-full mt-6"
                defaultValue={guestInfantsInputValue}
                onChange={(value) => { setGuestInfantsInputValue(value) }}
                max={4}
                min={0}
                label="Infants"
                desc="Ages 0–2"
              />

              <Select className="w-full mt-6 rounded-1xl" value={guestClassValue} onChange={(e) => setGuestClassValue(e.target.value)}>
                <option value='Y'>Economy</option>
                <option value='C'>Business</option>
                <option value='F'>First Class</option>
              </Select>

            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;

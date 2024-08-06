import { Fragment, useState, useEffect, FC } from 'react'
import WidgetHeading1 from "./WidgetHeading1";
import Checkbox from "shared/Checkbox/Checkbox";
import { FaStar } from "react-icons/fa"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { amountSeparator, getCurrency } from 'components/Helper'

const percentFormatter = (v: any) => {
  return (
    <>
      <span className='currency-font'>{getCurrency('BDT')}</span>{amountSeparator(v)}
    </>
  )
}

const percentDurationFormatter = (v: any) => {
  return `${v}N`;
}

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const WidgetTags = ({ setSearching, categories, loading, getPackageList, reserFilter, themeFilter, budgetFilter, nightsFilter, hotelFilter, setIsOpenModal }: any) => {
  
  const [pricing, setPricing] = useState([1, 200000])
  const [priceDetails, setPriceDetails] = useState([1000, 50000])

  const [duration, setDuration] = useState([1, 20])
  const [durationDetails, setDurationDetails] = useState([1, 20])

  // FILTERS THEME //
  const handleTheme = (event: any) => {
    if (event.target.checked) {
      getPackageList('', '', '', event.target.value, false)
    } else {
      getPackageList()
    }
    setIsOpenModal(false)
    setSearching(true)
  }

  return (
    <div
      className={`nc-WidgetTags nc-widgetFilters rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 ${(loading) ? 'gray-widget' : ''}`}
      data-nc-id="WidgetTags"
    >
      <div className={`nc-WidgetHeading1 flex items-center justify-between p-4 xl:p-5 border-b border-neutral-200 dark:border-neutral-700`} data-nc-id="WidgetHeading1">
        <h2 className="flex flex-row items-center text-lg text-neutral-900 dark:text-neutral-100 font-semibold">
          <i className="las la-sliders-h mr-1"></i> Filters
        </h2>
        <span className="flex-shrink-0 filter reset block text-primary-700 dark:text-primary-500 font-semibold text-sm cursor-pointer" onClick={reserFilter}>
          Reset
        </span>
      </div>

      {/**** PRICE ****/}
      <div className={`nc-WidgetHeading1 flex items-center justify-between p-4 xl:p-5 border-b border-neutral-200 dark:border-neutral-700`}
        data-nc-id="WidgetHeading1"
      >
        <h2 className="text-sm text-neutral-900 dark:text-neutral-100 font-semibold flex-grow">
          Budgets {(budgetFilter && budgetFilter.length > 0) && <>(<span className='currency-font'>{getCurrency('BDT')}</span>{`${amountSeparator(budgetFilter[0])}`} - <span className='currency-font'>{getCurrency('BDT')}</span>{`${amountSeparator(budgetFilter[1])}`}) </>}
        </h2>
      </div>
      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
          <Range defaultValue={pricing} min={pricing[0]} max={pricing[1]} tipFormatter={percentFormatter} onAfterChange={(value: any) => { setSearching(true); getPackageList(value, '', '', '', false); setPricing(value) }} />
        </div>  
      </div>

      {/**** DAY NIGHTS ****/}
      <div className={`nc-WidgetHeading1 flex items-center justify-between p-4 xl:p-5 border-b border-neutral-200 dark:border-neutral-700`}
        data-nc-id="WidgetHeading1"
      >
        <h2 className="text-sm text-neutral-900 dark:text-neutral-100 font-semibold flex-grow">
          Durations {(nightsFilter && nightsFilter.length > 0) && <>({`${nightsFilter[0]}N - ${nightsFilter[1]}N`}) </>}
        </h2>
      </div>
      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
          <Range defaultValue={duration} min={duration[0]} max={duration[1]} tipFormatter={percentDurationFormatter} onAfterChange={(value: any) => { setSearching(true); getPackageList('', value, '', '', false); setDurationDetails(value) }} />
        </div>
      </div>

      {/**** THEMEs ****/}
      <WidgetHeading1
        title="Theme"
        viewAll={{ label: "", href: "/#" }}
      />
      <div className="flow-root">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
          {categories.map((item: any, key: any) => (
            <>
              <div className="flex items-center">
                <input
                  id={`theme${key}`}
                  name={`theme`}
                  type="radio"
                  value={item.slug}
                  className="focus:ring-primary-500 h-5 w-5 text-primary-500 border-neutral-500 !checked:bg-primary-500 bg-transparent"
                  checked={(themeFilter === item.slug)}
                  onChange={(e) => handleTheme(e)}
                />
                <label
                  htmlFor={`theme${key}`}
                  className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {item.title}
                </label>
              </div>
            </>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WidgetTags;

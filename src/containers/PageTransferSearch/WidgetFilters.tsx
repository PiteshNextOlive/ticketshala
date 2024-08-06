import { Fragment, useState, useEffect, FC } from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { amountSeparator, getCurrency, OpenNotification } from 'components/Helper'
import ButtonCircle from "shared/Button/ButtonCircle"

const percentFormatter = (v: any) => {
  return (
    <>
      <span className='currency-font'>{getCurrency('BDT')}</span>{amountSeparator(v)}
    </>
  )
}

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const WidgetTags = ({ loading, reserFilter, budgetFilter, handlePricing, priceFilter }: any) => {
  
  const [priceMin, setPriceMin]: any = useState(null);
  const [priceMax, setPriceMax]: any = useState(null);

  useEffect(() => {
    if (priceFilter) {
      const price = priceFilter.split('-')
      if (price.length > 0) {
        setPriceMin(Number(price[0]))
        if (price[1]) {
          setPriceMax(Number(price[1]))
        }
      }
    } else {
      setPriceMin(null)
      setPriceMax(null)
    }
  }, [priceFilter])
  const handleOwnPrice = () => {
    if (priceMin === null || priceMax === null) {
      OpenNotification('error', 'Oops!', 'Min and Max value can not be empty!', '', true)
      return false
    }

    if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
      OpenNotification('error', 'Oops!', 'Min value can not be greater then Max value!', '', true)
      return false
    }
    const pr = priceMin + '-' + priceMax
    handlePricing(pr)
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
          Price
        </h2>
      </div>
      <div className="p-5 flex items-end justify-between space-x-3">
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Min (<span className='currency-font'>৳</span>)
          </label>
          <div className="mt-1 relative rounded-md">
            <input
              type="text"
              min={1}
              value={priceMin !== null ? priceMin : ''}
              onChange={(e: any) => setPriceMin(e.target.value)}
              name="minPrice"
              id="minPrice"
              className="focus:ring-indigo-500 text-sm focus:border-indigo-500 block w-full pr-3 border-neutral-200 rounded-sm text-neutral-900"
              placeholder="Min"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Max (<span className='currency-font'>৳</span>)
          </label>
          <div className="mt-1 relative rounded-md">
            <input
              type="text"
              min={1}
              value={priceMax !== null ? priceMax : ''}
              onChange={(e: any) => setPriceMax(e.target.value)}
              name="maxPrice"
              id="maxPrice"
              className="focus:ring-indigo-500 text-sm focus:border-indigo-500 block w-full pr-3 border-neutral-200 rounded-sm text-neutral-900"
              placeholder="Max"
            />
          </div>
        </div>
        <div>
          <ButtonCircle onClick={handleOwnPrice} className='w-10 h-10 btn-go text-xs rounded-none'><i className="las la-arrow-right text-xl"></i></ButtonCircle>
        </div>
      </div>

    </div>
  );
};

export default WidgetTags;

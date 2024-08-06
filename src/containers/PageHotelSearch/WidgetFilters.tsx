import { Fragment, useState, useEffect, FC } from 'react'
import WidgetHeading1 from "./WidgetHeading1";
import Checkbox from "shared/Checkbox/Checkbox";
import { FaStar } from "react-icons/fa"
import showMap from "images/map-entry-point.png";
import { url } from 'inspector';
import Facilities from 'data/jsons/__facilities.json'
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Switch from "react-switch";
import { OpenNotification } from 'components/Helper'
import Input from "shared/Input/Input";
import ButtonCircle from "shared/Button/ButtonCircle";
import { StarIcon } from "@heroicons/react/solid";

const WidgetTags = ({ searching, showFullMapFixed, setShowFullMapFixed, setIsOpenModal, handlePricing, handleCategory, handleFacility, handleCancellation, handleHotelName, priceFilter, categoryFilter, facilityFilter, cancellationFilter, nameFilter, resetFilter }: any) => {

  const [facilityMore, setFacilityMore] = useState(10);
  const [priceMin, setPriceMin] = useState(1);
  const [priceMax, setPriceMax] = useState(10000);
  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [hotelName, setHotelName] = useState("");

  const handleToggle = (nextChecked: any) => {
    setCheckedSwitch(nextChecked)
  };
 
  useEffect(() => {
    setHotelName(nameFilter)
  }, [nameFilter])

  const popularData = [
    { label: 'Free Cancellation Available', value: 'free_cancellation' },
    { label: 'Pay At Hotel Available', value: 'pay_at_hotel' },
    { label: 'Free Breakfast Included', value: 'free_breakfast' }
  ]

  const priceData = [
    { label: 'Less than ৳ 5,000', value: '0-5000' },
    { label: '৳ 5,000 to ৳ 10,000', value: '5000-10000' },
    { label: '৳ 10,000 to ৳ 15,000', value: '10000-15000' },
    { label: '৳ 15,000 to ৳ 20,000', value: '15000-20000' },
    { label: 'Greater than ৳ 20,000', value: '20000' }
  ]

  const ratingData = [
    { label: 'Any', value: '<any' },
    { label: 'Fabulous 5', value: '5' },
    { label: 'Wonderful 4.5+', value: '4.5' },
    { label: 'Very Good 4+', value: '4' },
    { label: 'Good 3.5+', value: '3.5' }
  ]

  const classData = [
    { label: '5 STARS', value: '5EST' },
    { label: '4 STARS', value: '4EST' },
    { label: '3 STARS', value: '3EST' },
    { label: '2 STARS', value: '2EST' },
    { label: '1 STAR', value: '1EST' }
  ]

  const handleOwnPrice = () => {
    if (priceMin > priceMax) {
      OpenNotification('error', 'Oops!', 'Min value can not be greater then Max value!', '', true)
      return false
    }
    const pr = priceMin + '-' + priceMax
    handlePricing(pr)
  }

  return (
    <>
      <div className={`nc-WidgetTags widget-filters-map hidden sm:flex lg:flex mb-11 md:flex xl:flex items-center justify-center rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800`}>
        <img className='w-full' src={showMap} />
        <span className='absolute' onClick={() => { setShowFullMapFixed(!showFullMapFixed) }}>Show on map</span>
      </div>

      <div className={`nc-WidgetTags nc-widgetFilters rounded-xl mt-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800`}
        data-nc-id="WidgetTags"
      >
        <div className={`nc-WidgetHeading1 flex items-center justify-between p-4 xl:p-5 border-b border-neutral-200 dark:border-neutral-700`} data-nc-id="WidgetHeading1">
          <h2 className="flex flex-row items-center text-lg text-neutral-900 dark:text-neutral-100 font-semibold">
            <i className="las la-sliders-h mr-1"></i> Filters
          </h2>
          <span className="flex-shrink-0 block reset text-primary-700 dark:text-primary-500 font-semibold text-sm cursor-pointer" onClick={resetFilter}>
            Reset
          </span>
        </div>

      {/**** Search Hotel Name ****/}
     
      <div className="flow-root">
        <div className="p-5 relative min-w-sm">
          <Input
            aria-required
            placeholder="Search By Hotel Name"
            type="email"
            className='rounded-none'
            value={hotelName}
            fontClass="text-sm"
            onChange={(e) => setHotelName(e.target.value)}
          />
          <ButtonCircle type="button" onClick={() => handleHotelName(hotelName)}
            className="absolute transform top-1/2 -translate-y-1/2 right-6 rounded-none"
          >
            <i className="las la-arrow-right text-xl"></i>
          </ButtonCircle>
        </div>
      </div>

      {/**** Price Range ****/}
        <WidgetHeading1
          title="Price Range"
          subtitle='(Base Fare)'
          viewAll={{ label: "", href: "/#" }}
        />
        <div className="flow-root">
          <div className='p-5' style={{ marginLeft: '-5px'}}>
          <label>
            <Switch
              onChange={handleToggle}
              checked={checkedSwitch}
              className="react-switch"
              onHandleColor="#fff"
              onColor="#013366"
              checkedIcon={false}
              uncheckedIcon={false}
              activeBoxShadow="0px"
              height={20}
              width={40}
            />
            <span className='text-sm ml-3'>Set your own price</span>
          </label>
          </div>
          {(checkedSwitch) ?
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
                    value={priceMin}
                    onChange={(e: any) => setPriceMin(e.target.value)}
                    name="minPrice"
                    id="minPrice"
                    className="focus:ring-indigo-500 text-sm focus:border-indigo-500 block w-full pr-3 border-neutral-200 rounded-sm text-neutral-900"
                    placeholder="1"
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
                    value={priceMax}
                    onChange={(e: any) => setPriceMax(e.target.value)}
                    name="maxPrice"
                    id="maxPrice"
                    className="focus:ring-indigo-500 text-sm focus:border-indigo-500 block w-full pr-3 border-neutral-200 rounded-sm text-neutral-900"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div>
                <ButtonCircle onClick={handleOwnPrice} className='w-10 h-10 btn-go text-xs rounded-none'><i className="las la-arrow-right text-xl"></i></ButtonCircle>
              </div>
            </div>
          : 
            <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
              {priceData.map((item) => (
                <div className="flex items-center">
                  <input
                    id={item.label} name={'price'} type="radio" value={item.value}
                    className="focus:ring-primary-500 h-5 w-5 text-primary-500 border-neutral-500 !checked:bg-primary-500 bg-transparent"
                    onClick={(e: any) => handlePricing(e.target.value)}
                    checked={priceFilter === item.value}
                  />
                  <label htmlFor={item.label}
                    className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          }
        </div>

        {/**** Star Category ****/}
        <WidgetHeading1
          title="Star Category"
          viewAll={{ label: "", href: "/#" }}
        />
        <div className="flow-root">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
            {classData.map((item: any) => (
              <div className="flex items-center">
                <input
                  id={item.label}
                  name={'class'}
                  type="checkbox"
                  value={item.value}
                  checked={categoryFilter.indexOf(item.value) > -1}
                  className="focus:ring-primary-500 h-5 w-5 text-primary-500 border-neutral-500 !checked:bg-primary-500 bg-transparent"
                  onChange={handleCategory}
                />
                <label
                  htmlFor={item.label}
                  className="ml-3 flex flex-center text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <span className='w-16'>{item.label}</span> &nbsp; 
                  {[1, 2, 3, 4, 5].slice(0, item.value.split('EST')[0]).map((obj) => {
                    return (
                      <StarIcon
                        key={obj}
                        className={`text-yellow-500 w-5 h-5`}
                      />
                    );
                  })}
                </label>
              </div>
            ))}
          </div>

        </div>

        {/**** Cancellation Policy ****/}
        <WidgetHeading1
          title="Cancellation Policy"
          viewAll={{ label: "", href: "/#" }}
        />
        <div className="flow-root">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
            <div className="flex items-center">
              
              <Checkbox
                label='Free Cancellation'
                name='Free Cancellation'
                checked={cancellationFilter === true}
                onChange={handleCancellation}
              />
            </div>
          </div>

        </div>

        {/**** Amenities ****/}
        <WidgetHeading1
          title="Facility"
          viewAll={{ label: "", href: "/#" }}
        />
        <div className="flow-root">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
            {Facilities.slice(0, facilityMore).map((item) => (
              <Checkbox
                label={item.name}
                name={item.name}
                value={item.code}
                checked={facilityFilter.indexOf(item.code) > -1}
                onChange={handleFacility}
              />
            ))}
            {(facilityMore === 10) ?
              <span className='mt-2 text-primary font-semibold text-sm cursor-pointer' onClick={() => setFacilityMore(Facilities.length)}>Show {Facilities.length - 10} More</span>
              :
              <span className='mt-2 text-primary font-semibold text-sm cursor-pointer' onClick={() => setFacilityMore(10)}>Hide</span>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetTags;

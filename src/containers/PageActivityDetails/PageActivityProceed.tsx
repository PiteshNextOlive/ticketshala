import React, { FC, Fragment, useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom'
import moment from "moment";
import { Service, Storage } from 'services/Service';
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { amountSeparator, OpenNotification, getCurrency, eventTrack } from 'components/Helper';
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import Countries from 'data/jsons/__countries.json';
import NcImage from "shared/NcImage/NcImage";
import { getActivityValidate } from 'redux/actions/booking'
import { setLoginModalVisible } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'

import PhoneInput from 'components/PhoneInput'

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const ActivityProceedPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const { slug }: any = useParams()
  const history = useHistory()
  const dispatch = useDispatch();

  const [data, setData]: any = useState(null)
  const [dataOptions, setDataOptions]: any = useState(null)
  const [loading, setLoading] = useState(true)
  const [departureDate, setDepartureDate] = useState([])
  const [galleries, setGalleries] = useState([])
  const [travellers, setTravellers] = useState(1)
  const [nationality, setNationality]: any = useState([])

  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [infantCount, setInfantCount] = useState(0)
  const [countryCodeList, setCountryCodeList]: any = useState([])
  const [buttonDisable, setButtonDisable] = useState(false)

  const getActivityData = (params: any) => {
    setLoading(true)
    Service.post({ url: `/activities/detail`, body: JSON.stringify(params) })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          return false
        } else {
          setData(response.data)
          setGalleries(response.data.images)
          setDataOptions(response.data.options[0])
        }
      })
  }

  useEffect(() => {

    const userInfo = Storage.get('auth')

    if (userInfo) {
      setTimeout(() => {
        setValue('contactName', userInfo.name)
        setValue('contactEmail', userInfo.email)
        setValue('contactMobile', userInfo.phone)
      }, 2000)
    }

  }, [Storage])

  useEffect(() => {
    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    if (slug) {

      const paramData: any = {
        id: slug
      }

      let travellersCount = 0
      const quantity: any = []
      if (params.get('adults')) {
        setAdultCount(params.get('adults'))
        travellersCount += Number(params.get('adults'))
        quantity.push({ type: "ADT", qty: Number(params.get('adults')) })
      }
      if (params.get('child')) {
        setChildCount(params.get('child'))
        travellersCount += Number(params.get('child'))
        quantity.push({ type: "CNN", qty: Number(params.get('child')) })
      }
      if (params.get('infant')) {
        setInfantCount(params.get('infant'))
        travellersCount += Number(params.get('infant'))
        quantity.push({ type: "INF", qty: Number(params.get('infant')) })
      }
      if (params.get('depDate')) {
        setDepartureDate(params.get('depDate'))
        paramData.sDate = params.get('depDate')
        paramData.eDate = params.get('depDate')
      }

      paramData.qty = quantity

      setTravellers(travellersCount)

      getActivityData(paramData)

      const countryNew = Countries.sort((x, y) => { return (x.iso2 === 'BD' || x.iso2 === 'IN') ? -1 : (y.iso2 === 'BD' || y.iso2 === 'IN') ? 1 : 0; });
      setCountryCodeList(countryNew)
      setNationality(Countries)
    }
  }, [slug])

  // PROCEED TO BOOKING
  const onSubmit = (value: any) => {

    {/***** CHECK USER LOGIN******/ }
    const userData = Storage.get('auth');
    if (userData === null) {
      dispatch(setLoginModalVisible(true));
      return false
    }
    {/**************/ }

    const params: any = {
      id: dataOptions.id,
      from: moment(dataOptions.from).format('YYYY-MM-DD'),
      to: moment(dataOptions.to).format('YYYY-MM-DD')
    }

    const passangerInfo = []

    // ADULT DETAILS
    if (value.adultFirstName_0 !== "") {
      for (let i = 0; i < 1; i++) {
        const temp_data: any = {
          title: value[`adultTitle_${i}`],
          name: value[`adultFirstName_${i}`],
          surName: value[`adultLastName_${i}`],
          email: value.contactEmail,
          phone: value.contactMobile,
          address: value[`adultAddress_${i}`],
          zip: value[`adultZipcode_${i}`],
          country: value[`adultCountry_${i}`]
        }

        if (value[`adultFirstName_${i}`] !== "" && value[`adultLastName_${i}`] !== "") {
          passangerInfo.push(temp_data)
        }
      }
    }

    params.contactPerson = passangerInfo[0]

    setButtonDisable(true)
    dispatch(getActivityValidate(params))
    setTimeout(() => {
      setButtonDisable(false)
      history.push(`/activity/checkout?${encodeURIComponent(`activityId=${dataOptions.id}`)}`)
    }, 1000);

  }

  const handleOptions = (event: any) => {
    if (event.target.checked) {
      const opt = data.options[event.target.value]
      setDataOptions(opt)
    }
  }

  const _renderLoading = () => {
    return (
      <>
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h3 className="blocl text-lg pt-5 text-neutral-400">Please Wait, Fetching Details...</h3>
      </>
    );
  };

  const renderSection1 = () => {
    return (
      <>
        <div className="listingSection__wrap !space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="flex-shrink-0 w-full sm:w-40">
              <div className=" aspect-w-5 aspect-h-5 sm:aspect-h-4 rounded-2xl overflow-hidden">
                <NcImage src={galleries[0]} />
              </div>
            </div>
            <div className="sm:px-5 space-y-3">
              {/* 2 */}
              <h2 className="text-2xl sm:text-2xl lg:text-2xl font-semibold">{data && data.name}</h2>

              {/* 3 */}
              {(data && data.duration.v && data.duration.v !== '') &&
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
                  <span className="mb-5 sm:mb-0">
                    <i className="las la-calendar-alt"></i>
                    <span className="ml-1">Duration: {data && data.duration.v} {data && data.duration.m}</span>
                  </span>
                </div>
              }

              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
                <span className="mb-5 sm:mb-0">
                  <i className="las la-map-marker-alt"></i>
                  <span className="ml-1">{data && data.places.join()}, {data && data.country}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {(data && data.options && data.options.length > 1) &&
          <div className="listingSection__wrap">
            <h2 className="text-2xl font-semibold">Meeting Point:</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            {data && data.options.map((item: any, key: any) => (
              <>
                <div className="flex items-center">
                  <input
                    id={item.id}
                    name={'class'}
                    type="radio"
                    defaultChecked={(key === 0)}
                    value={key}
                    onChange={handleOptions}
                    className="focus:ring-primary-500 h-5 w-5 text-primary-500 border-neutral-500 !checked:bg-primary-500 bg-transparent"
                  />
                  <label
                    htmlFor={item.name}
                    className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {item.name}
                  </label>
                </div>
              </>
            ))}
          </div>
        }
      </>
    );
  };

  const renderSection2 = () => {

    return (
      <div className="listingSection__wrap p-8 bg-white dark:bg-neutral-900 mt-5 traveller-details">
        <div>
          <h2 className="text-2xl font-semibold">Traveller Details</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {[...Array(Number(1))].map((item, i) => (
          <div className='listingSection__wrap travellers p-4 bg-gray-100 dark:bg-neutral-800'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Title<span className="astrick">*</span></Label>
                <Input
                  type='select' id={`adultTitle_${i}`} name={`adultTitle_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: true })}
                  invalid={errors[`adultTitle_${i}`] && true}
                  onChange={(e) => {
                    setValue(`adultGender_${i}`, (e.target.value === 'mr') ? 'M' : ((e.target.value === 'ms' || e.target.value === 'mrs') ? 'F' : ''))
                  }}
                >
                  <option value='' >Title</option>
                  <option value='mr' >Mr</option>
                  <option value='ms' >Ms</option>
                  <option value='mrs' >Mrs</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">First Name<span className="astrick">*</span></Label>
                <Input
                  id={`adultFirstName_${i}`} name={`adultFirstName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="First Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`adultFirstName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Last Name<span className="astrick">*</span></Label>
                <Input
                  id={`adultLastName_${i}`} name={`adultLastName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Last Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`adultLastName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Address<span className="astrick">*</span></Label>
                <Input
                  id={`adultAddress_${i}`} name={`adultAddress_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Address"
                  innerRef={register({ required: true })}
                  invalid={errors[`adultAddress_${i}`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Zip Code<span className="astrick">*</span></Label>
                <Input
                  id={`adultZipcode_${i}`} name={`adultZipcode_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Zip Code"
                  innerRef={register({ required: true })}
                  invalid={errors[`adultZipcode_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value.trim().replace(/[^a-z0-9]/gi, '')) }}
                />
              </FormGroup>
              <FormGroup >
                <Label className='block mb-1' for="email">Country<span className="astrick">*</span></Label>
                <Input
                  type='select'
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  name={`adultCountry_${i}`}
                  id={`adultCountry_${i}`}
                  control={control}
                  innerRef={register({ required: true })}
                  invalid={errors[`adultCountry_${i}`] && true}
                >
                  <option value="">Country</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.name}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

          </div>
        ))}

      </div>
    );
  };

  const renderSection3 = () => {

    return (
      <div className="listingSection__wrap p-8 bg-white dark:bg-neutral-900 mt-5">
        <div>
          <h2 className="text-2xl font-semibold">Booking details will be sent to</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          <FormGroup>
            <Label className='block mb-1' for="email">Name<span className="astrick">*</span></Label>
            <Input id={`contactName`} name={`contactName`}
              className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
              placeholder='Name'
              innerRef={register({ required: true })}
              onInput={(e: any) => { e.target.value = (e.target.value).trim().toUpperCase() }}
              invalid={errors[`contactName`] && true}
            />
          </FormGroup>
          <FormGroup className='col-span-2'>
            <Label className='block mb-1' for="email">Email<span className="astrick">*</span></Label>
            <Input id={`contactEmail`} name={`contactEmail`}
              className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
              placeholder='Email'
              innerRef={register({ required: true })}
              invalid={errors[`contactEmail`] && true}
            />
          </FormGroup>
          <FormGroup>
            <Label className='block mb-1' for="email">Phone Number<span className="astrick">*</span></Label>
            <Controller
              control={control}
              id='contactMobile'
              name='contactMobile'
              innerRef={register({ required: true })}
              invalid={errors.contactMobile && true}
              rules={{ required: true }}
              defaultValue={false}
              render={({ onChange, value, name }) => (
                <PhoneInput value={value} name={name} onChange={onChange} />
              )}
            />
          </FormGroup>
        </div>
      </div>
    );
  };

  const fixedNumber = (num: any) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const renderSidebar = () => {

    const userInfo = Storage.get('auth');

    return (
      <>
        <div className="listingSection__wrap p-8 shadow-xl mt-11 sm:mt-0">
          {/* PRICE */}
          <div className="flex justify-between items-center">
            <div className='flex flex-col w-full'>
              <div className="text-3xl font-semibold">
                <span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.totalFare.currency)}</span> {dataOptions && dataOptions.rate && amountSeparator(Number(dataOptions.rate.totalFare.amount / travellers))}
                <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
                  /per person
                </span>
              </div>
            </div>
          </div>


          {/* SUM */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span>Base Fare ({`${travellers} Pax`})</span>
              <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.baseFare.currency)}</span> {dataOptions && dataOptions.rate && amountSeparator(Number(dataOptions.rate.baseFare.amount))}</div>
            </div>
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span>Fee & Taxes</span>
              <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.tax.currency)}</span> {dataOptions && dataOptions.rate && amountSeparator(0.00)}</div>
            </div>
            {(dataOptions && dataOptions.rate && dataOptions && dataOptions.rate.discount.amount > 0) &&
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.discount.currency)}</span>{dataOptions && dataOptions.rate && amountSeparator(dataOptions.rate.discount.amount)}</div>
              </div>
            }
            <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex justify-between font-semibold">
              <span>Grand Total</span>
              <div><span className='currency-font'>{dataOptions && dataOptions.rate && getCurrency(dataOptions.rate.totalFare.currency)}</span>{dataOptions && dataOptions.rate && amountSeparator(Number(dataOptions.rate.totalFare.amount))}</div>
            </div>
          </div>

          {/* SUBMIT */}
          <ButtonPrimary className='bg-secondary-900 w-full' disabled={buttonDisable} loading={buttonDisable}>Proceed To Booking</ButtonPrimary>

        </div>

        {(userInfo === null) ?
          <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 mt-8 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
            <div className="flex flex-col space-y-4">
              <h3 className="text-2xl font-semibold">Why <span className="text-primary">Signup</span> or <span className="text-primary">Login</span></h3>
              <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
              <div key={11} className="flex items-start space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span className="text-sm">Get access to Secret Deals.</span>
              </div>
              <div key={12} className="flex items-start space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span className="text-sm">Book Faster - we'll save & pre-enter your details.</span>
              </div>
              <div key={13} className="flex items-start space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span className="text-sm">Manage your bookings from one place.</span>
              </div>
            </div>
          </div>
          : null}
      </>
    );
  };

  const renderSection4 = () => {
    return (
      <></>
    );
  };

  return (
    <div className={`nc-ListingStayDetailPage py-11 ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* MAIn */}
        <main className="container mt-11 flex flex-col sm:flex-row">

          {(!loading) ?
            <>
              {/* CONTENT */}
              <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
                {renderSection1()}
                {renderSection2()}
                {renderSection3()}
                {renderSection4()}
              </div>

              {/* SIDEBAR */}
              <div className="lg:block flex-grow">
                <div className="sticky top-24">{renderSidebar()}</div>
              </div>
            </>
            :
            <div className="w-full p-5">
              <div className='flex flex-col justify-center items-center'>{_renderLoading()}</div>
            </div>
          }


        </main>
      </Form>
    </div>
  );
};

export default ActivityProceedPage;

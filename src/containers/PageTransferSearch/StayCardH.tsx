import React, { FC, Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { amountSeparator, OpenNotification, getCurrency, eventTrack } from 'components/Helper';
import NcImage from "shared/NcImage/NcImage";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import { FaMapMarkerAlt, FaMarker } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service, Storage } from 'services/Service';
import Countries from 'data/jsons/__countries.json';
import moment from "moment";
import { Tab } from "@headlessui/react";
import { setLoginModalVisible } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'

import PhoneInput from 'components/PhoneInput'

const StayCardH = ({ data }: any) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const history = useHistory()
  const dispatch = useDispatch();
  const [categories, setCategories]: any = useState([])
  const [galleryImgs, setGalleryImgs] = useState([])
  const [facilityMore, setFacilityMore] = useState(3);
  const [nationality, setNationality]: any = useState([])
  const [countryCodeList, setCountryCodeList]: any = useState([])
  const [coordinates, setCoordinates]: any = useState(null)
  const [buttonDisable, setButtonDisable] = useState(false)

  const [isOpenModalItinerary, setIsOpenModalItinerary] = useState(false);
  const [cardData, setCardData] = useState<any>([]);

  const openModalItinerary = (col: any) => {
    setCardData(col)
    setIsOpenModalItinerary(true);
  }

  // PROCEED TO PAYMENT
  const onSubmit = (value: any) => {

    {/***** CHECK USER LOGIN******/ }
    const userData = Storage.get('auth');
    if (userData === null) {
      dispatch(setLoginModalVisible(true));
      return false
    }
    {/**************/ }

    const params: any = {
      id: cardData.k,
      from: cardData.pickup.from,
      to: cardData.pickup.to
    }

    // ADULT DETAILS
    if (value.adultFirstName_0 !== "") {
      for (let i = 0; i < 1; i++) {
        const temp_data: any = {
          title: value[`adultTitle_${i}`],
          name: value[`adultFirstName_${i}`],
          surName: value[`adultLastName_${i}`],
          phone: value[`adultMobile_${i}`],
          email: value[`adultEmail_${i}`],
        }
        params.contactPerson = temp_data
      }
    }

    if (typeof params.contactPerson.title === 'undefined' && typeof params.contactPerson.name === 'undefined' && typeof params.contactPerson.email === 'undefined') {
      OpenNotification('error', 'Missting Fields!', 'Please provide traveller information!', '', true)
      return false
    }
   
    const coords = Storage.get('coords')
    let depLatitude: any = ''
    let depLongitude: any = ''
    if (coords && coords !== null) {
      depLatitude = coords.lat;
      depLongitude = coords.lng;
    } else if (coordinates && coordinates !== null) {
      depLatitude = coordinates.latitude;
      depLongitude = coordinates.longitude;
    }

    if (depLatitude !== "" && depLongitude !== "") {
      params.userLocation = { coord: { lat: depLatitude, lng: depLongitude } }
    }
    
    setButtonDisable(true)
    Service.post({ url: `/transfers/booking`, body: JSON.stringify(params) })
      .then(response => {
        setButtonDisable(false)
        if (response && response.status === 'failed') {
          OpenNotification('error', 'Oops!', response.message, response, false)
        }
        if (response && response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, response, false)
        }
        if (response && response.status === 'success') {
          if (response.data === false) {
            OpenNotification('error', 'Oops!', 'Something went wrong, Please try again later!', response, false)
          } else {
            eventTrack('Payment', 'Transfer', `${cardData && cardData.pickup.from} - ${cardData && cardData.pickup.to}`)
            window.location.href = response.data.fulfillUrl
          }
        }
      })

  }

  const handleCloseModal = () => setIsOpenModalItinerary(false);

  const showPosition = (position: any) => {
    if (position && position !== null) {
      Storage.set('coords', { lat: position.coords.latitude, lng: position.coords.longitude });
    }
  }

  const getDepartureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  const getUserLocation = async () => {
    const url = 'https://ipapi.co/json/'
    try {
      const response = await fetch(url, {
        method: 'GET'
      })
      return await response.json()
    } catch (error) {
      return null
    }

  }

  useEffect(() => {

    const countryNew = Countries.sort((x, y) => { return x.iso2 === 'BD' ? -1 : y.iso2 === 'BD' ? 1 : 0; });
    setCountryCodeList(countryNew)
    setNationality(Countries)

    const coords = Storage.get('coords')
    if (coords === null) {
      getDepartureLocation()

      getUserLocation().then(response => {
        if (response !== null) {
          setCoordinates(response)
        }
      })
    }

  }, [])

  useEffect(() => {

    let img: any = []
    if (data.images && data.images.length > 0) {
      for (var i = 0; i < data.images.length; i++) {
        img.push(`${data.images[i]}`)
      }
      setGalleryImgs(img);
    }

    if (data.type && data.type !== null) {
      setCategories(data.type.split(','))
    }
  }, [])

  const renderSliderGallery = () => {
    return (
      <>
        <NcImage className='not-available p-3' src={data && data.image} />
      </>
    )
  };

  const renderContent = () => {
    return (
      <div className="flex-grow p-3 sm:p-5 flex flex-col">
        <div className="">
          <div className="flex justify-between space-x-2">
            <h2 className="text-lg font-medium capitalize">
              <span className="line-clamp-1 text-ellipsis overflow-hidden">{data && data.pickup.from} - {data && data.pickup.to}</span>
            </h2>
          </div>
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            {data && data.desc}
          </div>
          <div className="flex sm:items-center text-sm text-primary dark:text-neutral-400">
            <FaMapMarkerAlt className='mr-1' />
            Pickup Point: {data && data.pickup.spot}
          </div>
        </div>
      
        <div className='flex flex-col sm:flex-row justify-between items-end'>
          <div className="space-y-3">
            <div className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
              <i className="las la-calendar text-md"></i>
              <div className="text-sm"><span className="font-normal">{(data && data.pickup) && data.pickup.date} {(data && data.pickup) && data.pickup.time}</span> </div>
            </div>
            <div className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
              <i className="las la-user text-md"></i>
              <div className="text-sm"><span className="font-normal">{(data && data.pax) && data.pax.max} Seats</span> </div>
            </div>
            <div className="flex items-start text-neutral-500 dark:text-neutral-400 space-x-3 mb-2">
              <i className="las la-check-circle text-md text-green"></i>
              <span className="text-sm text-green">Free Cancellation</span>
            </div>
          </div>
          <div className="space-y-2 relative text-right">
            <div className="priceWrapper">
              <div className="block text-base text-lg font-semibold mb-1">
                <span className="block text-xs text-neutral-800 dark:text-neutral-400 font-normal">Starts from</span>
                <div className="flex flex-row items-center justify-end">
                  {(data && data.fare.discount.amount > 0) &&
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-normal line-through"><span className='currency-font'>{data && getCurrency(data.fare.baseFare.currency)}</span>{data && amountSeparator(Number(data.fare.baseFare.amount))}</div>
                  }
                  <div className="text-secondary-700"><span className='currency-font ml-3'>{data && getCurrency(data.fare.totalFare.currency)}</span>{data && amountSeparator(Number(data.fare.totalFare.amount))}</div>

                </div>
                <div className="block text-xs text-neutral-400 dark:text-neutral-400 font-normal">
                  Taxes & Fees Included
                </div>
              </div>

              <ButtonPrimary className='selectTransfer' onClick={() => data && openModalItinerary(data)}>  Select  </ButtonPrimary>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const userInfo = Storage.get('auth')

  return (

    <>
      <div
        className={`nc-StayCardH group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow`}
        data-nc-id="StayCardH"
      >
        <div className="flex flex-col sm:flex-row sm:items-center">
          {renderSliderGallery()}
          {renderContent()}
        </div>
      </div>

      <Transition appear show={isOpenModalItinerary} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full">
                <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-6 border-b border-neutral-200 dark:border-neutral-800 text-left">
                    <h3
                      className="text-xl font-medium leading-6 text-gray-900 dark:text-neutral-300"
                      id="headlessui-dialog-title-70"
                    >
                      Details Of Your Trip
                    </h3>
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={handleCloseModal} />
                    </span>
                  </div>

                  <div className="px-8 mt-2 flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300">
                    <div className='itinerary-details mt-3'>
                      <Tab.Group>
                        <Tab.List className="flex flex-wrap sm:flex-row space-x-1 overflow-x-auto">
                          <Tab key={1} as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                                  ? "bg-secondary-900 text-secondary-50 "
                                  : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  } `}
                              >
                                TRIP INFORMATION
                              </button>
                            )}
                          </Tab>
                          <Tab key={2} as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                                  ? "bg-secondary-900 text-secondary-50 "
                                  : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  } `}
                              >
                                TRAVELLER INFORMATION
                              </button>
                            )}
                          </Tab>
                        </Tab.List>
                        <Tab.Panels>
                          <Tab.Panel className="mt-5">
                            <div className="relative grid grid-cols-3 gap-1 sm:gap-2">
                              <div className="col-span-2 row-span-2">
                                <div className="mt-8 flex">
                                  <div className="flex-shrink-0 flex flex-col items-center py-2">
                                    <span className="block w-6 h-6 rounded-full border border-neutral-400"></span>
                                    <span className="block flex-grow border-l border-neutral-400 border-dashed my-1"></span>
                                    <span className="block w-6 h-6 rounded-full border border-neutral-400"></span>
                                  </div>
                                  <div className="ml-4 space-y-14 text-sm">
                                    <div className="flex flex-col space-y-2">
                                      <span className=" text-neutral-500 dark:text-neutral-400">
                                        {data && data.pickup.date} {data && data.pickup.time}
                                      </span>
                                      <span className=" font-semibold">
                                        {data && data.pickup.from}
                                      </span>
                                    </div>
                                    <div className="flex flex-col space-y-2" style={{ marginTop: '20px', marginBottom: '10px' }}>
                                      <span className=" font-semibold">
                                        {data && data.pickup.to}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-center items-center">
                                <NcImage className='transfer not-available' src={data && data.image} />
                                <div>
                                  <span className="font-semibold text-sm">{data && data.vehicle}</span>
                                  <span className="ml-1 font-normal text-sm">({(data && data.pax) && data.pax.max} Seats)</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div>
                                <h2 className="text-xl font-semibold">Instructions: </h2>
                              </div>

                              {/* 6 */}
                              <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 dark:text-neutral-300 mt-4 mb-2">
                                {data && data.instructions.slice(0, facilityMore).map((item: any) => (
                                  <div key={item.name} className="flex items-start space-x-3">
                                    <i className="las la-hand-point-right text-2xl"></i>
                                    <span>{item.n} {(item.d && item.d !== null) && <> : {item.d}</>}</span>
                                  </div>
                                ))}
                              </div>
                              {(facilityMore === 3) ?
                                <span className='mt-4 text-primary font-semibold text-sm cursor-pointer' onClick={() => data && setFacilityMore(data.instructions.length)}>Show {data && (data.instructions.length - 3)} More</span>
                                :
                                <span className='mt-4 text-primary font-semibold text-sm cursor-pointer' onClick={() => data && setFacilityMore(3)}>Hide</span>
                              }
                            </div>
                          </Tab.Panel>
                          <Tab.Panel className="mt-5">
                            <div className="listingSection__wrap p-8 bg-white dark:bg-neutral-900 mt-5 traveller-details">
                              {[...Array(Number(1))].map((item, i) => (
                                <div className='travellers'>
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
                                    <FormGroup className='col-span-2'>
                                      <Label className='block mb-1' for="email">Email<span className="astrick">*</span></Label>
                                      <Input 
                                        id={`adultEmail_${i}`} name={`adultEmail_${i}`}
                                        className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                                        placeholder='Email'
                                        innerRef={register({ required: true })}
                                        invalid={errors[`adultEmail_${i}`] && true}
                                      />
                                    </FormGroup>
                                    <FormGroup>
                                      <Label className='block mb-1' for="email">Phone Number<span className="astrick">*</span></Label>
                                      <Controller
                                        control={control}
                                        id={`adultMobile_${i}`} name={`adultMobile_${i}`}
                                        innerRef={register({ required: true })}
                                        invalid={errors[`adultMobile_${i}`] && true}
                                        rules={{ required: true }}
                                        defaultValue={false}
                                        render={({ onChange, value, name }) => ( 
                                          <PhoneInput value={value} name={name} onChange={onChange} />
                                        )}
                                      />
                                    </FormGroup>
                                  </div>

                                </div>
                              ))}
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </div>
                  </div>

                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                    <div>
                      {(data && data.isNonRefundable === true) ?
                        <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-red-700 text-red-50 rounded-full`}
                          data-nc-id="SaleOffBadge"
                        >
                          Non Refundable
                        </div>
                        :
                        <div className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-green-600 text-green-50 rounded-full`}
                          data-nc-id="SaleOffBadge"
                        >
                          Partially Refundable
                        </div>
                      }
                    </div>
                    <div className="flex items-right sm:justify-end">
                      <div className="flex flex-col mr-4">
                        <div className="flex flex-row items-center justify-end mt-2">
                          {(data && data.fare.discount.amount > 0) &&
                            <div className="text-sm text-neutral-500 dark:text-neutral-400 font-normal line-through"><span className='currency-font'>{data && getCurrency(data.fare.baseFare.currency)}</span>{data && amountSeparator(Number(data.fare.baseFare.amount))}</div>
                          }
                          <div className="font-semibold text-secondary-700"><span className='currency-font ml-3'>{data && getCurrency(data.fare.totalFare.currency)}</span>{data && amountSeparator(Number(data.fare.totalFare.amount))}<span className="astrick">*</span></div>

                        </div>

                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Includes Taxes & Fees</span>
                      </div>
                      <ButtonPrimary sizeClass="px-10 py-3 sm:pr-5 sm:px-5 bg-secondary-900" disabled={buttonDisable} loading={buttonDisable}>
                        Book Now
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
                </Form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition >
    </>
  );
};

export default StayCardH;

import React, { FC, Fragment, useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom'
import moment from "moment";
import { Service, Storage } from 'services/Service';
import Config from './../../config.json';
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { amountSeparator, OpenNotification, getCurrency, eventTrack } from 'components/Helper';
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { FaUserCheck } from "react-icons/fa";
import Countries from 'data/jsons/__countries.json';
import { setLoginModalVisible } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'

import PhoneInput from 'components/PhoneInput'

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const PackageProceedPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const { slug }: any = useParams()
  const history = useHistory()
  const dispatch = useDispatch();
  const [data, setData]: any = useState(null)

  const [loading, setLoading] = useState(true)
  const [packageYears, setPackageYears] = useState([])
  const [packageMonths, setPackageMonths] = useState([])
  const [departureDate, setDepartureDate] = useState([])
  const [depLatitude, setDepLatitude] = useState("")
  const [depLongitude, setDepLongitude] = useState("")
  const [price, setPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [travellers, setTravellers] = useState(1)

  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [infantCount, setInfantCount] = useState(0)
  const [nationality, setNationality]: any = useState([])
  const [countryCodeList, setCountryCodeList]: any = useState([])
  const [buttonDisable, setButtonDisable] = useState(false)
  const [packageSlug, setPackageSlug] = useState(null)
  const [importantInfo, setImportantInfo]: any = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const getPackageData = () => {

    const search = window.location.search
    const params: any = new URLSearchParams(decodeURIComponent(search))

    let travellersCount = 0
    if (params.get('adults')) {
      setAdultCount(params.get('adults'))
      travellersCount += Number(params.get('adults'))
    }
    if (params.get('child')) {
      setChildCount(params.get('child'))
      travellersCount += Number(params.get('child'))
    }
    if (params.get('infant')) {
      setInfantCount(params.get('infant'))
      travellersCount += Number(params.get('infant'))
    }
    if (params.get('depDate')) {
      setDepartureDate(params.get('depDate'))
    }
    if (params.get('depLatitude')) {
      setDepLatitude(params.get('depLatitude'))
    }
    if (params.get('depLongitude')) {
      setDepLongitude(params.get('depLongitude'))
    }

    setTravellers(travellersCount)

    setLoading(true)
    Service.get({ url: `/packages/${slug}` })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops', 'Package not available at this moment. please retry later!', '', true)
          history.goBack()
          return false
        } else {
          setData(response.data)
          setPackageYears(response.data.years.split(','))
          setPackageMonths(response.data.months.split(','))
          if (response.data.fare.totalFare.amount) {
            const amt: any = Math.round(response.data.fare.totalFare.amount)
            setPrice(amt)
            setTotalPrice(travellersCount * amt)
          }
        }
      })
  }

  const getImpData = () => {
    Service.get({
      url: '/cms/page/package_information'
    }).then(response => {
      if (response.data) {
        setImportantInfo(response.data)
      }
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    getImpData()

    setPackageSlug(slug)
    const countryNew = Countries.sort((x, y) => { return (x.iso2 === 'BD' || x.iso2 === 'IN') ? -1 : (y.iso2 === 'BD' || y.iso2 === 'IN') ? 1 : 0; });
    setCountryCodeList(countryNew)
    setNationality(Countries)

  }, [])

  useEffect(() => {
    if (slug) {
      getPackageData()
    }
  }, [slug])

  useEffect(() => {

    const userInfo =  Storage.get('auth')

    if (userInfo) {
      setValue('contactName', userInfo.name)
      setValue('contactEmail', userInfo.email)
      setValue('contactMobile', userInfo.phone)
    }

  }, [Storage])

  const checkPassportExpiry = (data: any) => {
    const currentDate = moment().format('YYYY-MM-DD')
    const futuresixmonth = moment(currentDate).add(6, 'M').format('YYYY-MM-DD')
    if (futuresixmonth >= moment(data).format('YYYY-MM-DD')) {
      return true
    }
  }

  // PROCEED TO PAYMENT
  const onSubmit = (value: any, type: any) => {

    {/***** CHECK USER LOGIN******/ }
    const userData = Storage.get('auth');
    if (userData === null) {
      dispatch(setLoginModalVisible(true));
      return false
    }
    {/**************/ }

    if (!termsAccepted) {
      OpenNotification('error', 'Oops!', 'Please accept the Fare Rules, Privacy Policy and Terms of Service!', '', true)
      return false
    }

    const params: any = {
      slug: packageSlug,
      tripDate: departureDate,
      contactPerson: {
        name: value.contactName,
        phone: value.contactMobile,
        email: value.contactEmail
      }
    }

    if (depLatitude !== "" && depLongitude !== "") {
      params.userLocation = { coord: { lat: depLatitude, lng: depLongitude } }
    }

    const allpassportNumber = []
    let childExpiry = false, adultExpiry = false, infantExpiry = false
    const passangerInfo = []

    // ADULT DETAILS
    if (value.adultFirstName_0 !== "") {
      for (let i = 0; i < adultCount; i++) {
        const temp_data: any = {
          title: value[`adultTitle_${i}`],
          name: value[`adultFirstName_${i}`],
          surName: value[`adultLastName_${i}`],
          phone: value[`adultPhone_${i}`],
          dob: moment(value[`adultDob_${i}`]).format('YYYY-MM-DD'),
          gender: value[`adultGender_${i}`],
          type: 'ADT',
          nationality: value[`adultNationality_${i}`]
        }
        if (data.international === 1) {
          if (checkPassportExpiry(value[`adultPassportExpiry_${i}`]) === true) {
            adultExpiry = true
          }
          allpassportNumber.push(value[`adultPassportNumber_${i}`])
          temp_data.passport = {
            PassportNumber: value[`adultPassportNumber_${i}`],
            ExpiryDate: moment(value[`adultPassportExpiry_${i}`]).format('YYYY-MM-DD'),
            Country: value[`adultPassportCountry_${i}`]
          }
        }
        passangerInfo.push(temp_data)
      }
    }

    // CHILD DETAILS
    if (childCount > 0 && value.childFirstName_0 !== "") {
      for (let i = 0; i < childCount; i++) {
        const temp_data: any = {
          title: value[`childTitle_${i}`],
          name: value[`childFirstName_${i}`],
          surName: value[`childLastName_${i}`],
          phone: value[`childPhone_${i}`],
          dob: moment(value[`childDob_${i}`]).format('YYYY-MM-DD'),
          gender: value[`childGender_${i}`],
          type: 'CHD',
          nationality: value[`childNationality_${i}`]
        }
        if (data.international === 1) {
          if (checkPassportExpiry(moment(value[`childPassportExpiry_${i}`]).format('YYYY-MM-DD')) === true) {
            childExpiry = true
          }
          allpassportNumber.push(value[`childPassportNumber_${i}`])
          temp_data.passport = {
            PassportNumber: value[`childPassportNumber_${i}`],
            ExpiryDate: moment(value[`childPassportExpiry_${i}`]).format('YYYY-MM-DD'),
            Country: value[`childPassportCountry_${i}`]
          }
        }
        passangerInfo.push(temp_data)
      }
    }

    // INFANT DETAILS
    if (infantCount > 0 && value.infantFirstName_0 !== "") {
      for (let i = 0; i < infantCount; i++) {
        const temp_data: any = {
          title: value[`infantTitle_${i}`],
          name: value[`infantFirstName_${i}`],
          surName: value[`infantLastName_${i}`],
          phone: value[`infantPhone_${i}`],
          dob: moment(value[`infantDob_${i}`]).format('YYYY-MM-DD'),
          gender: value[`infantGender_${i}`],
          type: 'INF',
          nationality: value[`infantNationality_${i}`]
        }
        if (data.international === 1) {
          if (checkPassportExpiry(moment(value[`infantPassportExpiry_${i}`]).format('YYYY-MM-DD')) === true) {
            infantExpiry = true
          }
          allpassportNumber.push(value[`infantPassportNumber_${i}`])
          temp_data.passport = {
            PassportNumber: value[`infantPassportNumber_${i}`],
            ExpiryDate: moment(value[`infantPassportExpiry_${i}`]).format('YYYY-MM-DD'),
            Country: value[`adultPassportCountry_${i}`]
          }
        }
        passangerInfo.push(temp_data)
      }
    }

    if (adultExpiry === true || childExpiry === true || infantExpiry === true) {
      OpenNotification('warning', 'Warning!', 'Your passport going to be expired. Please renew it before departure!', '', false)
    }
    params.mode = type
    params.passengerInfo = passangerInfo

    setButtonDisable(true)
    Service.post({ url: `/payment/init/user/package`, body: JSON.stringify(params) })
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
            if (response && response.data.mode === 'online') {
              eventTrack('Payment', 'Package', `${data && data.title}`)
              window.location.href = response.data.url;
            } else {
              eventTrack('Payment', 'Package (Offline)', `${data && data.title}`)
              OpenNotification('success', 'Thank You!', 'Your order has been received,  Ticketshala will review your order and send you confirmation email.', '', true)
              history.push('/account/my-trips')
            }
          }
        }
      })

  }

  const renderCities = (cities: any) => {
    if (cities && cities !== null) {
      const city = cities.split(',');
      return (
        (city && city.length > 0) &&
        <>
          {city.map((item: any, index: any) => (
            <>
              <Badge name={item} color="green" />
            </>
          ))}
        </>
      )
    }
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{data && data.title}</h2>

        {/* 3 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          <span className="mb-5 sm:mb-0 flex flex-row">
            <i className="las la-calendar-alt text-2xl"></i>
            <span className="ml-1">{data && data.days - 1} Nights / {data && data.days} Days</span>
          </span>
          <span className="ml-0 mb-5 sm:mb-0 sm:ml-2 flex flex-row">
            <i className="las la-map-marker-alt text-2xl"></i>
            <span className="ml-1"> {renderCities(data && data.cities)}</span>
          </span>
        </div>

        <div className="text-neutral-6000 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: data && data.shortDesc.replace(/<\/?[^>]+(>|$)/g, "") }}></div>

      </div>
    );
  };

  const renderSection2 = () => {

    return (
      <div className="listingSection__wrap sm:p-8 bg-white dark:bg-neutral-900 traveller-details">
        <div>
          <h2 className="text-2xl font-semibold">Traveller Details</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {[...Array(Number(adultCount))].map((item, i) => (
          <div className='listingSection__wrap travellers p-4 bg-gray-100 dark:bg-neutral-800'>
            <div className='flex'>
              <h4 className="flex text-md font-semibold"><FaUserCheck size='20' className='mr-2' /> Traveller {i + 1}</h4>
            </div>
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
              <FormGroup>
                <Label className='block mb-1' for="email">Gender<span className="astrick">*</span></Label>
                <Input
                  type='select'
                  id={`adultGender_${i}`} name={`adultGender_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: true })}
                  invalid={errors[`adultGender_${i}`] && true}
                >
                  <option value='' >Select One</option>
                  <option value='M' >Male</option>
                  <option value='F' >Female</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Phone<span className="astrick">*</span></Label>
                <Controller
                  control={control}
                  id={`adultPhone_${i}`}
                  name={`adultPhone_${i}`}
                  innerRef={register({ required: true })}
                  invalid={errors[`adultPhone_${i}`] && true}
                  rules={{ required: true }}
                  defaultValue={false}
                  render={({ onChange, value, name }) => ( 
                    <PhoneInput value={value} name={name} onChange={onChange} />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">DOB<span className="astrick">*</span></Label>
                <Input
                  type='date'
                  id={`adultDob_${i}`} name={`adultDob_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='DOB'
                  innerRef={register({ required: true })}
                  invalid={errors[`adultDob_${i}`] && true}
                  max={moment().format('YYYY-MM-DD')}
                  onKeyDown={(e) => e.preventDefault()}
                />
              </FormGroup>
              <FormGroup >
                <Label className='block mb-1' for="email">Nationality<span className="astrick">*</span></Label>
                <Input
                  type='select'
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  name={`adultNationality_${i}`}
                  id={`adultNationality_${i}`}
                  control={control}
                  innerRef={register({ required: true })}
                  invalid={errors[`adultNationality_${i}`] && true}
                >
                  <option value="">Nationality</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.nationality}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

            {(data && data.international === 1) &&
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
                  <FormGroup>
                    <Label className='block mb-1' for="email">Passport Number</Label>
                    <Input id={`adultPassportNumber_${i}`} name={`adultPassportNumber_${i}`}
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      placeholder='Passport Number'
                      innerRef={register({ required: true })}
                      invalid={errors[`adultPassportNumber_${i}`] && true}
                      onInput={(e: any) => {
                        e.target.value = (e.target.value.trim().toUpperCase().replace(/[^a-z0-9]/gi, ''))
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className='block mb-1' for="email">Expiry Date</Label>
                    <Input
                      type='date'
                      id={`adultPassportExpiry_${i}`} name={`adultPassportExpiry_${i}`}
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      placeholder='Expiry Date'
                      innerRef={register({ required: true })}
                      invalid={errors[`adultPassportExpiry_${i}`] && true}
                      min={moment().format('YYYY-MM-DD')}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className='block mb-1' for="email">Issued Country</Label>
                    <Input
                      type='select'
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      name={`adultPassportCountry_${i}`}
                      id={`adultPassportCountry_${i}`}
                      control={control}
                      innerRef={register({ required: true })}
                      invalid={errors[`adultPassportCountry_${i}`] && true}
                    >
                      <option value="">Issued Country</option>
                      {nationality.map((item: any, index: any) => (
                        <>
                          <option value={item.iso3}>{item.name}</option>
                        </>
                      ))}
                    </Input>
                  </FormGroup>
                </div>
              </>
            }
          </div>
        ))}

        {[...Array(Number(childCount))].map((item, i) => (
          <div className='listingSection__wrap p-4 travellers bg-gray-100 dark:bg-neutral-800'>
            <div className='flex'>
              <h4 className="flex text-md font-semibold"><FaUserCheck size='20' className='mr-2' /> Child {i + 1}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Title</Label>
                <Input
                  type='select' id={`childTitle_${i}`} name={`childTitle_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: true })}
                  invalid={errors[`childTitle_${i}`] && true}
                  onChange={(e) => {
                    setValue(`childGender_${i}`, (e.target.value === 'master') ? 'M' : ((e.target.value === 'ms') ? 'F' : ''))
                  }}
                >
                  <option value='' >Title</option>
                  <option value='ms' >Ms</option>
                  <option value='master' >Master</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">First Name</Label>
                <Input
                  id={`childFirstName_${i}`} name={`childFirstName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="First Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`childFirstName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Last Name</Label>
                <Input
                  id={`childLastName_${i}`} name={`childLastName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Last Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`childLastName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
          
              <FormGroup>
                <Label className='block mb-1' for="email">Gender</Label>
                <Input
                  type='select'
                  id={`childGender_${i}`} name={`childGender_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: true })}
                  invalid={errors[`childGender_${i}`] && true}
                >
                  <option value='' >Select One</option>
                  <option value='M' >Male</option>
                  <option value='F' >Female</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for={`childPhone_${i}`}>Phone</Label>
                <Controller
                  control={control}
                  id={`childPhone_${i}`}
                  name={`childPhone_${i}`}
                  innerRef={register({ required: true })}
                  invalid={errors[`childPhone_${i}`] && true}
                  rules={{ required: true }}
                  defaultValue={false}
                  render={({ onChange, value, name }) => ( 
                    <PhoneInput value={value} name={name} onChange={onChange} />
                  )}
                />
              </FormGroup>
          
              <FormGroup>
                <Label className='block mb-1' for="email">DOB</Label>
                <Input
                  type='date'
                  id={`childDob_${i}`} name={`childDob_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='DOB'
                  innerRef={register({ required: true })}
                  invalid={errors[`childDob_${i}`] && true}
                  max={moment().format('YYYY-MM-DD')}
                />
              </FormGroup>
              <FormGroup >
                <Label className='block mb-1' for="email">Nationality</Label>
                <Input
                  type='select'
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  name={`childNationality_${i}`}
                  id={`childNationality_${i}`}
                  control={control}
                  innerRef={register({ required: true })}
                  invalid={errors[`childNationality_${i}`] && true}
                >
                  <option value="">Nationality</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.nationality}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

            {(data && data.international === 1) &&
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
                  <FormGroup>
                    <Label className='block mb-1' for="email">Passport Number</Label>
                    <Input id={`childPassportNumber_${i}`} name={`childPassportNumber_${i}`}
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      placeholder='Passport Number'
                      innerRef={register({ required: true })}
                      invalid={errors[`childPassportNumber_${i}`] && true}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className='block mb-1' for="email">Expiry Date</Label>
                    <Input
                      type='date'
                      id={`childPassportExpiry_${i}`} name={`childPassportExpiry_${i}`}
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      placeholder='Expiry Date'
                      innerRef={register({ required: true })}
                      invalid={errors[`childPassportExpiry_${i}`] && true}
                      min={moment().format('YYYY-MM-DD')}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className='block mb-1' for="email">Issued Country</Label>
                    <Input
                      type='select'
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      name={`childPassportCountry_${i}`}
                      id={`childPassportCountry_${i}`}
                      control={control}
                      innerRef={register({ required: true })}
                      invalid={errors[`childPassportCountry_${i}`] && true}
                    >
                      <option value="">Issued Country</option>
                      {nationality.map((item: any, index: any) => (
                        <>
                          <option value={item.iso3}>{item.name}</option>
                        </>
                      ))}
                    </Input>
                  </FormGroup>
                </div>
              </>
            }
          </div>
        ))}

        {[...Array(Number(infantCount))].map((item, i) => (
          <div className='listingSection__wrap travellers p-4 bg-gray-100 dark:bg-neutral-800'>
            <div className='flex'>
              <h4 className="flex text-md font-semibold"><FaUserCheck size='20' className='mr-2' /> Infant {i + 1}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Title</Label>
                <Input
                  type='select' id={`infantTitle_${i}`} name={`infantTitle_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: true })}
                  invalid={errors[`infantTitle_${i}`] && true}
                  onChange={(e) => {
                    setValue(`infantGender_${i}`, (e.target.value === 'master') ? 'MI' : ((e.target.value === 'ms') ? 'FI' : ''))
                  }}
                >
                  <option value='' >Title</option>
                  <option value='ms' >Ms</option>
                  <option value='master' >Master</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">First Name</Label>
                <Input
                  id={`infantFirstName_${i}`} name={`infantFirstName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="First Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`infantFirstName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Last Name</Label>
                <Input
                  id={`infantLastName_${i}`} name={`infantLastName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Last Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`infantLastName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
           
              <FormGroup>
                <Label className='block mb-1' for="email">Gender</Label>
                <Input
                  type='select'
                  id={`infantGender_${i}`} name={`infantGender_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: true })}
                  invalid={errors[`infantGender_${i}`] && true}
                >
                  <option value='' >Select One</option>
                  <option value='MI' >Male</option>
                  <option value='FI' >Female</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Phone</Label>
                <Controller
                  control={control}
                  id={`infantPhone_${i}`}
                  name={`infantPhone_${i}`}
                  innerRef={register({ required: true })}
                  invalid={errors[`infantPhone_${i}`] && true}
                  rules={{ required: true }}
                  defaultValue={false}
                  render={({ onChange, value, name }) => ( 
                    <PhoneInput value={value} name={name} onChange={onChange} />
                  )}
                />
              </FormGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">DOB</Label>
                <Input
                  type='date'
                  id={`infantDob_${i}`} name={`infantDob_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='DOB'
                  innerRef={register({ required: true })}
                  invalid={errors[`infantDob_${i}`] && true}
                  max={moment().format('YYYY-MM-DD')}
                />
              </FormGroup>
              <FormGroup >
                <Label className='block mb-1' for="email">Nationality</Label>
                <Input
                  type='select'
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  name={`infantNationality_${i}`}
                  id={`infantNationality_${i}`}
                  control={control}
                  innerRef={register({ required: true })}
                  invalid={errors[`infantNationality_${i}`] && true}
                >
                  <option value="">Nationality</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.nationality}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

            {(data && data.international === 1) &&
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
                  <FormGroup>
                    <Label className='block mb-1' for="email">Passport Number</Label>
                    <Input id={`infantPassportNumber_${i}`} name={`infantPassportNumber_${i}`}
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      placeholder='Passport Number'
                      innerRef={register({ required: true })}
                      invalid={errors[`infantPassportNumber_${i}`] && true}
                      onInput={(e: any) => {
                        e.target.value = (e.target.value.trim().toUpperCase().replace(/[^a-z0-9]/gi, ''))
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className='block mb-1' for="email">Expiry Date</Label>
                    <Input
                      type='date'
                      id={`infantPassportExpiry_${i}`} name={`infantPassportExpiry_${i}`}
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      placeholder='Expiry Date'
                      innerRef={register({ required: true })}
                      invalid={errors[`infantPassportExpiry_${i}`] && true}
                      min={moment().format('YYYY-MM-DD')}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label className='block mb-1' for="email">Issued Country</Label>
                    <Input
                      type='select'
                      className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                      name={`infantPassportCountry_${i}`}
                      id={`infantPassportCountry_${i}`}
                      control={control}
                      innerRef={register({ required: true })}
                      invalid={errors[`infantPassportCountry_${i}`] && true}
                    >
                      <option value="">Issued Country</option>
                      {nationality.map((item: any, index: any) => (
                        <>
                          <option value={item.iso3}>{item.name}</option>
                        </>
                      ))}
                    </Input>
                  </FormGroup>
                </div>
              </>
            }
          </div>
        ))}

      </div>
    );
  };

  const renderSection3 = () => {

    const userInfo = Storage.get('auth');

    return (
      <div className="listingSection__wrap sm:p-8 bg-white dark:bg-neutral-900 mt-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Booking details will be sent to</h2>
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

  const renderSidebar = () => {
    return (
      <div className="listingSection__wrap p-4 sm:p-8 shadow-xl mt-11 sm:mt-0">
        {/* PRICE */}
        <div className="flex justify-between items-center">
          <div className='flex flex-col w-full'>
            <div className='flex justify-between items-center'>
              {(data && data.fare && data.fare.discount.amount > 0) ? <span className="text-xl"><div className="flight-lineThroughRed">{data && getCurrency(data.fare.baseFare.currency)} {data && amountSeparator(data.fare.baseFare.amount)}</div></span> : null}
              {(data && data.fare.discount && data.fare.discount.amount > 0) ? <div className="text-sm text-emerald-600">You save <span className='currency-font'>{data && getCurrency(data.fare.discount.currency)}</span> {data && data.fare.discount.amount}</div> : null}
            </div>
            <div className="text-3xl font-semibold">
              <span className='currency-font'>{data && getCurrency(data.fare.totalFare.currency)}</span>{data && amountSeparator(data.fare.baseFare.amount)}
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
            <div><span className='currency-font'>{data && getCurrency(data.fare.baseFare.currency)}</span> {data && amountSeparator(Math.round(data.fare.baseFare.amount) * travellers)}</div>
          </div>
          {(data && data.fare.tax && data.fare.tax.amount > 0) &&
            <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
              <span>Fee & Taxes</span>
              <div><span className='currency-font'>{data && getCurrency(data.fare.tax.currency)}</span> {data && amountSeparator(Math.round(data.fare.tax.amount) * travellers)}</div>
            </div>
          }

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Grand Total</span>
            <div><span className='currency-font'>{data && getCurrency(data.fare.totalFare.currency)}</span>{data && amountSeparator(Math.round(data.fare.totalFare.amount) * travellers)}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center max-w-xs text-xs leading-6 text-neutral-500">
          <Input
            type="checkbox"
            className={`block border-neutral-400 focus:border-primary-300 mr-2`}
            name='terms'
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          I have read and I accept the Fare Rules , the <Link to='/privacy-policy' target='_blank' className="text-primary mr-1">Privacy Policy</Link> and <Link to='/terms-conditions' target='_blank' className="ml-1 mr-1 text-primary">Terms of Service</Link> of Ticketshala.</div>

        {/* SUBMIT */}
        <div className="flex flex-col items-center justify-center text-center">
          {(data && data.p_type === 'offline' || data && data.p_type === 'both') &&
            <ButtonPrimary className='bg-secondary-900 w-full' onClick={handleSubmit((d: any) => onSubmit(d, 'offline'))} disabled={buttonDisable} loading={buttonDisable}>Submit Booking Request</ButtonPrimary>
          }
          {(data && data.p_type === 'both') && <span className="py-2">OR</span>}
          {(data && data.p_type === 'online' || data && data.p_type === 'both') &&
            <ButtonPrimary className='bg-secondary-900 w-full' onClick={handleSubmit((d: any) => onSubmit(d, 'online'))} disabled={buttonDisable} loading={buttonDisable}>Book & Pay Now</ButtonPrimary>
          }
        </div>
        {(data && data.p_type === 'offline' || data && data.p_type === 'both') ?
          <div className="flex items-center justify-center text-center">
            <span className="text-xs text-neutral-500 italic">(Our customer service team will reach you for confirmation)</span>
          </div>
          : null}

      </div>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap sm:p-8 bg-white dark:bg-neutral-900 mt-5">
        <div>
          <h2 className="text-2xl font-semibold">Important Information</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Please read the below information carefully before proceeding towards making the payment.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="text-sm text-neutral-700 dark:text-neutral-300 imp-info">
          <div key={1} className="flex items-center space-x-3">
            <div dangerouslySetInnerHTML={{ __html: importantInfo && importantInfo.content }}></div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap p-8 bg-white dark:bg-neutral-900 mt-5">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Acknowledgement</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            By clicking on the Continue button below to proceed with the booking, I confirm that I have read and I accept the Fare Rules , the <Link to='/privacy-policy' className="text-primary">Privacy Policy</Link> and <Link to='/terms-conditions' target='_blank' className="text-primary">Terms of Service</Link> of Ticketshala.
          </span>
        </div>

        {/* SUBMIT */}
        <div className="flex flex-col hidden sm:block lg:block md:block xl:block mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <ButtonPrimary className='bg-secondary-900' disabled={buttonDisable} loading={buttonDisable}>{(data && data.p_type === 'offline') ? `Submit Query` : `Proceed To Payment`}</ButtonPrimary>

          {(data && data.p_type === 'offline') ?
            <span className="text-xs text-neutral-500 italic">Our customer service team will reach you for confirmation</span>
            : null}
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-ListingStayDetailPage ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      <Form>
        {/* MAIn */}
        <main className="container mt-11 mb-11 flex flex-col sm:flex-row">
          {/* CONTENT */}
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-4 lg:space-y-10 lg:pr-10">
            {renderSection1()}
            {renderSection2()}
            {renderSection3()}
            {(importantInfo && importantInfo !== null) ? renderSection4() : null}
          </div>

          {/* SIDEBAR */}
          <div className="lg:block flex-grow">
            <div className="sticky top-24">{renderSidebar()}</div>
          </div>
        </main>
      </Form>
    </div>
  );
};

export default PackageProceedPage;

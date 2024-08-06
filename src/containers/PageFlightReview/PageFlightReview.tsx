import { FC, Fragment, useState, useEffect } from 'react'
import moment from "moment";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Checkbox from "shared/Checkbox/Checkbox";
import { useDispatch, useSelector } from 'react-redux'
import Badge from "shared/Badge/Badge";
import Avatar from "shared/Avatar/Avatar";
import { FaInfo, FaInfoCircle, FaUserCheck } from "react-icons/fa"
import { useHistory, Link } from 'react-router-dom'
import { getAirline, getDuration, getAirlineLogo, getAirport, getCurrency, getAirportCity, amountSeparator, OpenNotification, eventTrack } from 'components/Helper'
import { FaClock, FaPlane } from "react-icons/fa";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup, Collapse } from 'reactstrap'
import Countries from 'data/jsons/__countries.json'
import Airline from 'data/jsons/__airline.json'
import { Service, Storage } from 'services/Service';
import { setLoginModalVisible } from 'redux/actions/booking'
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap_white.css';
import UploadImage from 'components/UploadImage/index'
import PhoneInput from 'components/PhoneInput'
import Nationalities from 'data/jsons/__countries.json'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"

const ListingExperiencesDetailPage = () => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const { flightInfo, isFetching, seatQty, debugInfo } = useSelector(({ booking }: any) => booking)
  const history = useHistory()
  const [international, setInternational] = useState('N')
  const [loading, setLoading] = useState(true)
  const [flightFare, setFlightFare] = useState({ amount: 0, currency: "BDT" })
  const [baseFare, setBaseFare] = useState({ amount: 0, currency: "BDT" })
  const [discountFare, setDiscountFare] = useState({ amount: 0, currency: "BDT" })
  const [flightTaxes, setFlightTaxes] = useState({ amount: 0, currency: "BDT" })
  const [passengerFare, setPassengerFare] = useState([])
  const [baggages, setBaggages] = useState(null)
  const [flightSchedule, setFlightSchedule]: any = useState([])
  const [refundable, setRefundable] = useState([])
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [infantCount, setInfantCount] = useState(0)
  const [validateId, setValidateId] = useState('')
  const [direction, setDirection] = useState('')
  const [countryLists, setCountryLists]: any = useState([])
  const [nationality, setNationality]: any = useState([])
  const [buttonDisable, setButtonDisable] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [countryCodeList, setCountryCodeList]: any = useState([])
  const [importantInfo, setImportantInfo]: any = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [airlineData, setAirlineData]: any = useState([])
  const [collapse, setCollapse]: any = useState(null)
  const [passports, setPassports] = useState({ adult: [], child: [], infant: [] })
  const [visa, setVisa] = useState({ adult: [], child: [], infant: [] })
  const [validatingCarrier, setValidatingCarrier]: any = useState(null)
  const [collapseFare, setCollapseFare]: any = useState(false)
  const [emailSelection, setEmailSelection]: any = useState(null)
  const [adultDOB, setAdultDOB]: any = useState([])
  const [childDOB, setChildDOB]: any = useState([])
  const [infantDOB, setInfantDOB]: any = useState([])
  const [infantPassportDOB, setInfantPassportDOB]: any = useState([])
  const [adultPassportDOB, setAdultPassportDOB]: any = useState([])
  const [childPassportDOB, setChildPassportDOB]: any = useState([])

  const dispatch = useDispatch();

  const getImpData = () => {
    Service.get({
      url: '/cms/page/flight_information'
    }).then(response => {
      if (response.data) {
        setImportantInfo(response.data)
      }
    })
  }

  useEffect(() => {

    const userInfo = Storage.get('auth')

    if (userInfo) {
      setValue('contactName', userInfo.name)
      setValue('contactEmail', userInfo.email)
      setValue('contactMobile', userInfo.phone)
    }

  }, [Storage])

  useEffect(() => {
    window.scrollTo(0, 0)

    getImpData()

    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))
    const intl = params.get('intl')
    const carrier = params.get('carrier')

    if (intl && intl === 'Y') {
      setInternational('Y')
    }

    if (carrier) {
      setValidatingCarrier(carrier)
    }

    const countryNew = Countries.sort((x, y) => { return (x.iso2 === 'BD' || x.iso2 === 'IN') ? -1 : (y.iso2 === 'BD' || y.iso2 === 'IN') ? 1 : 0; });
    setCountryCodeList(countryNew)

    const nationalityNew = Nationalities.sort((x, y) => { return (x.iso2 === 'BD' || x.iso2 === 'IN') ? -1 : (y.iso2 === 'BD' || y.iso2 === 'IN') ? 1 : 0; });
    setNationality(nationalityNew)

    setCountryLists(Countries)

    const airlienNew = Airline.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0)
    setAirlineData(airlienNew)

  }, [])

  useEffect(() => {
    if (flightInfo && flightInfo.schedule) { setLoading(false) }
    if (flightInfo) {
      setFlightSchedule(flightInfo.schedule)
      if (flightInfo.fare) {
        setFlightFare(flightInfo.fare.totalFare)
        setBaseFare(flightInfo.fare.baseFare);
        setPassengerFare(flightInfo.fare.passenger)
        setFlightTaxes(flightInfo.fare.tax);
        setDiscountFare(flightInfo.fare.discount)
      }

      setBaggages(flightInfo.baggage)
      setRefundable(flightInfo.isNonRefundable)
      setValidateId(flightInfo.id)
      setDirection(flightInfo.direction)
      if (flightInfo.fare && flightInfo.fare.passenger) {
        for (let i = 0; i < flightInfo.fare.passenger.length; i++) {
          if (flightInfo.fare.passenger[i].type === 'ADT') {
            setAdultCount(flightInfo.fare.passenger[i].qty);
          } else if (flightInfo.fare.passenger[i].type === 'INF') {
            setInfantCount(flightInfo.fare.passenger[i].qty)
          } else if (flightInfo.fare.passenger[i].type === 'CNN' || flightInfo.fare.passenger[i].type === 'CHD') {
            setChildCount(flightInfo.fare.passenger[i].qty)
          }
        }
      }
    } else {
      OpenNotification('error', 'Oops', 'Itinerary not available at this moment. please retry with another option!', '', true)
      history.goBack()
    }
  }, [flightInfo, seatQty])

  const handleAdultDOP = (date: any, index: any) => {
    const temp = adultDOB
    temp[index] = Array.isArray(date) ? date[0] : date
    setAdultDOB([...temp])
  }

  const handleAdultPassport = (date: any, index: any) => {
    const temp = adultPassportDOB
    temp[index] = Array.isArray(date) ? date[0] : date
    setAdultPassportDOB([...temp])
  }

  const handleChildDoP = (date: any, index: any) => {
    const temp = childDOB
    temp[index] = Array.isArray(date) ? date[0] : date
    setChildDOB([...temp])
  }

  const handleChildPassport = (date: any, index: any) => {
    const temp = childPassportDOB
    temp[index] = Array.isArray(date) ? date[0] : date
    setChildPassportDOB([...temp])
  }

  const handleInfantDob = (date: any, index: any) => {
    const temp = infantDOB
    temp[index] = Array.isArray(date) ? date[0] : date
    setInfantDOB([...temp])
  }

  const handleInfantpassport = (date: any, index: any) => {
    const temp = infantPassportDOB
    temp[index] = Array.isArray(date) ? date[0] : date
    setInfantPassportDOB([...temp])
  }

  const onSubmit = (data: any) => {

    {/***** CHECK USER LOGIN******/ }
    const userData = Storage.get('auth')
    if (userData === null) {
      dispatch(setLoginModalVisible(true));
      return false
    }
    {/**************/ }

    if (!termsAccepted) {
      OpenNotification('error', 'Oops!', 'Please accept the Fare Rules, Privacy Policy and Terms of Service!', '', true)
      return false
    }

    const schedule = flightSchedule[0]

    const params: any = {
      id: validateId,
      from: schedule[0].depature.location,
      to: schedule[schedule.length - 1].arrival.location,
      tripType: direction,
      personalInfo: {
        name: (emailSelection === 'another') ? data.contactName : userData.name,
        phone: (emailSelection === 'another') ? data.contactMobile : userData.phone,
        email: (emailSelection === 'another') ? data.contactEmail : userData.email
      }
    }

    const passangerInfo = []

    // ADULT DETAILS
    if (data.adultFirstName_0 !== "") {

      for (let i = 0; i < adultCount; i++) {

        const temp_data: any = {
          title: data[`adultTitle_${i}`],
          name: data[`adultFirstName_${i}`],
          surName: data[`adultLastName_${i}`],
          phone: data[`adultPhone_${i}`],
          dob: moment(adultDOB[i]).format('YYYY-MM-DD'),
          gender: data[`adultGender_${i}`],
          type: 'ADT',
          nationality: data[`adultNationality_${i}`]
        }

        if (international === 'Y') {
          temp_data.passport = {
            PassportNumber: data[`adultPassportNumber_${i}`],
            ExpiryDate: moment(adultPassportDOB[i]).format('YYYY-MM-DD'),
            Country: data[`adultPassportCountry_${i}`]
          }

          if (passports.adult.length > 0 && passports.adult[i]) {
            temp_data.passport.attach_passport = passports.adult[i]
          }

          if (visa.adult.length > 0 && visa.adult[i]) {
            temp_data.passport.attach_visa = visa.adult[i]
          }
        }

        if (data[`adultFrequent_0`] === true) {
          temp_data.ffNo = {
            airport: data[`adultFrequentAirline_${i}`],
            number: data[`adultFrequentNumber_${i}`]
          }
        }

        passangerInfo.push(temp_data)
      }
    }

    // CHILD DETAILS
    if (childCount > 0 && data.childFirstName_0 !== "") {
      for (let i = 0; i < childCount; i++) {
        const temp_data: any = {
          title: data[`childTitle_${i}`],
          name: data[`childFirstName_${i}`],
          surName: data[`childLastName_${i}`],
          phone: data[`childPhone_${i}`],
          dob: moment(childDOB[i]).format('YYYY-MM-DD'),
          gender: data[`childGender_${i}`],
          type: 'CHD',
          nationality: data[`childNationality_${i}`]
        }
        if (international === 'Y') {
          temp_data.passport = {
            PassportNumber: data[`childPassportNumber_${i}`],
            ExpiryDate: moment(childPassportDOB[i]).format('YYYY-MM-DD'),
            Country: data[`childPassportCountry_${i}`]
          }

          if (passports.child.length > 0 && passports.child[i]) {
            temp_data.passport.attach_passport = passports.child[i]
          }

          if (visa.child.length > 0 && visa.child[i]) {
            temp_data.passport.attach_visa = visa.child[i]
          }
        }
        passangerInfo.push(temp_data)
      }
    }

    // INFANT DETAILS
    if (infantCount > 0 && data.infantFirstName_0 !== "") {
      for (let i = 0; i < infantCount; i++) {
        const temp_data: any = {
          title: data[`infantTitle_${i}`],
          name: data[`infantFirstName_${i}`],
          surName: data[`infantLastName_${i}`],
          phone: data[`infantPhone_${i}`],
          dob: moment(infantDOB[i]).format('YYYY-MM-DD'),
          gender: data[`infantGender_${i}`],
          type: 'INF',
          Infant: true,
          nationality: data[`infantNationality_${i}`]
        }
        if (international === 'Y') {
          temp_data.passport = {
            PassportNumber: data[`infantPassportNumber_${i}`],
            ExpiryDate: moment(infantPassportDOB[i]).format('YYYY-MM-DD'),
            Country: data[`adultPassportCountry_${i}`]
          }

          if (passports.infant.length > 0 && passports.infant[i]) {
            temp_data.passport.attach_passport = passports.infant[i]
          }

          if (visa.infant.length > 0 && visa.infant[i]) {
            temp_data.passport.attach_visa = visa.infant[i]
          }
        }
        passangerInfo.push(temp_data)
      }
    }

    params.passengerInfo = passangerInfo
  
    setButtonDisable(true)
    Service.post({ url: `/flight/user/ticketing`, body: JSON.stringify(params) })
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
            eventTrack('Payment', 'Flight', `${schedule[0].depature.location} - ${schedule[schedule.length - 1].arrival.location}`)
            window.location.href = response.data.fulfillUrl
          }
        }
      })
  }

  const renderLayover = (item: any, item1: any) => {
    let layover: any = ''
    let changed: any = false
    let shorter: any = false
    let longer: any = false
    if (item1) {
      const a = moment(item1.depature.dateTime.substring(0, 19))
      const b = moment(item.arrival.dateTime.substring(0, 19))
      layover = getDuration(a.diff(b, 'minutes'))
      if (a.diff(b, 'minutes') < 180) {
        shorter = true
      }
      if (a.diff(b, 'minutes') > 720) {
        longer = true
      }
      changed = (item.arrival.location !== item1.depature.location) ? true : false
    }
    return (
      <>
        {(item && item1) &&
          <div className='layover divider'>
            <div className='flex items-center justify-center mt-3 text-sm w-full divider-tex bg-gray-100 p-2'>
              {layover} &nbsp; Layover in {getAirportCity(item.arrival.location)} ({item.arrival.location}) &nbsp;
              {(changed === true) && <Badge key={1} color="yellow" name={<span className="block text-xs"><i className="las la-info-circle exclamation-info"></i> Airport change required</span>} />}
            </div>
            {(shorter) &&
              <div className='flex items-center justify-center mt-3 w-full divider-tex bg-red-100 p-2'>
                <span className='text-xs text-center'><i className="las la-info-circle text-xs exclamation-info"></i>  This flight has a layover time shorter than 3 hours which often increases the chance of missing the connecting flight. Please consider this before booking. </span>
              </div>
            }
            {(longer) &&
              <div className='flex items-center justify-center mt-3 w-full divider-tex bg-red-100 p-2'>
                <span className='text-xs text-center'><i className="las la-info-circle text-xs exclamation-info"></i>  This flight has a layover time more than 12 hours which often requires a transit visa. Please consider this before booking. </span>
              </div>
            }
          </div>
        }
      </>
    )
  }

  const renderFlightData = (item: any, index: any) => {
    return (
      <div
        className={`block nc-card-flights relative border-dashed border-2 border-neutral-200 dark:border-neutral-800 mt-3 p-3 rounded-2xl group`}>
        <div className="flex flex-col flex-grow">

          {/* 6 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
            <div className="flex flex-wrap sm:flex-row items-center my-2 space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
              <Avatar
                sizeClass="h-12 w-12"
                radius="rounded"
                imgUrl={getAirlineLogo(item.airline)}
              />
              <div className=' ml-3 sm:ml-1 sm:w-40'>
                <a className="flex items-center text-lg font-medium" href="##">
                  {getAirline(item.airline)}
                </a>
                <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{`${item.airline} - ${item.flightNo}`}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end  my-2 items-center space-y-3 sm:space-y-0 sm:space-x-3 ">
              <div>
                <span className="block text-sm font-medium">
                  {getAirportCity(item.depature.location)}({item.depature.location})
                </span>
                <span className="block text-lg font-medium">
                  {moment(item.depature.dateTime.substring(0, 19)).format('HH:mm')}
                </span>
                <div className="mt-1.5 lg:w-40 text-xs text-neutral-500 dark:text-neutral-400">
                  <span> {moment(item.depature.dateTime.substring(0, 19)).format('ll')} <br /> {getAirport(item.depature.location)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row lg:flex-col items-center my-2 text-center sm:text-center sm:space-x-3 ">
              <div className="block text-sm text-neutral-500 dark:text-neutral-400">
                <FaClock size='18' className='m-auto' />
              </div>
              <div className="w-20 mt-1 hidden lg:block mb-2 border-neutral-300 dark:border-neutral-700"></div>
              <span className="block text-sm ml-2 lg:ml-0 text-neutral-500 text-primary-700 dark:text-neutral-400">
                {getDuration(item.duration)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-start my-2 items-center space-y-3 sm:space-y-0 sm:space-x-3 ">
              <div>
                <span className="block text-sm font-medium">
                  {getAirportCity(item.arrival.location)}({item.arrival.location})
                </span>
                <span className="block text-lg font-medium">
                  {moment(item.arrival.dateTime.substring(0, 19)).format('HH:mm')}
                </span>
                <div className="mt-1.5 lg:w-40 text-xs text-neutral-500 dark:text-neutral-400">
                  <span> {moment(item.arrival.dateTime.substring(0, 19)).format('ll')} <br /> {getAirport(item.arrival.location)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  const _renderLoading = () => {
    return (
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
    );
  };

  const getBimanInfo = (schedule: any) => {
    const biman = schedule[0].filter((item: any) => { return (item.airline === 'BG') })
    if (biman && biman.length > 0) {
      if (biman.length !== schedule[0].length) {
        return true
      }
      return false
    } else {
      if (schedule && schedule[1]) {
        const biman1 = schedule[1].filter((item: any) => { return (item.airline === 'BG') })
        if (biman1.length === schedule[1].length) {
          return true
        }
        return false
      }
      return false
    }
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap p-5 bg-white dark:bg-neutral-900">

        {(loading) ? <div className='d-flex justify-content-center p-3'>{_renderLoading()}</div> :
          <>
            {(flightSchedule && getBimanInfo(flightSchedule) === true) ?
              <>
                <div className='nc-Badge inline-flex px-3 py-3 rounded-md font-medium text-sm relative text-red-800 bg-red-100 shadow-lg relative'>
                  <FaInfoCircle className='mr-1' size='18' /> Please call us to verify if this ticket can be confirmed/issued as this itinerary includes other airlines with Biman Bangladesh.
                </div>
              </>
              : null}

            {(flightSchedule && flightSchedule[0] && flightSchedule[0].length > 0) &&
              <>
                <p className='flex bg-gray-dt dark:bg-neutral-800 p-2'><FaPlane size={18} className='mr-2' /> {getAirportCity(flightSchedule[0][0].depature.location)} To {getAirportCity(flightSchedule[0][flightSchedule[0].length - 1].arrival.location)}, {moment(flightSchedule[0][0].depature.dateTime).format('ll')}</p>
                {flightSchedule[0].map((item: any, index: any, elements: any) => (
                  <>
                    {renderFlightData(item, index)}

                    {renderLayover(item, elements[index + 1])}
                  </>
                ))}
              </>
            }

            {(flightSchedule && flightSchedule[1] && flightSchedule[1].length > 0) &&
              <>
                <p className='flex bg-gray-dt dark:bg-neutral-800 p-2'><FaPlane size={18} className='mr-2' /> {getAirportCity(flightSchedule[1][0].depature.location)} To {getAirportCity(flightSchedule[1][flightSchedule[1].length - 1].arrival.location)}, {moment(flightSchedule[1][0].depature.dateTime).format('ll')}</p>
                {flightSchedule[1].map((item: any, index: any, elements: any) => (
                  <>
                    {renderFlightData(item, index)}

                    {renderLayover(item, elements[index + 1])}
                  </>
                ))}
              </>
            }
          </>
        }
      </div>
    );
  };

  const handleCollapse = (val: any, key: any, type: any) => {
    if (val === true) {
      setCollapse(`${type}${key}`)
    } else {
      setCollapse(null)
    }
  }

  const handleImagePath = (filepath: any, type: any, paxType: any, i: any) => {
    if (filepath !== false) {
      if (type === 'Passport') {
        const pp: any = passports
        if (paxType === 'child') {
          pp.child[i] = filepath
        } else if (paxType === 'infant') {
          pp.infant[i] = filepath
        } else {
          pp.adult[i] = filepath
        }

        setPassports(pp)
      } else if (type === 'Visa') {
        const v: any = visa
        if (paxType === 'child') {
          v.child[i] = filepath
        } else if (paxType === 'infant') {
          v.infant[i] = filepath
        } else {
          v.adult[i] = filepath
        }
        setVisa(v)
      }
    }
  }

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap p-5 bg-white dark:bg-neutral-900 mt-5 traveller-details">
        <div>
          <h2 className="text-2xl font-semibold">Traveller Details</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {[...Array(adultCount)].map((item, i) => (
          <div className='listingSection__wrap travellers p-3 bg-gray-100 dark:bg-neutral-800'>
            <div className='flex'>
              <h4 className="flex text-md font-semibold"><FaUserCheck size='20' className='mr-2' /> Adult {i + 1}</h4>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Date of Birth<span className="astrick">*</span></Label>
                {/* <Input
                  id={`adultDob_${i}`} name={`adultDob_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='Date of Birth'
                  innerRef={register({ required: true })}
                  invalid={errors[`adultDob_${i}`] && true}
                  max={moment().format('YYYY-MM-DD')}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                /> */}
                <Flatpickr
                  value={adultDOB[i]}
                  id={`adultDob_${i}`} name={`adultDob_${i}`}
                  className='form-control adultDOB'
                  placeholder='MM/DD/YYYY'
                  onChange={(date) => { handleAdultDOP(date, i) }}
                  options={{
                    maxDate: new Date(),
                    dateFormat: "d-m-Y"
                  }}
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
                  <option value="">Select Nationality</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.nationality}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

            {(international && international === 'Y') &&
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
                <FormGroup>
                  <Label className='block mb-1' for="email">Passport Number<span className="astrick">*</span></Label>
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
                  <Label className='block mb-1' for="email">Expiry Date<span className="astrick">*</span></Label>
                  {/* <Input
                    type='date'
                    id={`adultPassportExpiry_${i}`} name={`adultPassportExpiry_${i}`}
                    className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                    placeholder='Expiry Date'
                    innerRef={register({ required: true })}
                    invalid={errors[`adultPassportExpiry_${i}`] && true}
                    min={moment().format('YYYY-MM-DD')}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                  /> */}
                  <Flatpickr
                    value={adultPassportDOB[i]}
                    id={`adultPassportExpiry_${i}`} name={`adultPassportExpiry_${i}`}
                    className='form-control adultDOB'
                    placeholder='Expiry Date'
                    onChange={date => { handleAdultPassport(date, i) }}
                    options={{
                      minDate: moment().format('YYYY-MM-DD'),
                      dateFormat: "d-m-Y"
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className='block mb-1' for="email">Issued Country<span className="astrick">*</span></Label>
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
                    {countryLists.map((item: any, index: any) => (
                      <>
                        <option value={(debugInfo && debugInfo !== null && debugInfo.supplier === 'mystifly') ? item.iso2 : item.iso3}>{item.name}</option>
                      </>
                    ))}
                  </Input>
                </FormGroup>

                <UploadImage label="a front page of your Passport" pax="adult" handleImgUrl={handleImagePath} attachment={passports} index={i} />

                <UploadImage label="Visa / PR Document / Work Permit" pax="adult" handleImgUrl={handleImagePath} visa={visa} index={i} />
              </div>
            }

            {/****** FREQUENT FLYER********/}
            <div className="flex flex-wrap items-center max-w-xs text-sm leading-6 text-neutral-500">
              <Input
                type="checkbox"
                className={`block border-neutral-400 focus:border-primary-300 mr-2`}
                id={`adultFrequent_${i}`} name={`adultFrequent_${i}`}
                onChange={(e) => handleCollapse(e.target.checked, i, 'A')}
                innerRef={register({ required: false })}
                invalid={errors[`adultFrequent_${i}`] && true}
              />
              <span className=''>Add Frequent Flyer Information</span>
            </div>


            <div className={`${(collapse === `A${i}`) ? 'block' : 'hidden'} grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5`}>
              <FormGroup>
                <Input
                  type='select'
                  id={`adultFrequentAirline_${i}`} name={`adultFrequentAirline_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='Airline Code'
                  innerRef={register({ required: false })}
                  invalid={errors[`adultFrequentAirline_${i}`] && true}
                  value={validatingCarrier && validatingCarrier}
                  disabled
                >
                  <option value="">Select Airline</option>
                  {airlineData.map((item: any, index: any) => (
                    <>
                      <option key={`airline${index}`} value={item.id}>{`${item.name} (${item.id})`}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Input
                  id={`adultFrequentNumber_${i}`} name={`adultFrequentNumber_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='Frequent Flyer Number'
                  innerRef={register({ required: false })}
                  invalid={errors[`adultFrequentNumber_${i}`] && true}
                />
              </FormGroup>
            </div>
          </div>
        ))}

        {[...Array(childCount)].map((item, i) => (
          <div className='listingSection__wrap travellers bg-gray-100 p-3 dark:bg-neutral-800'>
            <div className='flex'>
              <h4 className="flex text-md font-semibold"><FaUserCheck size='20' className='mr-2' /> Child {i + 1}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Title<span className="astrick">*</span></Label>
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
                  <option value='ms' >Miss</option>
                  <option value='master' >Master</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">First Name<span className="astrick">*</span></Label>
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
                <Label className='block mb-1' for="email">Last Name<span className="astrick">*</span></Label>
                <Input
                  id={`childLastName_${i}`} name={`childLastName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Last Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`childLastName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Gender<span className="astrick">*</span></Label>
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
                <Label className='block mb-1' for="email">Phone<span className="astrick">*</span></Label>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Date of Birth<span className="astrick">*</span></Label>
                {/* <Input
                  type='date'
                  id={`childDob_${i}`} name={`childDob_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='Date of Birth'
                  innerRef={register({ required: true })}
                  invalid={errors[`childDob_${i}`] && true}
                  max={moment().format('YYYY-MM-DD')}
                  min={moment().subtract(11, 'years').format('YYYY-MM-DD')}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                /> */}
                <Flatpickr
                  value={childDOB[i]}
                  id={`childDob_${i}`} name={`childDob_${i}`}
                  className='form-control adultDOB'
                  placeholder='MM/DD/YYYY'
                  onChange={date => { handleChildDoP(date, i) }}
                  options={{
                    minDate: moment().subtract(11, 'years').format('YYYY-MM-DD'),
                    maxDate: new Date(),
                    dateFormat: "d-m-Y"
                  }}
                />
              </FormGroup>
              <FormGroup >
                <Label className='block mb-1' for="email">Nationality<span className="astrick">*</span></Label>
                <Input
                  type='select'
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  name={`childNationality_${i}`}
                  id={`childNationality_${i}`}
                  control={control}
                  innerRef={register({ required: true })}
                  invalid={errors[`childNationality_${i}`] && true}
                >
                  <option value="">Select Nationality</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.nationality}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

            {(international && international === 'Y') &&
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
                <FormGroup>
                  <Label className='block mb-1' for="email">Passport Number<span className="astrick">*</span></Label>
                  <Input id={`childPassportNumber_${i}`} name={`childPassportNumber_${i}`}
                    className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                    placeholder='Passport Number'
                    innerRef={register({ required: true })}
                    invalid={errors[`childPassportNumber_${i}`] && true}
                    onInput={(e: any) => {
                      e.target.value = (e.target.value.trim().toUpperCase().replace(/[^a-z0-9]/gi, ''))
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className='block mb-1' for="email">Expiry Date<span className="astrick">*</span></Label>
                  {/* <Input
                    type='date'
                    id={`childPassportExpiry_${i}`} name={`childPassportExpiry_${i}`}
                    className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                    placeholder='Expiry Date'
                    innerRef={register({ required: true })}
                    invalid={errors[`childPassportExpiry_${i}`] && true}
                    min={moment().format('YYYY-MM-DD')}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                  /> */}
                  <Flatpickr
                    value={childPassportDOB[i]}
                    id={`childPassportExpiry_${i}`} name={`childPassportExpiry_${i}`}
                    className='form-control adultDOB'
                    placeholder='MM/DD/YYYY'
                    onChange={date => { handleChildPassport(date, i) }}
                    options={{
                      minDate: moment().format('YYYY-MM-DD'),
                      dateFormat: "d-m-Y"
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className='block mb-1' for="email">Issued Country<span className="astrick">*</span></Label>
                  <Input
                    type='select'
                    className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                    name={`childPassportCountry_${i}`}
                    id={`childPassportCountry_${i}`}
                    control={control}
                    innerRef={register({ required: true })}
                    invalid={errors[`childPassportCountry_${i}`] && true}
                  >
                    <option value="">Country</option>
                    {countryLists.map((item: any, index: any) => (
                      <>
                        <option value={(debugInfo && debugInfo !== null && debugInfo.supplier === 'mystifly') ? item.iso2 : item.iso3}>{item.name}</option>
                      </>
                    ))}
                  </Input>
                </FormGroup>

                <UploadImage label="Passport" pax="child" handleImgUrl={handleImagePath} attachment={passports} index={i} />

                <UploadImage label="Visa" pax="child" handleImgUrl={handleImagePath} visa={visa} index={i} />

              </div>
            }
          </div>
        ))}

        {[...Array(infantCount)].map((item, i) => (
          <div className='listingSection__wrap travellers bg-gray-100 p-3 dark:bg-neutral-800'>
            <div className='flex'>
              <h4 className="flex text-md font-semibold"><FaUserCheck size='20' className='mr-2' /> Infant {i + 1}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Title<span className="astrick">*</span></Label>
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
                  <option value='ms' >Miss</option>
                  <option value='master' >Master</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">First Name<span className="astrick">*</span></Label>
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
                <Label className='block mb-1' for="email">Last Name<span className="astrick">*</span></Label>
                <Input
                  id={`infantLastName_${i}`} name={`infantLastName_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Last Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`infantLastName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).toUpperCase().replace(/[^A-Za-z ]/ig, '') }}
                />
              </FormGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Gender<span className="astrick">*</span></Label>
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
                <Label className='block mb-1' for="email">Phone<span className="astrick">*</span></Label>
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
                <Label className='block mb-1' for="email">Date of Birth<span className="astrick">*</span></Label>
                {/* <Input
                  type='date'
                  id={`infantDob_${i}`} name={`infantDob_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder='Date of Birth'
                  innerRef={register({ required: true })}
                  invalid={errors[`infantDob_${i}`] && true}
                  max={moment().format('YYYY-MM-DD')}
                  min={moment().subtract(2, 'years').format('YYYY-MM-DD')}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                /> */}
                <Flatpickr
                  value={infantDOB[i]}
                  id={`infantDob_${i}`} name={`infantDob_${i}`}
                  className='form-control adultDOB'
                  placeholder='MM/DD/YYYY'
                  onChange={date => { handleInfantDob(date, i) }}
                  options={{
                    minDate: moment().subtract(2, 'years').format('YYYY-MM-DD'),
                    maxDate: new Date(),
                    dateFormat: "d-m-Y"
                  }}
                />
              </FormGroup>
              <FormGroup >
                <Label className='block mb-1' for="email">Nationality<span className="astrick">*</span></Label>
                <Input
                  type='select'
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  name={`infantNationality_${i}`}
                  id={`infantNationality_${i}`}
                  control={control}
                  innerRef={register({ required: true })}
                  invalid={errors[`infantNationality_${i}`] && true}
                >
                  <option value="">Select Nationality</option>
                  {nationality.map((item: any, index: any) => (
                    <>
                      <option value={item.iso3}>{item.nationality}</option>
                    </>
                  ))}
                </Input>
              </FormGroup>
            </div>

            {(international && international === 'Y') &&
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
                <FormGroup>
                  <Label className='block mb-1' for="email">Passport Number<span className="astrick">*</span></Label>
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
                  <Label className='block mb-1' for="email">Expiry Date<span className="astrick">*</span></Label>
                  {/* <Input
                    type='date'
                    id={`infantPassportExpiry_${i}`} name={`infantPassportExpiry_${i}`}
                    className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                    placeholder='Expiry Date'
                    innerRef={register({ required: true })}
                    invalid={errors[`infantPassportExpiry_${i}`] && true}
                    min={moment().format('YYYY-MM-DD')}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                  /> */}
                  <Flatpickr
                    value={infantPassportDOB[i]}
                    id={`infantPassportExpiry_${i}`} name={`infantPassportExpiry_${i}`}
                    className='form-control adultDOB'
                    placeholder='MM/DD/YYYY'
                    onChange={date => { handleInfantpassport(date, i) }}
                    options={{
                      minDate: moment().format('YYYY-MM-DD'),
                      dateFormat: "d-m-Y"
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className='block mb-1' for="email">Issued Country<span className="astrick">*</span></Label>
                  <Input
                    type='select'
                    className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                    name={`infantPassportCountry_${i}`}
                    id={`infantPassportCountry_${i}`}
                    control={control}
                    innerRef={register({ required: true })}
                    invalid={errors[`infantPassportCountry_${i}`] && true}
                  >
                    <option value="">Country</option>
                    {countryLists.map((item: any, index: any) => (
                      <>
                        <option value={(debugInfo && debugInfo !== null && debugInfo.supplier === 'mystifly') ? item.iso2 : item.iso3}>{item.name}</option>
                      </>
                    ))}
                  </Input>
                </FormGroup>

                <UploadImage label="Passport" pax="infant" handleImgUrl={handleImagePath} attachment={passports} index={i} />

                <UploadImage label="Visa" pax="infant" handleImgUrl={handleImagePath} visa={visa} index={i} />

              </div>
            }
          </div>
        ))}

      </div>
    );
  };

  const renderEmailSelection = () => {
    return (
      <div className=" py-5 flex flex-col items-start">
        <div className="flex items-center">
          <input
            id="send-to-me"
            name="send-to-me"
            type="radio"
            className="focus:ring-primary-500 h-4 w-4 text-primary-500 border-neutral-300"
            checked={emailSelection === "own"}
            onChange={(e) => {
              setEmailSelection('own');
            }
            }
          />
          <label
            htmlFor="send-to-me"
            className="ml-2 sm:ml-3 block text-sm font-medium text-neutral-600 dark:text-neutral-300"
          >
            Send to Me
          </label>
        </div>
        <div className="flex items-center mt-4">
          <input
            id="different-person"
            name="different-person"
            type="radio"
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            checked={emailSelection === "another"}
            onChange={(e) => {
              setEmailSelection('another')
            }
            }
          />
          <label
            htmlFor="different-person"
            className="ml-2 sm:ml-3 block text-sm font-medium text-neutral-600 dark:text-neutral-300"
          >
            Send to Another Person
          </label>
        </div>
      </div>
    );
  };

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const renderSection3 = () => {

    const userInfo = Storage.get('auth');

    return (
      <div className="listingSection__wrap p-5 bg-white dark:bg-neutral-900 mt-5">
        <div>
          <h2 className="text-2xl font-semibold">Booking details will be sent to</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {renderEmailSelection()}

        {(emailSelection && emailSelection === 'another') &&
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
              <Label for='contactMobile'>Phone Number<span className="astrick">*</span></Label>
              <Controller
                control={control}
                id={`contactMobile`}
                name={`contactMobile`}
                innerRef={register({ required: true })}
                invalid={errors[`contactMobile`] && true}
                rules={{ required: true }}
                defaultValue={false}
                render={({ onChange, value, name }) => (
                  <PhoneInput value={value} name={name} onChange={onChange} />
                )}
              />
            </FormGroup>
          </div>
        }
      </div>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap p-5 bg-white dark:bg-neutral-900 mt-5">
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
      <div className="listingSection__wrap p-5 bg-white dark:bg-neutral-900 mt-5">
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
          <ButtonPrimary className='bg-secondary-900' disabled={buttonDisable} loading={buttonDisable}>Proceed To Payment</ButtonPrimary>
        </div>
      </div>
    );
  };

  const showPassengerFare = () => {
    return (
      <div className='flex flex-col w-56 justify-between'>
        <h2 className="mt-2">Passenger Fare</h2>
        {passengerFare && passengerFare.length > 0 &&
          <>
            {passengerFare.map((col: any, index: any) => (
              <div className="flex justify-between dark:text-neutral-300 mb-2">
                <span>{(col.type === 'CNN' || col.type === 'CHD') ? 'Children' : ((col.type === 'INF') ? 'Infant' : 'Adults')} ({col.qty})</span>
                <div><span className='currency-font'>{getCurrency(col.currency)}</span>{amountSeparator(col.fare)}</div>
              </div>
            ))}
          </>
        }
      </div>
    )
  }

  const renderSidebar = () => {
    return (
      <div className="listingSection__wrap p-5 bg-white dark:bg-neutral-900 shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-2xl font-semibold">
            FARE SUMMARY
          </span>
        </div>

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          {(loading) ? <div className='flex justify-content-center p-3'>{_renderLoading()}</div> :
            <>
              <div className="text-neutral-6000 dark:text-neutral-300">
                <div className='flex justify-between cursor-pointer' onClick={() => { setCollapseFare(!collapseFare) }}>
                  <span>Passenger Base Fare ({Number(adultCount) + Number(childCount) + Number(infantCount)} Pax)</span>
                  <div><span className='currency-font'>{baseFare && getCurrency(baseFare.currency)}</span>{baseFare && amountSeparator(baseFare.amount)}</div>
                </div>

                <div className={`mx-0 mt-2 ${(collapseFare === true) ? 'block' : 'hidden'}`}>
                  {passengerFare && passengerFare.length > 0 &&
                    <>
                      {passengerFare.map((col: any, index: any) => (
                        <div className='flex justify-between mt-1 text-neutral-500 dark:text-neutral-400 font-light'>
                          <span className="text-xs">{(col.type === 'CNN' || col.type === 'CHD') ? `Children x ${col.qty}` : ((col.type === 'INF') ? `Infant x ${col.qty}` : `Adults x ${col.qty}`)} </span>
                          <div className="text-xs"><span className='currency-font'>{getCurrency(col.currency)}</span>{amountSeparator(col.base)}</div>
                        </div>
                      ))}
                    </>
                  }
                </div>

              </div>
              <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                <span>Fee & Taxes</span>
                <div><span className='currency-font'>{flightTaxes && getCurrency(flightTaxes.currency)}</span> {flightTaxes && amountSeparator(flightTaxes.amount)}</div>
              </div>
              {(discountFare && discountFare.amount > 0) &&
                <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                  <span className='text-emerald-600'>Discounts </span>
                  <div className='text-emerald-600'>-<span className='currency-font'>{getCurrency(discountFare.currency)}</span> {amountSeparator(discountFare.amount)}</div>
                </div>
              }
              <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
              <div className="flex justify-between font-semibold">
                <div>
                  <span>Total Amount <Tooltip placement="top" trigger={['click']} overlay={showPassengerFare()}><i className="las la-info-circle fare-exclamation-info"></i></Tooltip></span>
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400 font-light">Includes Taxes & Fees</span>
                </div>

                <div><span className='currency-font'>{flightFare && getCurrency(flightFare.currency)}</span> {flightFare && amountSeparator(flightFare.amount)}</div>
              </div>
            </>
          }
        </div>

        <div className="flex flex-wrap items-center max-w-xs text-xs leading-6 text-neutral-500">
          <Input
            type="checkbox"
            className={`block border-neutral-400 focus:border-primary-300 mr-2`}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            name='terms'
          />
          I have read and I accept the Fare Rules , the <Link to='/privacy-policy' target='_blank' className="text-primary mr-1">Privacy Policy</Link> and <Link to='/terms-conditions' target='_blank' className="ml-1 mr-1 text-primary">Terms of Service</Link> of Ticketshala.</div>
        {/* SUBMIT */}
        <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <ButtonPrimary className='bg-secondary-900 w-full' disabled={buttonDisable} loading={buttonDisable}>Proceed To Payment</ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-ListingExperiencesDetailPage page-flight-review py-11 bg-neutral-100 dark:bg-neutral-900`} data-nc-id="ListingExperiencesDetailPage" >
      <Form onSubmit={handleSubmit(onSubmit)}>

        <div className="flight-review-container mb-5">
          <div className="container flex flex-col sm:flex-row justify-between flight-review-d">
            <h2 className={`text-2xl md:text-2xl font-semibold`}>Review Your Booking</h2>
            <div className="flex items-center justfy-start lg:justify-end">
              <ul className="stage-list">
                <li className='text-sm pr-2'>Flight Selection</li>
                <li className="text-sm review font-semibold pr-2">Booking</li>
                <li className='text-sm'>Payment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MAIn */}
        <main className="container flex flex-col sm:flex-row flight-review-d">

          {/* CONTENT */}
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:pr-10 lg:space-y-10">

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

export default ListingExperiencesDetailPage;

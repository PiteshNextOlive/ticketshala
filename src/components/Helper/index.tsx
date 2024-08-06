import { Fragment } from 'react'
import airline from '../../data/jsons/__airline.json'
import airports from '../../data/jsons/__airports.json'
import currencies from '../../data/jsons/__currencies.json'
import airportCountry from '../../data/jsons/__countries.json'
import Facilities from '../../data/jsons/__facilities.json'
import moment from 'moment'
import MoreInfo from './MoreInfo'
import { FaPlaneDeparture, FaParking, FaTaxi, FaSnowflake, FaHotel, FaShieldAlt, FaSeedling, FaBuilding, FaClinicMedical, FaBlender, FaBabyCarriage, FaBus, FaLanguage, FaNewspaper, FaRegBell, FaDog, FaGolfBall, FaWifi, FaPhoneAlt, FaLuggageCart, FaUtensils, FaSwimmingPool, FaUmbrellaBeach, FaChargingStation, FaMotorcycle, FaBed, FaTools, FaDumpster, FaHospital, FaElementor } from "react-icons/fa"
import { toast } from 'react-toastify';
import { GiChickenOven, GiChickenLeg } from "react-icons/gi"
import { MdDryCleaning, MdElectricalServices } from "react-icons/md"
import 'react-toastify/dist/ReactToastify.css';
import defaultImg from 'images/placeholder-large.png'
import Config from 'config.json'
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap_white.css'
import ReactGA from 'react-ga'
ReactGA.initialize('UA-221280050-1'); //UA-221280050-1 // UA-221281399-1

const OpenToast = ({ color, title, message, response }: any) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <h6 className='toast-title'>{title}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{message}</span>
      <span>{(Config.ENVIRONMENT === 'development' && response && response.debuginfo) && <MoreInfo response={response} />}</span>
    </div>
  </Fragment>
)

const OpenNotification = (type: any, title: any, message: any, response: any, autoClose: boolean) => {
  if (type === 'success') {
    toast.success(<OpenToast color={(type === 'error') ? 'danger' : type} title={title} message={message} response={response} />, {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      autoClose: (autoClose) ? 5000 : false
    })
  } else if (type === 'error') {
    toast.error(<OpenToast color={(type === 'error') ? 'danger' : type} title={title} message={message} response={response} />, {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      autoClose: (autoClose) ? 5000 : false
    })
  } else if (type === 'warning') {
    toast.warning(<OpenToast color={(type === 'error') ? 'danger' : type} title={title} message={message} response={response} />, {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      autoClose: (autoClose) ? 5000 : false
    })
  }
}

const getAirline = (code: any) => {
  const air = airline.filter((item) => item.id === code)
  return (air && air.length > 0) ? air[0].name : ''
}

const getAirlineLogo = (code: any) => {
  const airLogo = airline.filter((item) => item.id === code)
  return (airLogo && airLogo.length > 0) ? airLogo[0].logo : ''
}

const getDuration = (min: any) => {
  const duration = moment.duration(min, 'minutes')
  const hour = Math.floor(duration.asHours())
  const minutes = duration.minutes()

  return (<div><span className='font-weight-bolder'>{hour}</span>h <span className='font-weight-bolder'>{minutes}</span>m </div>)
}

const getCurrency = (val: any) => {
  const currency = currencies.filter((value) => {
    return value.code === val
  })
  return currency[0].symbolNative
}

const getAirport = (code: any) => {
  const airport = airports.filter((item) => item.iata_code === code)
  return airport[0].name
}

const getCabinClass = (code: any) => {
  const cabin = [{ id: 'P', value: 'Premium First' }, { id: 'F', value: 'First' }, { id: 'J', value: 'Premium Business' }, { id: 'C', value: 'Business' }, { id: 'S', value: 'Premium Economy' }, { id: 'Y', value: 'Economy' }]
  const classes = cabin.filter((item) => item.id === code)
  return (classes && classes.length > 0) ? classes[0].value : null
}

const getAirportCity = (code: any) => {
  const airport = airports.filter((item) => item.iata_code === code)
  return (airport && airport.length > 0) ? airport[0].city : null
}

const amountSeparator = (x: any) => {
  const amountFormat = Intl.NumberFormat('en-IN')
  return amountFormat.format(Math.floor(x))
}

const checkInternational = (from: any, to: any) => {
  const airportFrom = airports.filter((item) => item.iata_code === from)
  const airportTo = airports.filter((item) => item.iata_code === to)

  return airportFrom[0].country !== airportTo[0].country
}

const getAirportCountry = (val: any) => {
  const country = airportCountry.filter((value) => {
    return value.name === val
  })
  return (country && country.length > 0) ? country[0].iso2 : null
}

const getFlightCountry = (val: any) => {
  const country = airports.filter((value) => {
    return value.iata_code === val
  })
  return (country && country.length > 0) ? country[0].country : null
}

const renderFaIcons = (Icon: any, title: any) => {
  return (
    <div className='flex flex-col justify-center items-center text-neutral-800 dark:text-neutral-400 mr-2'>
      <Icon size={22} />
      <small className='truncate mb-0'>{title}</small>
    </div>
  )
}
const renderAmenities = (item: any, count: any) => {
  const items = item.split(",")

  return (
    <>
      {(items && items.length > 0) &&
        items.filter((_: any, i: any) => i < count).map((val: any, index: any) => (
          <>
            {(val === 'flight') && renderFaIcons(FaPlaneDeparture, 'Flight')}
            {(val === 'hotel') && renderFaIcons(FaHotel, 'Hotel')}
            {(val === 'parking') && renderFaIcons(FaParking, 'Parking')}
            {(val === 'airConditioning') && renderFaIcons(FaSnowflake, 'A/C')}
            {(val === 'cab') && renderFaIcons(FaTaxi, 'Transfer')}
            {(val === 'garden') && renderFaIcons(FaSeedling, 'Garden')}
            {(val === 'terrace') && renderFaIcons(FaBuilding, 'Terrace')}
            {(val === 'laundary') && renderFaIcons(FaDumpster, 'Launderette')}
            {(val === 'medical') && renderFaIcons(FaClinicMedical, 'Medical service')}
            {(val === 'charging_station') && renderFaIcons(FaChargingStation, 'Charging Station')}
            {(val === 'daycare') && renderFaIcons(FaHospital, 'Day-Care Centre')}
            {(val === 'babysitting') && renderFaIcons(FaBabyCarriage, 'Babysitting service')}
            {(val === 'transfer') && renderFaIcons(FaBus, 'Transfer service')}
            {(val === 'multilingual') && renderFaIcons(FaLanguage, 'Multilingual staff')}
            {(val === 'newspaper') && renderFaIcons(FaNewspaper, 'Newspapers')}
            {(val === 'bellboy') && renderFaIcons(FaRegBell, 'Bellboy service')}
            {(val === 'pets') && renderFaIcons(FaDog, 'Pets allowed')}
            {(val === 'golf') && renderFaIcons(FaGolfBall, 'Golf Desk')}
            {(val === 'wifi') && renderFaIcons(FaWifi, 'Wi-fi')}
            {(val === 'telephone') && renderFaIcons(FaPhoneAlt, 'Local & International calls')}
            {(val === 'luggage') && renderFaIcons(FaLuggageCart, 'Luggage Room')}
            {(val === 'swimming') && renderFaIcons(FaSwimmingPool, 'Private Pool')}
            {(val === 'electricKettle') && renderFaIcons(FaBlender, 'Electric Kettle')}
            {(val === 'BBQ') && renderFaIcons(GiChickenOven, 'BBQ facility')}
            {(val === 'Grill/BBQ') && renderFaIcons(GiChickenLeg, 'Grill/BBQ')}
            {(val === 'bike') && renderFaIcons(FaMotorcycle, 'Bikes Available')}
            {(val === 'towel') && renderFaIcons(FaBed, 'Towels and Bed Linen')}
            {(val === 'oven') && renderFaIcons(FaElementor, 'Oven')}
            {(val === 'dining') && renderFaIcons(FaUtensils, 'Dining area')}
          </>
        ))}
    </>
  )
}

const renderHotelFaIcons = (Icon: any, title?: any) => {
  return (
    <div key={Icon} className="flex items-center space-x-3">
      <Tooltip placement="top" trigger={['hover']} overlay={title}><Icon size={22} /></Tooltip>
    </div>
  )
}

const renderFacilities = (row: any) => {
  return (
    <>
      {
        (row && row !== null) &&
        Facilities.map((item: any, index: any) => (
          (row.includes(item.name) === true && item.icon !== "") &&
          <>
            {(item.icon === 'FaSeedling') && renderHotelFaIcons(FaSeedling, 'Garden')}
            {(item.icon === 'FaBuilding') && renderHotelFaIcons(FaBuilding, 'Terrace')}
            {(item.icon === 'FaDumpster') && renderHotelFaIcons(FaDumpster, 'Launderette')}
            {(item.icon === 'FaClinicMedical') && renderHotelFaIcons(FaClinicMedical, 'Medical service')}
            {(item.icon === 'FaChargingStation') && renderHotelFaIcons(FaChargingStation, 'Charging Station')}
            {(item.icon === 'FaHospital') && renderHotelFaIcons(FaHospital, 'Day-Care Centre')}
            {(item.icon === 'FaBabyCarriage') && renderHotelFaIcons(FaBabyCarriage, 'Babysitting service')}
            {(item.icon === 'FaBus') && renderHotelFaIcons(FaBus, 'Transfer service')}
            {(item.icon === 'FaLanguage') && renderHotelFaIcons(FaLanguage, 'Multilingual staff')}
            {(item.icon === 'FaNewspaper') && renderHotelFaIcons(FaNewspaper, 'Newspapers')}
            {(item.icon === 'FaRegBell') && renderHotelFaIcons(FaRegBell, 'Bellboy service')}
            {(item.icon === 'FaDog') && renderHotelFaIcons(FaDog, 'Pets allowed')}
            {(item.icon === 'FaGolfBall') && renderHotelFaIcons(FaGolfBall, 'Golf Desk')}
            {(item.icon === 'FaWifi') && renderHotelFaIcons(FaWifi, 'Wi-fi')}
            {(item.icon === 'FaPhoneAlt') && renderHotelFaIcons(FaPhoneAlt, 'Local & International calls')}
            {(item.icon === 'FaLuggageCart') && renderHotelFaIcons(FaLuggageCart, 'Luggage Room')}
            {(item.icon === 'FaUtensils') && renderHotelFaIcons(FaUtensils, 'Dining area')}
            {(item.icon === 'FaSwimmingPool') && renderHotelFaIcons(FaSwimmingPool, 'Private Pool')}
            {(item.icon === 'FaUmbrellaBeach') && renderHotelFaIcons(FaUmbrellaBeach, 'Beach')}
            {(item.icon === 'FaMotorcycle') && renderHotelFaIcons(FaMotorcycle, 'Bikes Available')}
            {(item.icon === 'FaBed') && renderHotelFaIcons(FaBed, 'Towels and Bed Linen')}
            {(item.icon === 'FaTools') && renderHotelFaIcons(FaTools, 'Hotel’s own bike shop/workshop')}
            {(item.icon === 'FaBlender') && renderHotelFaIcons(FaBlender, 'Electric Kettle')}
            {(item.icon === 'GiChickenOven') && renderHotelFaIcons(GiChickenOven, 'BBQ facility')}
            {(item.icon === 'MdDryCleaning') && renderHotelFaIcons(MdDryCleaning, 'Clothes dryer')}
            {(item.icon === 'GiChickenLeg') && renderHotelFaIcons(GiChickenLeg, 'Grill/BBQ')}
          </>
        ))
      }
    </>
  )

}

const ratingLabel = [
  { label: 'Fabulous', value: '5' },
  { label: 'Wonderful', value: '4.5' },
  { label: 'Very Good', value: '4' },
  { label: 'Good', value: '3.5' }
]

const getRatingLabel = (val: any) => {
  const rating = ratingLabel.filter((value: any) => {
    return value.value === Math.round(val)
  })
  return (rating && rating.length > 0) ? rating[0].label : 'Good'
}

const checkValidImage = (image: any) => {
  let dummyImage = defaultImg
  var ImageURL = (image && image !== null && image !== undefined) && image
  let validImage
  var pat = /^https?:\/\//i;
  if (pat.test(ImageURL)) {
    validImage = (image && (image && (image !== null && image !== undefined) && image) || dummyImage)
    return validImage
  } else {
    validImage = (image && (image && (image !== null && image !== undefined) && Config.MEDIA_URL + (image) || dummyImage)) || dummyImage
    return validImage
  }
}

const eventTrack = (category: any, action: any, label: any) => {
  ReactGA.event({ category: category, action: action, label: label, nonInteraction: true })
}

export { getAirline, getDuration, getAirlineLogo, getCurrency, getAirport, getCabinClass, getAirportCity, amountSeparator, getAirportCountry, checkInternational, OpenNotification, renderAmenities, renderFacilities, getRatingLabel, checkValidImage, getFlightCountry, eventTrack }
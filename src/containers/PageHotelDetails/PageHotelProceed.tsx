import React, { FC, Fragment, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'; 
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap' 
import Countries from 'data/jsons/__countries.json';
import { setLoginModalVisible } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'; 
import { Service, Storage } from 'services/Service';
import { OpenNotification } from 'components/Helper';
import PhoneInput from 'components/PhoneInput'

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const PageHotelProceed: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger }: any = useForm()

  const history = useHistory()
  const dispatch = useDispatch();
  const [adultCount, setAdultCount]: any = useState(1)
  const [childCount, setChildCount]: any = useState(0)
  const [roomCount, setRoomCount]: any = useState(0)
  const [loading, setLoading] = useState(true)
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestRooms: 1 });
  const [roomId, setRoomId]: any = useState(null)
  const [nationality, setNationality]: any = useState([])
  const [buttonDisable, setButtonDisable] = useState(false)

  useEffect(() => {
   
    // SEARCH DATA
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))
  
    const guest = guestValue
    
    if (params.get('roomid') && params.get('roomid') !== '') {
      setRoomId(params.get('roomid'))
    }
    if (params.get('rooms') && params.get('rooms') !== '') {
      setRoomCount(params.get('rooms'))
    }
    if (params.get('adults') && params.get('adults') !== '') {
      setAdultCount(params.get('adults'))
    }
    if (params.get('children') && params.get('children') !== '') {
      setChildCount(params.get('children'))
    }
   
    setGuestValue(guest)

    const countryNew = Countries.sort((x,y)=>{ return (x.iso2 === 'BD' || x.iso2 === 'IN') ? -1 : (y.iso2 === 'BD' || y.iso2 === 'IN') ? 1 : 0; });
    setNationality(countryNew)

  }, [])

  useEffect(() => {

    const userInfo =  Storage.get('auth')

    if (userInfo) {
      setValue('contactName', userInfo.name)
      setValue('contactEmail', userInfo.email)
      setValue('contactMobile', userInfo.phone)
    }

  }, [Storage])

  
  // PROCEED TO BOOKING
  const onSubmit = (value: any) => {

    {/***** CHECK USER LOGIN******/}
    const userData =  Storage.get('auth');
    if (userData === null) {
      dispatch(setLoginModalVisible(true));
      return false
    }
    {/**************/}

    const params: any = {
      rooms: [{
        roomId: roomId.replace(/\s/g, '+'),
      }],
      personalInfo: {
        name: value.contactName,
        surname: value.contactSurname,
        phone: value.contactMobile,
        email: value.contactEmail
      }
    }

    const passangerInfo = []

    // ADULT DETAILS
    if (value.adultFirstName_0 !== "") {
      for (let i = 0; i < 1; i++) {
        const temp_data: any = {
          title: value[`adultTitle_${i}`],
          name: value[`adultFirstName_${i}`],
          surName: value[`adultLastName_${i}`],
          gender: value[`adultGender_${i}`],
          type: 'ADT'
        }

        if(value[`adultFirstName_${i}`] !== "" && value[`adultLastName_${i}`] !== "") {
          passangerInfo.push(temp_data)
        }
      }
    }

    params.rooms[0].pax = passangerInfo

    setButtonDisable(true)
    Service.post({ url: `/hotels/validate`, body: JSON.stringify(params) })
    .then(response => {
      setButtonDisable(false)
      if (response && response.status === 'error') {
        OpenNotification('error', 'Oops!', response.data.message, response, false)
      }
      if (response.data && response.data.code) {
        history.push(`/hotel/checkout?${encodeURIComponent(`validateId=${response.data.code}&roomid=${roomId}`)}`)
      } else {
        OpenNotification('error', 'Oops!', 'Sorry! This Hotel is not accepting any booking at this moment. Kindly try another hotel!', response, false)
        history.push(`/hotels`)
      }
    })
    
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap bg-white traveller-details">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Guest Details</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {[...Array(Number(1))].map((item, i) => (
          <div className='listingSection__wrap p-5 travellers bg-gray-100'>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="email">Title{(i === 0) && <span className="astrick">*</span>}</Label>
                <Input
                  type='select' id={`adultTitle_${i}`} name={`adultTitle_${i}`}
                  className={`block w-full border-neutral-400 bg-white dark:bg-neutral-900 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: (i === 0) })}
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
                <Label className='block mb-1' for="email">Name{(i === 0) && <span className="astrick">*</span>}</Label>
                <Input
                  id={`adultFirstName_${i}`} name={`adultFirstName_${i}`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Name"
                  innerRef={register({ required: (i === 0) })}
                  invalid={errors[`adultFirstName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).trim().toUpperCase().replace(/[^A-Za-z]/ig, '') }}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Surname{(i === 0) && <span className="astrick">*</span>}</Label>
                <Input
                  id={`adultLastName_${i}`} name={`adultLastName_${i}`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Surname"
                  innerRef={register({ required: (i === 0) })}
                  invalid={errors[`adultLastName_${i}`] && true}
                  onInput={(e: any) => { e.target.value = (e.target.value).trim().toUpperCase().replace(/[^A-Za-z]/ig, '') }}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Gender{(i === 0) && <span className="astrick">*</span>}</Label>
                <Input
                  type='select'
                  id={`adultGender_${i}`} name={`adultGender_${i}`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  innerRef={register({ required: (i === 0) })}
                  invalid={errors[`adultGender_${i}`] && true}
                >
                  <option value='' >Select One</option>
                  <option value='M' >Male</option>
                  <option value='F' >Female</option>
                </Input>
              </FormGroup>
            </div>
            
          </div>
        ))}
        
      </div>
    );
  };

  const renderSection2 = () => {

    return (
      <>
      <div className="listingSection__wrap bg-white mt-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Booking details will be sent to</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-5">
          <FormGroup>
            <Label className='block mb-1' for="email">Name<span className="astrick">*</span></Label>
            <Input id={`contactName`} name={`contactName`}
              className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
              placeholder='Name'
              innerRef={register({ required: true })}
              onInput={(e: any) => { e.target.value = (e.target.value).trim().toUpperCase() }}
              invalid={errors[`contactName`] && true}
            />
          </FormGroup>
          <FormGroup>
            <Label className='block mb-1' for="email">Surname<span className="astrick">*</span></Label>
            <Input id={`contactSurname`} name={`contactSurname`}
              className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
              placeholder='Surname'
              innerRef={register({ required: true })}
              onInput={(e: any) => { e.target.value = (e.target.value).trim().toUpperCase() }}
              invalid={errors[`contactSurname`] && true}
            />
          </FormGroup>
          <FormGroup>
            <Label className='block mb-1' for="email">Email<span className="astrick">*</span></Label>
            <Input id={`contactEmail`} name={`contactEmail`}
              className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
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

      {/* SUBMIT */}
      <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
      <ButtonPrimary disabled={buttonDisable} loading={buttonDisable}>Proceed to Booking</ButtonPrimary>
    </div>
    </>
    );
  };

  return (
    <div
      className={`nc-ListingStayDetailPage  ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      
      {/* MAIn */}
      <main className="container mt-8 sm:mt-11 mb-11 flex ">

        <Form onSubmit={handleSubmit(onSubmit)}>
        
          {/* CONTENT */}
          <div className="w-full space-y-5 lg:space-y-10 lg:pr-10">
            {renderSection1()}
            {renderSection2()}
          </div>

        </Form>
      </main>

    </div>
  );
};

export default PageHotelProceed;

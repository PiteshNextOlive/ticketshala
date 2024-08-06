
import { FC, Fragment, useState, useContext, useEffect } from 'react'
import Avatar from "shared/Avatar/Avatar";
import ButtonPrimary from "shared/Button/ButtonPrimary";
/* import Input from "shared/Input/Input";
import Label from "components/Label/Label";*/
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";
import { Helmet } from "react-helmet";
import Badge from "shared/Badge/Badge";
import { Link, useHistory } from 'react-router-dom'
import { Service, Storage } from 'services/Service'
import { useDispatch, useSelector } from 'react-redux'
import { setLogoutStatus } from "redux/actions/booking";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Label } from 'reactstrap'
import { OpenNotification, checkValidImage } from 'components/Helper'
import moment from "moment";
import UploadImage from 'components/uploadbanner/index';
import Config from 'config.json'
import CountryList from 'data/jsons/__countries.json'
import avatar1 from "images/avatar.png";

import PhoneInput from 'components/PhoneInput'

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const history = useHistory()

  const [data, setData] = useState(Storage.get('auth'));
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()
  const [buttonDisable, setButtonDisable] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [dobPicker, setDobPicker]: any = useState(new Date())
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Storage.get('auth') === null) {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    if (data !== null) {
      setValue('avatar', data.avatar)
      setValue('name', data.name)
      setValue('email', data.email)
      setDobPicker(data.dob === null ? new Date() : data.dob)
      setValue('address', data.address)
      setValue('gender', data.gender)
      setValue('phone', data.phone)
      setValue('country', data.country)
      setAvatar(data.avatar)
    }
  }, [data])

  const logout = () => {
    // ** Remove user, accessToken & refreshToken from localStorage
    localStorage.removeItem('auth')
    localStorage.removeItem('token')
    dispatch(setLogoutStatus(true));
    history.push('/')
  }

  const onSubmit = (data: any) => {
   
    const params = {
      name: data.name,
      dob: moment(dobPicker).format('YYYY-MM-DD'),
      phone: data.phone,
      country: data.country
    }
    
    setLoading(true)
    setButtonDisable(true)
    Service.patch({
      url: '/user',
      body: JSON.stringify(params)
    })
      .then(response => {
        setButtonDisable(false)
        setLoading(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, '', false)
        } else {
          OpenNotification('success', 'Success!', 'Profile updated successfully', '', true)
          Storage.set('auth', (response.data))
          setData(response.data)
        }
      })
  }

  const handleImagePath = (filepath: any) => {
    if (filepath !== false) {
      setAvatar(filepath)

      const params = {
        avatar: filepath
      }

      Service.patch({
        url: '/user',
        body: JSON.stringify(params)
      })
        .then(response => {
          if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message, '', false)
          } else {
            OpenNotification('success', 'Success!', 'Profile photo updated successfully!', '', true)
            Storage.set('auth', (response.data))
            setData(response.data)
          }
        })
    }
  }

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Profile Information || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      <CommonLayout>

        <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 sm:space-y-8">
            {/* HEADING */}
            <h2 className="text-3xl font-semibold">Profile Information</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="showhim relative rounded-full overflow-hidden flex">
                  <Avatar
                    containerClassName="ring-2 ring-white"
                    sizeClass="w-32 h-32"
                    radius="rounded-full"
                    imgUrl={avatar !== '' ? checkValidImage(avatar) : avatar1}
                    userName={""} />
                  <div className="showme absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="mt-1 text-xs">Change Image</span>
                  </div>
                  <div className='cropModal'>
                    <UploadImage handleImgUrl={handleImagePath} ImgPath={avatar} aspectRatio={{ unit: '%', width: 100, aspect: 1 / 1 }} />
                  </div>
                </div>
                <div className="mt-5 cursor-pointer" onClick={() => logout()} >
                  <span className='logout-badge flex items-center justify-center font-medium'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-6 h-6 mr-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                  </span>
                </div>
              </div>
              <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                {/* ---- */}
                <div>
                  <Label>Full Name</Label>
                  <Controller
                    control={control}
                    as={Input}
                    id='name'
                    name='name'
                    placeholder='Name'
                    innerRef={register({ required: true })}
                    invalid={errors[`name`] && true}
                    onChange={(e: any) => setValue('name', e.target.value)}
                    className="mt-1.5 h-11 px-4 py-3 text-sm font-normal border-neutral-300 bg-white dark:bg-neutral-900 rounded-2xl w-full"
                  />
                </div>
                {/* ---- */}
                <div>
                  <Label>Email</Label>
                  <Controller
                    control={control}
                    as={Input}
                    id='email'
                    name='email'
                    placeholder='Email'
                    readOnly={true}
                    innerRef={register({ required: false })}
                    onChange={(e: any) => setValue('email', e.target.value)}
                    className="mt-1.5 h-11 px-4 py-3 text-sm font-normal border-neutral-300 bg-white dark:bg-neutral-900 rounded-2xl w-full" />
                </div>
                <div className="max-w-lg">
                  <Label>Date of birth</Label>
                  <Input type="date" onChange={(e: any) => setDobPicker(e.target.value)} value={dobPicker}
                    options={{ maxDate: 'today' }} name='dob' id='dob' placeholder='Select Date' innerRef={register()}
                    className="mt-1.5 h-11 px-4 py-3 text-sm border-neutral-300 bg-white dark:bg-neutral-900 font-normal rounded-2xl w-custom" />
                </div>
                {/* ---- */}
                <div>
                  <Label>Country</Label>
                  <Input
                    type='select'
                    name='country'
                    id='country'
                    className='nc-Select h-11 block w-full text-sm rounded-2xl border-neutral-300 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900'
                    control={control}
                    onChange={(e: any) => setValue('country', e.target.value)}
                    innerRef={register({ required: true })}
                    invalid={errors.country && true} >
                    <option value="">Select Country</option>
                    {CountryList.map((item, index) => (
                      <>
                        <option value={item.iso2}>{item.name}</option>
                      </>
                    ))}
                  </Input>
                </div>
                {/* ---- */}
                <div>
                  <Label>Phone Number</Label>
                  <Controller
                    control={control}
                    id={`phone`}
                    name={`phone`}
                    innerRef={register({ required: true })}
                    invalid={errors[`phone`] && true}
                    rules={{ required: true }}
                    defaultValue={false}
                    render={({ onChange, value, name }) => ( 
                      <PhoneInput value={value} name={name} onChange={onChange} />
                    )}
                  />
                </div>
                <div className="pt-2">
                  <ButtonPrimary disabled={loading} loading={loading} type="submit">Update </ButtonPrimary>
                </div>
              </div>
            </div>
          </div>
        </Form>


      </CommonLayout>
    </div>
  );
};

export default AccountPage;

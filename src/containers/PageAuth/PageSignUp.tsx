import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link, useHistory } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service, Storage } from 'services/Service'
import PageSocial from 'containers/PageSocial/PageSocial'
import { OpenNotification, eventTrack } from 'components/Helper'

import PhoneInput from 'components/PhoneInput'

const PageSignUp = ({ setIsOpenModal, setType }: any) => {

  const history = useHistory();
  // ** React hook form vars
  const { register, errors, handleSubmit, control, setValue, trigger } = useForm()

  const [buttonDisable, setButtonDisable] = useState(false)
  const [accepted, setAccepted] = useState(false)
  
  const onSubmit = (data: any) => {
    if (data.password.trim() === '') {
      OpenNotification('error', 'Oops!', 'Passwords enter valid password!', '', true);
      return false
    }

    if (data.password.trim() !== data.cpassword.trim()) {
      OpenNotification('error', 'Oops!', 'Passwords should be match!', '', true);
      return false
    }

    if (!accepted) {
      OpenNotification('error', 'Missing selection!', 'Please accept the Terms & Conditions & Privacy Policy!', '', true)
      return false
    }
    
    const params = {
      name: data.fullname,
      email: data.email,
      password: data.password,
      phone: data.phone
    }
   
    setButtonDisable(true)
    
    Service.post({
      url: '/user/signUp',
      body: JSON.stringify(params)
    })
    .then(response => {
      setButtonDisable(false)
      if (response.status === 'error') {
        OpenNotification('error', 'Oops!', response.data.message, response, true)
        return false
      }
      if (response.data) {
        Storage.set('auth', response.data.user);
        Storage.setString('token', response.data.token);
        eventTrack('Register', `${response.data.user.email} - ${response.data.user.id}`, 'Web')
        OpenNotification('success', `Welcome, ${response.data.user.name}`, 'You have successfully signed up! Now you can start to explore. Enjoy!!', '', true)
        setIsOpenModal(false)
      } 
    })
    .catch(err => {
      setButtonDisable(false)
      OpenNotification('error', 'Oops!', 'Something went wrong!', '', true)
    })
  }

  return (
    <div className={`nc-PageSignUp`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      <div className="auth-section mb-11 lg:mb-11">
        <h2 className="flex items-center mb-11 text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Create a new account
        </h2>

        <PageSocial />

        {/* OR */}
        <div className="relative max-w-md mx-auto text-center">
          <span className="relative z-10 inline-block px-4 py-8 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
            OR
          </span>
          <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          
          {/* FORM */}
          <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='block mb-1' for="email">Email Address</Label>
              <Input
                type="email"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Email Address"
                name='email'
                innerRef={register({ required: true })}
                invalid={errors.email && true}
              />
            </FormGroup>
            <FormGroup>
              <Label className='block mb-1' for="fullname">Full Name</Label>
              <Input
                type="text"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Full Name"
                name='fullname'
                innerRef={register({ required: true })}
                invalid={errors.fullname && true}
              />
            </FormGroup>
            <FormGroup>
              <Label className='block mb-1' for="phone">Phone Number</Label>
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
            </FormGroup>
            <FormGroup>
              <Label className='block mb-1' for="password">Password</Label>
              <Input
                type="password"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Password"
                name='password'
                innerRef={register({ required: true })}
                invalid={errors.password && true}
              />
            </FormGroup>
            <FormGroup>
              <Label className='block mb-1' for="cpassword">Confirm Password</Label>
              <Input
                type="password"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Confirm Password"
                name='cpassword'
                innerRef={register({ required: true })}
                invalid={errors.cpassword && true}
              />
            </FormGroup>
            <FormGroup className='flex item-center'>
              <Input
                type="checkbox"
                className={`block border-neutral-400 focus:border-primary-300`}
                name='terms'
                checked={accepted}
                onChange={(e) => setAccepted(e.currentTarget.checked)}
              /> <div className='ml-2 text-sm'>I agree with <Link to='/terms-conditions' target='_blank' className="text-primary">Terms & Conditions</Link> and <Link to='/privacy-policy' target='_blank' className="text-primary">Privacy Policy</Link></div>
            </FormGroup>
            <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} className='btn-login' type="submit">Continue</ButtonPrimary>
            
          </Form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <span className='text-primary cursor-pointer' onClick={()=> setType('login')}>Sign in</span>
          </span>
        </div>

        
      </div>
    </div>
  );
};

export default PageSignUp;

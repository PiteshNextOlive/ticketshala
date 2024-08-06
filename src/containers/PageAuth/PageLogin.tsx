import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service, Storage } from 'services/Service'
import PageSocial from 'containers/PageSocial/PageSocial'
import { OpenNotification, eventTrack } from 'components/Helper';

const PageLogin = ({ setIsOpenModal, setType }: any) => {

  const history = useHistory();
  // ** React hook form vars
  const { register, handleSubmit, errors } = useForm();
  
  const [buttonDisable, setButtonDisable] = useState(false)

  const onSubmit = (data: any) => {

    if (data.account !== '' && data.password !== '') {

      setButtonDisable(true)

      Service.post({
        url: '/user/signIn',
        body: JSON.stringify({
          account: data.account,
          password: data.password
        })
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
          eventTrack('Login', `${response.data.user.email} - ${response.data.user.id}`, 'Web')
          OpenNotification('success', `Welcome, ${response.data.user.name}`, 'You have successfully logged! Now you can start to explore. Enjoy!!', '', true)
          setIsOpenModal(false)
        } 
      })
      .catch(err => {
        setButtonDisable(false)
        OpenNotification('error', 'Oops!', 'Something went wrong!', '', true)
      })
    }
  }

  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
   
      <div className="auth-section mb-11 lg:mb-11">
        <h2 className="flex items-center text-3xl mb-11 leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
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
              <Label className='block mb-1' for="account">Email or Phone</Label>
              <Input
                type="text"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Email or Phone"
                name='account'
                innerRef={register({ required: true })}
                invalid={errors.account && true}
              />
            </FormGroup>
            <FormGroup>
              <Label className='flex justify-between mb-1' for="password">Password
                <span  className="text-sm text-primary cursor-pointer" onClick={()=> setType('forgot')}>
                  Forgot Password?
                </span>
              </Label>
              <Input
                type="password"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Password"
                name='password'
                innerRef={register({ required: true })}
                invalid={errors.password && true}
              />
            </FormGroup>
            <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} className='btn-login' type="submit">Continue</ButtonPrimary>
          </Form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <span className='text-primary cursor-pointer' onClick={()=> setType('signup')}>Create an account</span>
          </span>
        </div>

          
      </div>
    </div>
  );
};

export default PageLogin;

import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service, Storage } from 'services/Service';
import { OpenNotification } from 'components/Helper';

const PageForgotPassword = ({ setIsOpenModal, setType }: any) => {


  // ** React hook form vars
  const { register, handleSubmit, errors } = useForm();

  const [buttonDisable, setButtonDisable] = useState(false);

  const onSubmit = (data: any) => {
    if (data.account !== '') {

      setButtonDisable(true)

      Service.post({
        url: '/user/resetPassword',
        body: JSON.stringify({
          email: data.account
        })
      })
      .then(response => {
        setButtonDisable(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, response, true)
          return false
        }
        if (response.data) {
          OpenNotification('success', `Success!`, 'Link was successfully sent to your email address!', '', true)
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
      <Helmet>
        <title>Forgot Password || Ticketshala.com</title>
      </Helmet>
      <div className="auth-section mb-11 lg:mb-11">
        <h2 className="flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Forgot Password
        </h2>
        <div className="max-w-md mx-auto pt-11 space-y-6">

          {/* FORM */}
          <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='block mb-1' for="account">Email Address</Label>
              <Input
                type="text"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Email Address"
                name='account'
                innerRef={register({ required: true })}
                invalid={errors.account && true}
              />
            </FormGroup>
            <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} className='btn-login' type="submit">Continue</ButtonPrimary>
          </Form>
        
          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Back to {` `}
            <span className='text-primary cursor-pointer' onClick={()=> setType('login')}>Sign in</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageForgotPassword;

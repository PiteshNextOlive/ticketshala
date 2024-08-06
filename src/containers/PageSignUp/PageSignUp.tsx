import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link, useHistory } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service } from 'services/Service'
import PageSocial from 'containers/PageSocial/PageSocial'
import { OpenNotification } from 'components/Helper';
import Checkbox from "shared/Checkbox/Checkbox";

export interface PageSignUpProps {
  className?: string;
}


const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {

  const history = useHistory();
  // ** React hook form vars
  const { register, handleSubmit, errors } = useForm();

  const [buttonDisable, setButtonDisable] = useState(false)
  
  const onSubmit = (data: any) => {
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
        OpenNotification('error', 'Oops!', response.data.message, response, false)
        return false
      }

      OpenNotification('success', 'Success!', 'Thanks for singing up, please confirm your email!', '', true)
      history.push('/')
    })
    .catch(err => {
      setButtonDisable(false)
      OpenNotification('error', 'Oops!', 'Something went wrong!', '', true)
    })
  }

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      <div className="container auth-section mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Create a new account
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          
          <PageSocial />

          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='block mb-1' for="email">Email address</Label>
              <Input
                type="email"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Email"
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
              <Label className='block mb-1' for="phone">Mobile Number</Label>
              <Input
                type="text"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Mobile Number"
                name='phone'
                innerRef={register({ required: true })}
                invalid={errors.phone && true}
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
            <FormGroup>
            <Input
                type="checkbox"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Confirm Password"
                name='cpassword'
                innerRef={register({ required: true })}
                invalid={errors.cpassword && true}
              />
            </FormGroup>
            <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} className='btn-login' type="submit">Continue</ButtonPrimary>
            
          </Form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link className='text-primary' to="/login">Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;

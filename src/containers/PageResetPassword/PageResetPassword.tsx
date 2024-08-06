import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service, Storage } from 'services/Service'
import { OpenNotification } from 'components/Helper';

export interface PageLoginProps {
  className?: string;
}

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {

  const { token }: any = useParams()

  const history = useHistory();
  // ** React hook form vars
  const { register, handleSubmit, errors } = useForm();

  const [buttonDisable, setButtonDisable] = useState(false)

  const onSubmit = (data: any) => {
    if (token && token !== '' && data.password !== '') {

      if (data.password !== data.cpassword) {
        OpenNotification('error', 'Oops!', 'Passwords should be match!', '', true);
        return false
      }

      setButtonDisable(true)

      Service.post({
        url: '/user/updatePassword',
        body: JSON.stringify({
          newPassword: data.password,
          token: token
        })
      })
        .then(response => {
          setButtonDisable(false)
          if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message, response, false)
            return false
          }
          if (response.data) {
            OpenNotification('success', `Success!`, 'Your password has been changed successfully!', '', true)
            history.push('/')
          }
        })
        .catch(err => {
          setButtonDisable(false)
          OpenNotification('error', 'Oops!', 'Something went wrong!', '', true)
        })
    }
  }

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Reset Password || Ticketshala.com</title>
      </Helmet>
      <div className="container auth-section mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Reset Password
        </h2>
        <div className="max-w-md mx-auto space-y-6">

          {/* FORM */}
          <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='block mb-1' for="password">New Password</Label>
              <Input
                type="password"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Enter New Password"
                name='password'
                innerRef={register({ required: true })}
                invalid={errors.password && true}
              />
            </FormGroup>
            <FormGroup>
              <Label className='flex justify-between mb-1' for="cpassword">Confirm Password </Label>
              <Input
                type="password"
                className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                placeholder="Enter Confirm Password"
                name='cpassword'
                innerRef={register({ required: true })}
                invalid={errors.cpassword && true}
              />
            </FormGroup>
            <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} className='btn-login' type="submit">Continue</ButtonPrimary>
          </Form>

        </div>
      </div>
    </div>
  );
};

export default PageLogin;

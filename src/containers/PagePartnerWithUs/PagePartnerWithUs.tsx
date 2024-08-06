import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { Form, Input, Label, FormGroup } from 'reactstrap' 
import Checkbox from "shared/Checkbox/Checkbox";
import ButtonPrimary from "shared/Button/ButtonPrimary";

export interface PageSignUpProps {
  className?: string;
}


const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {

  const history = useHistory();
  // ** React hook form vars
  const { register, handleSubmit, errors } = useForm();

  const [buttonDisable, setButtonDisable] = useState(false) 
  const onSubmit = (data: any) => {
    
  }

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Partner Application || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-20">
        <div className="listingSection__wrap">
           {/* HEADING */}
          <h2 className="text-2xl font-semibold">New Partner Application</h2>
          <p style={{ marginTop: '1rem !important' }}>Tell us about you and your company.</p>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="fullName">Full Name</Label>
                <Input
                  id={`fullName`} name={`fullName`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Full Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`fullName`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="email">Email</Label>
                <Input
                  id={`email`} name={`email`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Email"
                  innerRef={register({ required: true })}
                  invalid={errors[`email`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="phone">Phone</Label>
                <Input
                  id={`phone`} name={`phone`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Phone"
                  innerRef={register({ required: true })}
                  invalid={errors[`phone`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="heared">How did you hear about us?</Label>
                <Input
                  type='select' id={`heared`} name={`heared`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="How did you hear about us?"
                  innerRef={register({ required: true })}
                  invalid={errors[`heared`] && true}
                >
                  <option value=''>Select One</option>
                  <option value='online'>Online Search</option>
                  <option value='youtube'>Youtube</option>
                  <option value='facebook'>Facebook</option>
                  <option value='frined'>A Friend</option>
                  <option value='other'>Other</option>
                </Input>
              </FormGroup>

            </div>

            <h4 className="text-lg font-semibold pt-11">Company Information</h4>
            {/* CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
              <FormGroup>
                <Label className='block mb-1' for="fullName">Company Name</Label>
                <Input
                  id={`company`} name={`company`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Company Name"
                  innerRef={register({ required: true })}
                  invalid={errors[`company`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="business">Type of Business</Label>
                <Input
                  type='select' id={`business`} name={`business`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="How did you hear about us?"
                  innerRef={register({ required: true })}
                  invalid={errors[`business`] && true}
                >
                  <option value="">Select Nature Of Business</option>
                  <option value="1">Destination management Company</option>
                  <option value="2">Source Management Company</option>
                  <option value="3">Travel Domain Company</option>
                  <option value="4">Insurance Domain Company</option>
                  <option value="5">Travel and Tourism</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="website">Website</Label>
                <Input
                  id={`website`} name={`website`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Website"
                  innerRef={register({ required: true })}
                  invalid={errors[`website`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="fullName">Address Line 1</Label>
                <Input
                  id={`address1`} name={`address1`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Address Line 1"
                  innerRef={register({ required: true })}
                  invalid={errors[`address1`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="fullName">Address Line 2</Label>
                <Input
                  id={`company`} name={`company`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Address Line 2"
                  innerRef={register({ required: true })}
                  invalid={errors[`company`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="city">City</Label>
                <Input
                  id={`city`} name={`city`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="City"
                  innerRef={register({ required: true })}
                  invalid={errors[`city`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="state">State</Label>
                <Input
                  id={`state`} name={`state`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="State"
                  innerRef={register({ required: true })}
                  invalid={errors[`state`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="state">Country</Label>
                <Input
                  id={`country`} name={`country`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Country"
                  innerRef={register({ required: true })}
                  invalid={errors[`country`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-1' for="zip">Postal / Zip Code </Label>
                <Input
                  id={`zip`} name={`zip`}
                  className={`block w-full border-neutral-400 focus:border-primary-300 rounded-2xl h-15 px-4 py-3`}
                  placeholder="Postal / Zip Code "
                  innerRef={register({ required: true })}
                  invalid={errors[`zip`] && true}
                />
              </FormGroup>
              <FormGroup>
                <Label className='block mb-2' for="interested">Are You Most Interested In? </Label>
                <Checkbox
                  label={'Travel and Tourism'}
                  name="interested"
                  value={'travel'}
                  className='mt-2'
                />
                <Checkbox
                  label={'Holiday Packages'}
                  name="interested"
                  value={'packages'}
                  className='mt-2'
                />
                <Checkbox
                  label={'Sightseeing'}
                  name="sight"
                  value={'travel'}
                  className='mt-2'
                />
              </FormGroup>
            </div>

            {/* SUBMIT */}
            <div className="flex flex-col mt-5 md:mt-5 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
              <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} className='btn-login' type="submit">Apply</ButtonPrimary>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;

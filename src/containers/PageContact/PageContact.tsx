import { FC, Fragment, useState, useContext } from 'react'
import { Helmet } from "react-helmet";
import SocialsList from "shared/SocialsList/SocialsList";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Label, FormGroup } from 'reactstrap'
import { Service, Storage } from 'services/Service'
import PageSocial from 'containers/PageSocial/PageSocial'
import { OpenNotification } from 'components/Helper'
import ReCAPTCHA from "react-google-recaptcha";
import Config from 'config.json'

const info = [
  {
    title: "🗺 ADDRESS",
    desc: "House 86/1, Inner Circular Road, Naya Paltan, Dhaka-1000",
  },
  {
    title: "⏰ TIMING",
    desc: "1000 Hours to 1800 Hours (Saturday - Thursday)",
  },
  {
    title: "💌 EMAIL",
    desc: "support@ticketshala.com",
  },
  {
    title: "☎ PHONE",
    desc: "+8809666770066",
  },
];

const PageContact = () => {

  // ** React hook form vars
  const { register, handleSubmit, errors, reset } = useForm();
  
  const [buttonDisable, setButtonDisable] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false);
	
	const onChangeCaptcha = (value: any) => {
		if(value) {
			setCaptchaVerified(true);
		}
	}

  const onSubmit = (data: any) => {

    const params = {
      name: data.name,
      email: data.email,
      message: data.message
    }

    if (!captchaVerified) {
      OpenNotification('error', 'Oops!', 'Please verify the reCAPTCHA!', '', false)
      return false
    }

    setButtonDisable(true)

    Service.post({
      url: '/data/contactus',
      body: JSON.stringify(params)
    })
      .then(response => {
        setButtonDisable(false)
        if (response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, '', true)
        } else {
          reset()
          OpenNotification('success', 'Thanks for being awesome!', 'We appreciate you contacting us. One of our colleagues will get back in touch with you soon!', '', true)
        }
      })
  }

  return (
    <div
      className={`nc-PageContact overflow-hidden`}
      data-nc-id="PageContact"
    >
      <Helmet>
        <title>Contact Us || Ticketshala.com</title>
      </Helmet>
      <div className="mb-16 lg:mb-16">
        <h2 className="my-10 sm:my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
        Contact Us
        </h2>
        <div className="container max-w-7xl mx-auto">
          <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-12 ">
            <div className="max-w-sm space-y-8">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                    {item.title}
                  </h3>
                  <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </span>
                </div>
              ))}
              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  🌏 SOCIALS
                </h3>
                <SocialsList className="mt-2" />
              </div>
            </div>
            <div>
              {/* FORM */}
              <Form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>

                <FormGroup>
                  <Label className='block mb-1' for="name">Full Name</Label>
                  <Input
                    type="text"
                    className={`block w-full border-neutral-400 focus:border-primary-300 rounded-lg h-15 px-4 py-3`}
                    placeholder="Full Name"
                    name='name'
                    innerRef={register({ required: true })}
                    invalid={errors.name && true}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className='block mb-1' for="email">Email Address</Label>
                  <Input
                    type="email"
                    className={`block w-full border-neutral-400 focus:border-primary-300 rounded-lg h-15 px-4 py-3`}
                    placeholder="Email Address"
                    name='email'
                    innerRef={register({ required: true })}
                    invalid={errors.email && true}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className='block mb-1' for="message">Message</Label>
                  <Input
                    type="textarea"
                    className={`block w-full border-neutral-400 focus:border-primary-300 rounded-lg h-15 px-4 py-3`}
                    placeholder="Write message here"
                    name='message'
                    rows={4}
                    style={{ resize: 'none' }}
                    innerRef={register({ required: true })}
                    invalid={errors.message && true}
                  />
                </FormGroup>
                <ReCAPTCHA sitekey={Config.GOOGLE_CAPTCHA} onChange={onChangeCaptcha} />
                <div>
                  <ButtonPrimary disabled={buttonDisable} loading={buttonDisable} type="submit">Send Message</ButtonPrimary>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContact;

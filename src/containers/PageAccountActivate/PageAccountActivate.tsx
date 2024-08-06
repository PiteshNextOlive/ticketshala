import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { Service } from 'services/Service'

const PageFlightPayment: React.FC = () => {

  const { type }: any = useParams()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(true)
  const [blocking, setBlocking] = useState(false)

  const _renderLoading = () => {
    return (
      <svg
        className="animate-spin m-auto h-11 w-11"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setProcessing(false)
    }, 2000);
  }, [])

  return (
    <div className="nc-Page404">
      <Helmet>
        <title>Account Activation || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      <div className="container relative pt-11 pb-16 lg:pb-20 lg:pt-11">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-2">
          {(processing === true) ?
            <div className='mt-11'>
              {_renderLoading()}
              <h2 className="text-2xl pt-11 lg:text-3xl font-semibold">
                Processing, Please wait...
              </h2>
            </div>
            :
            <>
              <h2 className="text-3xl pt-11 lg:text-4xl font-semibold">
                Email Address Confirmed!
              </h2>
              <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                You can now login with the email.
              </span>
           
              <div className="pt-8">
                <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
              </div>
            </>
          }
        </header>
      </div>
    </div>
  )
};

export default PageFlightPayment;

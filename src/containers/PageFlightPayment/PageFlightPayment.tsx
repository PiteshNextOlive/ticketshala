import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { Service } from 'services/Service'
import Config from 'config.json'

const PageFlightPayment: React.FC = () => {

  const { type }: any = useParams()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [processing, setProcessing] = useState(true)
  const [debugInfo, setDebugInfo]: any = useState([])
  const [blocking, setBlocking] = useState(false)

  const issueTicket = (txtid: any) => {
    // Add Api Call
    Service.post({
      url: '/flight/user/fulfillPnr',
      body: JSON.stringify({ txnId: txtid })
    })
      .then(response => {
        setProcessing(false)
        if (response && response.status == 'success') {
          if (response.data.bookingStatus === 2) {
            setTitle('Congratulation 🎉')
            setMessage('Your Transaction Completed. An email confirmation of your booking details with PNR has been sent!')
          } else if (response.data.bookingStatus === 3) {
            setTitle('Unable to issue ticket!')
            setMessage('Your Booking Completed. But there is problem while issuing ticket!')
            if (response.debuginfo) {
              setDebugInfo(response.debuginfo)
            }
          }
        }
      })
      .catch(err => {
        setProcessing(false)
      });
  }

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
    setProcessing(true)
    const params: any = new URLSearchParams(window.location.search)
    setBookingRef(params.get('txn_id'))

    if (type === 'success') {
      setMessage(params.get('message'))
      if (type === 'success') {
        if(params.get('type') === 'flight') {
          issueTicket(params.get('txn_id'))
        } else {
          setTitle('Congratulation 🎉')
          setMessage('Your Transaction Completed. An email confirmation of your booking details has been sent!')
          setProcessing(false)
        }
      } 
    } else if (type === 'failed') {

      if (params.get('status') === 'incomplete') {
        setTitle('Payment Incompleted!')
        setMessage('Unable to process payment!')
        setProcessing(false)
      } else if (params.get('status') === 'cancelled') {
        setTitle('Payment Cancelled!')
        setMessage('Unable to process payment!')
        setProcessing(false)
      } else {
        setTitle('Payment Failed!')
        setMessage('Unable to process payment!')
        setProcessing(false)
      }

    } else {
      setTitle('Payment Failed!')
      setMessage('Unable to process payment!')
      setProcessing(false)
    }
  }, [])

  return (
    <div className="nc-Page404">
      <Helmet>
        <title>Payment || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      <div className="container relative pt-11 pb-16 lg:pb-20 lg:pt-11">
        {/* HEADER */}
        <header className="text-center max-w-1xl mx-auto space-y-2">
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
                {title}
              </h2>
              <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                {message}
              </span>
              <span className="block text-md text-neutral-500 lg:text-lg sm:text-base dark:text-neutral-200 tracking-wider font-medium">
                Booking Reference #: {bookingRef}
              </span>
              {(Config.ENVIRONMENT === 'development' && debugInfo && debugInfo.supplier === 'sabre') &&
                <span className="block text-sm text-neutral-800 text-more sm:text-base dark:text-neutral-200 tracking-wider font-medium" onClick={() => setBlocking(!blocking)}>
                  View More Info
                </span>
              }
              {(blocking === true) &&
                <div className='view-debug-info'>
                  <span className='text-danger'>Errors:</span>
                  <ul style={{ paddingLeft: '17px' }}>
                    {
                      debugInfo && debugInfo.error.map((item: any, index: any) => (
                        <>
                          <li key={index}>{item.content}</li>
                        </>
                      ))
                    }
                  </ul>
                  <span className='text-warning'>Warnings:</span>
                  <ul style={{ paddingLeft: '17px' }}>
                    {
                      debugInfo && debugInfo.warning.map((item: any, index: any) => (
                        <>
                          <li key={index}>{item.content}</li>
                        </>
                      ))
                    }
                  </ul>
                </div>
              }
              <div className="pt-8">
                <ButtonPrimary href={`/order/${bookingRef}`}>View Booking Detail</ButtonPrimary>
              </div>
            </>
          }
        </header>
      </div>
    </div>
  )
};

export default PageFlightPayment;

import { PencilAltIcon } from "@heroicons/react/outline";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import NcImage from "shared/NcImage/NcImage";
import NcModal from "shared/NcModal/NcModal";
import { useHistory, Link } from 'react-router-dom';
import { Service, Storage } from 'services/Service';
import { amountSeparator, getCurrency, OpenNotification, eventTrack } from 'components/Helper';
import { Form, Input, Button, Label, FormGroup, InputGroup, Row, Col } from 'reactstrap'
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux'
import { StarIcon } from "@heroicons/react/solid";

export interface CheckOutPageProps {
  className?: string;
}

const CheckOutPage: FC<CheckOutPageProps> = ({ className = "" }) => {
  const history = useHistory()
  const { activityInfo, isFetching } = useSelector(({ booking }: any) => booking)
  const [buttonDisable, setButtonDisable] = useState(false)
  const [activityData, setActivityData]: any = useState(null)
  const [activityId, setActivityId]: any = useState(null)
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(()=> {
  
    // SEARCH DATA
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    if (params.get('activityId') && params.get('activityId') !== '') {
      setActivityId(params.get('activityId'))
    }

    if (activityInfo) {
      setActivityData(activityInfo)
    } else {
      history.goBack()
    }

  }, [activityInfo])

  const handleProceed = () => {

    if(activityInfo === null) {
      return false;
    }

    if (!termsAccepted) {
      OpenNotification('error', 'Oops!', 'Please accept the Fare Rules, Privacy Policy and Terms of Service!', '', true)
      return false
    }

    setButtonDisable(true)
    Service.post({ url: `/payment/init/user/activity`, body: JSON.stringify({ code: activityInfo.code }) })
      .then(response => {
        setButtonDisable(false)
        if (response && response.status === 'failed') {
          OpenNotification('error', 'Oops!', response.message, response, false)
        }
        if (response && response.status === 'error') {
          OpenNotification('error', 'Oops!', response.data.message, response, false)
        }
        if (response && response.status === 'success') {
          if (response.data === false) {
            OpenNotification('error', 'Oops!', 'Something went wrong, Please try again later!', response, false)
          } else {
            eventTrack('Payment', 'Activity', `${activityData && activityData.name}`)
            window.location.href = response.data.url
          }
        }
      })

  }
  
  const renderSidebar = () => {

    const userInfo =  Storage.get('auth');

    return (
      <>
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">FARE DETAILS</h3>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Base Price</span>
            <div><span className='currency-font'>{activityData && activityData.fare && getCurrency(activityData.fare.baseFare.currency)}</span>{activityData && activityData.fare && amountSeparator(activityData.fare.baseFare.amount)}</div>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Total Discount</span>
            <div><span className='currency-font'>{activityData && activityData.fare && getCurrency(activityData.fare.discount.currency)}</span>{activityData && activityData.fare && amountSeparator(activityData.fare.discount.amount)}</div>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Taxes & Service fees</span>
            <div><span className='currency-font'>{activityData && activityData.fare && getCurrency(activityData.fare.tax.currency)}</span>{activityData && activityData.fare && amountSeparator(activityData.fare.tax.amount)}</div>
          </div>

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <div><span className='currency-font'>{activityData && activityData.fare && getCurrency(activityData.fare.totalFare.currency)}</span>{activityData && activityData.fare && amountSeparator(activityData.fare.totalFare.amount)}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center max-w-xs text-xs leading-6 text-neutral-500">
          <Input
            type="checkbox"
            className={`block border-neutral-400 focus:border-primary-300 mr-2`}
            name='terms'
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          I have read and I accept the Fare Rules , the <Link to='/privacy-policy' target='_blank' className="text-primary mr-1">Privacy Policy</Link> and <Link to='/terms-conditions' target='_blank' className="ml-1 mr-1 text-primary">Terms of Service</Link> of Ticketshala.</div>
        {/* SUBMIT */}
        <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
          <ButtonPrimary className='bg-secondary-900 w-full' onClick={handleProceed} disabled={buttonDisable} loading={buttonDisable}>Proceed To Payment</ButtonPrimary>
        </div>
      </div>

    </>
    );
  };

  const renderMain = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
        <h2 className="text-3xl lg:text-3xl font-semibold">
          Confirm and Pay
        </h2>
        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="py-5 space-y-3">
              <div>
                <h2 className="flex flex-row items-center text-xl sm:text-xl lg:text-2xl mt-0 font-semibold">
                  {activityData && activityData.name}
                </h2>
              </div>
              <span className="block  text-sm text-neutral-500 dark:text-neutral-400">
                
              </span>
            </div>
          </div>
          <div>
            <NcModal
              renderTrigger={(openModal) => (
                <span onClick={() => openModal()}
                  className="block lg:hidden underline  mt-1 cursor-pointer"
                >
                  View Fare Details
                </span>
              )}
              renderContent={renderSidebar}
            />
          </div>
          <div className="mt-1 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700">
            
            {(activityData && activityData.pax && activityData.pax.length > 0) &&
              <div className="flex-1 mb-5 p-5 flex justify-between space-x-5">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-400">TRAVELLERS</span>
                  <span className="mt-1.5 text-lg font-semibold">{Number(activityData.pax.length)} Travellers</span>
                </div>
                <PencilAltIcon className="w-6 h-6 text-neutral-300 dark:text-neutral-6000" />
              </div>
            }
          </div>
          
          {(activityData && activityData.cancellationPolicy && activityData.cancellationPolicy.length > 0) &&
            <div className="flex flex-col mt-6 space-y-3">
              <h3 className="text-lg sm:text-lg lg:text-lg mt-0 font-semibold">
                Cancellation Policy <i className="las la-info-circle fare-exclamation-info"></i>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-5">
                <div key={21} className="pt-5 flex flex-col justify-start">
                  <p className="text-green"><strong>Free Cancellation</strong> until {moment(activityData.cancellationPolicy[0].dateFrom).format('LT')} on {moment(activityData.cancellationPolicy[0].dateFrom).format('ll')}</p>
                  <p className="text-neutral-6000 dark:text-neutral-300 mt-2">If you cancel booking after the date then cancellation charges will be <span className='currency-font'>{getCurrency(activityData.fare.totalFare.currency)}</span><span className="text-sm font-semibold">{amountSeparator(activityData.cancellationPolicy[0].amount)}</span></p>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    );
  };

  const getImpInfo = (str: any) => {
    const info = str.split(/\.\s*(?=[A-Z])/g)
    return (
      <>
        {(info && info.length > 0) ?
        <>
          {info.map((item: any, key: any) => (
          <> 
            {(item && item !== " ") &&
              <div key={`includes_${key}`} className="flex items-center space-x-3 mb-3">
                <i className="las la-check-circle text-2xl"></i>
                <span className="text-sm">{item}</span>
              </div>
            }
          </>
          ))}
        </>
        : null}
      </>
    )
  }

  const renderSection2 = () => {
    return (
      <>
        {(activityData && activityData.instructions) &&
        <div className="listingSection__wrap p-8 bg-white dark:bg-neutral-900 mt-6">
          <div>
            <h2 className="text-2xl font-semibold">Important Information</h2>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          {/* 6 */}
          <div className="text-sm text-neutral-700 dark:text-neutral-300 imp-info">
            <div key={1} className="flex flex-col items-start">
              {getImpInfo(activityData.instructions)}
            </div>
          </div>
        </div>
        }
      </>
    );
  };

  const _renderLoading = () => {
    return (
      <>
      <svg
        className="animate-spin -ml-1 mr-3 h-10 w-10"
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
      <h3 className="blocl text-lg pt-5 text-neutral-400">Please Wait, Fetching Details...</h3>
      </>
    );
  };

  return (
    <div className={`nc-CheckOutPage ${className}`} data-nc-id="CheckOutPage">
      <main className="container mt-11 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row">
        {(!isFetching) ?
        <>
          <div className="w-full lg:w-3/5 xl:w-2/3 lg:pr-10 ">
            {renderMain()}
            {renderSection2()}
          </div>
          
          <div className="hidden lg:block flex-grow">{renderSidebar()}</div>
        </>
          : 
          <div className="w-full p-5">
            <div className='flex flex-col justify-center items-center'>{_renderLoading()}</div> 
          </div>
          }
      </main>
    </div>
  );
};

export default CheckOutPage;

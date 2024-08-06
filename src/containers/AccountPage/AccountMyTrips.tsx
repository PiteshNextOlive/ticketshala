import { Fragment, useState, useEffect, FC } from 'react'
import { Tab } from "@headlessui/react";
import { Link, useHistory } from 'react-router-dom'
import ButtonPrimary from "shared/Button/ButtonPrimary";
import CommonLayout from "./CommonLayout";
import { FaSyncAlt } from "react-icons/fa"
import CardH from "./CardH";
import moment from "moment";
import { Service, Storage } from 'services/Service'
import Select from "shared/Select/Select"

const AccountSavelists = () => {

  const [loading, setLoading] = useState(false);
  const [upcomingList, setUpcomingList] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const history = useHistory()
  const userData =  Storage.get('auth')

  const getSearchResult = (type: any = '') => {

    const requests: any = {
      page: 1,
      limit: 500,
      dateOrder: 'desc'
    }

    if (type !== '') {
      requests.type = type 
    }
  
    setLoading(true)

    Service.post({ url: '/user/txn/search', body: JSON.stringify(requests) })
      .then((response) => {
        if (response) {
          setLoading(false)
          if (response.data.length > 0) {
            let upcoming: any = []
            let cancelled: any = []
            let completed: any = []
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].cStatus === 2) {
                  cancelled.push(response.data[i])
                } else if (response.data[i].cStatus !== 2 && moment(response.data[i].tripDate).isAfter(moment())) {
                  upcoming.push(response.data[i])
                } else {
                  completed.push(response.data[i])
                }
            }
            setUpcomingList(upcoming)
            setCancelledList(cancelled)
            setCompletedList(completed)

          } else {
            setUpcomingList([])
            setCancelledList([])
            setCompletedList([])
          }
        }
      })
  }

  useEffect(() => {
    if (userData && userData !== null) {
      getSearchResult()
    } else {
      history.push('/')
    }
  }, [])

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

  const renderSection1 = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className='flex items-center justify-between'>
          <h2 className="flex items-center text-3xl font-semibold">My Trips <FaSyncAlt onClick={() => getSearchResult()} size='20' className='text-neutral-400 cursor-pointer ml-2' /></h2>

          <Select className="w-36 rounded-1xl" onChange={(e) => getSearchResult(e.target.value)}>
            <option value=''>All</option>
            <option value='flight'>Flights</option>
            <option value='package'>Packages</option>
            <option value='hotel'>Hotels</option>
            <option value='activity'>Activities</option>
            <option value='transfer'>Transfers</option>
          </Select>
          
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 overflow-x-auto">
                <Tab key={11} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                          ? "bg-secondary-900 text-secondary-50 "
                          : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 bg-neutral-100 dark:hover:bg-neutral-800"
                        } `}
                    >
                      Upcoming
                    </button>
                  )}
                </Tab>
                <Tab key={12} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                        ? "bg-secondary-900 text-secondary-50 "
                        : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 bg-neutral-100 dark:hover:bg-neutral-800"
                      } `}
                  >
                    Cancelled
                  </button>
                )}
              </Tab>
              <Tab key={13} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${selected
                      ? "bg-secondary-900 text-secondary-50 "
                      : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 bg-neutral-100 dark:hover:bg-neutral-800"
                    } `}
                >
                  Completed
                </button>
              )}
            </Tab>
            </Tab.List>

            {(loading) ? <div className="flex flex-col mt-11 justify-center items-center">{_renderLoading()}</div> :

            <>
            <Tab.Panels>
              <Tab.Panel className="mt-8">
                {(upcomingList && upcomingList.length > 0) ?
                <>
                  <div className="grid grid-cols-1 gap-8">
                    {upcomingList.map((item, key) => (
                    <>
                      <CardH data={item} />
                    </>
                    ))}
                  </div>
                </>
                :
                <>
                  <div className="flex flex-col mt-11 justify-center items-center">
                    <h4 className='text-3xl md:text-xl font-semibold'>Looks like you have never booked with Ticketshala</h4>
                    <p className='mb-5 mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400'>When you book your trips will be shown here.</p>
                    <Link to='/'><ButtonPrimary>Start Booking Now</ButtonPrimary></Link>
                  </div>
                </>
                }
              </Tab.Panel>
              <Tab.Panel className="mt-8">
                {(cancelledList && cancelledList.length > 0) ?
                <>
                  <div className="grid grid-cols-1 gap-8">
                    {cancelledList.map((item, key) => (
                    <>
                      <CardH data={item} />
                    </>
                    ))}
                  </div>
                </>
                :
                <>
                  <div className="flex flex-col mt-11 justify-center items-center">
                    <h4 className='text-3xl md:text-xl font-semibold'>Looks like you have never cancelled with Ticketshala</h4>
                    <p className='mb-5 mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400'>When you cancel your trips will be shown here.</p>
                  </div>
                </>
                }
              </Tab.Panel>
              <Tab.Panel className="mt-8">
                {(completedList && completedList.length > 0) ?
                <>
                  <div className="grid grid-cols-1 gap-8">
                    {completedList.map((item, key) => (
                    <>
                      <CardH data={item} />
                    </>
                    ))}
                  </div>
                </>
                :
                <>
                  <div className="flex flex-col mt-11 justify-center items-center">
                    <h4 className='text-3xl md:text-xl font-semibold'>Looks like you have never completed booking with Ticketshala</h4>
                    <p className='mb-5 mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400'>When you complete your trips will be shown here.</p>
                    <Link to='/'><ButtonPrimary>Start Booking Now</ButtonPrimary></Link>
                  </div>
                </>
                }
              </Tab.Panel>
            </Tab.Panels>
            </>
            }
          </Tab.Group>
        </div>
      </div>
    );
  };

  return (
    <div>
      <CommonLayout>{renderSection1()}</CommonLayout>
    </div>
  );
};

export default AccountSavelists;

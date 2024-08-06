import { Fragment, useState, useEffect, FC } from 'react' 
import WidgetFilters from "./WidgetFilters";
import { Service } from 'services/Service'
import { Helmet } from "react-helmet";
import TransferModifySearchForm from "components/HeroSearchForm/TransferModifySearchForm";
import SectionGridHasMap from "./SectionGridHasMap";
import { FaFly } from "react-icons/fa" 
import 'react-loading-skeleton/dist/skeleton.css'
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import CardMobileHead from "./CardMobileHead";
import Circles from "components/Circles"
import ActivityLoader from "images/loader/tour_loading.gif";

// ** Store & Actions
// import { getAllCategories } from 'redux/actions/booking'
// import { useDispatch, useSelector } from 'react-redux'

export interface ListingCarMapPageProps {
  className?: string;
}

const PageTransferSearch = () => {

  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false);
  const [transfers, setTransfers]: any = useState([])
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);

  // FILTERS
  const [budgetFilter, setBudgetFilter] = useState([1, 200000])
  const [categoryFilter, setCategoryFilter] = useState('')

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);
  const [type, setType]: any = useState('filter');
  const [sortBy, setSortBy] = useState('priceAsc')

  const getLists = (data: any) => {
    setIsOpenModal(false)
    setLoading(true)

    Service.post({
      url: '/transfers',
      body: JSON.stringify(data)
    })
      .then(response => {
        setTimeout(() => {
          setLoading(false)
        }, 2000);
        if (response && response.data) {
          const sortedPrice = response.data.sort(function (a: any, b: any) {
            return a.fare.totalFare.amount - b.fare.totalFare.amount
          })

          setTransfers(sortedPrice)
        } else {
          setTransfers([])
        } 
      })
  }

  const getActivityList = (budget?: any, segment?: any, reset: any = false) => {
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    const origin: any = params.get('origin');
    const destination: any = params.get('destination');
    const adults: any = params.get('adults');
    const child: any = params.get('child');
    const time: any = params.get('time');

    const requests: any = {
      from: origin,
      to: destination,
      time: time.replace(' ', 'T'),
      pax: [{ type: "ADT", qty: parseInt(adults) }],
      limit: 50,
      page: 1
    }

    if (child && child !== "0") {
      requests.pax.push({ type: "CNN", qty: parseInt(child) })
    }

    //FILTERS DATA
    getLists(requests)
  }

  useEffect(() => {
    setLoading(true)
    getActivityList()

  }, [])

  const reserFilter = () => {
    setBudgetFilter([1, 200000])
    setCategoryFilter('')
    setIsOpenModal(false)
    getActivityList('', '', true)
  }

  const noData = () => {
    return (
      <div className='w-full w-full bg-white dark:bg-neutral-900 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-900 py-11 px-11 rounded-xl'>
        <FaFly size="40" className="text-neutral-500" />
        <h2 className="text-xl mt-2 font-semibold">No Transfers Found!</h2>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>We could not find any transfers as per your search criteria.</p>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>Please update your search criteria and do the search again.</p>
      </div>
    )
  }

  const showLoader = () => {
    return (
      <div className='flex justify-center bg-white items-center border-neutral-200 border border-neutral-300 dark:border-neutral-500 rounded-xl py-11 px-11'>
        <div className=''>
          <img src={ActivityLoader} style={{ width: '400px' }} />
        </div>
      </div>
    )
  }

  const handleCategory = (event: any) => {
    if (event.target.checked) {
      getActivityList('', event.target.value, false)
      setCategoryFilter(event.target.value)
    } else {
      getActivityList()
    }
  }

  const handleSorting = (type: any, val: any) => {
    setSortBy(val)
    
    if (type === 'price') {
      const sortedPrice = transfers.sort(function (a: any, b: any) {
        return (val === 'priceAsc') ? a.fare.totalFare.amount - b.fare.totalFare.amount : b.fare.totalFare.amount - a.fare.totalFare.amount
      })
      setTransfers(sortedPrice)
    }

    if (type === 'seat') {
      const sortedSeat = transfers.sort(function (a: any, b: any) {
        return (val === 'seatAsc') ? a.pax.max - b.pax.max : b.pax.max - a.pax.max
      })
      setTransfers(sortedSeat)
    }
  }

  return (
    <>
      <div className={`nc-ListingCarMapPage relative bg-neutral-100 dark:bg-black dark:bg-opacity-20`}
        data-nc-id="ListingCarMapPage"
      >
        <Helmet>
          <title>Transfer Search || Best Online Travel Agency in Bangladesh</title>
        </Helmet>

        {/* SECTION */}
        <div className="relative search-container-bg search-engine-desktop hidden sm:block lg:block md:block xl:block search-result pb-6 pt-6 xl:pl-10 xl:pr-10 xl:max-w-none">
          <div className='relative z-10'>
            <TransferModifySearchForm haveDefaultValue={true} header={false} page='page2' getSearchResult={getActivityList} />
          </div>
          <Circles />
        </div>

        {(!loading && transfers) &&
          <div className='bg-white space-y-5 p-3 mb-6 sm:hidden lg:hidden md:hidden xl:hidden border border-t'>
            <CardMobileHead setIsOpenModal={setIsOpenModal} setType={setType} />
          </div>
        }

        {/* SECTION */}
        <div className={`${(!showFullMapFixed) ? 'container' : ''} pb-24 lg:pb-32 relative`}>
          <div className={`nc-SectionLatestPosts relative mt-8`}>

            <div className="flex items-start flex-col lg:flex-row">
              {/* <div className="w-full hidden sm:block lg:block md:block xl:block space-y-7 mt-24 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-7">
                <WidgetFilters
                  setSearching={setSearching}
                  loading={loading}
                  getActivityList={getActivityList}
                  reserFilter={reserFilter}
                  categoryFilter={categoryFilter}
                  budgetFilter={budgetFilter}
                  handleCategory={handleCategory}
                  setIsOpenModal={setIsOpenModal}
                />
              </div> */}

              {(loading === true) &&
                <div className="w-full 2xl:pl-0">
                  {showLoader()}
                </div>
              }

              {(!loading && transfers) &&
                <div className="w-full">
                  <div className={`nc-ListingStayMapPage relative`} data-nc-id="ListingStayMapPage">
                    <div className="container pb-24 lg:pb-32 2xl:pl-0 xl:pr-0 xl:max-w-none" style={{ paddingLeft: '0px !important' }}>
                      {(transfers.length > 0) &&
                        <>
                          <SectionGridHasMap 
                            activityData={transfers} 
                            handleSorting={handleSorting}
                            sortBy={sortBy}
                          />
                        </>
                      }

                      {(!loading && transfers.length === 0) &&
                        <>
                          {noData()}
                        </>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 w-full">
                <div className="inline-flex flex-col w-full max-w-xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 text-left">
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={handleCloseModal} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {(type === 'search') ?
                      <>
                        <div className='sm-view'>
                          <TransferModifySearchForm haveDefaultValue={true} setIsOpenModal={setIsOpenModal} header={false} page='page2' getSearchResult={getActivityList} />
                        </div>
                      </>
                      :
                      <>
                        <div className="w-full sm-view space-y-7 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-7">
                          <WidgetFilters
                            setSearching={setSearching}
                            loading={loading}
                            getActivityList={getActivityList}
                            reserFilter={reserFilter}
                            categoryFilter={categoryFilter}
                            budgetFilter={budgetFilter}
                            handleCategory={handleCategory}
                            setIsOpenModal={setIsOpenModal}
                          />
                        </div>
                      </>
                    }
                  </div>

                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PageTransferSearch;

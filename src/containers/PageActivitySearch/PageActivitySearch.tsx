import { Fragment, useState, useEffect, FC } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Heading from "components/Heading/Heading";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import WidgetFilters from "./WidgetFilters";
import { Service } from 'services/Service'
import { Helmet } from "react-helmet";
import ActivityModifySearchForm from "components/HeroSearchForm/ActivityModifySearchForm";
import SectionGridHasMap from "./SectionGridHasMap";
import { FaFilter, FaSearch, FaFly } from "react-icons/fa"
import moment from "moment";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import CardMobileHead from "./CardMobileHead";
import Circles from "components/Circles"
import ActivityLoader from "images/loader/tour_loading.gif";

// ** Store & Actions
import { getAllCategories } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'

export interface ListingCarMapPageProps {
  className?: string;
}

const PageActivitySearch: FC<ListingCarMapPageProps> = ({ className = "" }) => {

  
  const history = useHistory();

  const dispatch = useDispatch()
 
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false);
  const [activities, setActivities] = useState([])
  const [currentPage, setCurrentPage] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);

  // FILTERS
  
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceFilter, setPriceFilter]: any = useState(null)

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);
  const [type, setType]: any = useState('filter');

  const getLists = (data: any) => {
    setIsOpenModal(false)
    setLoading(true)

    Service.post({
      url: '/activities',
      body: JSON.stringify(data)
    })
      .then(response => {
        setTimeout(() => {
          setLoading(false)
        }, 2000);
        if (response && response.data) {
          setActivities(response.data)
        } else {
          setActivities([])
        }
      })
  }

  const getActivityList = (budget?: any, segment?: any, reset: any = false) => {
    const formData: any = {
      page: 1,
      limit: 100
    }

    // SEARCH DATA
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    if (params.get('country') && params.get('country') !== '') {
      formData.country = params.get('country')
    }
    if (params.get('city') && params.get('city') !== '') {
      formData.location = params.get('city')
    }
    if (params.get('keyword') && params.get('keyword') !== '') {
      formData.keyword = params.get('keyword')
    }
    if (params.get('during') && params.get('during') !== '') {
      formData.sDate = moment(params.get('during')).format('YYYY-MM-DD')
      formData.eDate = moment(params.get('during')).add(5, "days").format('YYYY-MM-DD')
    } else {
      formData.sDate =  moment().format('YYYY-MM-DD')
      formData.eDate = moment().add(5, "days").format('YYYY-MM-DD')
    }
   
    if (budget && budget !== null) {
      const price = budget.split('-')
      if (price.length > 0) {
        formData.priceMin = Number(price[0])
        if (price[1]) {
          formData.priceMax = Number(price[1])
        }
      }
    }

    if (segment && segment !== '') {
      formData.segment = Number(segment)
    }

    formData.qty = [
      {type: "ADT", qty: 1}
    ]
   
    //FILTERS DATA
    getLists(formData)
  }

  useEffect(() => {
    setLoading(true)
    getActivityList()
  }, [])

  // PRICING FILTER
  const handlePricing = (val: any) => {
    setPriceFilter(val)
    getActivityList(val, '', true)
    setLoading(true)
  }

  const reserFilter = () => {
    setPriceFilter(null)
    setCategoryFilter('')
    setIsOpenModal(false)
    getActivityList('', '', true)
  }

  const noData = () => {
    return (
      <div className='w-full w-full bg-white dark:bg-neutral-900 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-900 py-11 px-11 rounded-xl'>
        <FaFly size="40" className="text-neutral-500" />
        <h2 className="text-xl mt-2 font-semibold">No Activities Found!</h2>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>We could not find any activities as per your search criteria.</p>
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

  return (
    <>
      <div className={`nc-ListingCarMapPage relative bg-neutral-100 dark:bg-black dark:bg-opacity-20 ${className}`}
        data-nc-id="ListingCarMapPage"
      >
        <Helmet>
          <title>Activity Search || Best Online Travel Agency in Bangladesh</title>
        </Helmet>

        {/* SECTION */}
        <div className='relative search-container-bg hidden sm:block lg:block md:block xl:block'>
          <div className='relative z-10'>
            <ActivityModifySearchForm haveDefaultValue={true} header={false} page='page2' getSearchResult={getActivityList} />
          </div>
          <Circles />
        </div>

        {(!loading && activities) &&
          <div className='bg-white space-y-5 p-3 mb-6 sm:hidden lg:hidden md:hidden xl:hidden border border-t'>
            <CardMobileHead setIsOpenModal={setIsOpenModal} setType={setType} />
          </div>
        }

        {/* SECTION */}
        <div className={`${(!showFullMapFixed) ? 'container' : ''} pb-24 lg:pb-32 relative`}>
          <div className={`nc-SectionLatestPosts relative mt-16`}>
            
            <div className="flex items-start flex-col lg:flex-row">
              <div className="w-full hidden sm:block lg:block md:block xl:block space-y-7 mt-24 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-7">
                <WidgetFilters
                  setSearching={setSearching}
                  loading={loading}
                  getActivityList={getActivityList}
                  reserFilter={reserFilter}
                  categoryFilter={categoryFilter}
                  priceFilter={priceFilter}
                  handleCategory={handleCategory}
                  setIsOpenModal={setIsOpenModal}
                  handlePricing={handlePricing}
                />
              </div>
              
              {(loading === true) &&  
                <div className="w-full 2xl:pl-10">
                  {showLoader()}
                </div>
              }
            
              {(!loading && activities) &&
                <div className="w-full">
                  <div className={`nc-ListingStayMapPage relative`} data-nc-id="ListingStayMapPage">
                    <div className="container pb-24 lg:pb-32 2xl:pl-10 xl:pr-0 xl:max-w-none">
                      {(activities.length > 0) &&
                        <>
                          <SectionGridHasMap activityData={activities} />
                        </>
                      }

                      {(!loading && activities.length === 0) &&
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
                        <ActivityModifySearchForm haveDefaultValue={true} setIsOpenModal={setIsOpenModal} header={false} page='page2' getSearchResult={getActivityList} />
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
                          priceFilter={priceFilter}
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

export default PageActivitySearch;

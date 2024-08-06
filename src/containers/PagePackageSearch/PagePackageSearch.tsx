import { Fragment, useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import WidgetFilters from "./WidgetFilters";
import { Service } from 'services/Service'
import { Helmet } from "react-helmet";
import PackageModifySearchForm from "components/HeroSearchForm/PackageModifySearchForm";
import SectionGridHasMap from "./SectionGridHasMap";
import { FaFly } from "react-icons/fa"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import moment from "moment";
import 'react-loading-skeleton/dist/skeleton.css'
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import CardMobileHead from "./CardMobileHead";
import Circles from "components/Circles"
import PackageLoader from "images/loader/tour_loading.gif";
import ButtonPrimary from "shared/Button/ButtonPrimary";
// ** Store & Actions
import { getAllCategories } from 'redux/actions/booking'
import { useDispatch, useSelector } from 'react-redux'

export interface ListingCarMapPageProps {
  className?: string;
}

const ListingCarMapPage: FC<ListingCarMapPageProps> = ({ className = "" }) => {

  const history = useHistory();

  const dispatch = useDispatch()
  const { allCategories } = useSelector(({ booking }: any) => booking)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false);
  const [packages, setPackages] = useState([])
  const [page, setPage] = useState(1)
  const [totalPackage, setTotalPackage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [loadingMore, setLoadingMore] = useState(false);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);

  // FILTERS
  const [budgetFilter, setBudgetFilter] = useState([1, 200000])
  const [nightsFilter, setNightsFilter] = useState([0, 20])
  const [hotelFilter, setHotelFilter] = useState('')
  const [themeFilter, setThemeFilter] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);
  const [type, setType]: any = useState('filter');


  const getCategoryLists = () => {
    const params = {
      page: 1,
      limit: 30,
      type: "packages"
    }
    dispatch(getAllCategories(params))
  }

  useEffect(() => {
    if (allCategories) {
      setCategories(allCategories)
    }
  }, [allCategories])

  const getLists = (data: any, more: any) => {
    setIsOpenModal(false)
    setLoading(true)

    Service.post({
      url: '/packages',
      body: JSON.stringify(data)
    })
      .then(response => {
        setTimeout(() => {
          setLoading(false)
          setLoadingMore(false)
        }, 2000);
        if (response.status === 'success') {

          if (response.data) {
            setPackages(response.data);
          }

          if (response.pagination && response.pagination.total) {
            setTotalPackage(response.pagination.total)
          }
        }
      })
  }

  const getPackageList = (budget?: any, nights?: any, hotel?: any, theme?: any, reset: any = false, more: any = null) => {

    const formData: any = {
      page: currentPage,
      limit: rowsPerPage
    }

    // SEARCH DATA
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    if (params.get('dCountry') && params.get('dCountry') !== '') {
      formData.dCountry = params.get('dCountry')
    }
    if (params.get('dCityName') && params.get('dCityName') !== '') {
      formData.dCity = params.get('dCityName')
    }
    if (params.get('country') && params.get('country') !== '') {
      formData.country = params.get('country')
    }
    if (params.get('cityName') && params.get('cityName') !== '') {
      formData.city = params.get('cityName')
    }
    if (params.get('during') && params.get('during') !== '') {
      formData.month = moment(params.get('during')).format('MMM').toLowerCase()
      formData.year = moment(params.get('during')).format('YYYY')
    }
    if (params.get('country') === null && params.get('title') && params.get('title') !== '') {
      formData.title = params.get('title')
    }
    if (params.get('slug') && params.get('slug') !== '') {
      formData.category = params.get('slug')
    }

    if (more === 'next') {
      const next = currentPage + 1
      setCurrentPage(next)
      formData.page = next
    } else if (more === 'prev') {
      const prev = currentPage - 1
      setCurrentPage(prev)
      formData.page = prev
    }

    //FILTERS DATA
    if (!reset) {

      let tempBudget: any = budgetFilter
      let tempNights: any = nightsFilter
      let tempHotel: any = hotelFilter
      let tempTheme: any = themeFilter

      if (budget && budget.length > 0) {
        tempBudget = budget
        setBudgetFilter(budget)
      }
      if (nights && nights.length > 0) {
        tempNights = nights
        setNightsFilter(nights)
      }
      if (theme && theme !== '') {
        tempTheme = theme
        setThemeFilter(theme)
      }
      if (hotel && hotel !== '') {
        tempHotel = hotel
        setHotelFilter(hotel)
      }

      if (tempBudget && tempBudget.length > 0) {
        formData.priceMin = parseInt(tempBudget[0])
        formData.priceMax = parseInt(tempBudget[1])
      }
      if (tempNights && tempNights.length > 0) {
        formData.dayMin = parseInt(tempNights[0] + 1)
        formData.dayMax = parseInt(tempNights[1] + 1)
      }
      if (tempTheme && tempTheme !== '') {
        formData.category = tempTheme
      }
      if (tempHotel && tempHotel !== '') {
        formData.hotelClass = tempHotel
      }
    }
    getLists(formData, more)
  }

  useEffect(() => {
    setLoading(true)
    getPackageList()
    getCategoryLists()
  }, [])

  const reserFilter = () => {
    setBudgetFilter([1, 200000])
    setNightsFilter([0, 20])
    setHotelFilter('')
    setThemeFilter('')
    setIsOpenModal(false)
    getPackageList('', '', '', '', true, null)
  }

  const handlePrevious = () => {
    getPackageList('', '', '', '', false, 'prev')
  }
  const handleNext = () => {
    getPackageList('', '', '', '', false, 'next')
  }

  const noData = () => {
    return (
      <div className='w-full w-full bg-white dark:bg-neutral-900 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-900 py-11 px-11 rounded-xl'>
        <FaFly size="40" className="text-neutral-500" />
        <h2 className="text-xl mt-2 font-semibold">No Packages Found!</h2>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>We could not find any packages as per your search criteria.</p>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>Please update your search criteria and do the search again.</p>
      </div>
    )
  }

  const showLoader = () => {
    return (
      <div className='flex justify-center bg-white items-center border-neutral-200 border border-neutral-300 dark:border-neutral-500 rounded-xl py-11 px-11'>
        <div className=''>
          <img src={PackageLoader} style={{ width: '400px' }} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`nc-ListingCarMapPage relative bg-neutral-100 dark:bg-black dark:bg-opacity-20 ${className}`}
        data-nc-id="ListingCarMapPage"
      >
        <Helmet>
          <title>Package Search || Best Online Travel Agency in Bangladesh</title>
        </Helmet>

        {/* SECTION */}
        <div className='relative search-container-bg hidden sm:block lg:block md:block xl:block'>
          <div className='relative z-10'>
            <PackageModifySearchForm haveDefaultValue={true} header={false} page='page2' getSearchResult={getPackageList} />
          </div>
          <Circles />
        </div>

        {(!loading && packages) &&
          <div className='bg-white space-y-5 p-3 mb-6 sm:hidden lg:hidden md:hidden xl:hidden border border-t'>
            <CardMobileHead setIsOpenModal={setIsOpenModal} setType={setType} />
          </div>
        }

        {/* SECTION */}
        <div className={`${(!showFullMapFixed) ? 'container' : ''} pb-16 lg:pb-24 relative`}>
          <div className={`nc-SectionLatestPosts relative mt-8 sm:mt-16`}>

            <div className="flex items-start flex-col lg:flex-row">
              <div className="w-full hidden sm:block lg:block md:block xl:block space-y-7 mt-24 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-7">
                <WidgetFilters
                  setSearching={setSearching}
                  loading={loading}
                  categories={categories}
                  packageData={packages}
                  getPackageList={getPackageList}
                  reserFilter={reserFilter}
                  hotelFilter={hotelFilter}
                  themeFilter={themeFilter}
                  budgetFilter={budgetFilter}
                  nightsFilter={nightsFilter}
                  setIsOpenModal={setIsOpenModal}
                />
              </div>

              {(loading === true) &&
                <div className="w-full 2xl:pl-10 mt-3 sm:mt-0">
                  {showLoader()}
                </div>
              }

              {(!loading && packages) &&
                <div className="w-full">
                  <div className={`nc-ListingStayMapPage relative`} data-nc-id="ListingStayMapPage">
                    <div className="pb-2 sm:pb-24 2xl:pl-10 xl:pr-0 xl:max-w-none">
                      {(packages.length > 0) &&
                        <>
                          <SectionGridHasMap packageData={packages} />
                        </>
                      }

                      {(!loading && packages.length === 0) &&
                        <>
                          {noData()}
                        </>
                      }
                    </div>
                  </div>

                  {totalPackage > 10 &&
                    <div className='flex pagination-button  ' style={{ justifyContent: 'center' }} >
                      <ButtonPrimary onClick={handlePrevious} disabled={currentPage === 1} className=' pag mx-5 ' ><BsArrowLeft className='mx-1' />Previous</ButtonPrimary>
                      <ButtonPrimary onClick={handleNext} disabled={Number(10 * currentPage) > totalPackage} className='pag mx-5 w-32'>Next<BsArrowRight className='mx-1' /></ButtonPrimary>
                    </div>
                  }
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
                          <PackageModifySearchForm haveDefaultValue={true} setIsOpenModal={setIsOpenModal} header={false} page='page2' getSearchResult={getPackageList} />
                        </div>
                      </>
                      :
                      <>
                        <div className="w-full sm-view space-y-7 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-7">
                          <WidgetFilters
                            setSearching={setSearching}
                            loading={loading}
                            categories={categories}
                            packageData={packages}
                            getPackageList={getPackageList}
                            reserFilter={reserFilter}
                            hotelFilter={hotelFilter}
                            themeFilter={themeFilter}
                            budgetFilter={budgetFilter}
                            nightsFilter={nightsFilter}
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

export default ListingCarMapPage;

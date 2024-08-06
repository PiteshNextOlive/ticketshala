import { Fragment, useState, useEffect, FC } from 'react'
import { Link, useHistory } from 'react-router-dom'
import WidgetFilters from "./WidgetFilters";
import { Service } from 'services/Service'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from "react-helmet";
import HotelModifiedSearchForm from "components/HeroSearchForm/HotelModifiedSearchForm";
import CardMobileHead from "./CardMobileHead";
import SectionGridHasMap from "./SectionGridHasMap";
import { FaHotel } from "react-icons/fa" 
import 'react-loading-skeleton/dist/skeleton.css'
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Circles from "components/Circles"
import HotelLoader from "images/loader/hotel_loading.gif";

export interface ListingCarMapPageProps {
  className?: string;
}

const ListingCarMapPage: FC<ListingCarMapPageProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [searching, setSearching] = useState(false);
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [loading, setLoading] = useState(false)
  const [hotels, setHotels]: any = useState([])
  const [totalPage, setTotalPage] = useState(0);
  const [sortBy, setSortBy] = useState('priceAsc')

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);
  const [type, setType]: any = useState('filter');

  // FILTERS
  const [priceFilter, setPriceFilter]: any = useState(null)
  const [categoryFilter, setCategoryFilter]: any = useState([])
  const [facilityFilter, setFacilityFilter]: any = useState([])
  const [cancellationFilter, setCancellationFilter]: any = useState(false)
  const [nameFilter, setNameFilter]: any = useState("")

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

  }, [])

  const getLists = (data?: any, load?: boolean) => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    setSearching((load) ? false : true)
    Service.post({
      url: '/hotels',
      body: JSON.stringify(data)
    }).then(response => {
      setTimeout(() => {
        setLoading(false)
        setSearching(false);
      }, 1500);
      
      if (response && response.data && response.data.length > 0) {
        setTotalPage(response.pages)
        setHotels(response.data)
      } else {
        setHotels([])
      }
    })
  }

  const getHotelList = (modified?: boolean, load?: boolean, budget?: any, classes?: any, amenities?: any, sortingBy: any = 'priceAsc', refundable?: boolean, name: any = '') => {
    const formData: any = {
      page: currentPage,
      limit: 20
    }
  
    if (modified) {
      budget = null
      classes = null 
      amenities = []

      setCategoryFilter([])
      setFacilityFilter([])
      setPriceFilter(null)
    }

    // SEARCH DATA
    const search = window.location.search
    const params = new URLSearchParams(decodeURIComponent(search))

    if (params.get('country') && params.get('country') !== '') {
      formData.country = params.get('country')
    }
    if (params.get('city') && params.get('city') !== '') {
      formData.city = params.get('city')
    }
    if (params.get('fromDate') && params.get('fromDate') !== '') {
      formData.fromDate = params.get('fromDate')
    }
    if (params.get('toDate') && params.get('toDate') !== '') {
      formData.toDate = params.get('toDate')
    }
    formData.occupancies = [{
      rooms: Number(params.get('rooms')),
      adults: Number(params.get('adults')),
      children: Number(params.get('child'))
    }]


    const filter: any = {}
    if (amenities && amenities.length > 0) {
      filter['amenities'] = amenities
    }
    if (classes && classes.length > 0) {
      filter['class'] = classes
    }
    if (budget && budget !== null) {
      const price = budget.split('-')
      if (price && price.length > 0) {
        filter['minPrice'] = Number(price[0])
        if (price[1]) {
          filter['maxPrice'] = Number(price[1])
        }
      }
    }
    if (name !== "") {
      filter['nameLike'] = name
    }
    if (refundable === true) {
      filter['refundable'] = true
    }
    if (Object.keys(filter).length > 0) {
      formData.filter = filter
    }

    if (sortingBy && sortingBy !== "") {
      formData.sort = sortingBy
    }
    
    
    getLists(formData, load)
  }

  useEffect(() => {
    if(currentPage > 1)
      getHotelList(false, true, priceFilter, categoryFilter, facilityFilter, sortBy, cancellationFilter, nameFilter)
    else 
    getHotelList(false, false, priceFilter, categoryFilter, facilityFilter, sortBy, cancellationFilter, nameFilter)
  }, [currentPage])

  const handleLoadMore = (opt: any) => {
    window.scrollTo(0,0);
    const page = (opt === 'prev') ? currentPage - 1 : currentPage + 1;
    setCurrentPage((page < 0) ? 1 : page)
    setLoading(true)
  }

  // PRICING FILTER
  const handlePricing = (val: any) => {
    setPriceFilter(val)
    getHotelList(false, true, val, categoryFilter, facilityFilter, sortBy, cancellationFilter)
    setLoading(true)
  }

  // CANCELLATION FILTER
  const handleCancellation = (e: any) => {
    setCancellationFilter(e.target.checked)
    getHotelList(false, true, priceFilter, categoryFilter, facilityFilter, sortBy, e.target.checked)
    setLoading(true)
  }

  // CATEGORY FILTER
  const handleCategory = (e: any) => {

    const categoryData: any = categoryFilter;
    const categoryIndex = categoryData.indexOf(parseInt(e.target.value))
    if (e.target.checked) {
      categoryData.push(e.target.value)
    } else {
      categoryData.splice(categoryIndex, 1)
    }

    setCategoryFilter([...categoryData])

    getHotelList(false, true, priceFilter, categoryData, facilityFilter, sortBy, cancellationFilter)
    setLoading(true)
  }

  const handleHotelName = (val: any) => {
    setNameFilter(val)
    getHotelList(false, true, priceFilter, categoryFilter, facilityFilter, sortBy, cancellationFilter, val)
    setLoading(true)
  }
  
  // FILTER FACILITY
  const handleFacility = (e: any) => {
    const faciltiyData: any = facilityFilter;
    const facilityIndex = faciltiyData.indexOf(parseInt(e.target.value))
    if (e.target.checked) {
      faciltiyData.push(parseInt(e.target.value))
    } else {
      faciltiyData.splice(facilityIndex, 1)
    }

    setFacilityFilter([...faciltiyData])
    getHotelList(false, true, priceFilter, categoryFilter, faciltiyData, sortBy, cancellationFilter)
    setLoading(true)
  }

  const resetFilter = () => {
    setCategoryFilter([])
    setFacilityFilter([])
    setPriceFilter(null)
    setSortBy('priceAsc')
    setCancellationFilter(false)
    setNameFilter("")
    getHotelList(false, true, null, null, [], sortBy, false, '')
    setLoading(true)
  }

  const handleSorting = (val: any) => {
    setSortBy(val)
    getHotelList(false, true, priceFilter, categoryFilter, facilityFilter, val, cancellationFilter)
    setLoading(true)
  }

  const noData = () => {
    return (
      <div className='w-full flex flex-col justify-center items-center border border-neutral-200 py-11 px-11 rounded-xl'>
        <FaHotel size="40" className="text-neutral-500" />
        <h2 className="text-xl mt-2 font-semibold">No Hotels Found!</h2>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>We could not find any hotel as per your search criteria.</p>
        <p className='w-full m-auto text-neutral-500 mt-4 text-center'>Please update your search criteria and do the search again.</p>
      </div>
    )
  }

  const showLoader = () => {
    return (
      <div className='flex justify-center items-center border-neutral-200 border border-neutral-300 dark:border-neutral-500 rounded-xl py-11 px-11'>
        <div className=''>
          <img src={HotelLoader} style={{ width: '220px' }} />
          <h2 className="text-lg mt-3 font-semibold">Searching For Hotels...</h2>
        </div>
      </div>
    )
  }

  return (
  <>
    <div className={`nc-ListingCarMapPage relative ${className}`}
      data-nc-id="ListingCarMapPage"
    >
      <Helmet>
        <title>Hotel Search || Best Online Travel Agency in Bangladesh</title>
      </Helmet>

      {/* SECTION */}
      <div className="relative container hidden sm:block lg:block md:block xl:block search-container-bg search-result pb-8 lg:pb-8 pt-8 xl:pl-10 xl:pr-10 xl:max-w-none">
        <div className='relative z-10'>
          <HotelModifiedSearchForm haveDefaultValue={true} header={false} page='page2' setIsOpenModal={setIsOpenModal} setCurrentPage={setCurrentPage} getHotelList={getHotelList} />
        </div>
        <Circles />
      </div>

      {(!searching && hotels && hotels.length > 0) &&
        <div className='bg-white space-y-5 p-3 mb-6 sm:hidden lg:hidden md:hidden xl:hidden border border-t'>
          <CardMobileHead departure={departure} arrival={arrival} setIsOpenModal={setIsOpenModal} setType={setType} />
        </div>
      }

      {/* SECTION */}
      <div className={`${(!showFullMapFixed) ? 'container' : ''} pb-24 lg:pb-32 relative`}>
        <div className={`nc-SectionLatestPosts relative mt-2 lg:mt-16`}>
          <div className="flex items-start flex-col lg:flex-row">

            {!showFullMapFixed && (
              <div className="w-full hidden sm:block lg:block md:block xl:block mt-24 lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-7">
                <WidgetFilters
                  searching={searching}
                  showFullMapFixed={showFullMapFixed}
                  setShowFullMapFixed={(data: any) => setShowFullMapFixed(data)}
                  setIsOpenModal={setIsOpenModal}
                  hotels={hotels}
                  handlePricing={handlePricing}
                  handleCategory={handleCategory}
                  handleFacility={handleFacility}
                  handleCancellation={handleCancellation}
                  handleHotelName={handleHotelName}
                  resetFilter={resetFilter}
                  priceFilter={priceFilter}
                  facilityFilter={facilityFilter}
                  categoryFilter={categoryFilter}
                  cancellationFilter={cancellationFilter}
                  nameFilter={nameFilter}
                />
              </div>
            )}

            <div className="w-full lg:w-5/5 xl:w-3/3">
              <div className={`nc-ListingStayMapPage relative`} data-nc-id="ListingStayMapPage">

                {(loading === true || searching === true) &&
                  <div className="w-full">
                    {showLoader()}
                  </div>
                }

                <div className="container pb-24 lg:pb-32 2xl:pl-10 xl:pr-0 xl:max-w-none">

                  {(!searching && !loading && hotels && hotels.length > 0) &&
                    <SectionGridHasMap
                      showFullMapFixed={showFullMapFixed}
                      setShowFullMapFixed={(data: any) => setShowFullMapFixed(data)}
                      hotels={hotels}
                      handleLoadMore={handleLoadMore}
                      searching={searching}
                      loading={loading}
                      totalPage={totalPage}
                      currentPage={currentPage}
                      handleSorting={handleSorting}
                      sortBy={sortBy}
                    />
                    
                  }

                  {(!searching && hotels && hotels.length === 0) &&
                    <>
                      {noData()}
                    </>
                    }
                </div>
              </div>
            </div>
           
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
                      <div className="search-container-bg search-result pb-8 lg:pb-8 pt-4 xl:pl-10 xl:pr-10 xl:max-w-none">
                        <div className='p-5 mt-3'>
                          <HotelModifiedSearchForm haveDefaultValue={true} header={false} page='page2' setIsOpenModal={setIsOpenModal} getHotelList={getHotelList} />
                        </div>
                      </div>
                    </>
                    :
                    <>
                      <div className="w-full sm-view lg:mt-0 lg:w-1/5 lg:pl-10 xl:pl-0 xl:w-1/3 xl:pr-14">
                        <WidgetFilters
                          searching={searching}
                          showFullMapFixed={showFullMapFixed}
                          setShowFullMapFixed={(data: any) => setShowFullMapFixed(data)}
                          setIsOpenModal={setIsOpenModal}
                          hotels={hotels}
                          handlePricing={handlePricing}
                          handleCategory={handleCategory}
                          handleFacility={handleFacility}
                          handleCancellation={handleCancellation}
                          handleHotelName={handleHotelName}
                          resetFilter={resetFilter}
                          priceFilter={priceFilter}
                          facilityFilter={facilityFilter}
                          categoryFilter={categoryFilter}
                          cancellationFilter={cancellationFilter}
                          nameFilter={nameFilter}
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

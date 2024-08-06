import React, { FC, Fragment, useEffect, useState } from "react";
import { useParams, useHistory, Link } from 'react-router-dom'
import { ArrowRightIcon } from "@heroicons/react/outline";
import LocationMarker from "components/AnyReactComponent/LocationMarker";
import CommentListing from "components/CommentListing/CommentListing";
import { StarIcon } from "@heroicons/react/solid";
import GoogleMapReact from "google-map-react";
import useWindowSize from "hooks/useWindowResize";
import moment from "moment";
import Badge from "shared/Badge/Badge";
import ButtonCircle from "shared/Button/ButtonCircle";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import FiveStartIconForRate from "./FiveStartIconForRate";
import Input from "shared/Input/Input";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import ModalPhotos from "./ModalPhotos";
import { Service, Storage } from 'services/Service';
import Config from './../../config.json';
import { amountSeparator, getCurrency, renderFacilities } from 'components/Helper';
import ReactDOM from "react-dom";
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap_white.css';
import defaultImg from 'images/hotel-placeholder.png'

export interface ListingStayDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  const { hotelid }: any = useParams()
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [loading, setLoading] = useState(true)
  const [guestValue, setGuestValue] = useState({ guestAdults: 2, guestChildren: 0, guestRooms: 1 });
  let [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [hotelData, setHotelData]: any = useState(null)
  const [galleryData, setGalleryData]: any = useState([])
  const [facilities, setFacilities]: any = useState([])
  const [roomData, setRoomData]: any = useState([])
  const [shareTitle, setShareTitle] = useState(null)
  const [shareUrl, setShareUrl]: any = useState(null)
  const [totalNights, setTotalNights]: any = useState(null);
  const [facilityMore, setFacilityMore] = useState(10);

  const getBookingNights = (cin: any, cout: any) => {
    return moment(cout).diff(moment(cin), 'days')
  }

  const getHotelData = () => {

    const formData: any = {
      page: 1,
      limit: 10
    }

    // SEARCH DATA
    const search = window.location.search;
    const params = new URLSearchParams(decodeURIComponent(search))
    let occupancies: any = {}

    const guest = guestValue

    if (params.get('chkin') && params.get('chkin') !== '') {
      formData.fromDate = params.get('chkin')
    }
    if (params.get('chkout') && params.get('chkout') !== '') {
      formData.toDate = params.get('chkout')
    }

    if (params.get('chkin') && params.get('chkin') !== "" && params.get('chkout') && params.get('chkout') !== "") {
      setTotalNights(getBookingNights(params.get('chkin'), params.get('chkout')))
    }

    if (params.get('country') && params.get('country') !== '') {
      formData.country = params.get('country')
    }
    if (params.get('city') && params.get('city') !== '') {
      formData.city = params.get('city')
    }
    if (params.get('rooms') && params.get('rooms') !== '') {
      occupancies.rooms = Number(params.get('rooms'))
      guest['guestRooms'] = Number(params.get('rooms'))
    }
    if (params.get('adults') && params.get('adults') !== '') {
      occupancies.adults = Number(params.get('adults'))
      guest['guestAdults'] = Number(params.get('adults'))
    }
    if (params.get('children') && params.get('children') !== '') {
      occupancies.children = Number(params.get('children'))
      guest['guestChildren'] = Number(params.get('children'))
    }
    if (params.get('featured') && params.get('featured') === 'true') {
      formData.featured = true
    }

    formData.occupancies = [occupancies]
    setGuestValue(guest)
    formData.id = hotelid
    setLoading(true)
    Service.post({ url: `/hotels/rooms`, body: JSON.stringify(formData) })
      .then(response => {
        setLoading(false)
        if (response.status === 'error') {
          history.push('/hotels')
          return false
        }
        setHotelData(response.data)
        setShareTitle(response.data.name)
        setShareUrl(`${Config.SITE_URL}/hotel/view/${response.data.id}${search}`)

        // GALLERY DATA
        let img: any = []
        if (response.data.images && response.data.images.length > 0) {
          for (var i = 0; i < response.data.images.length; i++) {
            img.push(`${Config.GIATA_URL}${response.data.images[i].path}`)
          }
          setGalleryData(img)
        }

        // ROOM DATA
        let room: any = []
        if (response.data.rooms && response.data.rooms.length > 0) {
          for (var i = 0; i < response.data.rooms.length; i++) {
            room.push(response.data.rooms[i].rates[0])
          }
          setRoomData(room)
        }

        // FACILITIES
        const amenities = []
        if (response.data.facilities && response.data.facilities.length > 0) {
          for (var i = 0; i < response.data.facilities.length; i++) {
            if (response.data.facilities[i].group === 'Facilities') {
              amenities.push(response.data.facilities[i].name)
            }
          }
          setFacilities(amenities)
        }
      })
  }

  useEffect(() => {
    if (hotelid) {
      getHotelData()
    }
  }, [hotelid])

  const windowSize = useWindowSize();

  const getDaySize = () => {
    if (windowSize.width <= 375) {
      return 34;
    }
    if (windowSize.width <= 500) {
      return undefined;
    }
    if (windowSize.width <= 1280) {
      return 56;
    }
    return 48;
  };

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleCloseModal = () => setIsOpen(false);

  const getRoomFare = (item: any, key: any) => {
    let room = roomData;
    room[key] = item;
    setRoomData(room);
    const amt: any = amountSeparator(item.amount.amount)
    ReactDOM.render(amt, document.getElementById(`room_amount_${key}`));
  }

  const selectRoom = (obj: any) => {
    history.push(`/hotel/proceed?${encodeURIComponent(`roomid=${obj.k}&adults=${guestValue.guestAdults}&child=${guestValue.guestChildren}&rooms=${guestValue.guestRooms}&v=1.0`)}`)
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* HEADING */}
        <h2 className="text-xl sm:text-2xl font-semibold">About Hotel</h2>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          {hotelData && hotelData.desc}
        </div>

      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <>
        {(hotelData && hotelData.board && hotelData.board.length > 0) &&
        <div className="listingSection__wrap">
          <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
            <div className="flex flex-col space-y-4">
              <h3 className="text-2xl font-semibold">Includes</h3>
              <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
                {hotelData.board.map((item: any, key: any) => (
                  <>
                    <div key={`includes_${key}`} className="flex items-start space-x-3">
                      <i className="las la-check-circle text-2xl"></i>
                      <span className="text-sm">{item}</span>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
        }
      </>
    )
  }

  const renderSection3 = () => {
    return (
      <>
        {(facilities && facilities.length > 0) &&
          <div className="listingSection__wrap">
            <div>
              <h2 className="text-2xl font-semibold">Hotel Amenities </h2>
            </div>
            <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>
            {/* 6 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
              {facilities.slice(0, facilityMore).map((item: any) => (
                <div key={item.name} className="flex items-center space-x-3">
                  {renderFacilities(item)}
                  <span className=" ">{item}</span>
                </div>
              ))}
            </div>
            {(facilities.length > 10) ?
              <>
                {(facilityMore === 10) ?
                  <span className='mt-2 text-primary font-semibold text-sm cursor-pointer' onClick={() => setFacilityMore(facilities.length)}>Show {facilities.length - 10} More</span>
                  :
                  <span className='mt-2 text-primary font-semibold text-sm cursor-pointer' onClick={() => setFacilityMore(10)}>Less</span>
                }
              </>
              : null}
          </div>
        }
      </>
    );
  };

  const renderSliderGallery = (item: any) => {
    const roomImg = hotelData.images && hotelData.images.filter((obj: any) => { return (obj.type === 'Room' && obj.r === item.c) })
    return (roomImg && roomImg.length > 0) ? `${Config.GIATA_URL}${roomImg[0].path}` : galleryData[0]
  };

  const showCancellationPolicy = (val: any) => {
    return (
      <>
        <p>If you cancel booking after <span className="font-semibold">{moment(val.from).format('lll')}</span> then Cancellation Charges will be <span className="text-sm"><span className='currency-font'>৳</span>{amountSeparator(val.amount)}</span></p>
      </>
    )
  }

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Choose Your Room</h2>
        </div>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* CONTENT */}
        {hotelData && hotelData.rooms.map((item: any, i: any) => (
          <div className="grid grid-cols-1 xl:grid-cols-3 text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <div className="w-full p-5">
              <NcImage className="w-full" src={renderSliderGallery(item)} />
              <h2 className="block text-lg mt-3 font-semibold capitalize">
                <span className="line-clamp-11">{item && item.name}</span>
              </h2>
            </div>
            <div className="col-span-2">
              {item && item.rates.map((obj: any, key: any) => (
                <>
                  <div className={`${(item.rates.length === 1) && 'h-full '} border border-neutral-200 dark:border-neutral-700 rounded-none flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700`}>
                    <div className="flex-1 p-5 flex justify-between space-x-5">
                      <div className="flex flex-col justify-center">
                        <span className="mt-1.5 text-md font-semibold">
                          {obj.board}
                        </span>
                        <div className="mt-3 flex flex-col">
                          {(obj.board.includes('ROOM ONLY')) ?
                            <span className="block sm:inline mt-1 text-sm"><i className="las la-check-circle text-sm"></i> No meals included</span>
                            : ((obj.board.includes('BREAKFAST')) ?
                              <span className="block sm:inline mt-1 text-sm"><i className="las la-check-circle text-sm"></i> Free Breakfast</span>
                              : null
                            )
                          }
                          {(obj.refundable && obj.refundable.flag === true) ?
                            <span className="block sm:inline mt-1 text-sm text-green"><i className="las la-check-circle text-sm"></i> <strong>Free Cancellation</strong> until {moment(obj.refundable.rule.from).format('LT')} on {moment(obj.refundable.rule.from).format('ll')} <Tooltip placement="top" trigger={['click']} overlay={showCancellationPolicy(obj.refundable.rule)}><i className="las la-info-circle fare-exclamation-info"></i></Tooltip></span>
                            :
                            <span className="block sm:inline mt-1 text-sm text-red-500"><i className="las la-times-circle text-sm"></i> <strong>Non-Refundable</strong></span>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex items-center justify-center space-x-5 room-detail">
                      <div className="flex flex-col">
                        <div>
                          <div className="block text-sm text-neutral-400 dark:text-neutral-400 font-normal relative">
                            {(obj && obj.fare.discount && obj.fare.discount.amount > 0) ? <><div className="flight-lineThroughRed"><span className='currency-font'>{getCurrency(obj.fare.baseFare.currency)}</span>{obj && amountSeparator(Number(obj.fare.baseFare.amount) + Number(obj.fare.tax.amount))}</div></> : null}
                          </div>
                          <span className='currency-font'>{getCurrency(obj.fare.totalFare.currency)}</span><span className="text-lg font-semibold" id={`room_amount_${i}`}>{amountSeparator(obj.fare.totalFare.amount)}</span>
                          <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                            {(totalNights && totalNights > 1) ? `/ ${totalNights} Nights` : `/ ${totalNights} Night`}
                          </span>
                            {(obj && obj.fare.discount && obj.fare.discount.amount > 0) ? <span className="block text-xs text-emerald-600 mb-2">You save <span className='currency-font'>{getCurrency(obj.fare.baseFare.currency)}</span>{obj && amountSeparator(obj.fare.discount.amount)}</span> : null}
                        </div>
                        <ButtonPrimary className='mt-2 selectRoom text-sm' onClick={() => selectRoom(obj)}>Reserve</ButtonPrimary>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap p-1">

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5">
          <div className="rounded-xl overflow-hidden">
            {(hotelData && hotelData !== null) &&
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyDxJaU8bLdx7sSJ8fcRdhYS1pLk8Jdvnx0",
                }}
                defaultZoom={15}
                yesIWantToUseGoogleMapApiInternals
                defaultCenter={{
                  lat: hotelData && Number(hotelData.coord[0]),
                  lng: hotelData && Number(hotelData.coord[1]),
                }}
              >
                <LocationMarker lat={hotelData && Number(hotelData.coord[0])} lng={hotelData && Number(hotelData.coord[1])} />
              </GoogleMapReact>
            }

          </div>
          <span className="hidden mt-2 ml-2 text-neutral-500 dark:text-neutral-400">
            {hotelData && hotelData.addr}, {hotelData && hotelData.locationName}
          </span>
        </div>
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Things To Know</h2>
        <div className="w-14 hidden sm:block border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            {(hotelData && hotelData.issues.length > 0) && hotelData.issues[0]}
          </span>
        </div>

      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Content */}
        <div className="space-y-5">
          <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your thoughts ..."
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <div className="pt-8">
            <ButtonSecondary>View more 20 reviews</ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  const getHotelCategory = (hClass: any) => {
    return (
      <>
        {(hClass.includes('STAR')) ?
          <>
            <div className={`ml-2 flex items-center text-neutral-300`}>
              {[1, 2, 3, 4, 5].slice(0, hClass.split(' STAR')[0]).map((item) => {
                return (
                  <StarIcon
                    key={item}
                    className={`text-yellow-500 w-5 h-5`}
                  />
                );
              })}
            </div>
          </>
          : <Badge name={hClass} className='hidden' color="green" />}
      </>
    )
  }

  return (
    <div
      className={`nc-ListingStayDetailPage  ${className}`}
      data-nc-id="ListingStayDetailPage"
    >
      {/* SINGLE HEADER */}
      <>
        <header className="container mt-8 lg:mt-11 rounded-md sm:rounded-xl">

          {/* 2 */}
          <h2 className="flex flex-row items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
            <span className="line-clamp-1">{hotelData && hotelData.name}</span>
            {hotelData && getHotelCategory(hotelData.category)}
          </h2>

          {/* 3 */}
          <div className="flex flex-wrap items-center justify-between sm:flex-row mb-6 mt-3">

            <div className="flex flex-wrap items-center">
              <span className='mr-3'>
                <i className="las la-map-marker-alt"></i>
                <span className="ml-1 text-primary dark:text-neutral-400"> {hotelData && hotelData.addr}, {hotelData && hotelData.locationName}</span>
              </span>

              <div className="flex mt-3 hidden sm:block sm:mt-0 ml-5">
                <LikeSaveBtns shareUrl={shareUrl} shareTitle={shareTitle} />
              </div>
            </div>
            <ButtonPrimary className='float-right reserve-btn selectRoom text-sm mt-5 sm:mt-5' onClick={() => window.scrollTo({ top: 1480, left: 0, behavior: 'smooth' })}>Reserve Room</ButtonPrimary>
          </div>

          <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 gallery-height">
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              <NcImage
                containerClassName="absolute inset-0"
                className="object-cover w-full h-full rounded-md sm:rounded-xl"
                src={(galleryData && galleryData.length > 0) ? galleryData[0] : defaultImg}
                prevImageHorizontal
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {galleryData.filter((_: any, i: any) => i >= 1 && i < 5).map((item: any, index: any) => (
              <div
                key={index}
                className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? "hidden sm:block" : ""
                  }`}
              >
                <NcImage
                  containerClassName="aspect-w-4 sm:aspect-w-6 h-full"
                  className="object-cover w-full h-full rounded-md sm:rounded-xl "
                  src={item || ""}
                  prevImageHorizontal
                />

                {/* OVERLAY */}
                <div
                  className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleOpenModal(index + 1)}
                />
              </div>
            ))}

            {(galleryData && galleryData.length > 0) &&
            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={() => handleOpenModal(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Show all photos
              </span>
           
            </div>
            }
          </div>
        </header>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={galleryData}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
        />
      </>

      {/* MAIn */}
      <main className="container mt-8 sm:mt-11 mb-11 flex ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-6 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {renderSection4()}
          {renderSection8()}
          {/*renderSection6()*/}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow">
          <div className="sticky top-24">{renderSection7()}</div>
        </div>
      </main>

    </div>
  );
};

export default ListingStayDetailPage;

import { FC, Fragment, useState, useEffect } from 'react'
import Logo from "shared/Logo/Logo";
import Navigation from "shared/Navigation/Navigation";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import MenuBar from "shared/MenuBar/MenuBar";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import { Service, Storage } from 'services/Service'
import { Dialog, Transition, Popover } from "@headlessui/react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import PageLogin from "containers/PageAuth/PageLogin";
import PageSignUp from 'containers/PageAuth/PageSignUp';
import PageForgotPassword from 'containers/PageAuth/PageForgotPassword';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { FaAngleDown } from "react-icons/fa"
import { setLoginModalVisible } from 'redux/actions/booking'
import Config from 'config.json';
import Avatar from "shared/Avatar/Avatar";
import { OpenNotification, checkValidImage } from 'components/Helper'
import avatar1 from "images/avatar.png";
import SocialsList from "shared/SocialsList/SocialsList";

export interface MainNav1Props {
  isTop: boolean;
}

const MainNav1: FC<MainNav1Props> = ({ isTop }) => {

  let userData: any = null;
  const { openLoginModal, logoutStatus } = useSelector(({ booking }: any) => booking);
  userData = Storage.get('auth')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenPromoModal, setIsOpenPromoModal] = useState(false);
  const [type, setType]: any = useState('login');
  const [promotionImg, setPromotionImg]: any = useState('');
  const history = useHistory()
  const dispatch = useDispatch();
  const handleCloseModal = () => dispatch(setLoginModalVisible(false));
  const location = useLocation();

  useEffect(() => {
    setIsOpenModal(openLoginModal)
  }, [openLoginModal])

  useEffect(() => {
    userData = Storage.get('auth')
  }, [logoutStatus])

  const handleMyTrips = () => {
    if (userData && userData !== null) {
      history.push('/account/my-trips')
    } else {
      setType('login'); dispatch(setLoginModalVisible(true));
    }
  }

  const handleProfile = () => {
    if (userData && userData !== null) {
      history.push('/account/profile-info')
    }
  }

  const showPromotions = (page?: any) => {

    const promo = Storage.get('promotions')
    const promoted = Storage.get('promoted')

    const res = promo.filter((item: any) => {
      if (page === '/' && (item.t === 'dashboard' || item.t === 'flight') && promoted !== null && promoted.indexOf(item.u) === -1) {
        return item
      } else if (page === '/packages' && item.t === 'package' && promoted !== null && promoted.indexOf(item.u) === -1) {
        return item
      } else if (page === '/hotels' && item.t === 'hotel' && promoted !== null && promoted.indexOf(item.u) === -1) {
        return item
      }
    })

    if (res && res.length > 0 && res[0].i && res[0].i !== "") {
      setPromotionImg(res[0].i)
      if (promoted.indexOf(res[0].u) === -1) {
        promoted.push(res[0].u)
        Storage.set('promoted', promoted);
      }

      setIsOpenPromoModal(true)
    }
  }

  const getPromotions = () => {
    Service.get({ url: `/data/promotions` })
      .then(response => {
        if (response.status === 'error') {
          return false
        } else {
          Storage.set('promotions', response.data);
          Storage.set('promoted', []);
          setTimeout(() => {
            showPromotions(location.pathname)
          }, 2000);
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    const promo = Storage.get('promotions')

    if (promo === null || (promo && promo.length === 0)) {
      getPromotions()
    } else {
      setTimeout(() => {
        showPromotions(location.pathname)
      }, 2000);
    }
  }, [location.pathname])

  const handleAgentLogin = () => {
    history.push({ pathname: Config.AGENCY_URL })
  }

  return (
    <>
      {/* <div id='top-header2' className="nav-top-bar2 py-3 relative text-xs text-neutral-100 dark:text-neutral-400 space-x-4 xl:space-x-8">
        <div className='container flex justify-between items-center'>
          <div className='hidden xl:flex space-x-1 flex-row'>
            <SocialsList />
          </div>
          <div className='flex space-x-4 flex-row justify-end items-center w-full'>
            <div className='relative flex items-center'>
              <i className="las la-phone-alt"></i><div className="ml-2 flex flex-row"><span className='hidden xl:flex mr-1'>Need Support?</span> +8809666770066</div>
            </div>
            <span className='hidden xl:flex text-neutral-400 dark:text-neutral-400'>|</span>
            <div className='relative hidden xl:flex items-center'>
              <i className="las la-envelope"></i><span className="ml-2">support@ticketshala.com</span>
            </div>
            <span className='text-neutral-400 dark:text-neutral-400'>|</span>
            <div className='relative flex items-center cursor-pointer'>
              <Link to={{ pathname: Config.AGENCY_URL }} target='_blank'><i className="las la-user"></i><span className="ml-2">Agent Login</span></Link>
            </div>
          </div>
        </div>
      </div> */}
      <div className={`nc-MainNav1 relative z-10 ${isTop ? "onTop " : "notOnTop backdrop-filter"}`} >
        <div className="container nav-top-bar py-5 relative flex justify-between items-center space-x-4 xl:space-x-8">
          <div className="flex justify-start flex-grow items-center space-x-4 sm:space-x-10 2xl:space-x-14">
            <Logo />
            <Navigation />
          </div>
          <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
            <div className="hidden items-center xl:flex space-x-1">
              <SwitchDarkMode />
              <div className={`hidden xl:flex justify-center myTrips flex-grow items-center cursor-pointer ${(userData && userData !== null) ? '' : 'text-neutral-400'}`} onClick={handleMyTrips}>
                <i className="text-3xl las la-suitcase-rolling"></i>
                <div>
                  <h5 className="ml-1 text-sm">My Trips</h5>
                  <span className="ml-1 text-sm"><small>Manage Bookings</small></span>
                </div>

              </div>
              <div className="px-1" />
              {(userData && userData !== null) ?
                <>
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button className={`flex text-left w-full flex-shrink-0 items-center space-x-3 focus:outline-none cursor-pointer`}>
                          <div className="flex-shrink-0 relative flex items-center space-x-2 border dark:border-neutral-700 user-section cursor-pointer">
                            {(userData.avatar && userData.avatar !== '') ? <Avatar
                              containerClassName="ring-2 ring-white"
                              sizeClass="w-8 h-8"
                              radius="rounded-full"
                              imgUrl={userData.avatar !== '' ? checkValidImage(userData.avatar) : avatar1}
                              userName={""} /> : <span className="text-sm rounded-avatar" style={{ background: userData.color }}>
                              {userData.name.charAt(0)}
                            </span>}
                            <span className="block text-sm text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
                              {userData.name}
                            </span>
                            <FaAngleDown size='12' />
                          </div>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel static className="sub-menu nc-will-change-transform absolute transform z-10 w-56 pt-3 left-0">
                            <ul className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 text-sm relative bg-white dark:bg-neutral-900 py-4 grid space-y-1">
                              <li className="px-2 text-md" onClick={handleProfile}>
                                <span className="flex items-center cursor-pointer text-sm font-medium text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                                  <i className="las la-user text-xl mr-1"></i> My Profile
                                </span>
                              </li>
                              <li className="px-2 text-md" onClick={handleMyTrips}>
                                <span className="flex items-center cursor-pointer text-sm font-medium text-neutral-6000 dark:text-neutral-300 py-2 px-4 rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                                  <i className="las la-suitcase text-xl mr-1"></i> My Trips
                                </span>
                              </li>
                            </ul>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>

                </>
                : <ButtonPrimary className='btn-signin' onClick={() => { setType('login'); dispatch(setLoginModalVisible(true)); }}>Login or Signup</ButtonPrimary>}
            </div>


            <div className="flex items-center menu-block sm:hidden lg:hidden md:hidden xl:hidden">
              <MenuBar />
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
                  <div className="relative flex-shrink-0 px-6 py-6 text-left">
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={handleCloseModal} />
                    </span>
                  </div>

                  <div className="px-8 mt-2 flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {(type === 'signup') ? <PageSignUp setIsOpenModal={(data: any) => setIsOpenModal(data)} setType={(data: any) => setType(data)} /> : ((type === 'forgot') ? <PageForgotPassword setIsOpenModal={(data: any) => setIsOpenModal(data)} setType={(data: any) => setType(data)} /> : <PageLogin setIsOpenModal={(data: any) => setIsOpenModal(data)} setType={(data: any) => setType(data)} />)}
                  </div>

                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/************ PROMOTION MODAL **************/}
      <Transition appear show={isOpenPromoModal} as={Fragment}>
        <Dialog as="div"
          className="fixed inset-0 bg-black bg-opacity-60 z-50 overflow-y-auto"
          onClose={() => setIsOpenPromoModal(false)}
        >
          <div className="text-center">

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
              <div className="inline-block w-full">
                <div className="inline-flex flex-col text-left align-middle transition-all transform overflow-hidden bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 text-left">
                    <span className="absolute right-3 top-4">
                      <ButtonClose onClick={() => setIsOpenPromoModal(false)} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    <img src={`${Config.MEDIA_URL}${promotionImg}`} className="object-cover w-full h-full" />
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

export default MainNav1;

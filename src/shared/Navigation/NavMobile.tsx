import { FC, Fragment, useState, useEffect } from 'react'
import ButtonClose from "shared/ButtonClose/ButtonClose";
import SocialsList from "shared/SocialsList/SocialsList";
import { Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { NavItemType } from "./NavigationItem";
import { NAVIGATION_DEMO } from "data/navigation";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Service, Storage } from 'services/Service'
import { ChevronDownIcon } from "@heroicons/react/solid";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import { FaPlaneDeparture, FaHotel, FaCar, FaFly, FaUmbrellaBeach, FaUser, FaLuggageCart, FaSuitcase } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { setLoginModalVisible } from 'redux/actions/booking'
import { Link, useHistory } from 'react-router-dom'

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION_DEMO,
  onClickClose,
}) => {

  const dispatch = useDispatch();

  let userData: any = null;
  const { openLoginModal, logoutStatus } = useSelector(({ booking }: any) => booking);
  userData = Storage.get('auth')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [type, setType]: any = useState('login');
  const history = useHistory()

  const handleProfile = () => {
    if (userData && userData !== null) {
      history.push('/account/profile-info')
    }
  }

  useEffect(() => {
    userData = Storage.get('auth')
  }, [logoutStatus])

  const _renderMenuChild = (item: NavItemType) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <NavLink
              exact
              strict
              to={{
                pathname: i.href || undefined,
              }}
              className="flex px-4 py-2.5 text-neutral-900 dark:text-neutral-200 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-[2px]"
              activeClassName="text-secondary"
            >
              <span
                className={!i.children ? "block w-full" : ""}
                onClick={onClickClose}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="block flex-grow"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex justify-end flex-grow"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-neutral-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </NavLink>
            {i.children && (
              <Disclosure.Panel>{_renderMenuChild(i)}</Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType, index: number) => {
    return (
      <Disclosure
        key={item.id}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <NavLink
          exact
          strict
          className={`flex items-center justify-start w-full items-center py-2.5 px-4 font-normal text-neutral-700 tracking-wide text-md hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg ${(item.name === 'Activities' || item.name === 'Transfers') ? ' pointer-events-none text-neutral-400' : 'text-neutral-700'}`}
          to={{
            pathname: item.href || undefined,
          }}
          activeClassName="text-secondary"
        >
          <span
            className={!item.children ? "flex items-center justify-start w-full" : ""}
            onClick={onClickClose}
          >
            {item.icon && item.icon === 'FaPlaneDeparture' && (
              <FaPlaneDeparture className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {item.icon && item.icon === 'FaFly' && (
              <FaFly className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {item.icon && item.icon === 'FaBed' && (
              <FaHotel className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {item.icon && item.icon === 'FaUmbrellaBeach' && (
              <FaUmbrellaBeach className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {item.icon && item.icon === 'FaCar' && (
              <FaCar className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {item.name} 
          </span>
        </NavLink>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  const _renderUserItem = () => {
    return (
      <>
        <Disclosure
          key={16}
          as="li"
          className="text-neutral-900 dark:text-white"
        >
          <NavLink
            exact
            strict
            className={`flex items-center justify-start w-full items-center py-2.5 px-4 font-normal text-neutral-700 tracking-wide text-md hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg`}
            to={{
              pathname: '/account/profile-info',
            }}
            activeClassName="text-secondary"
          >
            <span className={"flex items-center justify-start w-full"}
              onClick={onClickClose}
            >
              <FaUser className="mr-2 h-4 w-4" aria-hidden="true" />
              Edit Profile
            </span>
          </NavLink>
        </Disclosure>
        <Disclosure
        key={16}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <NavLink
          exact
          strict
          className={`flex items-center justify-start w-full items-center py-2.5 px-4 font-normal text-neutral-700 tracking-wide text-md hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg`}
          to={{
            pathname: '/account/my-trips',
          }}
          activeClassName="text-secondary"
        >
          <span className={"flex items-center justify-start w-full"}
            onClick={onClickClose}
          >
            <FaSuitcase className="mr-2 h-4 w-4" aria-hidden="true" />
            My Trips
          </span>
        </NavLink>
      </Disclosure>
    </>
    );
  };

  return (
    <div className="overflow-y-auto w-full max-w-sm h-screen transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-6 px-5 bg-gray-dt">
        <div className="flex flex-col mt-5 text-neutral-700 dark:text-neutral-300 text-sm">
          
          {(userData && userData !== null) ?
          <>
            <div className="flex-shrink-0 relative flex items-center space-x-2 dark:border-neutral-700 user-section cursor-pointer" onClick={handleProfile}>
              <span className="text-md rounded-avatar h-6 w-6" style={{ background: userData.color }}>
                {userData.name.charAt(0)}
              </span>
              <span className="block text-lg text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
                {userData.name}
              </span>
            </div>
          </>
          : null}

          <div className="flex justify-between items-center mt-4">
            <SocialsList itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300" />
            <span className="block">
              <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
            </span>
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col py-6 px-2 space-y-1">
        {data.map(_renderItem)}
          
        <hr className="h-[1px] border-t border-neutral-100 dark:border-neutral-700" />

        {(userData && userData !== null) ?
        <>{_renderUserItem()}</>
        : null}
      </ul>

      {(userData && userData !== null) ? null :
        <ButtonPrimary className='ml-4 btn-signin' onClick={() => { dispatch(setLoginModalVisible(true)); }}>Login or Signup</ButtonPrimary> }
    </div>
  );
};

export default NavMobile;

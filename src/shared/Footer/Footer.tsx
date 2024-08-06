import Logo from "shared/Logo/Logo";
import SocialsList from "shared/SocialsList/SocialsList";
import { CustomLink } from "data/types";
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ToastContainer } from 'react-toastify';

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "5",
    title: "PRODUCT OFFERING",
    menus: [
      { href: "/", label: "Flights" },
      { href: "/packages", label: "Packages" },
      { href: "/hotels", label: "Hotels" },
      { href: "/visa", label: "Visa" },
      { href: "/blog", label: "Blogs" }
    ],
  },
  {
    id: "1",
    title: "ABOUT THE SITE",
    menus: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-conditions", label: "Terms of Service" },
      { href: "/faqs", label: "FAQs" },
      //{ href: "/partner-with-us", label: "Partner with Us" }
    ],
  }
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm mt-5 ml-5">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <Link
                key={index}
                className={`text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white ${(item.label === 'Activities' || item.label === 'Transfers') ? ' pointer-events-none text-neutral-400' : 'text-neutral-700'}`}
                to={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="nc-Footer relative py-8 lg:py-10 border-t border-neutral-200 dark:border-neutral-700">
        <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
          <div className="grid grid-cols-2 gap-4 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
            <div className="col-span-2 md:col-span-1">
              <Logo />
            </div>
            <div className="col-span-2 flex flex-col items-start justify-start md:col-span-3">
              <div className="pb-6">
                <div className="flex items-center text-2xl text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group py-2">
                  <i className="las la-envelope"></i>
                  <span className="lg:block text-sm">support@ticketshala.com</span>
                </div>
                <div className="flex items-center text-2xl text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group py-2">
                  <i className="las la-phone"></i>
                  <span className="lg:block text-sm">+8809666770066</span>
                </div>
              </div>
              <SocialsList />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}

          <div key={31} className="text-sm mt-5 ml-5">
            <h2 className="font-semibold text-neutral-700 mb-5 dark:text-neutral-200">
              PAYMENT & SECURITY
            </h2>
            <div className='row'>
              <div className='col-12'>
                <div className="cards">
                  <a className="verify" title="Verify"></a>
                  <a className="visa" title="Visa"></a>
                  <a className="master" title="Master Card"></a>
                  <a className="american" title="American Express"></a>
                  <a className="rupay" title="RuPay"></a>
                </div>
              </div>
            </div>
          </div>

          <div key={31} className="text-sm mt-5 ml-5">
            <h2 className="font-semibold text-neutral-700 mb-5 dark:text-neutral-200">
              DOWNLOAD MOBILE APPS
            </h2>
            <div className='row'>
              <div className='col-12'>
                <div className="cards">
                  <a className='play_store' href='https://play.google.com/store/apps/details?id=com.ticketshala.app' target='_blank'></a>
                  <a className='app_store' href='https://apps.apple.com/in/app/ticketshala/id1601778381' target='_blank'></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="mt-4 mb-8 border-b border-neutral-200 dark:border-neutral-700"></div>
          <p className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300">Copyright Ⓒ {moment().format('YYYY')} by&nbsp;<Link to='/' className="text-primary">ticketshala.com</Link>&nbsp;<span className="hidden md:block">All Rights Reserved</span></p>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Footer;

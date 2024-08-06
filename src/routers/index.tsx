import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import TrackView from "./TrackView";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import PageHotels from "containers/PageHotels/PageHotels";
import PagePackages from "containers/PagePackages/PagePackages";
import PageActivities from "containers/PageActivities/PageActivities";
import PageTransfers from "containers/PageTransfers/PageTransfers";
import Header from "shared/Header/Header";
import Page404 from "containers/Page404/Page404";

import AccountPage from "containers/AccountPage/AccountPage";
import AccountMyTrips from "containers/AccountPage/AccountMyTrips";
import OrderPage from "containers/AccountPage/OrderPage";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import PageForgotPassword from "containers/PageForgotPassword/PageForgotPassword";
import PageResetPassword from "containers/PageResetPassword/PageResetPassword";
import PageSubcription from "containers/PageSubcription/PageSubcription";
import PagePrivacyPolicy from "containers/PagePrivacyPolicy/PagePrivacyPolicy";
import PageTermsConditions from "containers/PageTermsConditions/PageTermsConditions";
import PageFaqs from "containers/PageFaqs/PageFaqs";
import PagePartnerWithUs from "containers/PagePartnerWithUs/PagePartnerWithUs";
import PageAccountActivate from "containers/PageAccountActivate/PageAccountActivate";
import BlogPage from "containers/BlogPage/BlogPage";
import BlogSingle from "containers/BlogPage/BlogSingle";

import PageFlightSearch from "containers/PageFlightSearch/PageFlightSearch";
import PageFlightReview from "containers/PageFlightReview/PageFlightReview";
import PageFlightPayment from "containers/PageFlightPayment/PageFlightPayment";

import PageHotelSearch from "containers/PageHotelSearch/PageHotelSearch";
import PageHotelDetails from "containers/PageHotelDetails/PageHotelDetails";
import PageHotelProceed from "containers/PageHotelDetails/PageHotelProceed";
import PageHotelCheckOut from "containers/PageHotelDetails/PageHotelCheckOut";

import PagePackageSearch from "containers/PagePackageSearch/PagePackageSearch";
import PagePackageDetails from "containers/PagePackages/PagePackageDetails";
import PagePackageProceed from "containers/PagePackages/PagePackageProceed";
import PagePaymentInit from "containers/PagePackages/PagePaymentInit";

import PageActivitySearch from "containers/PageActivitySearch/PageActivitySearch";
import PageActivityDetails from "containers/PageActivityDetails/PageActivityDetails";
import PageActivityProceed from "containers/PageActivityDetails/PageActivityProceed";
import PageActivityCheckOut from "containers/PageActivityDetails/PageActivityCheckOut";

import PageTransferSearch from "containers/PageTransferSearch/PageTransferSearch";

export const pages: Page[] = [
  { path: "/", exact: true, component: PageHome },
  { path: "/#", exact: true, component: PageHome },
  { path: "/flights", exact: true, component: PageHome },
  { path: "/flights/search", exact: true, component: PageFlightSearch },
  { path: "/flight/review", exact: true, component: PageFlightReview },
  { path: "/accounting/transaction/:type", exact: true, component: PageFlightPayment },
  { path: "/packages", exact: true, component: PagePackages },
  { path: "/packages/search", exact: true, component: PagePackageSearch },
  { path: "/package/view/:slug", exact: true, component: PagePackageDetails },
  { path: "/package/proceed/:slug", exact: true, component: PagePackageProceed },
  { path: "/payment/init/:txnid", exact: true, component: PagePaymentInit },
  { path: "/hotels", exact: true, component: PageHotels },
  { path: "/hotels/search", exact: true, component: PageHotelSearch },
  { path: "/hotel/view/:hotelid", component: PageHotelDetails },
  { path: "/hotel/proceed", component: PageHotelProceed },
  { path: "/hotel/checkout", component: PageHotelCheckOut },
  { path: "/activities", exact: true, component: PageActivities },
  { path: "/activities/search", exact: true, component: PageActivitySearch },
  { path: "/activity/view/:slug", exact: true, component: PageActivityDetails },
  { path: "/activity/proceed/:slug", exact: true, component: PageActivityProceed },
  { path: "/activity/checkout", exact: true, component: PageActivityCheckOut },
  { path: "/transfers", exact: true, component: PageTransfers },
  { path: "/transfers/search", exact: true, component: PageTransferSearch },
 
  //
  { path: "/blog", component: BlogPage },
  { path: "/blog-single/:slug", component: BlogSingle },
 
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  { path: "/forgot-password", component: PageForgotPassword },
  { path: "/reset-password/:token", exact: true, component: PageResetPassword },
  { path: "/reset-password", component: PageResetPassword },
  { path: "/privacy-policy", component: PagePrivacyPolicy },
  { path: "/terms-conditions", component: PageTermsConditions },
  { path: "/faqs", component: PageFaqs },
  { path: "/partner-with-us", component: PagePartnerWithUs },
  { path: "/account/activate/:token", component: PageAccountActivate },
  { path: "/account/profile-info", component: AccountPage },
  { path: "/account/my-trips", component: AccountMyTrips },
  { path: "/order/:txtid", component: OrderPage },
];

const Routes = () => {
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <TrackView />
      <Switch>
        {pages.map(({ component, path, exact }) => {
          return (
            <Route
              key={path}
              component={component}
              exact={!!exact}
              path={path}
            />
          );
        })}
        <Route component={Page404} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;

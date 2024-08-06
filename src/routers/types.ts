import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/#"?: {};
  "/flights"?: {};
  "/flights/search"?: {};
  "/flight/review"?: {};
  "/accounting/transaction/:type"?: {};
  "/hotels"?: {};
  "/hotels/search"?: {};
  "/hotel/view/:hotelid"?: {};
  "/hotel/proceed"?: {};
  "/hotel/checkout"?: {};
  "/packages"?: {};
  "/packages/search"?: {};
  "/package/view/:slug"?: {};
  "/package/proceed/:slug"?: {};
  "/payment/init/:txnid"?: {};
  "/activities"?: {};
  "/activities/search"?: {};
  "/activity/view/:slug"?: {};
  "/activity/proceed/:slug"?: {};
  "/activity/checkout"?: {};
  "/transfers"?: {};
  "/transfers/search"?: {};
  //
  "/listing-stay"?: {};
  "/listing-stay-map"?: {};
  "/hotel/stay-detail"?: {};
  //
  "/listing-experiences"?: {};
  "/listing-experiences-map"?: {};
  "/listing-experiences-detail"?: {};
  //
  "/listing-car"?: {};
  "/listing-car-map"?: {};
  "/listing-car-detail"?: {};
  //
  "/checkout"?: {};
  "/pay-done"?: {};
  //
  "/blog"?: {};
  "/blog-single/:slug"?: {};
  //
  "/add-listing-1"?: {};
  "/add-listing-2"?: {};
  "/add-listing-3"?: {};
  "/add-listing-4"?: {};
  "/add-listing-5"?: {};
  "/add-listing-6"?: {};
  "/add-listing-7"?: {};
  "/add-listing-8"?: {};
  "/add-listing-9"?: {};
  "/add-listing-10"?: {};
  //
  "/search"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-password"?: {};
  "/reset-password/:token"?: {};
  "/reset-password"?: {};
  "/page404"?: {};
  "/subscription"?: {};
  "/privacy-policy"?: {};
  "/terms-conditions"?: {};
  "/faqs"?: {};
  "/partner-with-us"?: {};
  "/account/activate/:token"?: {};
  "/account/profile-info"?: {};
  "/account/my-trips"?: {};
  "/order/:txtid"?: {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<Object>;
}

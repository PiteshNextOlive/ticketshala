import ButtonPrimary from "shared/Button/ButtonPrimary";
import React from "react";
import { Helmet } from "react-helmet";
import NcImage from "shared/NcImage/NcImage";
import I404Png from "images/404.png";

const Page404: React.FC = () => (
  <div className="nc-Page404">
    <Helmet>
      <title>404 || Best Online Travel Agency in Bangladesh</title>
    </Helmet>
    <div className="container relative pt-16 pb-16 lg:pb-20 lg:pt-16">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        {/*<NcImage src={I404Png} />*/}
        <div className="pt-8 pb-8">
          <h2 className="not-found-number font-bold">404</h2>
        </div>
        <div className="pt-3 pb-8">
          <h2 className="text-3xl md:text-3xl font-semibold">OOPS, THIS PAGE NOT FOUND!</h2>
        </div>
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.{" "}
        </span>
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </header>
    </div>
  </div>
);

export default Page404;

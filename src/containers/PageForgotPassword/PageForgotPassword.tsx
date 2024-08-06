import React, { FC } from "react";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";

export interface PageLoginProps {
  className?: string;
}

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Forgot Password || Ticketshala.com</title>
      </Helmet>
      <div className="container auth-section mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Forgot Password
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email
              </span>
              <Input
                type="email"
                placeholder="Enter Your Email"
                className="mt-1"
              />
            </label>
            <ButtonPrimary className='btn-login' type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Back to {` `}
            <Link to="/login">Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;

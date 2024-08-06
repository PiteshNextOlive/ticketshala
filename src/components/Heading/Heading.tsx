import React, { HTMLAttributes, ReactNode } from "react";
import NextPrev from "shared/NextPrev/NextPrev";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  desc?: ReactNode;
  hasNextPrev?: boolean;
  isCenter?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = "Popular places to stay that Ticketshala recommends for you",
  className = "mb-8 lg:mb-16 text-neutral-900 dark:text-neutral-50",
  isCenter = false,
  hasNextPrev = false,
  ...args
}) => {
  return (
    <div
      className={`nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between ${className}`}
    >
      <div
        className={
          isCenter ? "text-center w-full max-w-4xl mx-auto" : "max-w-4xl"
        }
      >
        <h2 className={`text-2xl md:text-3xl font-semibold`} {...args}>
          {children || `Section Heading`}
        </h2>
        {desc && (
          <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400">
            {desc}
          </span>
        )}
      </div> 
      {hasNextPrev && !isCenter && (
        <div className="hidden sm:block mt-4 flex justify-end sm:ml-2 sm:mt-0 flex-shrink-0">
          <NextPrev onClickNext={() => {}} onClickPrev={() => {}} />
        </div>
      )}
    </div>
  );
};

export default Heading;

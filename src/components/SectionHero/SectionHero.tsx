import React, { FC } from "react";
import imagePng from "images/hero-right-new.png";
import HeroSearchForm from "components/HeroSearchForm/HeroSearchForm";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative pt-11`}
      data-nc-id="SectionHero"
    >
      {/* <div className="flex flex-col lg:flex-row"> */}
      <div className="flex flex-col lg:flex-row lg:items-start hidden">
        {/* <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pt-11 pb-14 lg:pb-60 xl:pr-14 lg:mr-10 xl:mr-0"> */}
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 pt-14 lg:pb-14 xl:pr-3 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-5xl leading-[110%]">
          Find a flexible flight for your next trip. 
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            Accompanying us, you have a trip full of experiences. With Ticketshala,
            booking accommodation, resort villas, hotels
          </span>
        </div>
        <div className="flex-grow">
          <img className="w-full" src={imagePng} alt="hero" />
        </div>
      </div>

      <div className="z-10 mb-12 lg:mb-0 w-full">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;

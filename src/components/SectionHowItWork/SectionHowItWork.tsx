import Heading from "components/Heading/Heading";
import React, { FC } from "react";
import NcImage from "shared/NcImage/NcImage";
import HIW1img from "images/HIW11.png";
import HIW2img from "images/HIW12.png";
import HIW3img from "images/HIW13.png";
import VectorImg from "images/VectorHIW.svg";

export interface SectionHowItWorkProps {
  className?: string;
}

const DEMO_DATA = [
  {
    id: 1,
    img: HIW1img,
    title: "Refunds & cancellations",
    desc: "Learn more about our numerous refund options like carrier self-service and instant refunds. ",
  },
  {
    id: 2,
    img: HIW2img,
    title: "Request a refund",
    desc: "The fastest and easiest way to cancel your booking is online via our refunds & cancellations form.",
  },
  {
    id: 3,
    img: HIW3img,
    title: "Coronavirus information",
    desc: "Read about how the new travel restrictions might affect your trip.",
  },
];

const SectionHowItWork: FC<SectionHowItWorkProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHowItWork  ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <Heading isCenter desc="Keep calm & travel on">
      Solutions for travelers during the COVID-19 pandemic
      </Heading>
      <div className="mt-20 relative grid md:grid-cols-3 gap-20">
        <img
          className="hidden md:block absolute inset-x-0 top-10"
          src={VectorImg}
          alt=""
        />
        {DEMO_DATA.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            <NcImage
              containerClassName="mb-8 howitworks mx-auto"
              src={item.img}
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionHowItWork;

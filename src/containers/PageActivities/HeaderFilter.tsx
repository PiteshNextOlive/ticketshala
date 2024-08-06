import React, { FC } from "react";
import Heading from "shared/Heading/Heading";
import Nav from "shared/Nav/Nav";
import NavItem from "shared/NavItem/NavItem";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import { ReactNode } from "react";

export interface HeaderFilterProps {
  tabActive: string;
  tabs?: string[];
  heading: ReactNode;
  subHeading?: ReactNode;
  onClickTab: (item: string) => void;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabActive,
  tabs,
  subHeading = "",
  heading = "🎈 Latest Articles",
  onClickTab,
}) => {
  return (
    <div className="flex flex-col mb-8 relative">
      <Heading desc={subHeading}>{heading}</Heading>
    </div>
  );
};

export default HeaderFilter;

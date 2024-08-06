import { MegamenuItem, NavItemType } from "shared/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

export const NAVIGATION_DEMO: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/flights",
    name: "Flights",
    icon: "FaPlaneDeparture"
  },
  {
    id: ncNanoId(),
    href: "/packages",
    name: "Packages",
    icon: "FaFly"
  },
  {
    id: ncNanoId(),
    href: "/hotels",
    name: "Hotels",
    icon: "FaBed"
  },
  {
    id: ncNanoId(),
    href: "/visa",
    name: "Visa",
    icon: "FaCcVisa"
  },

  {
    id: ncNanoId(),
    href: "/blog",
    name: "Blogs",
    icon: "FaFileAlt"
  }
];

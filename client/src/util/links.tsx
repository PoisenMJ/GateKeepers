import { IoBag, IoBasket, IoHome, IoPerson } from "react-icons/io5";
import { RiQuestionMark } from 'react-icons/ri';
import colors from "./colors";

const HomeLinks = (iconSize: number) => [
  {
    name: "Home",
    link: "/home",
    icon: <IoHome size={iconSize} color={colors.darkestGrey}/>
  },
  {
    name: "Shop",
    link: "/shop",
    icon: <IoBag size={iconSize} color={colors.darkestGrey}/>
  },
  {
    name: "Basket",
    link: "/basket",
    icon: <IoBasket size={iconSize} color={colors.darkestGrey}/>
  },
  {
    name: "FAQ",
    link: "/faq",
    icon: <RiQuestionMark size={iconSize} color={colors.darkestGrey} />
  }
];

const ProfileLink = (iconSize: number) => ({
  name: "Profile",
  link: "/profile",
  icon: <IoPerson size={iconSize} color={colors.darkestGrey}/>
});

export { HomeLinks, ProfileLink };
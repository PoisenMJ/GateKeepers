import React, { useEffect, useRef } from "react";
import { IoBag, IoBasket, IoClose, IoHome } from "react-icons/io5";
import { useNavigate } from "react-router";
import { animated, easings, useSpring } from "react-spring";
import styled from "styled-components";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import colors from "../../util/colors";
import { HomeLinks } from "../../util/links";

const Parent = styled(animated.div)`
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgb(190,190,190);
  width: 100%;
  height: 100%;
  z-index: 10;
`;

const FadedBG = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  opacity: 0;
  z-index: 5;
  display: none;
`;

const NavItem = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${colors.darkestGrey};

    h3 {
      color: ${colors.lightestGrey};
    }
    svg {
      color: ${colors.lightestGrey};
    }
  }
`;
const NavItemText = styled.h3`
  font-weight: 700;
  font-size: 3rem;
  letter-spacing: -2px;
`;

const Nav = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-left: auto;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2.5%;
  left: 2.5%;

  svg {
    transition: 0.15s;
  }

  &:hover {
    svg {
      scale: 1.15;
    }
  }
  &:active {
    svg {
      scale: 1.2;
    }
  }
`;

const Links = [
  { icon: <IoHome size={40} />, name: "HOME", link: "/home" },
  { icon: <IoBag size={40} />, name: "SHOP", link: "/shop" },
  { icon: <IoBasket size={40}/>, name: "BASKET", link: "/basket" }
];

interface Props {
  show: boolean;
  onHide: () => void;
}

const OffscreenNav = ({ show, onHide }: Props) => {
  const { width } = useWindowDimensions();

  const navigate = useNavigate();

  const [propsSlide, apiSlide] = useSpring(() => ({
    transform: `translateX(-${width}px)`,
  }));
  const [propsFade, apiFade] = useSpring(() => ({
    opacity: 0,
    onStart: () => ({ display: "block" }),
  }));

  const fadedBGRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      if(fadedBGRef.current) fadedBGRef.current.style.display = "block";
      apiSlide.start({ transform: "translateX(0px)", delay: 150 });
      apiFade.start({
        opacity: 1,
        config: { duration: 350, easing: easings.easeInOutSine },
        onStart: () => ({ display: "block" }),
      });
    } else {
      if(fadedBGRef.current) {
        setTimeout(() => {
          fadedBGRef.current!.style.display = "none";
        }, 320);
      }
      apiSlide.start({ transform: `translateX(-${width}px)`, delay: 150 });
      apiFade.start({
        opacity: 0,
        config: { duration: 350, easing: easings.easeInOutSine },
      });
    }
  }, [show]);

  const navigateTo = (uri: string) => navigate(uri);

  return (
    <>
      <Parent style={propsSlide}>
        <CloseButton onClick={onHide}>
          <IoClose size={50} />
        </CloseButton>
        <Nav>
          {HomeLinks(40).map(link => (
            <NavItem key={link.name} onClick={() => navigateTo(link.link)}>
              {link.icon}
              <NavItemText>{link.name}</NavItemText>
            </NavItem>
          ))}
        </Nav>
      </Parent>
      <FadedBG ref={fadedBGRef} style={propsFade} />
    </>
  );
};

export default OffscreenNav;

import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import colors from '../../util/colors';
import { IoCaretForward, IoLogoInstagram, IoLogoTwitter, IoMailOutline, IoLogIn } from 'react-icons/io5';
import { HomeNavbar } from '../../components/Navbars';
import { useSpring, Spring, animated } from 'react-spring';

import { LG, MD } from '../../util/breakpoints';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import OffscreenNav from '../../components/OffscreenNav';
import { useNavigate } from 'react-router';
import Container from '../../components/Container';
import { AuthContext } from '../../contexts/auth';

const GateKeeper = styled(animated.h1)`
    font-size: 12rem;
    font-weight: 900;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 8rem;
    letter-spacing: -0.6rem;
    color: ${colors.darkestGrey};

    @media screen and (max-width: ${LG}) {
      font-size: 8rem;
      line-height: 4.5rem;
    }
    @media screen and (max-width: ${MD}) {
      font-size: 6rem;
      line-height: 3.25rem;
    }
`;

const SubHeading = styled.h4`
    font-size: 2rem;
    font-weight: 400;
    margin-top: 12px;
    letter-spacing: 1.75rem;
    color: ${colors.lightGrey};
    text-align: center;

    @media screen and (max-width: ${LG}) {
      font-size: 1.5rem;
      letter-spacing: 1rem;
    }
    @media screen and (max-width: ${MD}) {
      font-size: 1.25rem;
      letter-spacing: 0.65rem;
    }
`;

const Title = styled.div`
  position: relative;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  width: fit-content;
  margin: 30px;

  @media screen and (max-width: ${MD}) {
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
`;

const Footer = styled(animated.div)`
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  color: ${colors.lighterGrey};
`;

const Socials = styled(animated.div)`
  margin-bottom: 0.5rem;
  position: absolute;
  top: 5%;
  left: 5%;

  @media screen and (max-width: ${LG}) {
    position: relative;
    top: unset;
    left: unset;
    margin-top: 0.5rem;
  }
`;
const Icon = styled.div`
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  cursor: pointer;

  svg { transition: 0.25s; }

  &:hover > svg{
    color: ${colors.lightGrey}!important;
  }
`;

const LoginButton = styled.div`
  position: absolute;
  top: 5%;
  right: 5%;
  display: flex;
  align-items: center;
  cursor: pointer;

  span, svg {
    transition: .2s;
  }

  &:hover{
    span {
      color: ${colors.grey};
    }
    svg {
      color: ${colors.grey}!important;
    }
  }
`;

const LoginText = styled.span`
  font-weight: 600;
  font-size: 1.25rem;
  color: ${colors.darkerGrey};
`;

const HomeNavbarWrapper = styled(animated.div)`
  position: fixed;
  right: 3%;
  top: 50%;
  transform: translateY(-100%);
  
  @media screen and (max-width: ${LG}) {
    display: none!important;
  }
`;

const NavbarToggle = styled.div`
  position: absolute;
  top: 2.5%;
  left: 2.5%;
  cursor: pointer;

  svg {
    transition: .15s;
  }

  &:hover{
    svg {
      scale: 1.15;
    }
  }
`;

const Home = () => {
  const { width } = useWindowDimensions();
  const authContext = useContext(AuthContext);

  const [showOffscreenNav, setShowOffscreenNav] = useState(false);
  const toggleOffscreenNav = (show: boolean) => setShowOffscreenNav(show);

  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 300
  });

  const slideInRight = useSpring({
    from: { transform: 'translateX(1000px) translateY(-50%)' },
    to: { transform: 'translateX(0px) translateY(-50%)' },
    delay: 500
  });

  const getTitleTransformAnimVal = (pos: 'FROM' | 'TO') => {
    if(width <= parseInt(MD, 10)) {
      return pos === 'FROM' ? `translateY(${width}px)` : 'translateY(0px)';
    } else {
      return pos === 'FROM' ? `translateX(-${width}px)` : 'translateX(0px)';
    }
  }

  const navigateToLogin = () => navigate("/login");
  console.log(authContext);
  return (
    <div style={{backgroundColor: colors.lightBgColor}} className="overflow-x-hidden overflow-y-hidden absolute w-full h-full">
      <NavbarToggle className="lg:hidden" onClick={() => toggleOffscreenNav(true)}>
        <IoCaretForward size={55}/>
      </NavbarToggle>
      <div className="lg:hidden">
        <OffscreenNav show={showOffscreenNav} onHide={() => toggleOffscreenNav(false)} />
      </div>
      {!authContext.token ?
        <LoginButton onClick={navigateToLogin}>
          <LoginText>Login</LoginText>
          <IoLogIn size={40} color={colors.darkerGrey}/>
        </LoginButton>:
        <div className="absolute top-[5%] right-[5%] cursor-pointer">
          <span className="font-bold text-xl">{authContext.user!.username}</span>
        </div>
      }
      <Title>
        <Spring from={{ transform: getTitleTransformAnimVal('FROM') }} to={{ transform: getTitleTransformAnimVal('TO') }}>
          {styles => (
            <GateKeeper style={styles}>GATE</GateKeeper>
          )}
        </Spring>
        <br/>
        <Spring from={{ transform: getTitleTransformAnimVal('FROM') }} to={{ transform: getTitleTransformAnimVal('TO') }} delay={500}>
          {styles => (
            <animated.div style={styles}>
              <GateKeeper>K33PERS</GateKeeper>
              <SubHeading>Fashion Collection</SubHeading>
            </animated.div>
          )}
        </Spring>
      </Title>
      <Socials style={fadeIn} className="hidden lg:flex">
        <Icon>
          <IoLogoInstagram size={35} color={colors.lightestGrey}/>
        </Icon>
        <Icon>
          <IoLogoTwitter size={35} color={colors.lightestGrey}/>
        </Icon>
        <Icon>
          <IoMailOutline size={35} color={colors.lightestGrey}/>
        </Icon>
      </Socials>
      <Footer className="flex flex-col items-center" style={fadeIn}>
        <span>Created by @maksie_aki</span>
        <Socials className="flex lg:hidden">
          <Icon>
            <IoLogoInstagram size={25} color={colors.lightestGrey}/>
          </Icon>
          <Icon>
            <IoLogoTwitter size={25} color={colors.lightestGrey}/>
          </Icon>
          <Icon>
            <IoMailOutline size={25} color={colors.lightestGrey}/>
          </Icon>
        </Socials>
      </Footer>
      <HomeNavbarWrapper style={slideInRight}>
        <HomeNavbar/>
      </HomeNavbarWrapper>
    </div>
  )
};

export default Home;
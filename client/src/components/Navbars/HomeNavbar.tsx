import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { SM } from '../../util/breakpoints';
import { HomeLinks } from '../../util/links';

const Parent = styled.div`
  display: flex;
`;

const Icon = styled.div`
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.25s;

  padding: 2rem;

  @media screen and (max-width: ${SM}) {
    padding: 1rem;

    svg {
      width: 45px!important;
      height: 45px!important;
    }
  }

  svg { transition: 0.15s; }

  &:hover{
    svg {
      scale: 1.25;
      transform-origin: 50% 50%;
    }
  }
`;

const HomeNavbar = () => {
  const navigate = useNavigate();

  const navigateTo = (uri: string) => navigate(uri);

  return (
    <Parent className="my-auto sm:flex-col flex-row justify-evenly w-full md:w-fit">
      {HomeLinks(60).map((link, index) => (
        <Icon key={link.name} onClick={() => navigateTo(link.link)}>
          {link.icon}
          <span>{link.name}</span>
        </Icon>
      ))}
    </Parent>
  )
};

export default HomeNavbar;
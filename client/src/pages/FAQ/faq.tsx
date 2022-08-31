import React from "react";
import styled from "styled-components";
import Container from "../../components/Container";
import { HomeNavbar } from "../../components/Navbars";

const QHeader = styled.div.attrs(() => ({
  className: "text-xl md:text-2xl font-bold uppercase",
}))``;

const QDesc = styled.div.attrs(() => ({
  className: "text-sm md:text-md font-light mb-6",
}))``;

const Wrapper = styled.div`
  overflow-y: scroll;
  scrollbar-color: rgb(225,225,225) rgba(0, 0, 0, 0.5) !important;
  scrollbar-width: thin;
  scroll-behavior: smooth!important;

  /* Works on Chrome, Edge, and Safari */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgb(225,225,225);
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(185,185,185);
    border-radius: 20px;
  }
`;

const FAQ = () => {
  return (
    <Container className="flex flex-row justify-between">
      <Wrapper className="h-[90%] sm:h-full flex flex-col justify-center w-full p-4 overflow-y-scroll">
        <QHeader>What</QHeader>
        <QDesc>
          Gatekeepers is a hub for creators where you can sell handmade/upcycled
          clothing, accessories, shoes... and so on. Get unique pieces from your
          favourite creators.
        </QDesc>
        <QHeader>Shipping</QHeader>
        <QDesc>
          Currently only shipping to countries in the united kingdom.
        </QDesc>
        <QHeader>Sizing</QHeader>
        <QDesc>
          If sizes you want are not available send an email to{" "}
          <span className="font-bold">maksie.aki@gmail.com</span> or DM
          <span className="font-bold"> @Gatek33pers</span> on instagram.
        </QDesc>
        <QHeader>Gatekeeper</QHeader>
        <QDesc>
          Do you want to become a gatekeepers?<br/> Send an email to{" "}
          <span className="font-bold">maksie.aki@gmail.com </span>
          attach pictures of your work and a description about yourself saying
          why you believe you would be a good fit.
        </QDesc>
        <QHeader>Refunds</QHeader>
        <QDesc>DM <span className="font-bold">@Gatek33pers </span> on instagram to talk about a refund.</QDesc>
      </Wrapper>
      <HomeNavbar />
    </Container>
  );
};

export default FAQ;

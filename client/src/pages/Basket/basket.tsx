import React from "react";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router";
import { animated, useSpring, useTrail } from "react-spring";
import styled from "styled-components";
import Container from "../../components/Container";
import { HomeNavbar } from "../../components/Navbars";
import { LG, MD } from "../../util/breakpoints";
import colors from "../../util/colors";

const BasketItem = styled(animated.div)`
  background-color: ${colors.darkestGrey};
  width: 50%;
  margin-bottom: 0.25rem;

  @media screen and (max-width: ${LG}) {
    width: 75%;
  }

  @media screen and (max-width: ${MD}) {
    width: 95%;
  }

  * {
    color: ${colors.almostWhite};
    font-weight: 600;
  }
`;

const Image = styled.div`
  width: 64px;
  height: 64px;
  background-color: ${colors.grey};
`;

const Name = styled.span`
  font-size: 1.2rem;
  padding: 0.75rem 1.25rem;
`;
const Count = styled.span`
  font-weight: 500;
  padding: 0.75rem 1.25rem;

  @media screen and (max-width: ${MD}) {
    padding: 0.5rem;
  }
`;
const Size = styled.span`
  font-weight: 400;
  padding: 0.75rem 1.25rem;
`;
const Price = styled.span`
  padding: 0.75rem 1.25rem;
`;

const Info = styled(animated.div)`
  width: 50%;

  @media screen and (max-width: ${LG}) {
    width: 75%;
  }

  @media screen and (max-width: ${MD}) {
    width: 95%;
  }
`;

const BasketItems = styled.div`
  overflow-y: scroll;
  /* scrollbar styling */
  overflow-y: scroll;
  scrollbar-color: rgb(225,225,225) rgba(0, 0, 0, 0.5) !important;
  scrollbar-width: thin;
  scroll-behavior: smooth!important;

  /* Works on Chrome, Edge, and Safari */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgb(225,225,225);
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(185,185,185);
  }
`;

const Proceed = styled.button`
  background-color: ${colors.green};
  padding: 0.5rem 1rem;
  color: ${colors.almostWhite};
  border-radius: 0.3rem;
`;

const Total = styled.span`
  background-color: ${colors.darkestGrey};
  color: ${colors.almostWhite};
  border-radius: 0.3rem;
`;

const Items = new Array(14).fill({
  name: "Product Name",
  count: 1,
  size: "Size",
  price: "$10.00",
});

const Basket = () => {
  const styles = useSpring({
    from: { transform: 'translateY(100px)' },
    to: { transform: 'translateY(0px)' }
  });

  const navigate = useNavigate();
  const goToCheckout = () => navigate("/checkout")

  return (
    <Container>
      <div className="h-[90%] sm:h-full w-full flex flex-col">
        <h3 className="text-center font-bold text-5xl mt-4 mb-5">Basket</h3>
        <BasketItems>
          {Items.map((item) => (
            <BasketItem className="flex items-center mx-auto">
              <Image />
              <Count>
                {item.count} X<Name> {item.name.toUpperCase()}</Name>
                <Size> ({item.size})</Size>
              </Count>
              <Price className="ml-auto">{item.price}</Price>
            </BasketItem>
          ))}
        </BasketItems>
        <Info style={styles} className="m-auto flex flex-row items-center p-2 sm:p-4">
          <span className="font-bold text-3xl">TOTAL:</span>
          <Total className="font-bold text-3xl p-2 px-3 ml-3"> $10.00</Total>
          <Proceed className="ml-auto text-xl font-bold flex flex-row items-center" onClick={goToCheckout}>
            Checkout
            <IoArrowForward size={25} className="ml-1"/>
          </Proceed>
        </Info>
      </div>
      <HomeNavbar />
    </Container>
  );
};

export default Basket;

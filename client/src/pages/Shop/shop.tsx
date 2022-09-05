import React from "react";
import { useNavigate } from "react-router";
import { animated, useTrail } from "react-spring";
import styled from "styled-components";
import Container from "../../components/Container";
import { HomeNavbar } from "../../components/Navbars";
import { LG, SM, XXL } from "../../util/breakpoints";
import colors from "../../util/colors";

const ShopWrapper = styled.div`
  padding: 1rem;
  padding-bottom: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-rows: calc(50% - 0.5rem);
  grid-gap: 1rem;
  width: 100%;

  overflow-y: scroll;
  /* scrollbar styling */
  overflow-y: scroll;
  scrollbar-color: rgb(225,225,225) rgba(0, 0, 0, 0.5) !important;
  scrollbar-width: thin;
  scroll-behavior: smooth!important;

  /* Works on Chrome, Edge, and Safari */
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: rgb(225,225,225);
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(185,185,185);
    /* border-radius: 20px; */
  }

  @media screen and (max-width: ${XXL}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media screen and (max-width: ${LG}) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: ${SM}) {
    grid-template-columns: 1fr;
  }
`;

const Product = styled(animated.div)`
  width: 100%;
  display: grid;
  grid-template-rows: 80% 20%;
  padding: 0.5rem;
  background-color: ${colors.darkestGrey};
  box-shadow: 1px 1px rgb(82, 82, 82), 2px 2px rgb(82, 82, 82), 3px 3px rgb(82, 82, 82), 4px 4px rgb(82, 82, 82), 5px 5px rgb(82, 82, 82), 6px 6px rgb(82, 82, 82), 7px 7px rgb(82, 82, 82), 8px 8px rgb(82, 82, 82);
  cursor: pointer;
  /* transition: 0.1s; */

  &:hover {
    box-shadow: 1px 1px rgb(82, 82, 82), 2px 2px rgb(82, 82, 82), 3px 3px rgb(82, 82, 82), 4px 4px rgb(82, 82, 82), 5px 5px rgb(82, 82, 82), 6px 6px rgb(82, 82, 82);
    transform: translate(2px, 2px)!important;
  }
`;
const ProductImage = styled.div`
  background-color: ${colors.grey};
  width: 100%;
  height: 100%;
`;
const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  * {
    color: ${colors.almostWhite};
    font-weight: 600;
  }
`;

const Items = new Array(12).fill({ name: "Product Name", price: "$5" });

const Shop = () => {
  const trail = useTrail(Items.length, {
    from: { opacity: 0, y: 0.9 },
    to: { opacity: 1, y: 1 },
    config: {
      duration: 150
    }
  });

  const navigate = useNavigate();

  const navigateTo = () => navigate("/shop/HI");

  return (
    <Container>
      <ShopWrapper>
        {trail.map(({ y, ...styles}, index) => (
          <Product style={{
              scale: y,
              ...styles,
            }} onClick={navigateTo}>
            <ProductImage/>
            <ProductInfo>
              <p>{Items[index].name}</p>
              <span>{Items[index].price}</span>
            </ProductInfo>
          </Product>
        ))}
      </ShopWrapper>
      <HomeNavbar />
    </Container>
  );
};

export default Shop;

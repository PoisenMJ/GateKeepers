import React from 'react';
import { IoAdd, IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Container from '../../components/Container';
import Divider from '../../components/Divider';
import { HomeNavbar } from '../../components/Navbars';
import Select from '../../components/Select';
import { MD } from '../../util/breakpoints';
import colors from '../../util/colors';

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: ${MD}) {
    flex-direction: column;
  }
`;
const ProductInfoWrapper = styled.div`
  height: 100%;
  width: 100%;

  @media screen and (max-width: ${MD}) {
    flex-shrink: 1;
    height: auto;
    padding: 2rem 0;
  }
`;
const ProductImage = styled.div`
  background-color: ${colors.grey};
  width: 100%;
  height: 100%;
`;

const AddToCart = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${colors.green};
  border-radius: 0.25rem;
`;

const BackButton = styled.div`
  top: 1.5rem;
  position: relative;

  @media screen and (max-width: ${MD}) {
    top: 0.75rem;
  }
`;

const Product = () => {
  const navigate = useNavigate();

  const goBack = () => navigate("/shop");

  return (
    <Container className="flex flex-col md:flex-row justify-between">
      <ProductWrapper className="w-full">
        <ProductImage/>
          <ProductInfoWrapper className="flex flex-col items-center justify-center">
            <span className="text-4xl font-black">Product Name<span className="text-2xl font-light"> ($4)</span></span>
            <Divider className="mt-4 mb-6"/>
            <Select className="w-2/3 xl:w-1/2" options={['hi', 'hello']}/>
            <AddToCart className="my-1 w-2/3 xl:w-1/2 flex flex-row items-center justify-center font-bold mb-2">ADD<IoAdd size={22}/></AddToCart>
            <p style={{color: colors.blue}} className="font-bold cursor-pointer">Don't have your size?</p>
            <BackButton className="flex flex-row items-center cursor-pointer" onClick={goBack}>
              <IoChevronBack size={20}/>
              <span className="font-bold">Back</span>
            </BackButton>
          </ProductInfoWrapper>
      </ProductWrapper>
      <HomeNavbar/>
    </Container>
  )
};

export default Product;
import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import { TopNavbar } from '../components/TopNavbar';

const Parent = styled.div`
  overflow-x: none;
`

function ShopLayout() {
  return (
    <Parent>
      <TopNavbar type="Shop"/>
      <Outlet/>
    </Parent>
  )
}

export default ShopLayout;
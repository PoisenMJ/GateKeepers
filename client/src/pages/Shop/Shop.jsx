import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
// import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import styled from 'styled-components';
import PageTemplate from '../../components/PageTemplate';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import { getShop } from '../../controllers/gatekeepers';

const Header = styled.div`
  align-items: center;
  position: relative;
  display: flex;
  padding: 1.5em 1em 0em 1em;
`;

const HeaderContent = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
`;

function Shop(){

  const { gatekeeper } = useParams();

  // const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getShop(gatekeeper).then(data => {
      if(data.success) {
        console.log('data:',data);
        setProducts(data.products);
      }
    });
  }, []);

  // const viewProduct = (path) => {
  //   navigate(`../${encodeURIComponent(path)}`);
  // }

  return (
    <PageTemplate>
      <TopNavbar type="Shop"/>
      <Header>
        <HeaderContent>
          <p className="fw-bold text-muted text-center my-0">
            Pieces from&nbsp;
            <span className="text-dark">
              <strong>@{gatekeeper.toUpperCase()}</strong>.
            </span>
          </p>
          <div className="d-flex flex-row justify-content-center align-items-center my-1">
            <span className="fw-bold text-muted t-9">SHIP TO:</span>
            <Dropdown className="mx-2">
              <Dropdown.Toggle variant="dark" size="sm" className="black-dropdown fw-bold">
                UNITED KINGDOM&nbsp;
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className="pointer">UNITED STATES</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </HeaderContent>
      </Header>
      {products}
    </PageTemplate>
  )
};

export default Shop;
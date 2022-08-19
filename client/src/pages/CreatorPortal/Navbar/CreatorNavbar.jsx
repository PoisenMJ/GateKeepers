import React, { useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { Button, Container, Dropdown, Navbar } from "react-bootstrap";
import { AuthContext } from "../../../services/AuthContext";
import { hasCustomsOn } from "../../../controllers/creators";

function CreatorNavbar() {
  const { username, onSignOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await hasCustomsOn(username);
    };
    fetchData();
  }, []);

  const logOut = () => {
    onSignOut();
    navigate("/creators/login");
  }

  return (
    <header id="header-normal">
      <Navbar expand="md"
        className="d-flex align-items-stretch h-100"
        bg="primary"
      >
        <Container>
          <Navbar.Toggle
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobile-navigation"
            className="navbar-toggler"
            id="custom-navbar-toggler"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <FaBars id="custom-navbar-toggle-icon" />
          </Navbar.Toggle>
          <Navbar.Collapse className="justify-content-center">
              <NavLink className="desktop-navbar-link fw-bold" to="orders">
                ORDERS
              </NavLink>
            <Dropdown>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Dropdown.Toggle className="desktop-navbar-link fw-bold">
                SHOP
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                    <NavLink className="pointer shop-dropdown-item" to="products">
                      PRODUCTS
                    </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                    <NavLink className="pointer shop-dropdown-item" to="upload">
                      UPLOAD
                    </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
              <NavLink className="desktop-navbar-link fw-bold" to="library">
                OUTFITS
              </NavLink>
              <NavLink className="desktop-navbar-link fw-bold" to="profile">
                PROFILE
              </NavLink>
              <NavLink className="desktop-navbar-link fw-bold" to="customs">
                CUSTOMS
              </NavLink>
            <Button className="desktop-navbar-link p-0 m-0" onClick={logOut}>
              <FaSignOutAlt
                style={{ marginBottom: "6px", cursor: "pointer" }}
              />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default CreatorNavbar;

import React, {  useId } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import PropTypes from "prop-types";
import { Home, Shop } from "./Links";
import styles from "./TopNavbar.module.css";
// import { AuthContext } from "../../services/AuthContext";
// import { useNavigate } from "react-router";
// import { AuthContext } from "../../services/AuthContext";

function TopNavbar({ type }) {
  // const navigate = useNavigate();
  const location = useLocation();
  // const { loggedIn } = useContext(AuthContext);
  const links = type === 'Home' ? Home.unauthenticated : Shop.unauthenticated;

  const topNavbarContentId = useId();

  const getActive = (path) => {
    if (path.replace('/', '') === location.pathname.replace('/', '')) return "";
    return styles.inactive;
  };

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="h-100 w-100" style={{ zIndex: 1 }}>
      <Container>
        <Navbar.Toggle aria-controls={topNavbarContentId} />
        <Navbar.Collapse id={topNavbarContentId}>
          <Nav className="mx-auto">
            {links.map((link) => {
              const dropDownId = useId();
              if (!Array.isArray(link))
                return (
                  <NavLink
                    key={link.text}
                    className={`text-light fw-bold px-5 ${getActive(
                      link.link
                    )} ${styles.link}`}
                    to={`${link.link}`}

                  >
                    {link.text}
                  </NavLink>
                );
              return (
                <Dropdown key={link.text}>
                  <Dropdown.Toggle
                    className={`fw-bold text-light px-5 p-0 border-none ${getActive(
                      "/gatekeeper"
                    )}  ${styles.link}`}
                    variant="transparent"
                    id={dropDownId}
                  >
                    {link[0]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={["w-100 text-center bg-primary", styles.dropdownMenu]}>
                    {link.slice(1).map((sublink) => (
                      <Dropdown.Item className={styles.dropdownItemDiv} key={sublink.text}>
                        <NavLink className={styles.dropdownItem} to={sublink.link}>{sublink.text}</NavLink>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

TopNavbar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  type: PropTypes.string.isRequired,
};

export default TopNavbar;

import React, { useContext, useState , useLayoutEffect } from "react";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import PropTypes from "prop-types";
import { FaSignOutAlt } from "react-icons/fa";
import { Home, Shop } from "./Links";
import styles from "./TopNavbar.module.css";
// import { useNavigate } from "react-router";
import { AuthContext } from "../../services/AuthContext";

function TopNavbar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, onSignOut } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  
  // layout effect triggers before DOM is painted
  // stops flash when changing between navbar content
  useLayoutEffect(() => {
    if(type === 'Home') setLinks(Home);
    else if(type === 'Shop') setLinks(Shop);
  }, [session]);

  const getActive = (path) => {
    if (path.replace('/', '') === location.pathname.replace('/', '')) return "";
    return styles.inactive;
  };

  const signOut = () => {
    onSignOut();
    navigate("/");
  }

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="h-100 w-100" style={{ zIndex: 1 }}>
      <Container>
        <Navbar.Toggle/>
        <Navbar.Collapse>
          <Nav className="mx-auto">
            {links.map((link) => {
              if (!Array.isArray(link))
                return (
                    <NavLink
                      key={link.text}
                      className={`text-light px-5 ${getActive(
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
                  >
                    {link[0]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={["w-100 text-center bg-primary", styles.dropdownMenu]}>
                    {link.slice(1).map((sublink) => (
                          <NavLink to={sublink.link} className={styles.dropdownItem}>{sublink.text}</NavLink>
                      // <Dropdown.Item className={styles.dropdownItemDiv} key={sublink.text}>
                      // </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              );
            })}
            {session &&
              <Button variant="transparent" className={['text-light fw-bold px-5', styles.signOutButton]} onClick={signOut}>
                <FaSignOutAlt size={30} className={styles.signOutIcon}/>
              </Button>
            }
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

export default React.memo(TopNavbar);

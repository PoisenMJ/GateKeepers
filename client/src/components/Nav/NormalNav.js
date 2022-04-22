import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaShoppingCart, FaBell } from 'react-icons/fa';
import { AuthContext } from '../../services/AuthContext';
import { CartContext } from '../../services/CartContext';
import "./Nav.css";

const NormalNav = ({ creators, logOut, showCart, transparent }) => {
    let navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);
    const { products } = useContext(CartContext);
    const toggleDropdown = () => { document.getElementById("gatekeepersDropdown").classList.toggle("show-gatekeepers"); }

    const cart = () => {
        {/* <button className="btn btn-light position-relative desktop-notifications-normal me-4">
            <FaBell className="fs-4"/>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                1
                <span className="visually-hidden">unread messages</span>
            </span>
        </button> */}
        if(showCart) return (
            <div className="normal-desktop-right">
                <div className="desktop-shopping-cart" onClick={() => navigate("/shopping-basket")}>
                    <span className="fw-bold">{products.length}</span>
                    <FaShoppingCart/>
                </div>
            </div>
        )
    }

    return (
        <nav className='navbar navbar-expand-md d-flex align-items-stretch h-100' id={transparent?'':'creator-navbar'}>
            <div className="container-fluid">
                <button data-bs-toggle="offcanvas" data-bs-target="#mobile-navigation" className="navbar-toggler" id="custom-navbar-toggler">
                    <span className="visually-hidden">Toggle navigation</span>
                    <FaBars id="custom-navbar-toggle-icon"/>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="normal-nav">
                    <NavLink to="/" className="desktop-navbar-link fw-bold">HOME</NavLink>
                    <div className="dropdown">
                        <a className="dropdown-toggle mx-3 desktop-gatekeeper-dropdown text-muted fw-bold" id="gatekeepersDowndownLink" role="button" onClick={toggleDropdown}>GATEKEEPERS</a>
                        <div className="dropdown-menu" id="gatekeepersDropdown" aria-labelledby="gatekeepersDowndownLink">
                            {creators && creators.map((creator, index) => (
                                <NavLink className="dropdown-item" key={index} to={creator.tag+"/made"}>{creator.tag.toUpperCase()}</NavLink>
                            ))}
                        </div>
                    </div>
                    <NavLink to="/about" className="desktop-navbar-link fw-bold">ABOUT</NavLink>
                    {loggedIn ?
                        <>
                            <NavLink to="/profile" className="desktop-navbar-link fw-bold">PROFILE</NavLink>
                            <a className="desktop-navbar-link p-0 m-0" onClick={logOut}><FaSignOutAlt style={{marginBottom: '3px', cursor: 'pointer'}}/></a>
                        </>:
                        <NavLink to="/login" className="desktop-navbar-link fw-bold">LOGIN</NavLink>
                    }
                </div>
                {cart()}
            </div>
        </nav>
    )
}

export default NormalNav;
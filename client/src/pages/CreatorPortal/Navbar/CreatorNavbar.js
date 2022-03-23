import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { LogOut } from '../../../services/auth';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../services/AuthContext';

const CreatorNavbar = () => {
    const { loggedIn, setLoggedIn, username, setUsername, setToken } = useContext(AuthContext);

    let navigate = useNavigate();
    const toggleNavbar = () => document.getElementById("menu").classList.toggle("active");

    const logOutButton = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('')
        LogOut();
        navigate('/login');
    }

    const toggleOffCanvas = () => {
        document.getElementById("mobile-navigation-close").click();
    }

    return (
        <>
            <header id="header-normal">
                <nav className='navbar navbar-expand-md d-flex align-items-stretch h-100' id={'creator-navbar'}>
                    <div className="container-fluid">
                        <button data-bs-toggle="offcanvas" data-bs-target="#mobile-navigation" className="navbar-toggler" id="custom-navbar-toggler">
                            <span className="visually-hidden">Toggle navigation</span>
                            <FaBars id="custom-navbar-toggle-icon"/>
                        </button>
                        <div className="collapse navbar-collapse justify-content-center">
                            <NavLink to="orders" className="desktop-navbar-link">ORDERS</NavLink>
                            <NavLink to="upload" className="desktop-navbar-link">UPLOAD</NavLink>
                            <NavLink to="products" className="desktop-navbar-link">PRODUCTS</NavLink>
                            <NavLink to="library" className="desktop-navbar-link">LIBRARY</NavLink>
                            <NavLink to="profile" className="desktop-navbar-link">PROFILE</NavLink>
                            <a className="desktop-navbar-link p-0 m-0" onClick={logOutButton}>
                                <FaSignOutAlt style={{marginBottom: '3px', cursor: 'pointer'}}/>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </>
        // <div>
        //     <div className="toggle" onClick={toggleNavbar}>
        //         <FaBars style={{cursor: 'pointer', padding: '5px', color: 'white'}} size={40}/>
        //     </div>

        //     <div id="menu">
        //         <ul>
        //             <li><NavLink to="upload" className={"mb-2"} onClick={toggleNavbar}>Upload</NavLink></li>
        //             <li><NavLink to="products" className={"mb-2"} onClick={toggleNavbar}>Products</NavLink></li>
        //             <li><NavLink to="orders" className={"mb-2"} onClick={toggleNavbar}>Orders</NavLink></li>
        //             <li><NavLink to="profile" className={"mb-2"} onClick={toggleNavbar}>Profile</NavLink></li>
        //         </ul>
        //         <span onClick={() => {toggleNavbar(); logOutButton();}} style={{textDecoration: 'none'}} className="sign-out">Sign Out<FaSignOutAlt style={{marginLeft: '8px',marginBottom: '4px'}}/></span>
        //         <span style={{position: 'absolute', bottom: 'calc(.5rem + 10px)', left: 'calc(.5rem + 10px)'}}>{username}</span>
        //     </div>
        // </div>
    )
}

export default CreatorNavbar;
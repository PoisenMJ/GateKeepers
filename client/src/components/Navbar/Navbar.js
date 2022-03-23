import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import Cart from '../Cart/Cart';
import { LogOut } from '../../services/auth';

import { AuthContext } from '../../services/AuthContext';
import { CartMobileBreakpoint } from '../Query';
import { CartContext } from '../../services/CartContext';

const Navbar = ({ nav, offcanvas }) => {
    let navigate = useNavigate();
    
    const { loggedIn, token, setLoggedIn, username, setUsername, setToken } = useContext(AuthContext);
    const { clearCart } = useContext(CartContext);
    
    const logOutButton = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('');
        clearCart();
        LogOut();
        navigate('/login');
    }
    
    return (
        <>
            {offcanvas}
            <header id="header-normal">
                {nav}
            </header>
        </>

    )
};

export default Navbar;
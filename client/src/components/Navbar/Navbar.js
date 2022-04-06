import React from 'react';
import './Navbar.css';

const Navbar = ({ nav, offcanvas }) => {
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
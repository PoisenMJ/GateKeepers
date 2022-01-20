import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './ProductsNavigation.css';

const CreatorNavbar = () => {
    return (
        <div id="parent">
            <div id="creator-nav">
                <NavLink to='own' className={"text-center text-light creator-nav-link px-3 py-3"}>Worn By</NavLink>
                <NavLink to='made' className={"text-center text-light creator-nav-link py-3"}>Products</NavLink>
                <NavLink to='customs' className={"text-center text-light creator-nav-link px-3 py-3"}>Customs</NavLink>
            </div>
        </div>
    )
}

export default CreatorNavbar;
import React from 'react';
import { NavLink } from 'react-router-dom';

const CreatorOffcanvas = () => {

    const toggleOffCanvas = () => { document.getElementById("mobile-navigation-close").click(); }

    return (
        <div className="offcanvas offcanvas-start" id="mobile-navigation">
            <div className="offcanvas-header">
                <button id="mobile-navigation-close" type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body" id="mobile-navigation-body">
                <div id="mobile-navigation-links">
                    <NavLink to="orders" onClick={toggleOffCanvas} className="mobile-navigation-link">ORDERS</NavLink>
                    <NavLink to="upload" onClick={toggleOffCanvas} className="mobile-navigation-link">UPLOAD</NavLink>
                    <NavLink to="products" onClick={toggleOffCanvas} className="mobile-navigation-link">PRODUCTS</NavLink>
                    <NavLink to="library" onClick={toggleOffCanvas} className="mobile-navigation-link">LIBRARY</NavLink>
                    <NavLink to="profile" onClick={toggleOffCanvas} className="mobile-navigation-link">PROFILE</NavLink>
                </div>
            </div>
        </div>
    )
};

export default CreatorOffcanvas;
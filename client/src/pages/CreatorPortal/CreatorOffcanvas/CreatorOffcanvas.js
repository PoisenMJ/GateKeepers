import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const CreatorOffcanvas = ({ logOut }) => {
    const [dropdownToggled, setDropdownToggled] = useState(false);
    const toggleOffCanvas = () => { document.getElementById("mobile-navigation-close").click(); }
    const toggleDropdown = () => {
        document.getElementById("creator-offcanvas-shop-dropdown").classList.toggle("show");
        document.getElementById("creator-offcanvas-shop").classList.toggle("active");
        setDropdownToggled(!dropdownToggled);
    }

    return (
        <div className="offcanvas offcanvas-start" id="mobile-navigation">
            <div className="offcanvas-header">
                <button id="mobile-navigation-close" type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body" id="mobile-navigation-body">
                <div id="mobile-navigation-links">
                    <NavLink to="orders" onClick={toggleOffCanvas} className="mobile-navigation-link fw-bold">ORDERS</NavLink>
                    <a id="creator-offcanvas-shop" className="mobile-navigation-link fw-bold" onClick={toggleDropdown} role="button">
                        SHOP
                        {dropdownToggled ? <FaChevronUp style={{marginLeft: '5px', marginBottom: '5px'}}/>:
                            <FaChevronDown style={{marginLeft: '5px', marginBottom: '5px'}}/>}
                    </a>
                    <div id="creator-offcanvas-shop-dropdown">
                        <NavLink to="products" onClick={toggleOffCanvas} className="mobile-navigation-link sm fw-bold">PRODUCTS</NavLink>
                        <NavLink to="upload" onClick={toggleOffCanvas} className="mobile-navigation-link sm fw-bold">UPLOAD</NavLink>
                    </div>
                    <NavLink to="library" onClick={toggleOffCanvas} className="mobile-navigation-link fw-bold">LIBRARY</NavLink>
                    <NavLink to="profile" onClick={toggleOffCanvas} className="mobile-navigation-link fw-bold">PROFILE</NavLink>
                    <div className="mobile-navigation-logout-parent" onClick={() => {toggleOffCanvas();logOut();}}>
                        <span className="mobile-navigation-logout fw-bold">Log Out<FaSignOutAlt style={{marginBottom: '3px',marginLeft:'4px'}}/></span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreatorOffcanvas;
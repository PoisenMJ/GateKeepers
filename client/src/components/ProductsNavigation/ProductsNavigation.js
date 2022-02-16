import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaLightbulb, FaTags, FaVestPatches } from 'react-icons/fa';
import { CartDesktopBreakpoint, Desktop } from '../Query';
import './ProductsNavigation.css';
import Cart from '../Cart/Cart';

const CreatorNavbar = () => {
    return (
        <div id="parent">
            <div id="creator-nav">
                <NavLink to='made' className={"text-center text-light creator-nav-link py-3"}>
                    <Desktop>
                        <FaTags style={{marginRight: '3px', marginBottom: '3px'}}/>
                    </Desktop>
                    Products
                </NavLink>
                <NavLink to='own' className={"text-center text-light creator-nav-link px-3 py-3"}>
                    <Desktop>
                        <FaVestPatches style={{marginRight: '3px', marginBottom: '3px'}}/>
                    </Desktop>
                    Worn By
                </NavLink>
                <NavLink to='customs' className={"text-center text-light creator-nav-link py-3 px-3"}>
                    <Desktop>
                        <FaLightbulb style={{marginRight: '3px', marginBottom: '3px'}}/>
                    </Desktop>
                    Customs
                </NavLink>
                <CartDesktopBreakpoint>
                    <Cart clicked={() => console.log("HI")} inNavigation={true}/>
                </CartDesktopBreakpoint>
            </div>
        </div>
    )
}

export default CreatorNavbar;
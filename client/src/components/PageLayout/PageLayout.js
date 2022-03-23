import React from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage/FlashMessage';
import { AuthVerify } from '../../services/AuthContext';
import Cart from '../Cart/Cart';
import { CartDesktopBreakpoint, Desktop } from '../Query';
import Navbar from '../Navbar/Navbar';

const PageLayout = ({ nav, offcanvas, body, footer, cartEnabled}) => {
    return (
        <>
            <Navbar nav={nav} offcanvas={offcanvas}/>
            <FlashMessage/>
            <main id="main-normal">
                {!body ?
                    <Outlet/> : body
                }
            </main>
            {footer}
            <AuthVerify/>
        </>
    )
}

export default PageLayout;
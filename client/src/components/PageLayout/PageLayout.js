import React from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage/FlashMessage';
import { AuthVerify } from '../../services/AuthContext';
import Cart from '../Cart/Cart';
import { CartDesktopBreakpoint, Desktop } from '../Query';

const PageLayout = ({ header, body, footer, cartEnabled}) => {
    return (
        <div id="page-layout">
            <CartDesktopBreakpoint>
                {cartEnabled === true &&
                    <Cart clicked={() => {}} inNavigation={false}/>
                }
            </CartDesktopBreakpoint>
            {header}
            {body}
            {footer}
            <FlashMessage/>
            {!body &&
                <Outlet/>
            }
            <AuthVerify/>
        </div>
    )
}

export default PageLayout;
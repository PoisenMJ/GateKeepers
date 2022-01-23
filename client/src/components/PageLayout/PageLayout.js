import React from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage/FlashMessage';
import AuthProvider, { AuthVerify } from '../../services/AuthContext';
import Cart from '../Cart/Cart';
import { Desktop } from '../Query';

const PageLayout = ({ header, body, footer, cartEnabled}) => {
    return (
        <div id="page-layout">
            <Desktop>
                {cartEnabled === true &&
                    <Cart clicked={() => console.log('1')}/>
                }
            </Desktop>
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
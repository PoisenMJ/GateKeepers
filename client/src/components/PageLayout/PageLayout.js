import React from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage/FlashMessage';
import { AuthVerify } from '../../services/AuthContext';
import { CartDesktopBreakpoint, Desktop } from '../Query';

const PageLayout = ({ header, body, footer, cartEnabled}) => {
    return (
        <>
            {header}
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
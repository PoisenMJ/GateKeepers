import React from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage/FlashMessage';
import AuthProvider, { AuthVerify } from '../../services/AuthContext';

const PageLayout = ({ header, body, footer}) => {
    return (
        <div id="page-layout">
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
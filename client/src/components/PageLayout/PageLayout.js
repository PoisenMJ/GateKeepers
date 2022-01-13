import React from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage/FlashMessage';
import AuthProvider from '../../services/AuthContext';

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
        </div>
    )
}

export default PageLayout;
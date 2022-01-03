import { React } from 'react';
import './PageLayout.css';
import { Outlet } from 'react-router';

const PageLayout = ({ header, body, footer}) => {
    return (
        <div id="page-layout">
            {header}
            {body}
            {footer}
            <Outlet/>
        </div>
    )
}

export default PageLayout;
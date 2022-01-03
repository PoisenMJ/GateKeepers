import { React } from 'react';
import './Header.css';

const Header = ({ navbar, navigation }) => {
    return (
        <div id="header">
            {navbar}
            {navigation}
        </div>
    )
};

export default Header;
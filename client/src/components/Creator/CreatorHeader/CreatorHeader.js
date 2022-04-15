import React, { useContext } from 'react';
import CreatorOffcanvas from '../../../pages/CreatorPortal/CreatorOffcanvas/CreatorOffcanvas';
import CreatorNavbar from '../../../pages/CreatorPortal/Navbar/CreatorNavbar';

import { LogOut } from '../../../services/auth';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../services/AuthContext';

const CreatorHeader = () => {
    let navigate = useNavigate();
    const { setLoggedIn, setUsername, setToken } = useContext(AuthContext);

    const logOutButton = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('')
        LogOut();
        navigate('/creators/login');
    }

    return (
        <>
            <CreatorOffcanvas logOut={logOutButton}/>
            <header id="header-normal">
                <CreatorNavbar logOut={logOutButton}/>
            </header>
        </>
    )
};

export default CreatorHeader;
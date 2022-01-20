import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { LogOut } from '../../../services/auth';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../services/AuthContext';

const CreatorNavbar = () => {
    const { loggedIn, setLoggedIn, username, setUsername, setToken } = useContext(AuthContext);

    let navigate = useNavigate();
    const toggleNavbar = () => document.getElementById("menu").classList.toggle("active");

    const logOutButton = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('')
        LogOut();
        navigate('/login');
    }

    return (
        <div>
            <div className="toggle" onClick={toggleNavbar}>
                <FaBars style={{cursor: 'pointer', top: '10px', position: 'relative', backgroundColor: 'rgba(255,255,255,0.5)', paddingLeft: '3px', paddingRight: '3px'}} size={30}/>
            </div>

            <div id="menu">
                <ul>
                    <li><NavLink to="upload" className={"mb-2"} onClick={toggleNavbar}>Upload</NavLink></li>
                    <li><NavLink to="products" className={"mb-2"} onClick={toggleNavbar}>Products</NavLink></li>
                    <li><NavLink to="orders" className={"mb-2"} onClick={toggleNavbar}>Orders</NavLink></li>
                    <li><NavLink to="profile" className={"mb-2"} onClick={toggleNavbar}>Profile</NavLink></li>
                </ul>
                <span onClick={() => {toggleNavbar(); logOutButton();}} style={{textDecoration: 'none'}} className="sign-out">Sign Out<FaSignOutAlt style={{marginLeft: '8px',marginBottom: '4px'}}/></span>
                <span style={{position: 'absolute', bottom: 'calc(.5rem + 10px)', left: 'calc(.5rem + 10px)'}}>{username}</span>
            </div>
        </div>
    )
}

export default CreatorNavbar;
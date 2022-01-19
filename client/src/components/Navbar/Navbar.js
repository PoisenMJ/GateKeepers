import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { FaBars, FaSignOutAlt, FaSortDown } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCreators } from '../../controllers/creators';
import Cart from '../Cart/Cart';
import { LogOut } from '../../services/auth';

import { AuthContext } from '../../services/AuthContext';
import Event from '../../utils/events';
import LocaleButton from '../LocaleButton/LocaleButton';

const Navbar = () => {
    let navigate = useNavigate();
    const [creators, setCreators] = useState(null);

    const { loggedIn, token, setLoggedIn, username, setUsername, setToken } = useContext(AuthContext);

    useEffect(() => {
        // if(!loggedIn){
        //     navigate('/login');
        // }
        const fetchData = async () => {
            var creators = await getCreators();
            setCreators(creators);
        }
        fetchData();
    }, []);

    const toggleNavbar = () => document.getElementById("menu").classList.toggle("active");
    const logOutButton = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('');
        LogOut();
        navigate('/login');
    }
    
    return (
        <div>
            <div className="toggle" onClick={toggleNavbar}>
                <FaBars style={{cursor: 'pointer', top: '10px', position: 'relative'}} size={30}/>
            </div>

            <div id="menu">
                <Cart clicked={toggleNavbar}/>
                <LocaleButton/>
                <ul>
                    <li><NavLink to="/" className={"mb-2"} onClick={toggleNavbar}>Home</NavLink></li>
                    <li><a href="#" className={"d-flex"} style={{marginLeft: '40px'}}
                        onClick={() => document.getElementById("creator-list").classList.toggle("open")}>
                        Gatekeepers
                        <FaSortDown style={{marginLeft: '4px', marginBottom: '3px'}}/></a>
                        <div id="creator-list">
                            {creators && creators.map((creator, index) => (
                                    <NavLink key={creator.tag} onClick={toggleNavbar} to={`/${creator.tag}/own`} className="mb-1 text-secondary creator">{creator.tag}</NavLink>
                                ))
                            }
                        </div>
                    </li>
                    <li><NavLink to="/about" className={"mb-2"} onClick={toggleNavbar}>About</NavLink></li>
                    <li><NavLink to="/contact-us" className={"mb-2"} onClick={toggleNavbar}>Contact Us</NavLink></li>
                    {loggedIn ?
                        <li><NavLink to="/profile" onClick={toggleNavbar} className={"mb-2"}>Profile</NavLink></li>
                        :
                        <li><NavLink to="/login" onClick={toggleNavbar} className={"mb-2"}>Login</NavLink></li>
                    }
                </ul>
                {loggedIn &&
                <div>
                    <span onClick={() => { toggleNavbar(); logOutButton(); }} className="sign-out">Sign Out<FaSignOutAlt style={{marginBottom: '4px', marginLeft: '8px'}}/></span>
                    <span style={{position: 'absolute', bottom: 'calc(.5rem + 10px)', left: 'calc(.5rem + 10px)'}}>{username}</span>
                </div>
                }
            </div>
        </div>

    )
};

export default Navbar;
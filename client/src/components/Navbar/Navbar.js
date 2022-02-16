import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { FaBars, FaInstagram, FaSignOutAlt, FaChevronDown, FaTwitter, FaChevronUp } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCreators } from '../../controllers/creators';
import Cart from '../Cart/Cart';
import { LogOut } from '../../services/auth';

import { AuthContext } from '../../services/AuthContext';
import { CartMobileBreakpoint } from '../Query';
import { CartContext } from '../../services/CartContext';

const Navbar = () => {
    let navigate = useNavigate();
    const [creators, setCreators] = useState(null);
    const [dropdownToggled, setDropdownToggled] = useState(false);

    const { loggedIn, token, setLoggedIn, username, setUsername, setToken } = useContext(AuthContext);
    const { clearCart } = useContext(CartContext);

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

    const toggleNavbar = () => {
        document.getElementById("menu").classList.toggle("active");
    }
    const logOutButton = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('');
        clearCart();
        LogOut();
        navigate('/login');
    }
    
    return (
        <div>
            <div className="toggle" onClick={toggleNavbar}>
                <FaBars style={{cursor: 'pointer', top: '10px', position: 'relative'}} size={30}/>
            </div>

            <div id="menu">
                <CartMobileBreakpoint>
                    <Cart clicked={toggleNavbar} inNavigation={false}/>
                </CartMobileBreakpoint>
                <ul className="navbar-ul">
                    <li><NavLink to="/" className={"mb-2"} onClick={toggleNavbar}>Home</NavLink></li>
                    <li><a href="#" className={"d-flex mb-2"} style={{marginLeft: '40px'}}
                        onClick={() => {
                            document.getElementById("creator-list").classList.toggle("open");
                            setDropdownToggled(!dropdownToggled);
                            }}>
                        Gatekeepers
                        {dropdownToggled ?
                            <FaChevronUp style={{marginTop: '10px', marginLeft: '10px'}}/>
                            :<FaChevronDown style={{marginTop: '10px', marginLeft: '10px'}}/>
                        }
                        </a>
                        <div id="creator-list">
                            {creators && creators.map((creator, index) => (
                                    <NavLink key={creator.tag} onClick={toggleNavbar} to={`/${creator.tag}/made`} className="mb-1 text-secondary creator">{creator.tag}</NavLink>
                                ))
                            }
                        </div>
                    </li>
                    <li><NavLink to="/about" className={"mb-2"} onClick={toggleNavbar}>About</NavLink></li>
                    {loggedIn ?
                        <li><NavLink to="/profile" onClick={toggleNavbar} className={"mb-2"}>Profile</NavLink></li>
                        :
                        <li><NavLink to="/login" onClick={toggleNavbar} className={"mb-2"}>Login</NavLink></li>
                    }
                    <li>
                        <a href="https://www.instagram.com/gatekeepers.store/">
                            <FaInstagram size={50}/>
                        </a>
                        <a href="https://twitter.com/Gatek33pers">
                            <FaTwitter size={50}/>
                        </a>
                    </li>
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
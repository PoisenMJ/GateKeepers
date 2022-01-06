import { React, useState, useEffect } from 'react';
import './Navbar.css';
import { FaBars, FaSortDown } from 'react-icons/fa';
import { Outlet, NavLink } from 'react-router-dom';
import { getCreators } from '../../controllers/creators';
import { checkLoggedIn } from '../../services/auth';

const Navbar = () => {
    const [creators, setCreators] = useState(null);
    var loggedIn = false;

    useEffect(() => {
        var loggedIn = checkLoggedIn();
        const fetchData = async () => {
            var creators = await getCreators();
            setCreators(creators);
        }
        fetchData();
    }, []);

    const toggleNavbar = () => document.getElementById("menu").classList.toggle("active");

    return (
        <div>
            <div className="toggle" onClick={toggleNavbar}>
                <FaBars style={{cursor: 'pointer', top: '10px', position: 'relative'}} size={30}/>
            </div>

            <div id="menu">
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
                    <li><NavLink to="/contact-us" className={"mb-2"}>Contact Us</NavLink></li>
                    {loggedIn ? 
                        <li><NavLink to="/login" onClick={toggleNavbar} className={"mb-2"}>Login</NavLink></li>
                        :
                        <li><NavLink to="/profile" onClick={toggleNavbar} className={"mb-2"}>Profile</NavLink></li>
                    }
                </ul>
            </div>
        </div>

    )
};

export default Navbar;
import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../../services/AuthContext';
import { getCreators } from '../../controllers/creators';
import "./Nav.css";

const NormalNav = ({ transparent, ...props }) => {
    let navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);
    const [creators, setCreators] = useState(null);

    useEffect(() => {
        const fetchCreators = async () => {
            var creators = await getCreators();
            setCreators(creators);
        }
        fetchCreators();
    }, [])

    const toggleDropdown = () => {
        document.getElementById("gatekeepersDropdown").classList.toggle("show-gatekeepers");
    }

    return (
        <nav className='navbar navbar-expand-md d-flex align-items-stretch h-100' id={transparent?'':'creator-navbar'}>
            <div className="container-fluid">
                <button data-bs-toggle="offcanvas" data-bs-target="#mobile-navigation" className="navbar-toggler" id="custom-navbar-toggler">
                    <span className="visually-hidden">Toggle navigation</span>
                    <FaBars id="custom-navbar-toggle-icon"/>
                </button>
                <div className="collapse navbar-collapse justify-content-center">
                    <NavLink to="/" className="desktop-navbar-link">HOME</NavLink>
                    <div className="dropdown">
                        <a className="dropdown-toggle mx-3 desktop-gatekeeper-dropdown text-muted" id="gatekeepersDowndownLink" role="button" onClick={toggleDropdown}>GATEKEEPERS</a>
                        <div className="dropdown-menu" id="gatekeepersDropdown" aria-labelledby="gatekeepersDowndownLink">
                            {creators && creators.map((creator, index) => (
                                <NavLink className="dropdown-item" key={index} to={creator.tag+"/made"}>{creator.tag.toUpperCase()}</NavLink>
                            ))}
                        </div>
                    </div>
                    <NavLink to="/about" className="desktop-navbar-link">ABOUT</NavLink>
                    {loggedIn ?
                        <>
                            <NavLink to="/profile" className="desktop-navbar-link">PROFILE</NavLink>
                            <a className="desktop-navbar-link p-0 m-0"><FaSignOutAlt style={{marginBottom: '3px', cursor: 'pointer'}}/></a>
                        </>:
                        <NavLink to="/login" className="desktop-navbar-link">LOGIN</NavLink>
                    }
                </div>
                <div className="desktop-shopping-cart" onClick={() => navigate("/shopping-basket")}>
                    <span>2</span>
                    <FaShoppingCart/>
                </div>
            </div>
        </nav>
    )
}

export default NormalNav;
import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../../services/AuthContext';
import { hasCustomsOn } from '../../../controllers/gatekeepers';

const CreatorNavbar = ({ logOut }) => {
    const { username } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            var r = await hasCustomsOn(username);
            
        }
    }, [])

    return (
        <>
            <header id="header-normal">
                <nav className='navbar navbar-expand-md d-flex align-items-stretch h-100' id={'creator-navbar'}>
                    <div className="container-fluid">
                        <button data-bs-toggle="offcanvas" data-bs-target="#mobile-navigation" className="navbar-toggler" id="custom-navbar-toggler">
                            <span className="visually-hidden">Toggle navigation</span>
                            <FaBars id="custom-navbar-toggle-icon"/>
                        </button>
                        <div className="collapse navbar-collapse justify-content-center">
                            <NavLink to="orders" className="desktop-navbar-link fw-bold">ORDERS</NavLink>
                            <div className="dropdown">
                                <a className="desktop-navbar-link fw-bold dropdown-toggle"
                                    href="#" role="buton" data-bs-toggle="dropdown">SHOP</a>
                                <ul className="dropdown-menu">
                                    <li><NavLink to="products" className="dropdown-item pointer shop-dropdown-item">PRODUCTS</NavLink></li>
                                    <li><NavLink to="upload" className="dropdown-item pointer shop-dropdown-item">UPLOAD</NavLink></li>
                                </ul>
                            </div>
                            <NavLink to="library" className="desktop-navbar-link fw-bold">OUTFITS</NavLink>
                            <NavLink to="profile" className="desktop-navbar-link fw-bold">PROFILE</NavLink>
                            <NavLink to="customs" className="desktop-navbar-link fw-bold">CUSTOMS</NavLink>
                            <a className="desktop-navbar-link p-0 m-0" onClick={logOut}>
                                <FaSignOutAlt style={{marginBottom: '6px', cursor: 'pointer'}}/>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default CreatorNavbar;
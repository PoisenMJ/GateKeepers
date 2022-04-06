import React, { useEffect, useState } from 'react';
import { getCreators } from '../../controllers/creators';
import { NavLink } from 'react-router-dom';
import { FaInstagram, FaSignOutAlt, FaChevronDown, FaTwitter, FaChevronUp } from 'react-icons/fa';

const UserOffcanvas = () => {
    const [creators, setCreators] = useState(null);
    const [dropdownToggled, setDropdownToggled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            var creators = await getCreators();
            setCreators(creators);
        }
        fetchData();
    }, []);

    const toggleOffCanvas = () => {
        document.getElementById("mobile-navigation-close").click();
    }
    const toggleDropdown = () => {
        document.getElementById("mobile-navigation-gatekeepers-dropdown").classList.toggle("active");
        document.getElementById("mobile-navigation-gatekeepers").classList.toggle("show-gatekeepers-mobile");
        setDropdownToggled(!dropdownToggled);
    }

    return (
        <div className="offcanvas offcanvas-start" id="mobile-navigation">
            <div className="offcanvas-header">
                <button id="mobile-navigation-close" type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body" id="mobile-navigation-body">
                <div id="mobile-navigation-links">
                    <NavLink to="/" onClick={toggleOffCanvas} className="mobile-navigation-link">HOME</NavLink>
                    <a onClick={toggleDropdown} id="mobile-navigation-gatekeepers-dropdown" className="mobile-navigation-link">GATEKEEPERS
                        {dropdownToggled ?
                            <FaChevronUp style={{marginLeft: '5px', marginBottom: '5px'}}/>:
                            <FaChevronDown style={{marginLeft: '5px', marginBottom: '5px'}}/>
                        }
                    </a>
                    <div id="mobile-navigation-gatekeepers">
                        {creators && creators.map((creator, index) => (
                            <NavLink key={index} onClick={toggleOffCanvas} className="mobile-navigation-link mobile-navigation-gatekeeper" to={creator.tag+"/made"}>{creator.tag.toUpperCase()}</NavLink>
                        ))}
                    </div>
                    <NavLink to="/about" onClick={toggleOffCanvas} className="mobile-navigation-link">ABOUT</NavLink>
                    <NavLink to="/login" onClick={toggleOffCanvas} className="mobile-navigation-link">LOGIN</NavLink>
                </div>
            </div>
        </div>
    )
};

export default UserOffcanvas;
import { React, useState, useEffect } from 'react';
import './Navbar.css';
import { FaBars, FaSortDown } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCreators } from '../../controllers/creators';

const Navbar = () => {
    const [creators, setCreators] = useState(null);
    const [currentlySelected, setCurrentlySelected] = useState('home');
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            var creators = await getCreators();
            setCreators(creators);
        }
        fetchData();
    }, []);

    const getActive = (name) => {
        if(name == currentlySelected) return "active";
    }

    const changeActive = (name) => {
        setCurrentlySelected(name);
    }

    return (
        <div>
            <div className="toggle" onClick={() => {
                document.getElementById("menu").classList.toggle("active");
            }}>
                <FaBars style={{cursor: 'pointer', top: '10px', position: 'relative'}} size={30}/>
            </div>
            <div id="menu">
                <ul>
                    <li><a className={"mb2 "+getActive("home")} href="/" onClick={() => changeActive("home")}>Home</a></li>
                    <li><a href="#" className={"d-flex "+getActive("creators")} style={{marginLeft: '40px'}}
                        onClick={() => {
                            document.getElementById("creator-list").classList.toggle("open");
                        }}>
                        Creators
                        <FaSortDown style={{marginLeft: '4px', marginBottom: '3px'}}/></a>
                        <div id="creator-list">
                            {creators && creators.map((creator, index) => (
                                    <span key={creator.tag}
                                        className="mb-1 text-secondary creator"
                                        onClick={() => {
                                            changeActive("creators");
                                            navigate(`/${creator.tag}`);
                                        }}>
                                        {creator.tag}
                                    </span>
                                ))
                            }
                        </div>
                    </li>
                    <li><a className={"mb-2 "+getActive("about")} onClick={() => changeActive("about")} href="#">About</a></li>
                    <li><a className={"mb-2 "+getActive("contact")} onClick={() => changeActive("contact")} href="#">Contact Us</a></li>
                </ul>
            </div>
            <Outlet/>
        </div>

    )
}

export default Navbar;
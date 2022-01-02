import { React, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import './CreatorNavbar.css';

const CreatorNavbar = () => {
    const [currentlySelected, setCurrentlySelected] = useState("own");
    const {creator} = useParams();
    let navigate = useNavigate();

    const navigateTo = (location) => {
        setCurrentlySelected(location);
        navigate(`/${creator}/${location}`)
    }

    const getClass = (name) => {
        return (name == currentlySelected) ? " active":"";
    }

    return (
        <div>
            <div id="creator-nav">
                <span onClick={() => navigateTo("own")} className={"text-light creator-nav-link px-3 py-3"+getClass("own")}>Worn By</span>
                <span onClick={() => navigateTo("products")} className={"text-light creator-nav-link py-3"+getClass("products")}>Products</span>
                <span onClick={() => navigateTo("customs")} className={"text-light creator-nav-link px-3 py-3"+getClass("customs")}>Customs</span>
            </div>
            <Outlet/>
        </div>
    )
}

export default CreatorNavbar;
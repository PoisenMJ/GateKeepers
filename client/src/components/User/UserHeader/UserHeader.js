import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorNav from '../../Nav/CreatorNav';
import NormalNav from '../../Nav/NormalNav';
import UserOffcanvas from '../../UserOffcanvas/UserOffcanvas';
import { AuthContext } from '../../../services/AuthContext';
import { CartContext } from '../../../services/CartContext';
import { LogOut } from '../../../services/auth';
import { getCreators } from '../../../controllers/creators';

const UserHeader = ({ productNav, transparent }) => {
    let navigate = useNavigate();
    const [creators, setCreators] = useState([]);
    
    const { setLoggedIn, setUsername, setToken } = useContext(AuthContext);
    const { clearCart } = useContext(CartContext);

    useEffect(() => {
        const fetchCreators = async () => {
            var creators = await getCreators();
            setCreators(creators);
        }
        fetchCreators();
    }, [])

    const logOutEvent = () => {
        setLoggedIn(false);
        setUsername('');
        setToken('');
        clearCart();
        LogOut();
        navigate('/login');
    }

    return (
        <>
            <UserOffcanvas/>
            <header id="header-normal">
                {productNav ?
                    <CreatorNav logOut={logOutEvent}/>:
                    <NormalNav logOut={logOutEvent} creators={creators} transparent={transparent?true:false}/>}
            </header>
        </>
    )
};

export default UserHeader;
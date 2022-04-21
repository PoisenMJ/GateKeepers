import React, { useContext, useEffect, useState } from 'react';
import './CreatorLogin.css';
import { login } from '../../../controllers/gatekeepers';
import { useNavigate } from 'react-router';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { AuthContext } from '../../../services/AuthContext';
import { APP_ID, APP_REDIRECT } from '../../../config';
import { FaInstagram } from 'react-icons/fa';

const CreatorLoginPage = () => {
    let navigate = useNavigate();
    const [username, _setUsername] = useState('');
    const [password, _setPassword] = useState('');

    const { setToken, setUsername, setLoggedIn, loggedIn } = useContext(AuthContext);

    useEffect(() => {
        if(loggedIn && localStorage.getItem("creator") == "true") navigate("/creators/orders");
    }, [])

    const sendLogin = async event => {
        event.preventDefault();
        var response = await login(username, password);
        if(response.success){
            setToken(response.token);
            setUsername(username);
            setLoggedIn(true);
            localStorage.setItem("creator", true);
            navigate("/creators/orders");
            // Event.emit('loggedIn');
        } else Flash("Incorrect username or password", "dark");
    }

    return (
        <div id="admin-login-parent" className="p-4">
            <form id="admin-login-form" onSubmit={sendLogin}>
                <span className="fs-3 fw-bold">LOGIN</span>
                <input onChange={event => _setUsername(event.target.value)}
                        className="form-control mb-1 mt-4 fw-bold" type="text" placeholder="USERNAME"/>
                <input onChange={event => _setPassword(event.target.value)}
                        className="form-control mb-2 fw-bold" type="password" placeholder="PASSWORD"/>
                <button className="btn btn-dark fw-bold w-100 mb-1" type="submit">LOGIN</button>
                <a href={`https://api.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${APP_REDIRECT}&scope=user_profile&response_type=code&state=creator`}
                    className="btn btn-primary fw-bold pb-2 instagram-button w-100"
                    type="button">Sign In
                    <FaInstagram className='icon-3'/>
                </a>
            </form>
        </div>
    )
}

export default CreatorLoginPage;
import React, { useContext, useState } from 'react';
import './CreatorLogin.css';
import { login } from '../../../controllers/gatekeepers';
import { useNavigate } from 'react-router';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { AuthContext } from '../../../services/AuthContext';

const CreatorLoginPage = () => {
    let navigate = useNavigate();
    const [username, _setUsername] = useState('');
    const [password, _setPassword] = useState('');

    const { setToken, setUsername, setLoggedIn } = useContext(AuthContext);

    const sendLogin = async event => {
        event.preventDefault();
        var response = await login(username, password);
        console.log(response);
        if(response.success){
            setToken(response.token);
            setUsername(username);
            setLoggedIn(true);
            navigate("/creators/orders");
            Event.emit('loggedIn');
        } else Flash("Incorrect username or password", "dark");
    }

    return (
        <div id="admin-login-parent" className="p-4">
            <form id="admin-login-form" onSubmit={sendLogin}>
                <span className="fs-3 fw-bold">ADMIN ~ LOGIN</span>
                <input onChange={event => _setUsername(event.target.value)}
                        className="form-control mb-1 mt-4" type="text" placeholder="USERNAME"/>
                <input onChange={event => _setPassword(event.target.value)}
                        className="form-control mb-2" type="password" placeholder="PASSWORD"/>
                <button className="btn btn-dark fw-bold w-100" type="submit">LOGIN</button>
            </form>
        </div>
    )
}

export default CreatorLoginPage;
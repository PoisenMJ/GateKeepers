import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import { Form, Button } from 'react-bootstrap';
import { login } from '../../controllers/auth';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../services/AuthContext';
import Event from '../../utils/events';

const Login = () => {

    const { setLoggedIn, setUsername, setToken, loggedIn, username, token } = useContext(AuthContext);

    let navigate = useNavigate();

    const [inputUsername, setInputUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = event => setInputUsername(event.target.value);
    const handlePasswordChange = event => setPassword(event.target.value);

    useEffect(() => {
        if(loggedIn) navigate('/')
    }, []);

    const sendLogin = async event => {
        event.preventDefault();
        if(inputUsername && password){
            var res = await login(inputUsername, password);
            if(res.success){
                setToken(res.token);
                setUsername(inputUsername);
                setLoggedIn(true);
                
                if(res.type == 'user')
                    navigate('/', { state: 'logged-in' });
                else if(res.type == 'creator')
                    navigate('/creators/upload', { state: 'logged-in' });
                Event.emit('loggedIn');
            }
            else Flash(res.message, "danger");
        } else Flash("Enter Username & Password", "dark");
    }

    return (
        <div id="login">
            <div className="simple-page-parent">
                <div style={{width: '100%', textAlign: 'center'}}>
                    <span className="fs-3">▶ LOGIN ◀</span>
                </div>
                <hr className="mb-4"/>
                <Form onSubmit={sendLogin} className="mb-4">
                    <Form.Control type="text" onChange={handleUsernameChange} name="username" className="custom-input mb-2" placeholder="USERNAME" />
                    <Form.Control type="password" onChange={handlePasswordChange} name="password" className="custom-input mb-3" placeholder="PASSWORD" />
                    <Button className="w-100" variant="dark" type="submit">LOGIN</Button>
                </Form>
                <div id="no-account">
                    <span>Don't have an account? </span>
                    <Link style={{textDecoration: 'none'}} to="/create-account"><span id="create-account-link">Create</span></Link>
                </div>
            </div>
        </div>
    )
};

export default Login;
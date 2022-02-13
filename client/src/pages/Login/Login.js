import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import { Form, Button } from 'react-bootstrap';
import { login } from '../../controllers/auth';
import { getActivationToken } from '../../controllers/users';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../services/AuthContext';
import Event from '../../utils/events';
import ActivateAccount from '../../components/ActivateAccount/ActivateAccount';
import PasswordRecoveryBox from '../../components/PasswordRecoveryBox/PasswordRecoveryBox';
import { CartContext } from '../../services/CartContext';

const Login = () => {

    const { setLoggedIn, setUsername, setToken, loggedIn, username, token } = useContext(AuthContext);
    const { clearCart } = useContext(CartContext);

    let navigate = useNavigate();

    const [inputUsername, setInputUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showActivationDialog, setShowActivationDialog] = useState(false);
    const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);

    const handleUsernameChange = event => setInputUsername(event.target.value);
    const handlePasswordChange = event => setPassword(event.target.value);

    const activationCodeSuccess = async () => {
        // var res = await login(inputUsername, password);
        // setToken(res.token);
        // setUsername(inputUsername);
        // setLoggedIn(true);

        setShowActivationDialog(false);
        Flash("Account activated.", "dark");
        navigate('/login');
    }

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
                clearCart();

                if(res.type == 'user')
                    navigate('/', { state: 'logged-in' });
                else if(res.type == 'creator')
                    navigate('/creators/upload', { state: 'logged-in' });
            Event.emit('loggedIn');
            }
            else {
                if(res.message === "activate account") {
                    getActivationToken(inputUsername);
                    setShowActivationDialog(true);
                } else Flash(res.message, "danger")
            };
        } else Flash("Enter Username & Password", "dark");
    }

    return (
        <div id="login">
            <PasswordRecoveryBox
                showPasswordRecovery={showPasswordRecovery}
                hidePasswordRecovery={() => setShowPasswordRecovery(false)}/>
            <ActivateAccount
                showDialog={showActivationDialog}
                username={inputUsername}
                activationSuccess={activationCodeSuccess}
                hideDialog={() => setShowActivationDialog(false)}/>

            <div className="simple-page-parent">
                <div style={{width: '100%', textAlign: 'center'}}>
                    <span className="fs-3">▶ LOGIN ◀</span>
                </div>
                <hr className="mb-4"/>
                <Form onSubmit={sendLogin} className="mb-4">
                    <Form.Control type="text" onChange={handleUsernameChange} name="username" className="custom-input mb-2" placeholder="USERNAME" />
                    <Form.Control type="password" onChange={handlePasswordChange} name="password" className="custom-input" placeholder="PASSWORD" />
                    <span className="forgot-password-link" onClick={() => setShowPasswordRecovery(true)}>Forgot password</span>
                    <Button className="w-100 mt-3" variant="dark" type="submit">LOGIN</Button>
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
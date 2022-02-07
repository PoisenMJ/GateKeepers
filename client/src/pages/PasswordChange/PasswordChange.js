import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { changePassword } from '../../controllers/users';
import { AuthContext } from '../../services/AuthContext';
import "./PasswordChange.css";

const PasswordChange = () => {
    let navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const handleUpdatePassword = event => setPassword(event.target.value);
    const handleUpdatePasswordConf = event => setPasswordConf(event.target.value);

    const { updateToken } = useParams();
    const { username, token } = useContext(AuthContext);

    const sendPasswordChange = async event => {
        event.preventDefault();
        if(password === passwordConf){
            if(password.length > 8){
                var res = await changePassword(username, token, password, updateToken);
                if(res.success){
                    Flash("Password Updated", "dark");
                    navigate("/profile");
                } else Flash(res.message, "danger");
            } else Flash("Password must be at least 8 chars long", "danger");

        } else Flash("Passwords don't match", "danger");
    }

    return (
        <div id="password-change">
            <Form onSubmit={sendPasswordChange} id="password-change-parent">
                <span>Password Change</span>
                <Form.Control onChange={handleUpdatePassword} className='mb-2 custom-input' type="password" placeholder="password"/>
                <Form.Control onChange={handleUpdatePasswordConf} className='mb-2 custom-input' type="password" placeholder="confirm password"/>
                <Button type="submit" variant="dark" className='w-100'>UPDATE</Button>
            </Form>
        </div>
    )
}

export default PasswordChange;
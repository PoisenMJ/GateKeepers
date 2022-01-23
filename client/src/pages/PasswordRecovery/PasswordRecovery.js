import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { recoverPassword } from '../../controllers/users';
import "./PasswordRecovery.css";

const PasswordRecovery = () => {
    let navigate = useNavigate();
    const { token, username } = useParams();

    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const sendRecoverPassword = async event => {
        event.preventDefault();
        if(password === confPassword){
            var res = await recoverPassword(username, token, password);
            if(res.success){
                Flash("Password updated.", "dark");
                navigate("/login");
            } else Flash("Password don't match", "danger");
        }
    }

    const handlePasswordUpdate = event => setPassword(event.target.value);
    const handleConfPasswordUpdate = event => setConfPassword(event.target.value);

    return (
        <div id="password-recovery-parent">
            <Form onSubmit={sendRecoverPassword} id="password-recovery">
                <span className='fs-5'>New Password</span>
                <Form.Control onChange={handlePasswordUpdate} type="password" placeholder="new password" className="black-custom-input mt-2 mb-1"/>
                <Form.Control onChange={handleConfPasswordUpdate} type="password" placeholder="confirm new password" className="black-custom-input mb-3"/>
                <Button type="submit" className="w-100 radius-zero" variant="dark">SUBMIT</Button>
            </Form>
        </div>
    )
}

export default PasswordRecovery;
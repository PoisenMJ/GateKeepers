import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { createAccount } from '../../controllers/auth';
import { useNavigate } from 'react-router';
import './CreateAccount.css';

const CreateAccount = () => {
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const handleUsernameChange = event => setUsername(event.target.value);
    const handleEmailChange = event => setEmail(event.target.value);
    const handlePasswordChange = event => setPassword(event.target.value);
    const handleConfPasswordChange = event => setConfPassword(event.target.value);

    const submitAccount = async event => {
        event.preventDefault();
        if(username && email && password){
            if(password.length >= 7){
                var res = await createAccount(username, email, password);
                if(res.success){
                    Flash("Check email for activation code", "success");
                    navigate("/login");
                } else Flash(res.message, "danger");
            } else Flash("Password must be at least 7 chars long", "warning");
        } else Flash("Fill in all boxes", "dark");
    }

    return (
        <div id="create-account-parent">
            <form id="create-account-form" onSubmit={submitAccount}>
                <label className="form-label">EMAIL</label>
                <input className="form-control mb-1" type="email"
                    onChange={handleEmailChange} placeholder="johndoe@email.com" />
                <label className="form-label">USERNAME</label>
                <input className="form-control mb-1" type="text"
                    onChange={handleUsernameChange} placeholder="John Doe" />
                <label className="form-label">PASSWORD</label>
                <input className="form-control mb-1" type="password"
                    onClick={handlePasswordChange} placeholder="password123" />
                <label className="form-label">CONFIRM PASSWORD</label>
                <input className="form-control mb-3" type="password"
                    onChange={handleConfPasswordChange} placeholder="password123" />
                <button className="btn btn-dark fw-bold w-100" type="submit">CREATE ACCOUNT</button>
            </form>
        </div>
    )
};

export default CreateAccount;
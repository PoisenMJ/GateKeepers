import { React, useState } from 'react';
import './CreateAccount.css';
import { Form, Button } from 'react-bootstrap';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { createAccount } from '../../controllers/auth';
import { useNavigate } from 'react-router';

const CreateAccount = () => {
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = event => setUsername(event.target.value);
    const handleEmailChange = event => setEmail(event.target.value);
    const handlePasswordChange = event => setPassword(event.target.value);

    const submitAccount = async event => {
        event.preventDefault();
        if(username && email && password){
            var res = await createAccount(username, email, password);
            if(res.success){
                navigate("/login");
            } else Flash(res.message, "danger");
        } else Flash("Fill in all boxes", "dark");
    }

    return (
        <div id="create-account">
            <div className="simple-page-parent">
                <div id="create-account-header">
                    <span className="fs-2">▶ CREATE ACCOUNT ◀</span>
                </div>
                <hr className="mb-4"/>
                <Form onSubmit={submitAccount}>
                    <Form.Control onChange={handleUsernameChange} className="custom-input mb-3" type="text" placeholder="USERNAME" />
                    <Form.Control onChange={handleEmailChange} className="custom-input mb-3" type="email" placeholder="EMAIL" />
                    <Form.Control onChange={handlePasswordChange} className="custom-input mb-3" type="password" placeholder="PASSWORD" />
                    <Form.Group>
                        <Form.Label>SELECT INFLUENCER</Form.Label>
                        <Form.Select className="mb-4 custom-input" aria-label="Select Influencer">
                            <option value="MAKSIE_AKI">MAKSIE_AKI</option>
                            <option value="FLORMARYLANE">FLOMARYLANE</option>
                            <option value="LIFEOFADEADGIRL">LIFEOFADEADGIRL</option>
                            <option value="JASHUBOO">JASHUBOO</option>
                            <option value="NONE">NONE</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="secondary" type="submit" className="w-100">
                        Create
                    </Button>
                </Form>
            </div>
        </div>
    )
};

export default CreateAccount;
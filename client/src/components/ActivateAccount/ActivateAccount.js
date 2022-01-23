import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Flash } from '../FlashMessage/FlashMessage';
import { submitActivationToken } from '../../controllers/users';
import "./ActivateAccount.css";

const ActivateAccount = ({ showDialog, hideDialog, username, activationSuccess }) => {
    let navigate = useNavigate();
    const [code, setCode] = useState(null);

    const handleCodeChange = (event) => {
        setCode(event.target.value)
    };

    const checkActivationToken = async event => {
        event.preventDefault();
        var res = await submitActivationToken(code, username);
        if(res.success){
            activationSuccess();
        } else {
            if(res.message) Flash(res.message);
            else Flash ("Error", "danger");
        }
    }

    return (
        <Modal show={showDialog} onHide={hideDialog} centered>
            <Modal.Header closeButton>
                <span className="fs-4">Activation Code</span>
            </Modal.Header>
            <Modal.Body>
                <div id="activate-account-parent">
                    <Form className="text-center" onSubmit={checkActivationToken}>
                        <Form.Control onChange={handleCodeChange} type="text" placeholder="ACTIVATION CODE" className="black-custom-input mb-2"/>
                        <Button type="submit" className="w-100 radius-zero" variant="dark">SUBMIT</Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ActivateAccount;
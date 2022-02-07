import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { sendRecoveryEmail } from '../../controllers/users';
import { Flash } from '../FlashMessage/FlashMessage';

const PasswordRecoveryBox = ({showPasswordRecovery, hidePasswordRecovery}) => {
    const [email, setEmail] = useState('');
    const handleEmailUpdate = event => setEmail(event.target.value);

    const sendPasswordRecovery = async event => {
        event.preventDefault();
        var res = await sendRecoveryEmail(email);
        if(res.success) Flash("Check email for link", "dark");
        else Flash("failed", "danger");
        hidePasswordRecovery();
    }

    return (
        <Modal show={showPasswordRecovery} onHide={hidePasswordRecovery}>
            <Modal.Header closeButton>
                <span className="fs-4">Password recovery</span>
            </Modal.Header>
            <Modal.Body>
                <div id="password-recovery-box">
                    <Form onSubmit={sendPasswordRecovery}>
                        <Form.Control onChange={handleEmailUpdate} type="text" placeholder="Enter account email..." className="black-custom-input mb-2"/>
                        <Button type="submit" className='w-100' variant="dark">SEND</Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PasswordRecoveryBox;
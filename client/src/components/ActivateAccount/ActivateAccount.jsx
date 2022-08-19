/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import PropTypes from 'prop-types';
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { Flash } from "../FlashMessage/FlashMessage";
import { submitActivationToken } from "../../controllers/users";
import styles from "./ActivateAccount.module.css";

function ActivateAccount({
  username,
  activationSuccess,
  show,
  handleClose
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const handleCodeChange = (event) => {
    setCode(event.target.value.toUpperCase());
  };

  const checkActivationToken = async (event) => {
    event.preventDefault();
    const res = await submitActivationToken(code, username);
    if (res.success) {
      activationSuccess();
    } else if (res.message) setError(res.message);
      else Flash("Error", "danger");
  };

  const inputClass = error ? "is-invalid" : "";

  return (
    <Modal
    show={show}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
  >
      <Modal.Header closeButton>
        <Modal.Title>Activation Code</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.mainBody}>
        <Form className='text-center' onSubmit={checkActivationToken}>
          <FormControl autoFocus type="text" placeholder='ACTIVATION CODE' className={inputClass} onChange={handleCodeChange} value={code}/>
          {error &&
            <div className="invalid-feedback my-0 text-left mb-2">{error}</div>
          }
          <Button type="submit" variant="dark" className='w-100'>Submit</Button> 
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ActivateAccount;

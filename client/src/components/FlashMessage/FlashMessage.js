import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import Event from '../../utils/events';
import "./FlashMessage.css";

const styles = {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    zIndex: 100,
    padding: '0 1rem 0 1rem',
    textAlign: 'center'
}

const FlashMessage = () => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');

    useEffect(() => {
        let isMounted = true;
        Event.addListener('flash', ({message_, variant_}) => {
            if(isMounted){
                setShow(true);
                setMessage(message_);
                setVariant(variant_);
                // set timeout for when to hide message
                setTimeout(() => {
                    setShow(false);
                }, 4000)
            }
        })
        return () => { isMounted = false };
    }, []);

    const handleClose = () => {
        setShow(false);
    }

    return(
        <div style={styles} className="custom-flash-message">
            {show && 
                <Alert variant={variant} onClose={handleClose} dismissible>
                    {message}
                </Alert>
            }
        </div>
    );
}

const Flash = (message_, variant_) => {
    Event.emit('flash', ({message_, variant_}));
}

export default FlashMessage;
export { Flash };
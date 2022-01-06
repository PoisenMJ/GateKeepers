import { React, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import Event from '../../utils/events';

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


    return(
        <div style={styles}>
            {show && 
                <Alert variant={variant}>
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
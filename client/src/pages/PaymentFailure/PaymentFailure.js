import React from 'react';
import { useNavigate } from 'react-router';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailure = () => {
    let navigate = useNavigate();
    return (
        <div id="payment-failure" style={{height: '70vh', display: 'grid', placeItems: 'center', textAlign: 'center'}}>
            <div>
                <span className="fs-1">Payment failed!</span>
                <br/>
                <span
                    style={{fontSize: '.9rem', cursor: 'pointer', color: 'rgb(100,100,100)'}}
                    onClick={() => navigate('/shopping-basket')}
                >Back to cart.</span>
                <br/>
                <FaTimesCircle style={{marginTop: '10px'}} size={50}/>
            </div>
        </div>
    )
}

export default PaymentFailure;
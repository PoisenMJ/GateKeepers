import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSessionData } from '../../controllers/payment';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import './PaymentSuccess.css';
import { CartContext } from '../../services/CartContext';
import { AuthContext } from '../../services/AuthContext';
import { saveOrder, sendConfirmationEmail } from '../../controllers/payment';

const PaymentSuccess = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const [data, setData] = useState(null);
    const { clearCart, products, total, shippingAddress } = useContext(CartContext);
    const { username, loggedIn } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const session_id = params.get('session_id');
        if(session_id){
            const fetchSessionData = async () => { 
                var res = await getSessionData(session_id);
                if(res.success){
                    var d = {}
                    d['name'] = res.name;
                    d['email'] = res.email;
                    setData(d);

                    // if no email use email from stripe payment
                    if(!shippingAddress.email) shippingAddress['email'] = res.email;
                    
                    // set items into [ {uri, name} ]
                    var u = (username) ? username : "Guest";
                    var items = products.map((item, index) => { return { uri: item.uri, name: item.name, size: item.size } });
                    var creators = [...new Set(products.map((item, index) => item.creator))];
                    await saveOrder(res.customerID, res.orderID, items, (total+shippingAddress.shippingPrice), total, u, shippingAddress, creators);
                    await sendConfirmationEmail(res.orderID, res.email, items, (total+shippingAddress.shippingPrice));
                    clearCart();
                } else navigate("/");
            }
            fetchSessionData();
        } else navigate("/");
    }, [])

    const goBackHome = () => {
        navigate('/');
    }

    return (
        <div id="payment-success">
            {data &&
                <div className='text-center'>
                    <span className='fs-2'>Thank you for your order {data.name}!</span>
                    <br/>
                    <span id="payment-success-confirm">Email confirmation sent to {data.email}.</span>
                    <br/>
                    <span
                        style={{fontSize: '.9rem', cursor: 'pointer', color: 'rgb(100,100,100)'}}
                        onClick={goBackHome}
                    >Back to home.</span>
                    <br/>
                    <FaCheckCircle onClick={goBackHome} size={50} style={{marginTop: '10px'}}/>
                </div>
            }
        </div>
    )
}

export default PaymentSuccess;
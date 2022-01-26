import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getOrders, markOrderSent } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import { Accordion, Button } from 'react-bootstrap';
import "./Orders.css";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const CreatorsOrders = () => {
    let navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { username, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            var res = await getOrders(username, token);
            if(res.success){
                setOrders(res.orders);
            } else {
                navigate('/creators/upload');
            }
        }
        fetchOrders();
    }, []);

    const sendMarkOrderSent = async (orderID, index) => {
        var res = await markOrderSent(orderID, username, token);
        console.log(res);
        if(res.success){
            var a = orders;
            a[index].sent = true;
            // need to clear before reset otherwise doesnt recognise update as object is shallow copy
            setOrders([]);
            setOrders(a);
        } else {
            console.log('failed');
        }
    }

    return (
        <div id="creator-orders">
            <Accordion defaultActiveKey={0}>
                {orders && orders.length > 0 ? orders.map((order, index) => {
                    var items = order.items.map((item, i) => item.name)
                    var date = new Date(order.date);
                    var formattedDate = MONTHS[date.getMonth()] +' '+ date.getDate();
                    var dots = (items.length > 1) ? '...' : '';
                    var sent = (order.sent) ? "SENT" : "NOT SENT";
                    return (
                        <Accordion.Item className="custom-accordion-item" key={order.id} eventKey={index}>
                            <Accordion.Button className="custom-accordion-button">
                                <div className="order-accordion-header">
                                    <span>{items[0]+dots}</span>
                                    <span>{formattedDate}</span>
                                    <span>{sent}</span>
                                </div>
                            </Accordion.Button>
                            <Accordion.Body className="custom-accordion-body">
                                <div className="order-address">
                                    <span>COUNTRY: <span className="gray-text">{order.address.country}</span></span>
                                    <span>STATE: <span className="gray-text">{order.address.state}</span></span>
                                    <span>ZIPCODE: <span className="gray-text">{order.address.zipcode}</span></span>
                                    <span>ADDR: <span className='gray-text'>{order.address.streetAddress}</span></span>
                                </div>
                                <div className="order-details">
                                    <div>
                                        <span>TOTAL: <span className="gray-text">£{order.total}</span></span><br/>
                                        <span>USER: <span className="gray-text">{order.user ? order.user : "GUEST"}</span></span>
                                    </div>
                                    <Button onClick={() => sendMarkOrderSent(order.id, index)}
                                        className="order-mark-sent"
                                        size='sm'
                                        variant="light">Mark Sent</Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                }) : 
                    <div className='w-100 text-center' style={{display: 'grid', placeContent: 'center', height: '80vh'}}>
                        <span className='fs-1'>No Orders</span>
                        <br/>
                        <span className='text-muted'>Check again later.</span>
                    </div>
                }
            </Accordion>
        </div>
    )
}

export default CreatorsOrders;
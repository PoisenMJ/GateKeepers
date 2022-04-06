import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getOrders, markOrderSent } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import { Accordion, Button } from 'react-bootstrap';
import { Desktop, Mobile } from '../../../components/Query';
import "./Orders.css";
import { FaCheck, FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const CreatorsOrders = () => {
    let navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const { username, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            var res = await getOrders(username, token);
            if(res.success){
                // come in fifo
                setOrders(res.orders.reverse());
            } else {
                navigate('/creators/upload');
            }
        }
        fetchOrders();
    }, []);

    const sendMarkOrderSent = async (orderID, index) => {
        var res = await markOrderSent(orderID, username, token);
        if(res.success){
            var a = orders;
            a[index].sent = true;
            // need to clear before reset otherwise doesnt recognise update as object is shallow copy
            setOrders([]);
            setOrders(a);
        } else {
            // console.log('failed');
        }
    }

    return (
        <div id="admin-orders-parent">
            <input className="form-control-lg w-100 mb-2" type="text" placeholder="Search orders"/>
            <div className="accordion" role="tablist" id="accordion-1">
                {orders && orders.length > 0 ? orders.map((order, index) => {
                    var items = order.items.map((item, i) => item.name)
                    var date = new Date(order.date);
                    var formattedDate = MONTHS[date.getMonth()] +' '+ date.getDate();
                    var year = date.getFullYear();
                    var dots = (items.length > 1) ? '...' : '';
                    var sent = (order.sent) ? "SENT" : "NOT SENT";
                    return (
                        <div className="accordion-item custom-black-accordion" key={index}>
                            <h2 className="accordion-header" role="tab">
                                <button className="accordion-button fw-bold" data-bs-toggle="collapse" 
                                            data-bs-target={"#accordion-1 .item-"+index} type="button" 
                                            aria-controls={"accordion-1 .item-"+index}>{formattedDate} - £{order.total}
                                    {order.sent ?
                                        <FaCheck className="fs-4 text-success icon-3"/>:
                                        <FaTimes className="fs-4 text-danger icon-3"/>
                                    }
                                </button>
                            </h2>
                            <div className={"accordion-collapse collapse item-"+index} role="tabpanel" data-bs-parent="#accordion-1">
                                <div className="accordion-body d-flex">
                                    <div className="order-address d-flex flex-column">
                                        <span>COUNTRY: <span className="text-muted">{order.address.country}</span></span>
                                        <span>STATE: <span className="text-muted">{order.address.state}</span></span>
                                        <span>ZIPCODE: <span className="text-muted">{order.address.zipcode}</span></span>
                                        <span>ADDR: <span className='text-muted'>{order.address.streetAddress}</span></span>
                                        <br/>
                                        <span>DATE: <span className='text-muted'>{year+' '+formattedDate}</span></span>
                                        <hr/>
                                        {order.items.map((item, i2) => (
                                            <div key={3+i2}>
                                                <span>{item.name} </span>
                                                <span className="text-muted">({item.size})</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-details" style={{marginLeft: 'auto'}}>
                                        <div>
                                            <span>FIRST NAME: <span className="text-muted">{order.address.firstName}</span></span><br/>
                                            <span>LAST NAME: <span className="text-muted">{order.address.lastName}</span></span><br/>
                                            <span>EMAIL: <span className="text-muted">{order.address.email}</span></span><br/>
                                            <span>TOTAL: <span className="text-muted">£{order.total}</span></span><br/>
                                            <span>USER: <span className="text-muted">{order.user ? order.user : "GUEST"}</span></span>
                                        </div>
                                        <Button onClick={() => sendMarkOrderSent(order.id, index)}
                                            className="order-mark-sent mt-1"
                                            size='sm'
                                            variant="light">Mark Sent</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }):
                    <span>No Orders</span>
                }
            </div>
        </div>
        // <div id="creator-orders">
        //     <Accordion defaultActiveKey={0}>
        //         {orders && orders.length > 0 ? orders.map((order, index) => {
        //             var items = order.items.map((item, i) => item.name)
        //             var date = new Date(order.date);
        //             var formattedDate = MONTHS[date.getMonth()] +' '+ date.getDate();
        //             var year = date.getFullYear();
        //             var dots = (items.length > 1) ? '...' : '';
        //             var sent = (order.sent) ? "SENT" : "NOT SENT";
        //             return (
        //                 <Accordion.Item className="custom-accordion-item" key={order.id} eventKey={index}>
        //                     <Accordion.Button className="custom-accordion-button">
        //                         <div className="order-accordion-header">
        //                             <span>{items[0]+dots}</span>
        //                             <span>{formattedDate}</span>
        //                             <span>{order.sent ? <FaCheckCircle style={{marginRight: '5px', marginBottom: '5px'}}/> : <FaTimesCircle style={{marginRight: '5px', marginBottom: '5px'}}/>}{sent}</span>
        //                         </div>
        //                     </Accordion.Button>
        //                     <Accordion.Body className="custom-accordion-body">
        //                         <Mobile>
        //                             <div className="order-address">
        //                                 <span>COUNTRY: <span className="text-muted">{order.address.country}</span></span>
        //                                 <span>STATE: <span className="text-muted">{order.address.state}</span></span>
        //                                 <span>ZIPCODE: <span className="text-muted">{order.address.zipcode}</span></span>
        //                                 <span>ADDR: <span className='text-muted'>{order.address.streetAddress}</span></span>
        //                                 <br/>
        //                                 <span>DATE: <span className='text-muted'>{year+' '+formattedDate}</span></span>
        //                                 <hr/>
        //                                 {order.items.map((item, i2) => (
        //                                     <div>
        //                                         <span>{item.name} </span>
        //                                         <span className="text-muted">({item.size})</span>
        //                                     </div>
        //                                 ))}
        //                             </div>
        //                             <div className="order-details">
        //                                 <div>
        //                                     <span>FIRST NAME: <span className="text-muted">{order.address.firstName}</span></span><br/>
        //                                     <span>LAST NAME: <span className="text-muted">{order.address.lastName}</span></span><br/>
        //                                     <span>EMAIL: <span className="text-muted">{order.address.email}</span></span><br/>
        //                                     <span>TOTAL: <span className="text-muted">£{order.total}</span></span><br/>
        //                                     <span>USER: <span className="text-muted">{order.user ? order.user : "GUEST"}</span></span>
        //                                 </div>
        //                                 <Button onClick={() => sendMarkOrderSent(order.id, index)}
        //                                     className="order-mark-sent mt-1"
        //                                     size='sm'
        //                                     variant="light">Mark Sent</Button>
        //                             </div>
        //                         </Mobile>
        //                         <Desktop>
        //                             <div className="order-address">
        //                                 <span>COUNTRY: <span className="text-muted">{order.address.country}</span></span>
        //                                 <span>STATE: <span className="text-muted">{order.address.state}</span></span>
        //                                 <span>ZIPCODE: <span className="text-muted">{order.address.zipcode}</span></span>
        //                                 <span>ADDR: <span className='text-muted'>{order.address.streetAddress}</span></span>
        //                             </div>
        //                             <div className="order-user">
        //                                     <span>FIRST NAME: <span className="text-muted">{order.address.firstName}</span></span><br/>
        //                                     <span>LAST NAME: <span className="text-muted">{order.address.lastName}</span></span><br/>
        //                                     <span>EMAIL: <span className="text-muted">{order.address.email}</span></span><br/>
        //                             </div>
        //                             <div className="order-products">
        //                                 <h4>PRODUCTS:</h4>
        //                                 {order.items.map((item, i2) => (
        //                                     <div>
        //                                         <span>{item.name} </span>
        //                                         <span className="text-muted">({item.size})</span>
        //                                     </div>
        //                                 ))}
        //                             </div>
        //                             <div className="order-details">
        //                                 <div>
        //                                     <span>USER: <span className="text-muted">{order.user ? order.user : "GUEST"}</span></span><br/>
        //                                     <span>TOTAL: <span className="text-muted">£{order.total}</span></span>
        //                                 </div>
        //                                 <Button onClick={() => sendMarkOrderSent(order.id, index)}
        //                                     className="order-mark-sent mt-1"
        //                                     size='sm'
        //                                     variant="light">Mark Sent</Button>
        //                             </div>
        //                         </Desktop>
        //                     </Accordion.Body>
        //                 </Accordion.Item>
        //             )
        //         }) : 
        //             <div className='w-100 text-center' style={{display: 'grid', placeContent: 'center', height: '80vh'}}>
        //                 <span className='fs-1'>No Orders</span>
        //                 <br/>
        //                 <span className='text-muted'>Check again later.</span>
        //             </div>
        //         }
        //     </Accordion>
        // </div>
    )
}

export default CreatorsOrders;
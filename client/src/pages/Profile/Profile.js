import React, { useEffect, useState, useContext } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getProfile, sendPasswordChangeEmail } from '../../controllers/users';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { AuthContext } from '../../services/AuthContext';
import './Profile.css';

const Profile = () => {
    let navigate = useNavigate();

    const { token, username } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({});
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            var response = await getProfile(username, token);
            if(response.success){
                setProfileData(response.profile);
                setOrders(response.orders);
            }
            else navigate("/login");
        }
        fetchData();

    }, [])

    const sendUpdatePassword = async () => {
        var res = await sendPasswordChangeEmail(username, token);
        if(res.success) Flash("Check email for update link", "success");
        else Flash("Password failed to update", "dark");
    }

    return (
        <div id="profile-parent">
            <form id="profile-form">
                <label className="form-label">EMAIL</label>
                <input className="form-control mb-1" type="text" readOnly defaultValue={profileData?profileData.email:'email'}/>
                <label className="form-label">USERNAME</label>
                <input className="form-control mb-3" type="text" readOnly defaultValue={profileData?profileData.username:'username'}/>
                <button className="btn btn-dark fw-bold w-100 mb-4" type="button" onClick={sendUpdatePassword}>UPDATE PASSWORD</button>
                <label className="form-label">ORDERS</label>
                <div id="profile-orders-parent">
                    <div className="accordion" role="tablist" id="accordion-1">
                        {orders && orders.length > 0 ? orders.map((order, index) => (
                            <div key={index} className="accordion-item custom-black-accordion">
                                <h2 className="accordion-header" role="tab">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#accordion-1 .item-"+index} aria-expanded="true">{order.items.length} {order.items.length === 1?'Item':'Items'} - £{order.total} - {order.date}</button>
                                </h2>
                                <div className={"accordion-collapse collapse show item-"+index} role="tabpanel" data-bs-parent="#accordion-1">
                                    <div className="accordion-body d-flex flex-column">
                                        {order.items.map((item, i2) => (
                                            <span key={i2}>{item}<span className="text-muted"> {order.sizes[i2]}</span></span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )):
                            <span>No Orders</span>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
};

export default Profile;
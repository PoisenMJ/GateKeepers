import React, { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
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
        <div id="profile">
            <div className="simple-page-parent">
                <div style={{width: '100%', textAlign: 'center'}}>
                    <span className="fs-3">◑ PROFILE ◐</span>
                </div>
                <hr className="mb-4"/>
                <span>INFO</span>
                <Form.Control className="custom-input mb-2" type="text" disabled defaultValue={profileData ? profileData.username : 'username'}/>
                <Form.Control className="custom-input mb-2" type="text" disabled defaultValue={profileData ? profileData.email : 'email'}/>
                <br />
                <Button onClick={sendUpdatePassword} className="w-100 mb-3" variant="dark" type="submit">UPDATE PASSWORD</Button>
                <span>ORDERS</span>
                <div id="profile-page-order-history">
                    {orders && orders.length > 0 ? orders.map((order, index) => {
                        var hr = (index < orders.length-1) ? <hr style={{margin: '2px 30px 2px 30px'}}/> : "";
                        return (
                            <div>
                                <div key={index} className="profile-page-order">
                                    <span className="order-names">{order.items.join(', ')}</span>
                                    <span className="text-muted">{order.date}</span>
                                    <span>${order.total}</span>
                                </div>
                                {hr}
                            </div>
                        )
                    }) : 
                        <div className="p-2 text-center">
                            <span>No Orders</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
};

export default Profile;
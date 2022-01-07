import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getProfile, updatePassword } from '../../controllers/users';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import './Profile.css';

const Profile = () => {
    let navigate = useNavigate();

    const [profileData, setProfileData] = useState({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = event => setPassword(event.target.value);
    const handleConfirmPasswordChange = event => setConfirmPassword(event.target.value);

    useEffect(() => {
        const fetchData = async () => {
            var response = await getProfile();
            if(response.success) setProfileData(response.user);
            else navigate("/login");
        }
        fetchData();
    }, [])

    const sendUpdatePassword = async event => {
        event.preventDefault();
        if(password !== confirmPassword) Flash("Passwords don't match", "dark");
        else {
            var res = await updatePassword(password);
            if(res.success) Flash("Password updated", "success");
            else Flash("Password failed to update", "dark");
        }
    }

    return (
        <div id="profile">
            <div className="simple-page-parent">
                <div style={{width: '100%', textAlign: 'center'}}>
                    <span className="fs-3">◑ PROFILE ◐</span>
                </div>
                <hr className="mb-4"/>
                <Form onSubmit={sendUpdatePassword}>
                    <Form.Control className="custom-input mb-2" type="text" disabled value={profileData ? profileData.username : 'username'}/>
                    <Form.Control className="custom-input mb-2" type="text" disabled value={profileData ? profileData.email : 'email'}/>
                    <br />
                    <Form.Text className="mb-1">Update Password</Form.Text>
                    <Form.Control className="custom-input mb-2" onChange={handlePasswordChange} type="password" placeholder="New Password"/>
                    <Form.Control className="custom-input mb-2" onChange={handleConfirmPasswordChange} type="password" placeholder="Confirm Password"/>
                    <Button className="w-100" variant="secondary" type="submit">UPDATE</Button>
                </Form>
            </div>
        </div>
    )
};

export default Profile;
import React, { useContext, useEffect, useState } from 'react';
import { getGatekeeper, updateGatekeeper } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import { Button, CloseButton, Col, Form, InputGroup, Row } from 'react-bootstrap';
import './CreatorProfile.css';
import { FaInstagram, FaTiktok, FaTwitch, FaTwitter } from 'react-icons/fa';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { useNavigate } from 'react-router';
import { ShippingCountries } from '../../../services/Shipping';

const CreatorProfile = () => {
    let navigate = useNavigate();
    const { username, token } = useContext(AuthContext);

    const [twitter, setTwitter] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [instagram, setInstagram] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [accentColor, setAccentColor] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const [customsOn, setCustomsOn] = useState(true);

    const [dataFetched, setDataFetched] = useState(false);
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [shippingDetails, setShippingDetails] = useState({});


    useEffect(() => {
        const fetch = async () => {
            var data = await getGatekeeper(username, token);
            if(data.success){
                setTwitter(data.user.links.twitter);
                setTiktok(data.user.links.tiktok);
                setInstagram(data.user.links.instagram);
                setImage(data.user.image);
                setName(data.user.name);
                setEmail(data.user.email);
                setShippingDetails(data.user.shippingDetails);
                setAccentColor(data.user.accent);
                setDataFetched(true);
                setPaymentLink(data.user.paymentLink);
                setCustomsOn(data.user.customsOn);
            }
            else {
                navigate('/login');
            }
        }
        fetch();
    }, [])

    const handleInputChange = event => {
        switch(event.target.name){
            case "twitterLink":
                setTwitter(event.target.value);
                break;
            case "tiktokLink":
                setTiktok(event.target.value);
                break;
            case "instagramLink":
                setInstagram(event.target.value);
                break;
            case "name":
                setName(event.target.value);
                break;
            case "email":
                setEmail(event.target.value);
                break;
            case "password":
                setPassword(event.target.value);
                break;
            case "confPassword":
                setConfPassword(event.target.value);
                break;
            case "accent":
                setAccentColor(event.target.value);
                break;
            case "paymentLink":
                setPaymentLink(event.target.value);
                break;
            case "customsOn":
                setCustomsOn(event.target.checked);
                break;
        }
    }

    const updateCreatorProfile = async event => {
        event.preventDefault();

        var formData = new FormData();
        formData.append('instagramLink', instagram);
        formData.append('twitterLink', twitter);
        formData.append('tiktokLink', tiktok);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('creatorImage', (typeof image === 'src') ? '' : image);
        formData.append('shippingDetails', JSON.stringify(shippingDetails));
        formData.append('username', username);
        formData.append('token', token);
        formData.append('accent', accentColor);
        formData.append('paymentLink', paymentLink);
        formData.append('customsOn', customsOn);

        if(customsOn && !paymentLink){
            return Flash("Must Have Payment Link For Customs to Be On", "dark");
        }
        if(password && confPassword){
            if(password !== confPassword) return Flash("Password Don't Match", "dark");
            else if(password.length < 8) return Flash("Password must be 8 chars long", "dark");
            else {
                formData.append('password', password);
            }
        }
        if(email){
            var res = await updateGatekeeper(formData, username);
            if(res.success) Flash("Successfully updated", "dark");
            else Flash("Update Failed", "danger");
        } else Flash("Email empty", "danger");
    }

    const addCountry = () => {
        var b = {...shippingDetails, 'new-country': true};
        setShippingDetails(b);
    }
    const removeCountry = (event, country) => {
        var a = {...shippingDetails};
        console.log(country)
        delete a[country];
        setShippingDetails(a);
    }
    const updateCountry = (event, country) => {
        var a = {...shippingDetails};
        if(event.target.value !== 'new-country'){
            a[event.target.value.toString()] = a[country];
            delete a[country];
        }
        setShippingDetails(a);
    }
    const updatePrice = (event, country) => {
        var a = {...shippingDetails};
        a[country] = parseFloat(event.target.value);
        setShippingDetails(a);
    }

    const openImageUpload = event => {
        var imageInput = document.getElementById("creator-profile-image-upload");
        imageInput.click();
        imageInput.onchange = function(event){
            var newFile = new File([event.target.files[0]], event.target.files[0].name, {
                type: event.target.files[0].type
            });
            setImage(newFile);
        }
    }

    return (
        <div id="admin-profile-parent">
            <form onSubmit={updateCreatorProfile}>
                <input type="file" className="visually-hidden" id="creator-profile-image-upload"/>
                <div id="admin-profile-image-parent" className="mb-2" onClick={openImageUpload}>
                    <img id="admin-profile-image" src={typeof image === 'string' ? `/images/${image}` : URL.createObjectURL(image)}/>
                    <span id="admin-profile-image-text">CLICK TO CHANGE</span>
                </div>
                <div id="admin-profile-shipping-parent" className="mb-2">
                    <label className="form-label">SHIPPING</label>
                    {shippingDetails && Object.entries(shippingDetails).map((country, index) => {
                        return (
                            <div className="admin-profile-shipping mb-1" key={index}>
                                <select className="me-1" onChange={(e) => updateCountry(e, country[0])} defaultValue={country[0]}>
                                    {ShippingCountries.map((country2, index2) => (
                                        <option value={country2} key={index2+1}>{country2}</option>
                                    ))}
                                </select>
                                <input onChange={(e) => updatePrice(e, country[0])}
                                        defaultValue={country[1]}
                                        type="number" className="me-1"
                                        required min="0" step="0.01"
                                        placeholder="0.00"/>
                                <button onClick={(e) => removeCountry(e, country[0])} className="btn btn-dark" type="button">DELETE</button>
                            </div>
                    )})}
                    <button onClick={addCountry} className="btn btn-secondary w-100 mb-1" type="button">ADD COUNTRY</button>
                </div>
                <label className="form-label">SOCIALS</label>
                <div className="input-group mb-1">
                    <span className="input-group-text"><FaInstagram/></span>
                    <input onChange={handleInputChange} name="instagramLink"
                            className="form-control" type="text"
                            placeholder='instagram' defaultValue={instagram}/>
                </div>
                <div className="input-group mb-1">
                    <span className="input-group-text"><FaTiktok/></span>
                    <input onChange={handleInputChange} name="tiktokLink"
                            className="form-control" type="text"
                            placeholder="tiktok" defaultValue={tiktok}/>
                </div>
                <div className="input-group mb-2">
                    <span className="input-group-text"><FaTwitter/></span>
                    <input onChange={handleInputChange} name="twitterLink"
                            className="form-control" type="text"
                            placeholder="twitter" defaultValue={twitter}/>
                </div>
                <div className="d-flex flex-column mb-1" id="admin-profile-password-parent">
                    <label className="form-label">PASSWORD</label>
                    <input onChange={handleInputChange} name="password"
                            type="password" className="form-control mb-1"
                            placeholder="NEW PASSWORD"/>
                    <input onChange={handleInputChange} name="confPassword"
                            type="password" className="form-control mb-1"
                            placeholder="CONFIRM PASSWORD"/>
                </div>
                <div className="d-flex flex-column" id="admin-profile-info-parent">
                    <label className="form-label">INFO</label>
                    <input onChange={handleInputChange} type="text"
                            className="form-control mb-2" value={email}
                            name="email" placeholder="email@gmail.com"/>    
                </div>
                <div className="d-flex flex-column">
                    <label className="form-label">PAYMENT LINK (CUSTOMS)</label>
                    <input onChange={handleInputChange} type="text"
                            className="form-control mb-2" value={paymentLink}
                            name="paymentLink" placeholder="https://www.paypal.com/username"/>
                </div>
                <div className="mb-3 form-check">
                    <label className="form-check-label" htmlFor="customsOn">CUSTOMS ON</label>
                    <input type="checkbox" className="form-check-input" onChange={handleInputChange}
                        id="customsOn" checked={customsOn} name="customsOn"/>
                </div>
                <button className="btn btn-success btn-lg w-100" type="submit">UPDATE</button>
            </form>
        </div>
    )
}

export default CreatorProfile;
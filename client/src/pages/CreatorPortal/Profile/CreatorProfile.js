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

    const [twitch, setTwitch] = useState('');
    const [twitter, setTwitter] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [instagram, setInstagram] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [accentColor, setAccentColor] = useState('');

    const [dataFetched, setDataFetched] = useState(false);
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [shippingDetails, setShippingDetails] = useState({});


    useEffect(() => {
        const fetch = async () => {
            var data = await getGatekeeper(username, token);
            if(data.success){
                setTwitch(data.user.links.twitch);
                setTwitter(data.user.links.twitter);
                setTiktok(data.user.links.tiktok);
                setInstagram(data.user.links.instagram);
                setImage(data.user.image);
                setName(data.user.name);
                setEmail(data.user.email);
                setShippingDetails(data.user.shippingDetails);
                setAccentColor(data.user.accent);
                setDataFetched(true);
            }
            else {
                navigate('/login');
            }
        }
        fetch();
    }, [])

    const handleInputChange = event => {
        switch(event.target.name){
            case "twitchLink":
                setTwitch(event.target.value);
                break;
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
        }
    }

    const updateCreatorProfile = async event => {
        event.preventDefault();

        var formData = new FormData();
        formData.append('instagramLink', instagram);
        formData.append('twitterLink', twitter);
        formData.append('twitchLink', twitch);
        formData.append('tiktokLink', tiktok);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('creatorImage', (typeof image === 'src') ? '' : image);
        formData.append('shippingDetails', JSON.stringify(shippingDetails));
        formData.append('username', username);
        formData.append('token', token);
        formData.append('accent', accentColor);

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
        <div id="creator-profile">
            <div className="w-100 text-center">
                <span className="fs-3">▶ GATEKEEPER PROFILE ◀</span>
                <hr className="mb-3"/>
            </div>
            {dataFetched &&
                <Form onSubmit={updateCreatorProfile}>
                    <div className='mb-3' id="shipping-countries">
                        <span>SHIPPING</span>
                        {shippingDetails && Object.entries(shippingDetails).map((country, index) => {
                            return (
                                <Row className="g-1 mb-1" key={index}>
                                    <Col className="col-8">
                                        <Form.Select onChange={(e) => updateCountry(e, country[0])} defaultValue={country[0]} className="custom-input">
                                            {ShippingCountries.map((country2, index2) => (
                                                <option value={country2} key={index2}>{country2}</option>
                                            ))}
                                        </Form.Select></Col>
                                    <Col>
                                        <InputGroup>
                                            <InputGroup.Text className="custom-input">£</InputGroup.Text>
                                            <Form.Control step={.1} type="number" onChange={(e) => updatePrice(e, country[0])} defaultValue={country[1]} className="custom-input"/>
                                        </InputGroup>
                                    </Col>
                                    <CloseButton style={{placeSelf: 'center'}} onClick={(e) => removeCountry(e, country[0])}/>
                                </Row>
                            )
                        })}
                        <Button onClick={addCountry} className="w-100" variant="success">Add Country</Button>
                    </div>
                    <div className='mb-2' id="creator-image">
                        <span>IMAGE <span className='text-muted'>(GIF)</span></span>
                        <div id="creator-image-src-parent" className='mt-1' onClick={openImageUpload}>
                            <img id="creator-image-src" src={typeof image === 'string' ? `/images/${image}` : URL.createObjectURL(image)}/>
                            <div id="creator-image-src-overlay">Click to change</div>
                        </div>
                        <Form.Control accept='image/gif' className='visually-hidden' type='file' id='creator-profile-image-upload'/>
                    </div>
                    <div className='mb-2'>
                        <span>ACCENT</span>
                        <Form.Control value={accentColor} name="accent" onChange={handleInputChange} type="color" className='w-100'/>
                    </div>
                    <div id="creator-profile-socials" className="mb-3">
                        <span>SOCIALS</span>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="instagram" className="custom-input"><FaInstagram/></InputGroup.Text>
                            <Form.Control
                                placeholder="instagram link"
                                aria-label="instagram link"
                                aria-describedby='instagram'
                                className="custom-input"
                                name="instagramLink"
                                value={instagram}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="tiktok" className="custom-input"><FaTiktok/></InputGroup.Text>
                            <Form.Control
                                placeholder="tiktok link"
                                aria-label="tiktok link"
                                aria-describedby='tiktok'
                                className="custom-input"
                                name="tiktokLink"
                                value={tiktok}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="twitter" className="custom-input"><FaTwitter/></InputGroup.Text>
                            <Form.Control
                                placeholder="twitter link"
                                aria-label="twitter link"
                                aria-describedby='twitter'
                                className="custom-input"
                                name="twitterLink"
                                value={twitter}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-1">
                            <InputGroup.Text id="twitch" className="custom-input"><FaTwitch/></InputGroup.Text>
                            <Form.Control
                                placeholder="twitch link"
                                aria-label="twitch link"
                                aria-describedby='twitch'
                                className="custom-input"
                                name="twitchLink"
                                value={twitch}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                    </div>
                    <div id="creator-profile-password" className="mb-3">
                        <span>PASSWORD</span>
                        <Form.Control className="custom-input mb-1" type="password" placeholder="password" name="password" value={password} onChange={handleInputChange}/>
                        <Form.Control className="custom-input" type="password" placeholder="confirm password" name="confPassword" value={confPassword} onChange={handleInputChange}/>
                    </div>
                    <div id="creator-profile-personal-info" className="mb-2">
                        <span>INFO</span>
                        <Form.Control className="custom-input mb-1" value={name} onChange={handleInputChange} type="text" name="name" placeholder="name"/>
                        <Form.Control className="custom-input mb-1" value={email} onChange={handleInputChange} type="email" name="email" placeholder="email"/>
                    </div>
                    <Button className="w-100" variant="dark" type="submit">UPDATE</Button>
                </Form>
            }
        </div>
    )
}

export default CreatorProfile;
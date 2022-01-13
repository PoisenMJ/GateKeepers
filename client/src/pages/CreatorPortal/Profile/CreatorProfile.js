import React, { useContext, useEffect, useState } from 'react';
import { getGatekeeper, updateGatekeeper } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import './CreatorProfile.css';
import { FaInstagram, FaTiktok, FaTwitch, FaTwitter } from 'react-icons/fa';
import { Flash } from '../../../components/FlashMessage/FlashMessage';

const CreatorProfile = () => {
    const { username, token } = useContext(AuthContext);

    const [twitch, setTwitch] = useState('');
    const [twitter, setTwitter] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [instagram, setInstagram] = useState('');
    const [name, setName] = useState('');
    const [dataFetched, setDataFetched] = useState(false);
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    useEffect(() => {
        const fetch = async () => {
            var data = await getGatekeeper(username, token);
            if(data.success){
                setTwitch(data.user.links.twitch);
                setTwitter(data.user.links.twitter);
                setTiktok(data.user.links.tiktok);
                setInstagram(data.user.links.instagram);
                setName(data.user.name);
                setDataFetched(true);
            }
            else {
                // TODO: NAVIGATE IF FAILED
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
            case "password":
                setPassword(event.target.value);
                break;
            case "confPassword":
                setConfPassword(event.target.value);
                break;
        }
    }

    const updateCreatorProfile = async event => {
        event.preventDefault();

        var data = {
            instagramLink: instagram,
            twitterLink: twitter,
            twitchLink: twitch,
            tiktokLink: tiktok,
            name: name,
            username,
            token
        };

        if(password && confPassword){
            if(password !== confPassword) return Flash("Password Don't Match", "dark");
            else if(password.length < 8) return Flash("Password must be 8 chars long", "dark");
            else {
                data['password'] = password;
            }
        }
        var res = await updateGatekeeper(data, username);
        if(res.success) Flash("Successfully updated", "dark");
        else Flash("Update Failed", "danger");
    }

    return (
        <div id="creator-profile">
            <div className="w-100 text-center">
                <span className="fs-3">▶ GATEKEEPER PROFILE ◀</span>
                <hr className="mb-3"/>
            </div>
            {dataFetched &&
                <Form onSubmit={updateCreatorProfile}>
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
                    </div>
                    <Button className="w-100" variant="dark" type="submit">UPDATE</Button>
                </Form>
            }
        </div>
    )
}

export default CreatorProfile;
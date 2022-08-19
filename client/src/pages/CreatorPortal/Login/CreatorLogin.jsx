import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FaInstagram } from 'react-icons/fa';
import styled from 'styled-components';
import { Button, FormControl } from 'react-bootstrap';
import { login } from '../../../controllers/creators';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { AuthContext } from '../../../services/AuthContext';
import { APP_ID, APP_REDIRECT } from '../../../config';
import PageTemplate from '../../../components/PageTemplate';
import Divider from '../../../components/Divider';
import { checkCreatorTokenExists, setCreatorToken } from '../../../services/auth';

const Parent = styled.div`
    position: absolute;
    top: 0;
    margin: auto;
    height: 100vh;
    width: 100vw!important;
    display: grid;
    @media (max-width: 700px) {
        width: 100%!important;
    }
`;

const Form = styled.form`
    width: 40vw;
    margin: auto;
    text-align: center;
    background-color: rgb(220,220,220);
    padding: 25px;
    border-radius: .25rem;
    @media (min-width: 1400px) {
        width: 30vw!important;
    }
`;

const InstagramButton = styled.a`
  background: linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  background: -webkit-linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  background: -moz-linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  background: -o-linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  -webkit-appearance: none;
  border: none;
  padding: 6px;
`;

function CreatorLogin() {
    const navigate = useNavigate();
    const [username, _setUsername] = useState('');
    const [password, _setPassword] = useState('');

    const { onSignIn } = useContext(AuthContext);

    useEffect(() => {
        if(checkCreatorTokenExists()) navigate("/creators/upload");
    }, [])

    const sendLogin = async event => {
        event.preventDefault();
        const response = await login(username, password);
        if(response.success){
            onSignIn(response);
            setCreatorToken('true');
            navigate("/creators/upload");
            // Event.emit('loggedIn');
        } else Flash("Incorrect username or password", "danger");
    }

    return (
        <PageTemplate>
            <Parent className="p-4">
                <Form onSubmit={sendLogin}>
                    <span className="fs-3 fw-bold">LOGIN</span>
                    <FormControl onChange={event => _setUsername(event.target.value)}
                            className="mb-1 mt-4 fw-bold" type="text" placeholder="USERNAME"/>
                    <FormControl onChange={event => _setPassword(event.target.value)}
                            className="mb-2 fw-bold" type="password" placeholder="PASSWORD"/>
                    <Button variant="dark" className="fw-bold w-100 mb-3" type="submit">LOGIN</Button>
                    <Divider text="Social" color="rgb(150,150,150)" thickness="1px"/>
                    <InstagramButton href={`https://api.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${APP_REDIRECT}&scope=user_profile&response_type=code&state=creator`}
                        className="btn text-light fw-bold pb-2 w-100 mt-1 mb-3"
                        type="button">Sign In
                        <FaInstagram className='icon-3'/>
                    </InstagramButton>
                    <span>If you would like to be a gatekeeper email: <strong>maksie.aki@gmail.com</strong></span>
                </Form>
            </Parent>
        </PageTemplate>
    )
}

export default CreatorLogin;
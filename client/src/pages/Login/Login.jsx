/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import { login } from "../../controllers/auth";
// import { getActivationToken } from "../../controllers/users";
import { Flash } from "../../components/FlashMessage/FlashMessage";
import { AuthContext } from "../../services/AuthContext";
import Event from "../../utils/events";
import ActivateAccount from "../../components/ActivateAccount/ActivateAccount";
import PasswordRecoveryBox from "../../components/PasswordRecoveryBox/PasswordRecoveryBox";
import { CartContext } from "../../services/CartContext";
import { APP_ID, APP_REDIRECT } from "../../config";
import PageTemplate from "../../components/PageTemplate";
import Divider from "../../components/Divider";

const Parent = styled.div`
  height: 80vh;
  width: 100vw;
  display: grid;
  align-items: center;
  padding: 20px;
  @media (min-width: 992px) {
    width: 48vw;
    margin: auto;
  }
  @media (min-width: 1200px) {
    width: 31vw;
  }
`;

const LoginForm = styled.form`
  padding: 25px 25px;
  background-color: rgb(230, 230, 230);
  border-radius: 5px;
`;

const InstagramButton = styled.a`
  background: linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  background: -webkit-linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  background: -moz-linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  background: -o-linear-gradient(to right, rgba(64, 93, 230, 1) 0%, rgba(88, 81, 219, 1) 20%, rgba(131, 58, 180, 1) 40%, rgba(193, 53, 132, 1) 60%, rgba(225, 48, 108, 1) 80%, rgba(253, 29, 29, 1) 100%);
  -webkit-appearance: none;
  border: none;
  padding: 6px;
`

function Login() {
  const { onSignIn, token } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  const [inputUsername, setInputUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => setInputUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const [showActivationBox, setShowActivationBox] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);

  const openPasswordRecovery = () => setShowPasswordRecovery(true);

  const activationCodeSuccess = async () => {
    setShowActivationBox(false);
    Flash("Account activated.", "success");
    navigate("/login");
  };

  useEffect(() => {
    if (token) navigate("/");
  }, []);

  const sendLogin = async (event) => {
    event.preventDefault();
    if (inputUsername && password) {
      const res = await login(inputUsername, password);
      if (res.success) {
        const signInResult = onSignIn(res);
        if(signInResult){
          clearCart();
          navigate("/", { state: "logged-in" });
          Event.emit("loggedIn");
        } else Flash("Error signing in", "danger");
      } else if (res.message === "activate account") {
        setShowActivationBox(true);
        // getActivationToken(inputUsername);
      } else Flash(res.message, "danger");
    } else Flash("Enter Username & Password", "dark");
  };

  return (
    <PageTemplate>
      <Parent>
        <PasswordRecoveryBox
          show={showPasswordRecovery}
          handleClose={() => setShowPasswordRecovery(false)}
        />
        <ActivateAccount
          username={inputUsername}
          activationSuccess={activationCodeSuccess}
          show={showActivationBox}
          handleClose={() => setShowActivationBox(false)}
        />

        <LoginForm onSubmit={sendLogin}>
          <Form.Control
            onChange={handleUsernameChange}
            className="mb-1 mt-3 fw-bold"
            type="text"
            id="username"
            placeholder="USERNAME"
            required=""
            name="username"
            inputMode="katakana"
          />
          <Form.Control
            onChange={handlePasswordChange}
            className="mb-2 fw-bold"
            type="password"
            id="password"
            placeholder="PASSWORD"
          />
          <Button variant="dark" className="fw-bold w-100 mb-3" type="submit">
            LOGIN
          </Button>
          <Divider text="Social" thickness="1px" color="rgb(130,130,130)"/>
          <InstagramButton
            href={`https://api.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${APP_REDIRECT}&scope=user_profile&response_type=code`}
            className="text-light btn fw-bold pb-2 w-100"
            type="button"
          >
            Sign In
            <FaInstagram className="icon-3" />
          </InstagramButton>
          <hr className="my-4" />
          <span className="text-muted">
            Don&rsquo;t have an account?
            <Link to="/create-account">
              <span  className="ps-1 text-primary pointer">CREATE ONE</span>
            </Link>
          </span>
          <br />
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            type="button"
            role="button"
            tabIndex={0}
            className="text-danger no-text-decoration font-3"
            aria-label='Close'
            onClick={openPasswordRecovery}
          >
            Forgot Password
          </a>
        </LoginForm>
      </Parent>
    </PageTemplate>
  );
}

export default Login;

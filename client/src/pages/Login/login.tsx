import React, { useState } from "react";
import styled from "styled-components";
import colors from "../../util/colors";
import { IoChevronBack, IoEllipse, IoLogoInstagram } from "react-icons/io5";
import TextInput from "../../components/TextInput";
import { useNavigate } from "react-router";
import SlideIn from "../../animations/slideIn";
import { animated } from "react-spring";
import Container from "../../components/Container";
import { LG, MD } from "../../util/breakpoints";

const BackButton = styled.div`
  position: absolute;
  top: 5%;
  left: 5%;
  cursor: pointer;

  svg {
    transition: 0.15s;
  }

  &:hover {
    svg {
      scale: 1.15;
    }
  }
`;

const FormWrapper = styled(animated.form)`
  margin: auto;
  width: 30%;
  background-color: ${colors.almostWhite};
  padding: 2rem;
  border-radius: 0.35rem;
  box-shadow: rgba(125, 125, 125, 0.16) 0px 3px 6px,
    rgba(125, 125, 125, 0.23) 0px 3px 6px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${LG}) {
    width: 50%;
  }

  @media screen and (max-width: ${MD}) {
    width: 75%;
  }
`;

const FormText = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const LoginButton = styled.button`
  font-weight: 600;
  font-size: 1.25rem;
  background-color: ${colors.darkGrey};
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.35rem;
  width: 100%;
  margin-top: 0.5rem;
  transition: 0.25s;

  &:hover {
    background-color: ${colors.darkerGrey};
  }
`;

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const InstagramButton = styled.button`
  background: linear-gradient(
    45deg,
    #405de6,
    #5851db,
    #833ab4,
    #c13584,
    #e1306c,
    #fd1d1d
  );
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 1rem;
  color: ${colors.almostWhite};
  border-radius: 0.35rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const CreateAccount = styled.button`
  color: ${colors.blue};
  cursor: pointer;
  font-weight: 600;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (newUsername: string) => setUsername(newUsername);
  const onChangePassword = (newPassword: string) => setPassword(newPassword);

  const navigate = useNavigate();

  const goBack = () => navigate("/home");
  const goToSignup = () => navigate("/sign-up");

  return (
    <Container className="flex">
      <BackButton onClick={goBack}>
        <IoChevronBack size={50} />
      </BackButton>
      <FormWrapper style={SlideIn({ direction: "bottom", delay: 0 })}>
        <FormText className="mb-3">Login</FormText>
        <TextInput
          placeholder="USERNAME"
          onChange={onChangeUsername}
          value={username}
          width={"100%"}
          className="mb-1"
        />
        <TextInput
          placeholder="PASSWORD"
          onChange={onChangePassword}
          value={password}
          width={"100%"}
        />
        <LoginButton>LOGIN</LoginButton>
        <Divider>
          <IoEllipse size={15} className="mx-1" />
          <IoEllipse size={15} className="mx-1" />
          <IoEllipse size={15} className="mx-1" />
        </Divider>
        <InstagramButton>
          <IoLogoInstagram className="mx-1" size={20} /> Instagram
        </InstagramButton>
        <span>
          Don't have an account?{" "}
          <CreateAccount onClick={goToSignup}>Create one.</CreateAccount>
        </span>
      </FormWrapper>
    </Container>
  );
};

export default Login;

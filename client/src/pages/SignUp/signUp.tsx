import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import { animated } from "react-spring";
import styled from "styled-components";
import SlideIn from "../../animations/slideIn";
import Container from "../../components/Container";
import Divider from "../../components/Divider";
import TextInput from "../../components/TextInput";
import { LG, MD } from "../../util/breakpoints";
import colors from "../../util/colors";

import { createUser } from '../../controllers/user';
import { TriggerFlashMessage } from "../../components/FlashMessage/flashMessage";

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

const FormWrapper = styled(animated.div)`
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
    width: 40%;
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

const SignupButton = styled.button`
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

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (newUsername: string) => setUsername(newUsername);
  const onChangeEmail = (newEmail: string) => setEmail(newEmail);
  const onChangePassword = (newPassword: string) => setPassword(newPassword);

  const navigate = useNavigate();

  const onSubmit = async () => {
    const success = await createUser(username, email, password);
    console.log("Success:", success);
    if(success) {
      TriggerFlashMessage({ text: "Account Created" });
      navigate("/login"); 
    }
  }

  const goBack = () => navigate("/login");

  return (
    <Container className="flex">
      <BackButton onClick={goBack}>
        <IoChevronBack size={50} />
      </BackButton>
      <FormWrapper style={SlideIn({ direction: "bottom", delay: 0 })}>
        <FormText className="mb-3">Sign Up</FormText>
        <TextInput
          placeholder="USERNAME"
          onChange={onChangeUsername}
          value={username}
          width={"100%"}
          className="mb-1"
        />
        <TextInput
          placeholder="EMAIL"
          onChange={onChangeEmail}
          value={email}
          width={"100%"}
          className="mb-1"
        />
        <TextInput
          placeholder="PASSWORD"
          onChange={onChangePassword}
          value={password}
          width={"100%"}
          type="password"
        />
        <SignupButton onClick={onSubmit}>SIGN-UP</SignupButton>
        <Divider />
      </FormWrapper>
    </Container>
  );
};

export default SignUp;

import React, { useState } from "react";
import { IoSave } from "react-icons/io5";
import styled from "styled-components";
import Container from "../../components/Container";
import Divider from "../../components/Divider";
import { HomeNavbar } from "../../components/Navbars";
import TextInput from "../../components/TextInput";
import colors from "../../util/colors";

const Wrapper = styled.div`
  width: 50%;
`;

const StyledButton = styled.button<{ color?: string }>`
  background-color: ${props => props.color ? props.color : colors.green};
  border-radius: 0.35rem;
  padding: 0.5rem 1rem;
`;

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <Container className="flex flex-row justify-between">
      <div className="w-full h-full flex">
        <Wrapper className="flex flex-col m-auto">
          <TextInput value="test_username" disabled={true} className="mb-1" />
          <TextInput
            value="email@provider.com"
            disabled={true}
            className="mb-1"
          />
          <div className="flex flex-row w-full mb-2">
            <TextInput
              value={firstName}
              onChange={setFirstName}
              placeholder="First Name"
              className="mr-1"
              width={"50%"}
            />
            <TextInput
              value={lastName}
              onChange={setLastName}
              placeholder="Last Name"
              width={"50%"}
            />
          </div>
          <StyledButton className="font-bold text-2xl flex flex-row items-center justify-center">
            SAVE
            <IoSave size={25} className="ml-2"/>
          </StyledButton>
          <Divider className="mt-5"/>
          <StyledButton className="font-bold text-md" color={colors.blue}>CHANGE PASSWORD</StyledButton>
        </Wrapper>
      </div>
      <HomeNavbar />
    </Container>
  );
};

export default Profile;

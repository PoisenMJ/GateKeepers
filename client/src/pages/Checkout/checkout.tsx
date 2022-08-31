import React, { useState } from "react";
import styled from "styled-components";
import Container from "../../components/Container";
import Divider from "../../components/Divider";
import Select from "../../components/Select";
import TextInput from "../../components/TextInput";
import colors from "../../util/colors";

const FormWrapper = styled.div`
  width: 60%;
  height: 100%;
`;

const Form = styled.div`
  width: 70%;
  height: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Total = styled.span``;
const Price = styled.span`
  background-color: ${colors.darkestGrey};
  border-radius: .3rem;
  padding: 0.5rem 1.25rem;
  color: ${colors.almostWhite};
  font-weight: 600;
  font-size: 1.25rem;
`;

const Buy = styled.button`
  background-color: ${colors.green};
  padding: 0.5rem 1.25rem;
  border-radius: 0.3rem;
`;

const Checkout = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [addressLine, setAddressLine] = useState("");
  const [cityOrState, setCityOrState] = useState("");
  const [zipCode, setZipCode] = useState("");

  return (
    <Container>
      <FormWrapper className="m-auto flex flex-col">
        <Form>
          <div className="flex flex-row mb-1">
            <TextInput
              placeholder="First name"
              value={firstName}
              onChange={setFirstName}
              width={"50%"}
            />
            <TextInput
              placeholder="Last name"
              value={lastName}
              onChange={setLastName}
              width={"50%"}
              className="ml-1"
            />
          </div>
          <TextInput
            placeholder="Adress line 1"
            value={addressLine}
            onChange={setAddressLine}
            className="mb-1"
          />
          <div className="flex flex-row mb-1">
            <TextInput
              placeholder="City/State"
              value={cityOrState}
              onChange={setCityOrState}
              width={"60%"}
            />
            <TextInput
              placeholder="Zipcode"
              value={zipCode}
              onChange={setZipCode}
              width={"40%"}
              className="ml-1"
            />
          </div>
          <Select options={['United Kingdom']} className="w-full mb-2"/>
          <Divider/>
          <div className="flex flex-row justify-between items-center">
            <Total className="font-bold text-3xl">Total:</Total>
            <Price>$10.00</Price>
          </div>
          <div className="flex flex-row items-center">
            <span className="font-bold text-lg">Sub total:</span>
            <span className="font-light text-lg ml-3"> $9.00</span>
          </div>
          <div className="flex flex-row items-center">
            <span className="font-bold text-lg">Shipping:</span>
            <span className="font-light text-lg ml-3"> $1.00</span>
          </div>
          <Buy className="text-3xl font-bold mt-3">BUY</Buy>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default Checkout;

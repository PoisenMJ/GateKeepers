import React, { ChangeEvent } from "react";
import styled, { CSSProperties } from "styled-components";
import colors from "../../util/colors";

interface Props {
  placeholder?: string;
  onChange?: (newValue: string) => void;
  value: string;
  width?: CSSProperties["width"];
  className?: string;
  disabled?: boolean;
}

const InputElement = styled.input<{ width: CSSProperties["width"] }>`
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
  background-color: ${colors.darkestGrey};
  color: ${colors.almostWhite};
  font-weight: 600;
  transition: 0.25s;
  width: ${(props) => props.width};

  &:focus {
    box-shadow: 0 0 4px 2px rgb(100, 100, 100);
    border: "3px solid black!important";
    outline: none !important;
  }

  &:disabled {
    color: ${colors.lighterGrey};
  }
`;

const TextInput = ({
  placeholder,
  onChange,
  value,
  width,
  className,
  disabled,
}: Props) => {
  const onInputValChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <InputElement
      type="text"
      placeholder={placeholder}
      onChange={onInputValChange}
      value={value}
      width={width ?? "auto"}
      className={className}
      disabled={disabled}
    />
  );
};

export default TextInput;

import React from 'react';
import styled from 'styled-components';
import colors from '../../util/colors';

const SelectElement = styled.select`
  padding: .5rem 1rem;
  background-color: ${colors.darkestGrey};
  color: ${colors.almostWhite};
  font-weight: 600;
  border-radius: .25rem;

  display: block;
`;

interface Props {
  options: string[];
  className?: string;
};

const Select = ({ options, className }: Props) => {
  return (
    <SelectElement className={className}>
      {options.map(option => (
        <option value={option}>{option}</option>
      ))}
    </SelectElement>
  )
};

export default Select;
import React from 'react';
import styled from 'styled-components';
import colors from '../../util/colors';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ContainerEl = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.lightBgColor};
`;

const Container = ({ children, className }: Props) => (
  <ContainerEl className={`flex flex-col sm:flex-row overflow-y-hidden ${className}`}>
    {children}
  </ContainerEl>
);

export default Container;
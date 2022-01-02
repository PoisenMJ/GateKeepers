import React from 'react';
import MediaQuery from 'react-responsive';

const Mobile = ({ children }) => (
    <MediaQuery maxWidth={1224}>
        {children}
    </MediaQuery>
)

export default Mobile;
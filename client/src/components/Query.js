import React from 'react';
import MediaQuery from 'react-responsive';

const Mobile = ({ children }) => (
    <MediaQuery maxWidth={1224}>
        {children}
    </MediaQuery>
)

const Desktop = ({ children }) => (
    <MediaQuery minWidth={1224}>
        {children}
    </MediaQuery>
)

export { Mobile, Desktop };
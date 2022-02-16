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

const CartMobileBreakpoint = ({ children }) => (
    <MediaQuery maxWidth={600}>
        {children}
    </MediaQuery>
)

const CartDesktopBreakpoint = ({ children }) => (
    <MediaQuery minWidth={600}>
        {children}
    </MediaQuery>
)

export { Mobile, Desktop,
    CartDesktopBreakpoint, CartMobileBreakpoint};
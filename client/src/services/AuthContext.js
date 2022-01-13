import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
    token: null,
    setToken: (data) => { },
    username: null,
    setUsername: (data) => { },
    loggedIn: null,
    setLoggedIn: (data) => { }
});

const AuthProvider = ({ children }) => { 
    const localLoggedIn  = JSON.parse(localStorage.getItem('auth')) || false;
    const localToken = localStorage.getItem('token') || null;
    const localUsername = localStorage.getItem('username') || '';

    const [token, setToken] = useState(localToken);
    const [username, setUsername] = useState(localUsername);
    const [loggedIn, setLoggedIn] = useState(localLoggedIn);

    useEffect(() => {
        localStorage.setItem('auth', loggedIn);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
    }, [token, username, loggedIn]);

    return (
        <AuthContext.Provider value={{
            loggedIn: loggedIn,
            token: token,
            username: username,
            setLoggedIn: setLoggedIn,
            setToken: setToken,
            setUsername: setUsername
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router';
import { LogOut } from './auth';

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

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch(err) {
        return null;
    }
}

const AuthVerify = (props) => {
    const {username, token, loggedIn,
            setUsername, setToken, setLoggedIn} = useContext(AuthContext);
    var location = useLocation();


    // if just USERNAME FOR ACTIVATOIN TODO::
    useEffect(() => {
        if(username && token && loggedIn){
            const decodedJwt = parseJwt(token);
            if(decodedJwt.exp * 1000 < Date.now()) {
                setUsername(null);
                setToken(null);
                setLoggedIn(false);
                LogOut();
            } else {
                console.log('valid');
            }
        } else {
            setUsername(null);
            setToken(null);
            setLoggedIn(false);
            LogOut();
        }
    }, [location])

    return <div></div>
}

export { AuthProvider, AuthContext, AuthVerify };
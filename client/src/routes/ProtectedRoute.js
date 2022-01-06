import { React, useEffect, useState } from 'react';
import { checkToken } from '../services/auth';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const [auth, setAuth] = useState(false);
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    useEffect(() => {
        checkToken().then(result => {
            if(result){
                setAuth(true);
            }
        }).then(() => {
            setIsTokenValidated(true);
        })

    }, []);

    if(!isTokenValidated) return <div>Loading</div>
    return (
        (auth) ? <Outlet/> : <Navigate to="/login"/>
    )
};

export default ProtectedRoute;
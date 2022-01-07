import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router-dom';
import { checkCreatorToken } from '../services/auth';

const CreatorRoute = () => {
    const [isCreator, setIsCreator] = useState(false);
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    useEffect(() => {
        checkCreatorToken().then(result => {
            if(result){
                setIsCreator(true);
            }
        }).then(() => {
            setIsTokenValidated(true);
        })
    }, []);

    if(!isTokenValidated) return <div>Loading</div>
    return (
        (isCreator) ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default CreatorRoute;
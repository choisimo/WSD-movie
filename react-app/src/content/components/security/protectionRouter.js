import React from 'react';
import {Navigate} from 'react-router-dom';

const ProtectionRouter = ({ prop }) => {
    const isAuthenticated = localStorage.getItem('TMDb-key') != null;

    if (!isAuthenticated) {

    }

    return prop;
};

export default ProtectionRouter;
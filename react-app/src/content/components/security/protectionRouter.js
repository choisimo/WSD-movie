import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './projectionRouter.css';

const ProtectionRouter = ({ prop }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('TMDb-Key') != null);
    const [showWarn, setShowWarn] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setShowWarn(true);
            setTimeout(() => {
                setShowWarn(false);
                setRedirect(true);
            }, 3000);
        }
    }, [isAuthenticated]);

    if (redirect) {
        return <Navigate to="/user/signin" />;
    }

    return (
        <>
            {showWarn && (
                <div className="warning-message">
                    <div className="spinner"></div>
                    로그인이 필요한 페이지 입니다.
                </div>
            )}
            {isAuthenticated && prop}
        </>
    );
};

export default ProtectionRouter;

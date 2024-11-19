import React from 'react';
import loadingStyle from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    return (
        <div className={loadingStyle.loadingSpinner}>
            <div className={loadingStyle.spinner}></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;

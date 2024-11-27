import React, { useState, createContext, useContext } from 'react';
import style from './customAlert.module.css'; // CSS 모듈

const AlertContext = createContext();

export const useAlert = () => {
    return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ message: '', type: '' });

    const showAlert = (message, type = 'error') => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: '', type: '' }), 3000); // 3초 후 알림 숨김
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert.message && (
                <div
                    className={`${style.customAlert} ${
                        alert.type === 'success' ? style.success : style.error
                    }`}
                    aria-live="assertive"
                >
                    {alert.message}
                </div>
            )}
        </AlertContext.Provider>
    );
};

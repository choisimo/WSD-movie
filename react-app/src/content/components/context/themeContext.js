// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // 초기 테마 설정: 로컬스토리지에서 가져오거나 기본값 설정
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        // 테마 변경 시 HTML에 적용
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // 로컬스토리지에 저장
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

import React, { createContext, useContext, useRef } from 'react';

const ScrollContext = createContext();

export const ScrollPositionProvider = ({ children }) => {
    const positions = useRef({});

    const saveScrollPosition = (path) => {
        positions.current[path] = {
            x: window.scrollX,
            y: window.scrollY,
        };
    };

    const getScrollPosition = (path) => {
        return positions.current[path] || { x: 0, y: 0 };
    };

    return (
        <ScrollContext.Provider value={{ saveScrollPosition, getScrollPosition }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScrollPosition = () => useContext(ScrollContext);

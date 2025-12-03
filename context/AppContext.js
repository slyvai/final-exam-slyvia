import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('appTheme');
        return storedTheme ? storedTheme : 'light';
    }
    return 'light';
});

const [selectedCategories, setSelectedCategories] = useState('');

const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
        localStorage.setItem('appTheme', newTheme);
    }
};

const value = {
    theme,
    setTheme, 
    selectedCategories,
    setSelectedCategories,
};


return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
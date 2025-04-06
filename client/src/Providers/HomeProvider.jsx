import { createContext, useContext, useState } from 'react';

const context = createContext();

export const HomeProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('new');
    return (
        <context.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </context.Provider>
    );
};

export const useHomeContext = () => useContext(context);

import { createContext, useContext, useState } from 'react';

const context = createContext();

export const HomeProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('new');

    const [projects, setProjects] = useState(
        (() => {
            const localProjects = localStorage.getItem('projects');
            return localProjects ? JSON.parse(localProjects) : [];
        })()
    ); // {title, roomId, createdAt}[]

    function addProject(title, roomId, createdAt) {
        let alreadyExists = false;
        projects.forEach(({ roomId: rid }) => {
            if (roomId === rid) {
                alreadyExists = true;
                return;
            }
        });
        if (alreadyExists) return;
        setProjects((p) => {
            const newProjects = [...p, { title, roomId, createdAt }];
            localStorage.setItem('projects', JSON.stringify(newProjects));
            return newProjects;
        });
    }

    return (
        <context.Provider
            value={{ activeTab, setActiveTab, projects, addProject }}
        >
            {children}
        </context.Provider>
    );
};

export const UseHome = () => useContext(context);

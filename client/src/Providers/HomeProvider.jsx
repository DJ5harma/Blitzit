import { createContext, useContext, useState } from 'react';
import { NewProject } from '../Components/Home/RightSection/NewProject';
import { UserProfile } from '../Components/Home/RightSection/UserProfile';
import { YourProjects } from '../Components/Home/RightSection/YourProjects';

const context = createContext();

const tabMap = {
    new: <NewProject />,
    projects: <YourProjects />,
    profile: <UserProfile />,
};

export const HomeProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('new');

    const [projects, setProjects] = useState(
        (() => {
            const localProjects = localStorage.getItem('projects');
            return localProjects ? JSON.parse(localProjects) : [];
        })()
    ); // {title, roomId, createdAt}[]

    function addProject({ title, roomId, createdAt, runCommand }) {
        let alreadyExists = false;
        projects.forEach(({ roomId: rid }) => {
            if (roomId === rid) {
                alreadyExists = true;
                return;
            }
        });
        if (alreadyExists) return;
        setProjects((p) => {
            const newProjects = [
                ...p,
                { title, roomId, createdAt, runCommand },
            ];
            localStorage.setItem('projects', JSON.stringify(newProjects));
            return newProjects;
        });
    }

    return (
        <context.Provider
            value={{
                activeTab,
                currTabComponent: tabMap[activeTab],
                tabNames: Object.keys(tabMap),
                setActiveTab,
                projects,
                addProject,
                setProjects,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const UseHome = () => useContext(context);

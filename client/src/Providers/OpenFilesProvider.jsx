import { createContext, useContext, useEffect, useState } from 'react';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openFiles, setOpenFiles] = useState({});
    const addFile = (file) => {
        setOpenFiles((prev) => ({
            ...prev,
            [file.path]: file,
        }));
    };

    useEffect(() => {
        console.log(openFiles);
    }, [openFiles]);

    const deleteFile = (path) => {
        setOpenFiles((prev) => {
            const updated = { ...prev };
            delete updated[path];
            return updated;
        });
    };

    return (
        <context.Provider value={{ openFiles, addFile, deleteFile }}>
            {children}
        </context.Provider>
    );
};

export const useOpenFiles = () => useContext(context);

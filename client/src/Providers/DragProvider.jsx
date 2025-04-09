import { createContext, useContext, useEffect, useState } from 'react';
import { UseFiles } from './FilesProvider';

const context = createContext();

export const DragProvider = ({ children }) => {
    const [draggingFilePath, setDraggingFilePath] = useState(null);

    const { openFile } = UseFiles();

    const initializeDrag = (path) => {
        setDraggingFilePath(path);
    };
    const finalizeDrag = () => {
        if (!draggingFilePath) return;
        const currentPath = draggingFilePath;
        setDraggingFilePath(null); 
        openFile(currentPath); 
    };

    useEffect(() => {
        console.log({ draggingFilePath });
    }, [draggingFilePath]);

    return (
        <context.Provider value={{ initializeDrag, finalizeDrag }}>
            {children}
        </context.Provider>
    );
};

export const UseDrag = () => useContext(context);

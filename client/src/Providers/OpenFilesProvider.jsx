import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openPaths, setOpenPaths] = useState(new Set());
    const [focusedPath, setFocusedPath] = useState(null);
    const [pathToContent, setPathToContent] = useState({}); // path -> content

    const { skt } = useSocket();

    const saveFile = () => {
        if (!focusedPath || !pathToContent[focusedPath]) return;

        const content = pathToContent[focusedPath];
        content.replaceAll(`"`, `\\"`);
        content.replaceAll('`', '\\`');

        EMITTER.saveFileEmitter(content, focusedPath);

        toast.success(`"${focusedPath}" saved!`);
    };

    const openFile = (filePath) => {
        setOpenPaths((p) => new Set([...p, filePath]));
        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    };

    const closeFile = (path) => {
        setOpenPaths((p) => new Set([...p].filter((pth) => pth !== path)));
        if (focusedPath === path) setFocusedPath(null);
    };

    useEffect(() => {
        skt.on('connectEditorTerminal -o1', ({ data, filePath }) => {
            console.log({ data, filePath });

            setPathToContent((p) => {
                if (p[filePath]) return p;
                return ({ ...p, [filePath]: data });
            });
        });
    }, [skt]);

    return (
        <context.Provider
            value={{
                openPaths,
                pathToContent,
                setPathToContent,
                saveFile,
                openFile,
                closeFile,
                focusedPath,
                setFocusedPath,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const useOpenFiles = () => useContext(context);

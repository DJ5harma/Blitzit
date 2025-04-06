import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openPaths, setOpenPaths] = useState([]);
    const [focusedPath, setFocusedPath] = useState(null);
    const [pathToContent, setPathToContent] = useState({}); // path -> content

    const { skt } = UseSocket();

    const saveFile = () => {
        if (!focusedPath || !pathToContent[focusedPath]) return;

        const content = pathToContent[focusedPath];
        content.replaceAll(`"`, `\\"`);
        content.replaceAll('`', '\\`');

        EMITTER.saveFileEmitter(content, focusedPath);

        toast.success(`"${focusedPath}" saved!`);
    };

    const openFile = (filePath) => {
        setFocusedPath(filePath);
        if (openPaths.includes(filePath)) return;

        setOpenPaths((p) => [...p, filePath]);
        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    };

    const closeFile = (path) => {
        setOpenPaths((p) => {
            const newPaths = p.filter((pth) => pth !== path);
            if (path === focusedPath) {
                const indexOfRemoved = p.indexOf(path);
                if (indexOfRemoved === newPaths.length)
                    setFocusedPath(newPaths[newPaths.length - 1]);
                else
                    setFocusedPath(
                        newPaths.length
                            ? newPaths[indexOfRemoved % newPaths.length]
                            : null
                    );
            }
            return newPaths;
        });
    };

    useEffect(() => {
        skt.on('connectEditorTerminal -o1', ({ data, filePath }) => {
            console.log({ data, filePath });

            setPathToContent((p) => {
                if (p[filePath]) return p;
                return { ...p, [filePath]: data };
            });
        });
        return () => {
            skt.removeListener('connectEditorTerminal -o1');
        };
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

export const UseOpenFiles = () => useContext(context);
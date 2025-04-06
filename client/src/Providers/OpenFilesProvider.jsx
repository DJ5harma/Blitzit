import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openPaths, setOpenPaths] = useState({
        left: new Set(),
        right: new Set()
    });
    const [focusedPaths, setFocusedPaths] = useState({
        left: null,
        right: null,
    });
    const [pathToContent, setPathToContent] = useState({});

    const { skt } = UseSocket();

    const saveFile = (side = 'left') => {
        const filePath = focusedPaths[side];
        if (!filePath || !pathToContent[filePath]) return;

        let content = pathToContent[filePath];
        content = content.replaceAll(`"`, `\\"`).replaceAll('`', '\\`');

        EMITTER.saveFileEmitter(content, filePath);
        toast.success(`"${filePath}" saved!`);
    };

    const openFile = (filePath, side = 'left') => {
        setOpenPaths(prev => ({
            ...prev,
            [side]: new Set([...prev[side], filePath])
        }));
        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    };

    const closeFile = (filePath) => {        
        setOpenPaths(prev => ({
            ...prev,
            ['left']: new Set([...prev['left']].filter(pth => pth !== filePath))
        }));
        setFocusedPaths(prev => ({
            ...prev,
            ['left']: prev['left'] === filePath ? null : prev['left']
        }));
        setOpenPaths(prev => ({
            ...prev,
            ['right']: new Set([...prev['right']].filter(pth => pth !== filePath))
        }));
        setFocusedPaths(prev => ({
            ...prev,
            ['right']: prev['right'] === filePath ? null : prev['right']
        }));
    };

    const getAllOpenPaths = () => {
        return new Set([...openPaths.left, ...openPaths.right]);
    };

    useEffect(() => {
        skt.on('connectEditorTerminal -o1', ({ data, filePath }) => {
            setPathToContent((p) => {
                if (p[filePath]) return p;
                return ({ ...p, [filePath]: data });
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
                getAllOpenPaths,
                pathToContent,
                setPathToContent,
                saveFile,
                openFile,
                closeFile,
                focusedPaths,
                setFocusedPaths,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const UseOpenFiles = () => useContext(context);

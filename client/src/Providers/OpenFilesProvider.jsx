import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openFiles, setOpenFiles] = useState({});
    const { skt } = useSocket();

    const [saveFlag, setSaveFlag] = useState(false);

    const openFile = (file) => {
        console.log({ file });

        setOpenFiles((prev) => ({
            ...prev,
            [file.path]: file,
        }));
        EMITTER.readFile(file.path);
    };

    const closeFile = (path) => {
        setOpenFiles((prev) => {
            const updated = { ...prev };
            delete updated[path];
            return updated;
        });
    };

    useEffect(() => {
        skt.on('connectEditorTerminal -o1', ({ data, filePath }) => {
            setOpenFiles((p) => {
                return {
                    ...p,
                    [filePath]: {
                        ...p[filePath],
                        value: data,
                    },
                };
            });
        });
    }, [skt]);

    return (
        <context.Provider
            value={{ openFiles, openFile, closeFile, saveFlag, setSaveFlag }}
        >
            {children}
        </context.Provider>
    );
};

export const useOpenFiles = () => useContext(context);

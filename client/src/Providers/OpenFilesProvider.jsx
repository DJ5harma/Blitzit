import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openFiles, setOpenFiles] = useState({});
    const { skt } = useSocket();

    const addFile = (file) => {
        console.log({ file });

        setOpenFiles((prev) => ({
            ...prev,
            [file.path]: file,
        }));
        skt.emit('connectEditorTerminal -i1', {
            input: 'cat ' + file.path,
            filePath: file.path,
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

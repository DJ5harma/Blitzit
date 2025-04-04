import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';

const context = createContext();

export const OpenFilesProvider = ({ children }) => {
    const [openFiles, setOpenFiles] = useState({});
    const { skt } = useSocket();

    const [saveFlag, setSaveFlag] = useState(false);

    const [fileName, setFileName] = useState('');

    const file = fileName ? openFiles[fileName] : null;

    const editorContentRef = useRef(file ? file.value : '');

    const saveFile = () => {
        if (!file || !editorContentRef.current) return;

        editorContentRef.current.replaceAll(`"`, `\\"`);
        editorContentRef.current.replaceAll('`', '\\`');
        
        EMITTER.saveFileEmitter(editorContentRef.current,file.path)
        
        toast.success(`"${file.path}" saved!`);
    };

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
            value={{ openFiles, openFile, closeFile, saveFlag, setSaveFlag,fileName,setFileName,saveFile,editorContentRef,file }}
        >
            {children}
        </context.Provider>
    );
};

export const useOpenFiles = () => useContext(context);

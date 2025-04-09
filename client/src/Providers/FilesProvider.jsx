import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';
import { getFileTree } from '../Utils/getFileTree';

const context = createContext();

export const FilesProvider = ({ children }) => {
    const [openPaths, setOpenPaths] = useState([]);
    const [focusedPath, setFocusedPath] = useState(null);
    const [pathToContent, setPathToContent] = useState({}); // path -> content

    const [fileTreeData, setFileTreeData] = useState(null);

    const { skt } = UseSocket();

    const saveFile = () => {
        if (!focusedPath || !pathToContent[focusedPath]) return;

        const content = pathToContent[focusedPath];
        content.replaceAll(`"`, `\\"`);
        content.replaceAll('`', '\\`');

        EMITTER.saveFile(content, focusedPath);

        toast(`"${focusedPath}" is being saved!`);
    };

    useEffect(() => {
        if (!openPaths.includes(focusedPath)) setFocusedPath(null);
    }, [focusedPath, openPaths]);

    const openFile = (filePath) => {
        setFocusedPath(filePath);
        if (openPaths.includes(filePath)) return;

        setOpenPaths((p) => [...p, filePath]);
        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    };

    const closeFile = (path) => {
        if (openPaths.includes(path)) {
            const newOpenPaths = openPaths.filter((pth) => pth !== path);
            setOpenPaths(newOpenPaths);
        }
    };

    const deleteEntity = (isFolder, path) => {
        if (!isFolder) closeFile(path);
        EMITTER.deleteEntity(isFolder, path);
    };

    const renameEntity = (oldPath, newPath, isFolder) => {
        if (!isFolder) {
            setOpenPaths((prev) =>
                prev.map((p) => (p === oldPath ? newPath : p))
            );
            setPathToContent((p) => {
                const cpy = { ...p };
                cpy[newPath] = cpy[oldPath];
                return cpy;
            });
            setTimeout(() => {
                setPathToContent((p) => {
                    const cpy = { ...p };
                    delete cpy[oldPath];
                    return cpy;
                });
                setFocusedPath(newPath);
            }, 500);
        }
        EMITTER.renameEntity(oldPath, newPath);
    };

    useEffect(() => {
        skt.on('FILE_READ_COMPLETE', (output) => {
            try {
                const { data, filePath } = JSON.parse(output);
                setPathToContent((p) => {
                    if (p[filePath]) return p;
                    return { ...p, [filePath]: data };
                });
            } catch ({ message }) {
                console.error(message);
            }
        });

        skt.on('FILE_TREE_DATA', (output) => {
            output = output.substring(output.indexOf('/'));
            console.log({ output });
            setFileTreeData(() => getFileTree(output));
        });

        EMITTER.callForTree();
        return () => {
            skt.removeListener('FILE_READ_COMPLETE');
            skt.removeListener('FILE_TREE_DATA');
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
                deleteEntity,
                renameEntity,
                focusedPath,
                setFocusedPath,
                fileTreeData,
                setFileTreeData,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const UseFiles = () => useContext(context);

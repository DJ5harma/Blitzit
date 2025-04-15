import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';
import { getFileTree } from '../Utils/getFileTree';

const context = createContext();

export const FilesProvider = ({ children }) => {
    const { skt } = UseSocket();
    const [pathToContent, setPathToContent] = useState({}); // path -> content

    const [fileTreeData, setFileTreeData] = useState(null);

    const [editors, setEditors] = useState([
        // { openPaths: [], focusedPath: null },
    ]);
    const [focusedEditorIndex, setFocusedEditorIndex] = useState(0);

    function focusPath(editorIndex, path) {
        setEditors((p) => {
            p[editorIndex].focusedPath = path;
            return [...p];
        });
    }

    function addNewEditor(filePath) {
        setEditors((p) => [
            ...p,
            { openPaths: [filePath], focusedPath: filePath },
        ]);
        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    }

    function closeFile(editorIndex, filePath) {
        setEditors((p) => {
            const { openPaths } = p[editorIndex];
            const newPaths = openPaths.filter((pth) => pth !== filePath);

            p[editorIndex].openPaths = newPaths;

            if (newPaths.length === 0)
                return p.filter((_, eidx) => eidx !== editorIndex);

            return [...p];
        });
    }
    const openFile = (filePath) => {
        if (editors.length === 0) return addNewEditor(filePath);
        setEditors((p) => {
            if (!p[focusedEditorIndex].openPaths.includes(filePath))
                p[focusedEditorIndex].openPaths.push(filePath);
            return [...p];
        });

        focusPath(focusedEditorIndex, filePath);

        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    };

    const saveFile = () => {
        const { focusedPath } = editors[focusedEditorIndex];
        if (!focusedPath || !pathToContent[focusedPath]) return;

        const content = pathToContent[focusedPath];

        EMITTER.saveFile(content, focusedPath);
        toast(`"${focusedPath}" is being saved!`, { autoClose: 800 });
    };

    const deleteEntity = (isFolder, path) => {
        if (!isFolder)
            setEditors((p) => {
                return p.map(({ openPaths, focusedPath }) => {
                    openPaths = openPaths.filter((pth) => pth !== path);
                    if (focusedPath === path)
                        if (openPaths.length === 0) focusedPath = null;
                        else focusedPath = openPaths[0];
                    return {
                        openPaths,
                        focusedPath,
                    };
                });
            });
        EMITTER.deleteEntity(isFolder, path);
    };

    const renameEntity = (oldPath, newPath, isFolder) => {
        if (!isFolder)
            setEditors((p) => {
                p.forEach(({ focusedPath, openPaths }, i) => {
                    if (focusedPath === oldPath) p[i].focusedPath = newPath;
                    for (let j = 0; j < openPaths.length; ++j) {
                        if (oldPath === openPaths[j]) {
                            p[i].openPaths[j] = newPath;
                            break;
                        }
                    }
                });
                return [...p];
            });

        setPathToContent((p) => {
            p[newPath] = p[oldPath];
            return p;
        });
        setTimeout(() => {
            setPathToContent((p) => {
                delete p[oldPath];
                return p;
            });
        }, 500);
        EMITTER.renameEntity(oldPath, newPath);
    };

    useEffect(() => {
        skt.on('FILE_READ_COMPLETE', (output) => {
            const { data, filePath } = JSON.parse(output);
            setPathToContent((p) => {
                if (p[filePath]) return p;
                return { ...p, [filePath]: data };
            });
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
                editors,
                pathToContent,
                fileTreeData,
                setPathToContent,
                saveFile,
                openFile,
                closeFile,
                deleteEntity,
                renameEntity,
                setFileTreeData,
                setEditors,
                setFocusedEditorIndex,
                addNewEditor,
                focusPath,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const UseFiles = () => useContext(context);

import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';
import { toast } from 'react-toastify';
import { getFileTree } from '../Utils/getFileTree';

const context = createContext();

export const FilesProvider = ({ children }) => {
    const [editorStates, setEditorStates] = useState([{
        openPaths: [],
        focusedPath: null,
    }]);
    const [activeEditorIndex, setActiveEditorIndex] = useState(0);
    const [pathToContent, setPathToContent] = useState({}); // path -> content
    const [fileTreeData, setFileTreeData] = useState(null);

    const { skt } = UseSocket();
    const activeEditor = editorStates[activeEditorIndex];

    const saveFile = () => {
        if (
            !activeEditor.focusedPath ||
            !pathToContent[activeEditor.focusedPath]
        )
            return;

        const content = pathToContent[activeEditor.focusedPath];

        EMITTER.saveFile(content, activeEditor.focusedPath);
        toast(`"${activeEditor.focusedPath}" is being saved!`, {
            autoClose: 800,
        });
    };

    const openFile = (filePath, editorIndex = activeEditorIndex) => {
        setEditorStates((prev) =>
            prev.map((state, idx) => {
                if (idx !== editorIndex) return state;

                const newOpenPaths = state.openPaths.includes(filePath)
                    ? state.openPaths
                    : [...state.openPaths, filePath];

                return {
                    ...state,
                    openPaths: newOpenPaths,
                    focusedPath: filePath,
                };
            })
        );
        if (!pathToContent[filePath]) EMITTER.readFile(filePath);
    };

    const closeFile = (path, editorIndex = activeEditorIndex) => {
        setEditorStates((prev) => {
            const updated = prev.map((state, idx) => {
                if (idx !== editorIndex) return state;

                const newOpenPaths = state.openPaths.filter((p) => p !== path);
                const newFocusedPath =
                    state.focusedPath === path
                        ? newOpenPaths[newOpenPaths.length - 1] || null
                        : state.focusedPath;

                return {
                    ...state,
                    openPaths: newOpenPaths,
                    focusedPath: newFocusedPath,
                };
            });

            const currentEditor = updated[editorIndex];
            if (currentEditor.openPaths.length === 0) {
                closeEditor(editorIndex);
            }
            return updated;
        });
    };

    const createNewEditor = (newState) => {
        setEditorStates((prev) => [...prev, newState]);
        setActiveEditorIndex(editorStates.length);
    };

    const closeEditor = (index) => {
        if (editorStates.length <= 0) return;
        setEditorStates((prev) => prev.filter((state, idx) => idx !== index));
        setActiveEditorIndex((prev) => Math.min(prev, editorStates.length - 2));
    };

    const deleteEntity = (isFolder, path) => {
        if (!isFolder) {
            editorStates.forEach((state, idx) => closeFile(path, idx));
        }
        EMITTER.deleteEntity(isFolder, path);
    };

    const renameEntity = (oldPath, newPath, isFolder) => {
        if (!isFolder)
            setEditorStates((prev) =>
                prev.map((state) => ({
                    ...state,
                    openPaths: state.openPaths.map((p) =>
                        p === oldPath ? newPath : p
                    ),
                    focusedPath:
                        state.focusedPath === oldPath
                            ? newPath
                            : state.focusedPath,
                }))
            );

        setPathToContent((prev) => {
            const newContent = { ...prev };
            newContent[newPath] = newContent[oldPath];
            delete newContent[oldPath];
            return newContent;
        });
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
                editorStates,
                setEditorStates,
                activeEditorIndex,
                pathToContent,
                fileTreeData,
                setPathToContent,
                saveFile,
                openFile,
                closeFile,
                createNewEditor,
                closeEditor,
                deleteEntity,
                renameEntity,
                setActiveEditorIndex,
                setFileTreeData,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const UseFiles = () => useContext(context);

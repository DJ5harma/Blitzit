import { useState } from 'react';
import { UseFiles } from '../../../Providers/FilesProvider';
import { NodeDoables } from './NodeDoables';
import { NodeVisuals } from './NodeVisuals';

export const FileTreeNode = ({ name, value, marginLeft, path, deletable,allOpenPaths }) => {
    const { openFile, editorStates , activeEditorIndex , createNewEditor } = UseFiles();
    

    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const isFolder = value !== null;

    const directChildren = isFolder ? Object.keys(value) : [];
    const currentEditor = editorStates[activeEditorIndex] || { focusedPath: null };

    const handleFileOpen = (e, path) => {
        e.stopPropagation();
        if (e.metaKey || e.ctrlKey) {
            createNewEditor({
                openPaths: [path],
                focusedPath: path
            });
        } else {            
            openFile(path, activeEditorIndex);
        }
    };

    return (
        <>
            <div
                className={`flex justify-between items-center pr-2.5 cursor-pointer select-none font-sans 
                    ${
                        currentEditor.focusedPath === path
                            ? 'bg-black'
                            : 'hover:bg-neutral-800 bg-neutral-900'
                    }`}
                style={{
                    paddingLeft: marginLeft,
                }}
                onClick={(e) => {
                    if (isFolder) setIsExpanded((p) => !p);
                    else handleFileOpen(e, path);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <NodeVisuals
                    isEditing={isEditing}
                    isExpanded={isExpanded}
                    isFolder={isFolder}
                    isFolderEmpty={directChildren.length === 0}
                    path={path}
                    setIsEditing={setIsEditing}
                    name={name}
                />
                {isHovered && (
                    <NodeDoables
                        isFolder={isFolder}
                        path={path}
                        deletable={deletable}
                        setIsEditing={setIsEditing}
                        onCreateEditor={() => createNewEditor({
                            openPaths: [path],
                            focusedPath: path
                        })}
                    />
                )}
            </div>
            {isExpanded &&
                directChildren.map((key, i) => {
                    return (
                        <FileTreeNode
                            key={i}
                            path={path + '/' + key}
                            marginLeft={marginLeft + 15}
                            name={key}
                            value={value[key]}
                            deletable={true}
                            allOpenPaths={allOpenPaths}
                        />
                    );
                })}
        </>
    );
};

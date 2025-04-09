import { FaFileUpload, FaFolder, FaFolderPlus } from 'react-icons/fa';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import { UseFiles } from '../../Providers/FilesProvider';
import { IconFromFileName } from '../../Utils/IconFromFileName';
import { EMITTER } from '../../Utils/EMITTER';
import { FaPencil } from 'react-icons/fa6';

export const FileTreeNode = ({ name, value, marginLeft, path, deletable }) => {
    const { openFile, deleteEntity, focusedPath, renameEntity } = UseFiles();

    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);

    const isFolder = value !== null;

    const directChildren = isFolder ? Object.keys(value) : [];

    const saveNameChange = () => {
        const newPath =
            path.substring(0, path.lastIndexOf('/') + 1) + editedName;
        renameEntity(path, newPath, isFolder);
        setIsEditing(false);
    };

    return (
        <>
            <div
                className={
                    'flex justify-between items-center pr-2.5 cursor-pointer select-none font-sans ' +
                    (focusedPath === path
                        ? 'bg-black'
                        : 'hover:bg-neutral-800 bg-neutral-900')
                }
                style={{
                    paddingLeft: marginLeft,
                }}
                onClick={() => {
                    if (isFolder) return setIsExpanded((p) => !p);
                    openFile(path);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span className="flex gap-1.5 items-center p-1">
                    {isFolder ? (
                        <FaFolder color="rgb(220, 220, 120)" />
                    ) : (
                        <IconFromFileName name={name} />
                    )}
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onBlur={saveNameChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveNameChange();
                                }
                            }}
                            className="bg-transparent border-b border-neutral-500 focus:outline-none text-white"
                            autoFocus
                        />
                    ) : (
                        name
                    )}
                    {directChildren.length > 0 && (
                        <MdKeyboardArrowRight
                            size={20}
                            style={{
                                rotate: isExpanded ? '90deg' : '0deg',
                            }}
                        />
                    )}
                </span>
                <div className={`${isHovered ? 'flex' : 'hidden'} gap-1`}>
                    {isFolder && (
                        <>
                            <FaFileUpload
                                onClick={(e) => {
                                    e.stopPropagation();
                                    EMITTER.createEntity(true, path);
                                }}
                                className="button p-0.5"
                                size={26}
                            />
                            <FaFolderPlus
                                onClick={(e) => {
                                    e.stopPropagation();
                                    EMITTER.createEntity(false, path);
                                }}
                                className="button p-0.5"
                                size={26}
                            />
                        </>
                    )}
                    <FaPencil
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className="button p-0.5"
                        size={23}
                    />
                    {deletable && (
                        <MdDelete
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteEntity(isFolder, path);
                            }}
                            className="button p-0.5"
                            size={26}
                        />
                    )}
                </div>
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
                        />
                    );
                })}
        </>
    );
};

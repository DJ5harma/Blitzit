import { useState } from 'react';
import { UseFiles } from '../../../Providers/FilesProvider';
import { FaCircle, FaFolder } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { IconFromFileName } from '../../../Utils/IconFromFileName';

export const NodeVisuals = ({
    isFolder,
    path,
    isEditing,
    setIsEditing,
    isExpanded,
    isFolderEmpty,
    name,
}) => {
    const { renameEntity, filesPendingSave } = UseFiles();
    const [editedName, setEditedName] = useState(name);

    const saveNameChange = () => {
        const newPath =
            path.substring(0, path.lastIndexOf('/') + 1) + editedName;
        renameEntity(path, newPath, isFolder);
        setIsEditing(false);
    };

    return (
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
                    onKeyDown={(e) => e.key === 'Enter' && saveNameChange()}
                    className="bg-transparent border-b border-neutral-500 focus:outline-none text-white"
                    autoFocus
                />
            ) : (
                <div className=' flex'>
                    {name}
                    {filesPendingSave.has(path) && <FaCircle size={10} className=' ml-2 mt-2 text-blue-600'/>}
                </div>
            )}
            {!isFolderEmpty && (
                <MdKeyboardArrowRight
                    size={20}
                    style={{
                        rotate: isExpanded ? '90deg' : '0deg',
                    }}
                    className="relative top-0.5"
                />
            )}
        </span>
    );
};

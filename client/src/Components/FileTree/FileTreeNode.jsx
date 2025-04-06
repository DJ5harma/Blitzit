import { FaFileUpload, FaFolder, FaFolderPlus } from 'react-icons/fa';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import { UseOpenFiles } from '../../Providers/OpenFilesProvider';
import { IconFromFileName } from '../../Utils/IconFromFileName';
import { EMITTER } from '../../Utils/EMITTER';

export const FileTreeNode = ({ name, value, marginLeft, path, deletable }) => {
    const { openFile, closeFile } = UseOpenFiles();

    const [isExpanded, setIsExpanded] = useState(true);

    const isFolder = value !== null;
    const handleFileOpeningDirection = (e) => {
        if (!isFolder) {
            if (e.shiftKey) {
                openFile(path,'right');
            } else {
                openFile(path, 'left'); 
            }
        }
    };

    return (
        <>
            <div
                className="cursor-pointer select-none"
                style={{
                    paddingLeft: marginLeft,
                }}
                onClick={handleFileOpeningDirection}
            >
                <div
                    className="flex justify-between items-center pr-2.5 border-b"
                    onClick={() => isFolder && setIsExpanded((p) => !p)}
                >
                    <span className="flex gap-1.5 items-center p-1.5">
                        {isFolder ? (
                            <FaFolder />
                        ) : (
                            <IconFromFileName name={name} />
                        )}
                        {name}
                        {isFolder && (
                            <MdKeyboardArrowRight
                                size={20}
                                style={{
                                    rotate: isExpanded ? '90deg' : '0deg',
                                }}
                            />
                        )}
                    </span>
                    <div>
                        {isFolder && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        EMITTER.createEntity(true, path);
                                    }}
                                    className="p-1 bg-transparent m-0.5"
                                >
                                    <FaFileUpload size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        EMITTER.createEntity(false, path);
                                    }}
                                    className="p-1 bg-transparent m-0.5"
                                >
                                    <FaFolderPlus />
                                </button>
                            </>
                        )}
                        {deletable && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    EMITTER.deleteEntity(isFolder, path);
                                    closeFile(path);
                                }}
                                className="p-1"
                            >
                                <MdDelete />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isExpanded &&
                value &&
                Object.keys(value).map((key, i) => {
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

import { useSocket } from '../Providers/SocketProvider';
import { FaFileUpload, FaFolder, FaFolderPlus } from 'react-icons/fa';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';
import { getLanguageFromFileName } from '../Utils/getLanguageFromFileName';
import { IconFromFileName } from '../Utils/IconFromFileName';
import { EMITTER } from '../Utils/EMITTER';

export const FileTreeNode = ({ name, value, marginLeft, path, deletable }) => {
    const { skt } = useSocket();
    const { openFile, closeFile } = useOpenFiles();

    const [isDeleted, setIsDeleted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const isFolder = value !== null;

    const handleFileClick = () => {
        openFile(path)
        // if (!openFiles[path]) {
        //     openFile({
        //         path,
        //         name,
        //         language: getLanguageFromFileName(name),
        //         value: '',
        //     });
        // }
    };

    function createEntity(isFile) {
        const entityName = prompt(`Enter ${isFile ? 'file' : 'folder'} name:`);
        if (!entityName) return;

        const fullPath = path + '/' + entityName;

        const command = (isFile ? `echo "Empty file" > ` : 'mkdir ') + fullPath;
        skt.emit('connectFileTreeTerminal -i1', { input: command });
        EMITTER.callForTree();
    }

    return (
        <>
            <div
                className="cursor-pointer select-none"
                style={{
                    paddingLeft: marginLeft,
                }}
                onClick={() => {
                    if (!isFolder) handleFileClick();
                }}
            >
                <div
                    className="flex justify-between items-center pr-2.5 border-b"
                    onClick={() => {
                        if (!isFolder) return;
                        setIsExpanded((p) => !p);
                    }}
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
                                        createEntity(true);
                                    }}
                                    className="p-1 bg-transparent m-0.5"
                                >
                                    <FaFileUpload size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        createEntity(false);
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
                                    closeFile(path);
                                    EMITTER.deleteEntity(isFolder, path);
                                    setIsDeleted(true);
                                }}
                                className="p-1"
                            >
                                <MdDelete />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {!isDeleted &&
                isExpanded &&
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

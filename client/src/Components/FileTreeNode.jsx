import { useSocket } from '../Providers/SocketProvider';
import {
    FaFileContract,
    FaFileUpload,
    FaFolder,
    FaFolderPlus,
    FaICursor,
    FaPlus,
} from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';
import { getLanguageFromFileName } from '../Utils/getLanguageFromFileName';
import { useRoom } from '../Providers/RoomProvider';

export const FileTreeNode = ({ name, value, marginLeft, path, deletable }) => {
    const { skt } = useSocket();
    const { openFiles, openFile, closeFile } = useOpenFiles();

    const [isDeleted, setIsDeleted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { callForTree } = useRoom();

    const isFolder = value !== null;

    function deleteEntity() {
        if (isFolder) {
            skt.emit('connectFileTreeTerminal -i1', { input: 'rm -r ' + path });
        } else {
            skt.emit('connectFileTreeTerminal -i1', { input: 'rm ' + path });
        }
        setIsDeleted(true);
        callForTree();
    }

    const handleFileClick = () => {
        if (!openFiles[path]) {
            openFile({
                path,
                name,
                language: getLanguageFromFileName(name),
                value: '',
            });
        }
    };

    function createEntity(isFile) {
        const entityName = prompt(`Enter ${isFile ? 'file' : 'folder'} name:`);
        if (!entityName) return;

        const fullPath = path + '/' + entityName;

        let command;
        if (isFile) {
            command = 'touch ' + fullPath;
        } else {
            command = 'mkdir ' + fullPath;
        }
        skt.emit('connectFileTreeTerminal -i1', { input: command });
        callForTree();
    }

    return (
        <>
            <div
                style={{
                    paddingLeft: marginLeft,
                    cursor: isHovered ? 'pointer' : 'default',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                    if (!isFolder) {
                        handleFileClick();
                    }
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: 10,
                        borderBottom: 'solid 0.5px',
                    }}
                >
                    <span
                        style={{
                            display: 'flex',
                            gap: 6,
                            alignItems: 'center',
                            padding: 5,
                        }}
                    >
                        {isFolder ? <FaFolder /> : <FaFileAlt />}
                        {name}
                    </span>
                    <div>
                        {isFolder ? (
                            <button
                                onClick={() => createEntity(true)}
                                style={{
                                    padding: '2px 5px',
                                    backgroundColor: 'transparent',
                                    marginTop: '2px',
                                }}
                            >
                                <FaFileUpload />
                            </button>
                        ) : (
                            ''
                        )}
                        {isFolder ? (
                            <button
                                onClick={() => createEntity(false)}
                                style={{
                                    padding: '2px 5px',
                                    backgroundColor: 'transparent',
                                    marginTop: '2px',
                                }}
                            >
                                <FaFolderPlus />
                            </button>
                        ) : (
                            ''
                        )}
                        {deletable && (
                            <button
                                onClick={() => {
                                    closeFile(path);
                                    deleteEntity();
                                }}
                                style={{ padding: '2px 5px' }}
                            >
                                <MdDelete />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {!isDeleted &&
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

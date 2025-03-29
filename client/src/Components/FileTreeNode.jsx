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
import { useRoom } from '../Pages/Room';
import { useState } from 'react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';
import { getLanguageFromFileName } from '../Utils/getLanguageFromFileName';

export const FileTreeNode = ({ name, value, marginLeft, path }) => {
    const { skt } = useSocket();
    const { openFiles, addFile, deleteFile } = useOpenFiles();

    const [isDeleted, setIsDeleted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { callForTree } = useRoom();

    const isFolder = value !== null;

    function deleteEntity() {
        if (isFolder) {
            skt.emit('connectFileTerminal -i1', { input: 'rm -r ' + path });
        } else {
            skt.emit('connectFileTerminal -i1', { input: 'rm ' + path });
        }
        setIsDeleted(true);
        callForTree();
    }

    const handleFileClick = () => {
        if (!openFiles[path]) {
            addFile({
                path,
                name,
                language: getLanguageFromFileName(name),
                value: '// file content',
            });
        }
    };

    function addEntity(isFileAdd) {
        const entityName = prompt(
            `Enter ${isFileAdd ? 'file' : 'folder'} name:`
        );
        if (!entityName) return;

        const fullPath = path + '/' + entityName;

        let command;
        if (isFileAdd) {
            command = 'touch ' + fullPath;
        } else {
            command = 'mkdir ' + fullPath;
        }
        skt.emit('connectFileTerminal -i1', { input: command });
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
                onClick={(e) => {
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
                                onClick={() => addEntity(true)}
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
                                onClick={() => addEntity(false)}
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
                        <button
                            onClick={() => deleteEntity()}
                            style={{ padding: '2px 5px' }}
                        >
                            <MdDelete />
                        </button>
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
                        />
                    );
                })}
        </>
    );
};

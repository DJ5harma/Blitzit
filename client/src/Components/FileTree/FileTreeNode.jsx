import { FaFileUpload, FaFolder, FaFolderPlus } from 'react-icons/fa';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { useState } from 'react';
import { UseFiles } from '../../Providers/FilesProvider';
import { IconFromFileName } from '../../Utils/IconFromFileName';
import { EMITTER } from '../../Utils/EMITTER';

export const FileTreeNode = ({ name, value, marginLeft, path, deletable }) => {
    const { openFile, closeFile, focusedPath, setFocusedPath } = UseFiles();

    const [isExpanded, setIsExpanded] = useState(true);

    const isFolder = value !== null;

    return (
        <>
            <div
                className={
                    'flex justify-between items-center pr-2.5 cursor-pointer select-none ' +
                    (focusedPath === path
                        ? 'bg-black'
                        : 'bg-neutral-800 hover:bg-neutral-900')
                }
                style={{
                    paddingLeft: marginLeft,
                }}
                onClick={() => {
                    if (isFolder) return setIsExpanded((p) => !p);
                    openFile(path);
                    setFocusedPath(path);
                }}
            >
                <span className="flex gap-1.5 items-center p-1">
                    {isFolder ? <FaFolder /> : <IconFromFileName name={name} />}
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
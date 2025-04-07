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

    const directChildren = isFolder ? Object.keys(value) : [];

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
                    setFocusedPath(path);
                }}
            >
                <span className="flex gap-1.5 items-center p-1">
                    {isFolder ? <FaFolder /> : <IconFromFileName name={name} />}
                    {name}
                    {directChildren.length > 0 && (
                        <MdKeyboardArrowRight
                            size={20}
                            style={{
                                rotate: isExpanded ? '90deg' : '0deg',
                            }}
                        />
                    )}
                </span>
                <div className="flex gap-1">
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
                    {deletable && (
                        <MdDelete
                            onClick={(e) => {
                                e.stopPropagation();
                                EMITTER.deleteEntity(isFolder, path);
                                closeFile(path);
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

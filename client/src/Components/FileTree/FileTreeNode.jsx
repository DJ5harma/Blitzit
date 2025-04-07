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
                    {isFolder && (
                        <MdKeyboardArrowRight
                            size={20}
                            style={{
                                rotate: isExpanded ? '90deg' : '0deg',
                            }}
                        />
                    )}
                    {isFolder ? <FaFolder /> : <IconFromFileName name={name} />}
                    {name}
                </span>
                <div className='flex gap-1'>
                    {isFolder && (
                        <>
                            <FaFileUpload
                                onClick={(e) => {
                                    e.stopPropagation();
                                    EMITTER.createEntity(true, path);
                                }}
                                className="button"
                                size={20}
                            />
                            <FaFolderPlus
                                onClick={(e) => {
                                    e.stopPropagation();
                                    EMITTER.createEntity(false, path);
                                }}
                                className="button"
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
                            className="button"
                        />
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

import { IoClose } from 'react-icons/io5';
import { UseOpenFiles } from '../../Providers/OpenFilesProvider';
import { getFileNameFromPath } from '../../Utils/getFileNameFromPath';
import { useState } from 'react';
import { IconFromFileName } from '../../Utils/IconFromFileName';

export const EditorTabs = () => {
    const { openPaths, closeFile, focusedPath, setFocusedPath } =
        UseOpenFiles();

    const [closeButtonPath, setCloseButtonPath] = useState('');

    return (
        <div
            className="flex font-mono"
            style={{ backgroundColor: 'rgb(31, 31, 31)', fontSize: 18 }}
        >
            {openPaths.map((path) => {
                const fileName = getFileNameFromPath(path);
                return (
                    <div
                        key={path}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            if (e.button === 1) {
                                closeFile(path);
                                return;
                            }
                            setFocusedPath(path);
                        }}
                        className="flex items-center gap-1 p-3 pr-2 border border-gray-500 text-white hover:bg-gray-900 cursor-pointer select-none"
                        style={
                            focusedPath === path
                                ? {
                                      backgroundColor: 'black',
                                  }
                                : {}
                        }
                        title={path}
                        onMouseEnter={() => setCloseButtonPath(path)}
                        onMouseLeave={() => setCloseButtonPath('')}
                    >
                        <IconFromFileName name={fileName} />
                        {fileName}
                        <IoClose
                            onClick={(e) => {
                                closeFile(path);
                                e.stopPropagation();
                            }}
                            size={22}
                            opacity={closeButtonPath === path ? '100%' : '0%'}
                            className="relative mx-1 flex items-center cursor-pointer rounded-sm hover:bg-neutral-200 hover:text-black"
                        />
                    </div>
                );
            })}
        </div>
    );
};
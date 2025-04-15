import { IoClose } from 'react-icons/io5';
import { UseFiles } from '../../Providers/FilesProvider';
import { getFileNameFromPath } from '../../Utils/getFileNameFromPath';
import { useState } from 'react';
import { IconFromFileName } from '../../Utils/IconFromFileName';

export const EditorTabs = ({ editorIndex }) => {
    const { closeFile, focusPath, editors } = UseFiles();

    const { openPaths, focusedPath } = editors[editorIndex];

    const [closeButtonPath, setCloseButtonPath] = useState('');

    return (
        <div
            className="flex font-mono button h-[45px]"
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
                                closeFile(editorIndex, path);
                                return;
                            }
                            focusPath(editorIndex, path);
                        }}
                        className="button flex items-center gap-1.5 py-1.5 pl-2.5 pr-1.5 border border-gray-500 text-white hover:bg-gray-900 cursor-pointer select-none"
                        style={
                            focusedPath === path
                                ? {
                                      backgroundColor: 'black',
                                      borderRadius: 0,
                                  }
                                : {
                                      borderRight: '1px solid',
                                      borderRadius: 0,
                                  }
                        }
                        title={path}
                        onMouseEnter={() => setCloseButtonPath(path)}
                        onMouseLeave={() => setCloseButtonPath('')}
                    >
                        <IconFromFileName name={fileName} />
                        {fileName}
                        <IoClose
                            onClick={(e) => {
                                closeFile(editorIndex, path);
                                e.stopPropagation();
                            }}
                            size={20}
                            opacity={closeButtonPath === path ? '100%' : '0%'}
                            className="relative top-0.5 flex items-center cursor-pointer rounded-sm hover:bg-neutral-200 hover:text-black"
                        />
                    </div>
                );
            })}
        </div>
    );
};

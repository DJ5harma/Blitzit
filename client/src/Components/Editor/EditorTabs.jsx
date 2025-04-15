import { IoClose } from 'react-icons/io5';
import { UseFiles } from '../../Providers/FilesProvider';
import { getFileNameFromPath } from '../../Utils/getFileNameFromPath';
import { useState } from 'react';
import { IconFromFileName } from '../../Utils/IconFromFileName';

export const EditorTabs = ({ editorIndex }) => {
    const { 
        editorStates, 
        closeFile, 
        setEditorStates
    } = UseFiles();
    const [closeButtonPath, setCloseButtonPath] = useState('');
    const { openPaths, focusedPath } = editorStates[editorIndex];
    const changeFocusedPath = (path) => {
        setEditorStates((prevEditorStates) =>
          prevEditorStates.map((state, idx) =>
            idx === editorIndex ? { ...state, focusedPath: path } : state
          )
        );
      };


    return (
        <div
            className="flex font-mono button h-[45px]"
            style={{ 
                backgroundColor: 'rgb(31, 31, 31)', 
                fontSize: 18,
                borderBottom: '1px solid #404040'
            }}
        >
            {openPaths.map((path) => {
                const fileName = getFileNameFromPath(path);
                const isActive = focusedPath === path;

                return (
                    <div
                        key={path}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            changeFocusedPath(path);
                        }}
                        className={`flex items-center gap-1.5 py-1.5 pl-2.5 pr-1.5 border-r border-gray-700 
                                   hover:bg-gray-800 cursor-pointer select-none transition-colors
                                   ${isActive ? 'bg-gray-900' : 'bg-gray-950'}`}
                        title={path}
                        onMouseEnter={() => setCloseButtonPath(path)}
                        onMouseLeave={() => setCloseButtonPath('')}
                    >
                        <IconFromFileName name={fileName} />
                        <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                            {fileName}
                        </span>
                        <IoClose
                            onClick={(e) => {
                                closeFile(path, editorIndex);
                                e.stopPropagation();
                            }}
                            size={20}
                            className={`ml-1 p-0.5 rounded-sm 
                                     ${closeButtonPath === path ? 'opacity-100' : 'opacity-0'}
                                     ${isActive ? 'hover:bg-gray-700' : 'hover:bg-gray-600'}`}
                        />
                    </div>
                );
            })}
        </div>
    );
};
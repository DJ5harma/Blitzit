import { IoClose } from 'react-icons/io5';
import { useOpenFiles } from '../../Providers/OpenFilesProvider';

export const EditorTabs = ({ side }) => {
    const { openPaths, closeFile, focusedPaths, setFocusedPaths } = useOpenFiles();

    const handleClick = (path) => {
        setFocusedPaths((prev) => ({ ...prev, [side]: path }));
    };

    return (
        <div className="flex bg-neutral-600 p-1">
            {[...openPaths[side]].map((path) => (
                <div
                    key={path}
                    onClick={() => handleClick(path)}
                    className="flex items-center gap-2 p-2 border border-gray-500 text-white rounded-lg"
                    style={{
                        background: focusedPaths[side] === path ? 'black' : '#2d2d2d',
                        cursor: focusedPaths[side] === path ? 'default' : 'pointer',
                    }}
                >
                    {path}
                    <IoClose
                        onClick={(e) => {
                            closeFile(path);
                            e.stopPropagation();
                        }}
                        color="black"
                        className="flex items-center cursor-pointer rounded-sm p-0.5 bg-neutral-200"
                    />
                </div>
            ))}
        </div>
    );
};

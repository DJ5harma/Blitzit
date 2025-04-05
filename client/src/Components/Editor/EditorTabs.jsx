import { IoClose } from 'react-icons/io5';
import { useOpenFiles } from '../../Providers/OpenFilesProvider';

export const EditorTabs = () => {
    const { openPaths, closeFile, focusedPath, setFocusedPath } =
        useOpenFiles();

    return (
        <div className="flex bg-neutral-600 p-1">
            {[...openPaths].map((path) => (
                <div
                    key={path}
                    // disabled={fileName === path}
                    onClick={() => setFocusedPath(path)}
                    className="flex items-center gap-2 p-2 border border-gray-500 text-white rounded-lg"
                    style={{
                        background:
                            focusedPath === path ? 'black' : '#2d2d2d',
                        cursor:
                            focusedPath === path ? 'default' : 'pointer',
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

import { FileTreeNode } from './FileTreeNode/FileTreeNode';
import { UseFiles } from '../../Providers/FilesProvider';
import { UseRoom } from '../../Providers/RoomProvider';

export const FileTree = () => {
    const { fileTreeData , editorStates } = UseFiles();
    const { project } = UseRoom();
    if (!fileTreeData) return null;

    const allOpenPaths = Array.from(new Set(
        editorStates.flatMap(state => state.openPaths)
    ));


    return (
        <div
            className="button overflow-y-auto h-full w-full flex flex-col overflow-x-hidden"
            style={{ backgroundColor: 'rgb(24, 24, 24)' }}
        >
            <span className="w-full text-center font-bold font-mono bg-black p-2 select-none">
                {project.title.toUpperCase()}
            </span>
            <FileTreeNode
                name={'app'}
                value={fileTreeData['app']}
                marginLeft={8}
                path={'/app'}
                deletable={false}
                allOpenPaths={allOpenPaths}
            />
        </div>
    );
};

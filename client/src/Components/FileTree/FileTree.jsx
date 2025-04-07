import { FileTreeNode } from './FileTreeNode';
import { UseFiles } from '../../Providers/FilesProvider';

export const FileTree = () => {
    const { fileTreeData } = UseFiles();
    if (!fileTreeData) return null;

    return (
        <div
            className="overflow-y-auto h-full w-full"
            style={{ backgroundColor: 'rgb(24, 24, 24)' }}
        >
            <FileTreeNode
                name={'app'}
                value={fileTreeData['app']}
                marginLeft={8}
                path={'/app'}
                deletable={false}
            />
        </div>
    );
};

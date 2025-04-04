import { useEffect, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { FileTreeNode } from './FileTreeNode';
import { getFileTree } from '../Utils/getFileTree';
import { useRoom } from '../Providers/RoomProvider';

export const FileTree = () => {
    const { skt } = useSocket();
    const { callForTree } = useRoom();

    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        skt.on('connectFileTreeTerminal -o1', ({ data }) => {
            console.log({ data });
            setTreeData(() => getFileTree(data));
        });

        callForTree();

        return () => {
            skt.removeListener('connectFileTreeTerminal -o1');
        };
    }, [callForTree, skt]);

    if (!treeData) return null;

    return (
        <div className="pl-2.5 overflow-y-auto h-full w-full">
            <FileTreeNode
                name={'app'}
                value={treeData['app']}
                marginLeft={0}
                path={'/app'}
                deletable={false}
            />
        </div>
    );
};

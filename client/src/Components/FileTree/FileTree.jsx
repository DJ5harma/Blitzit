import { useEffect, useState } from 'react';
import { useSocket } from '../../Providers/SocketProvider';
import { FileTreeNode } from './FileTreeNode';
import { getFileTree } from '../../Utils/getFileTree';
import { EMITTER } from '../../Utils/EMITTER';

export const FileTree = () => {
    const { skt } = useSocket();

    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        skt.on('connectFileTreeTerminal -o1', ({ data }) => {
            console.log({ data });
            setTreeData(() => getFileTree(data));
        });

        EMITTER.callForTree();

        return () => {
            skt.removeListener('connectFileTreeTerminal -o1');
        };
    }, [skt]);

    if (!treeData) return null;

    return (
        <div className="pl-1 overflow-y-auto h-full w-full">
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

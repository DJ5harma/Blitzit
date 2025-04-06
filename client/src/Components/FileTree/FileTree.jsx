import { useEffect, useState } from 'react';
import { UseSocket } from '../../Providers/SocketProvider';
import { FileTreeNode } from './FileTreeNode';
import { getFileTree } from '../../Utils/getFileTree';
import { EMITTER } from '../../Utils/EMITTER';

export const FileTree = () => {
    const { skt } = UseSocket();

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
        <div
            className="overflow-y-auto h-full w-full"
            style={{ backgroundColor: 'rgb(24, 24, 24)' }}
        >
            <FileTreeNode
                name={'app'}
                value={treeData['app']}
                marginLeft={8}
                path={'/app'}
                deletable={false}
            />
        </div>
    );
};

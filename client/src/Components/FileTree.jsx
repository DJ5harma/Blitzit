import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { FileTreeNode } from './FileTreeNode';
import { getFileTree } from '../Utils/getFileTree';
import { useRoom } from '../Providers/RoomProvider';

export const FileTree = () => {
    const { skt } = useSocket();
    const { callForTree } = useRoom();

    const outputRef = useRef({ fileOutput: null, dirOutput: null });
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        skt.on('connectFileTreeTerminal -o1', ({ data }) => {
            data.replace(/\n/g, '\r\n');

            let temp = outputRef.current;
            if (!temp.dirOutput) temp = { ...temp, dirOutput: data };
            else if (!temp.fileOutput) {
                temp = { ...temp, fileOutput: data };
                setTreeData(getFileTree(temp.dirOutput, temp.fileOutput));
            } else temp = { dirOutput: data, fileOutput: null };
            outputRef.current = temp;
        });

        setTimeout(() => {
            callForTree();
        }, 300);

        return () => {
            skt.removeListener('connectFileTreeTerminal -o1');
        };
    }, [callForTree, skt]);

    if (!treeData) return null;

    // console.log(obj);

    return (
        <div className="border border-red-400 pl-2.5 overflow-y-auto h-full">
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

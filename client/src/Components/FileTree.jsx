import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { FileTreeNode } from './FileTreeNode';
import { getFileTree } from '../Utils/getFileTree';
import { useRoom } from '../Providers/RoomProvider';

export const FileTree = () => {
    const { skt } = useSocket();
    const { callForTree } = useRoom();

    const [output, setOutput] = useState({ fileOutput: null, dirOutput: null });

    const dataRef = useRef(null);

    useEffect(() => {
        skt.on('connectFileTreeTerminal -o1', ({ data }) => {
            data.replace(/\n/g, '\r\n');
            // console.log({ tree: data });
            setOutput((p) => {
                if (!p.dirOutput) return { ...p, dirOutput: data };
                if (!p.fileOutput) {
                    const res = { ...p, fileOutput: data };
                    dataRef.current = getFileTree(
                        res.dirOutput,
                        res.fileOutput
                    );
                    return res;
                }
                return { dirOutput: data, fileOutput: null };
            });
        });

        setTimeout(() => {
            callForTree();
        }, 300);

        return () => {
            skt.removeListener('connectFileTreeTerminal -o1');
        };
    }, [callForTree, skt]);

    if (!dataRef.current || !output.dirOutput || !output.fileOutput)
        return null;

    // console.log(obj);

    return (
        <div
            style={{
                border: 'solid red',
                paddingLeft: 10,
                overflowY: 'auto',
                height: '100%',
            }}
        >
            <FileTreeNode
                name={'app'}
                value={dataRef.current['app']}
                marginLeft={0}
                path={'/app'}
                deletable={false}
            />
        </div>
    );
};

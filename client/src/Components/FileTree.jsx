import { useEffect, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { FileTreeNode } from './FileTreeNode';
import { useRoom } from '../Pages/Room';
import { getFileTree } from '../Utils/getFileTree';

export const FileTree = ({ containerId }) => {
    const { skt } = useSocket();
    const { callForTree } = useRoom();

    const [output, setOutput] = useState({ fileOutput: null, dirOutput: null });

    const [terminalId, setTerminalId] = useState(null);
    const [isTerminalCreated, setIsTerminalCreated] = useState(false);

    const [obj, setObj] = useState(null);

    useEffect(() => {
        if (terminalId) return;
        skt.on('createFileTerminal -o1', ({ execId }) => {
            setTerminalId(execId);
            setIsTerminalCreated(true);
            // console.log("fsexec: ", execId);
        });
        skt.emit('createFileTerminal', { containerId });

        return () => {
            skt.removeListener('createFileTerminal -o1');
        };
    }, [terminalId, containerId, skt]);

    useEffect(() => {
        if (!isTerminalCreated) return;

        skt.emit('connectFileTerminal', { execId: terminalId });

        setTimeout(() => {
            callForTree();
        }, 300);

        skt.on('connectFileTerminal -o1', ({ data }) => {
            data.replace(/\n/g, '\r\n');
            // console.log({ tree: data });
            setOutput((p) => {
                if (!p.dirOutput) return { ...p, dirOutput: data };
                if (!p.fileOutput) {
                    const res = { ...p, fileOutput: data };
                    setObj(() => getFileTree(res.dirOutput, res.fileOutput));
                    return res;
                }
                return { dirOutput: data, fileOutput: null };
            });
        });

        return () => {
            skt.removeListener('connectFileTerminal -o1');
        };
    }, [callForTree, isTerminalCreated, skt, terminalId]);

    if (!obj || !output.dirOutput || !output.fileOutput) return null;

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
                value={obj['app']}
                marginLeft={0}
                path={'/app'}
            />
        </div>
    );
};
